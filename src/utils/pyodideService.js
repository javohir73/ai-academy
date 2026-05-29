/*
 * pyodideService — the single owner of the in-browser Python runtime.
 *
 * Responsibilities (one job: run Python):
 *   - lazily inject the pinned Pyodide CDN script the first time it's needed
 *   - boot Pyodide once and memoize it for the whole session
 *   - run a learner's code, capturing stdout/stderr
 *   - run hidden test code in the same namespace to auto-grade
 *   - reset the namespace between lessons so variables don't leak
 *
 * No backend; the CDN script is the only external dependency.
 */

const PYODIDE_VERSION = '0.26.4'
const CDN_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

// Finite cap on the boot so a stalled CDN/WASM fetch rejects instead of hanging
// forever (60s — generous for a large WASM + sklearn download on a slow link).
const BOOT_TIMEOUT_MS = 60000

// Cap on loading a lesson's packages (e.g. scikit-learn): network-bound, so
// generous, but finite — a stalled package fetch must not freeze the Run button.
const PACKAGE_TIMEOUT_MS = 60000

// Cap on running learner code / hidden tests: CPU-bound in the main thread, so
// shorter — an accidental infinite loop should fail fast with a friendly error.
const EXEC_TIMEOUT_MS = 15000

let pyodidePromise = null
let bootTimeoutMs = BOOT_TIMEOUT_MS
let packageTimeoutMs = PACKAGE_TIMEOUT_MS
let execTimeoutMs = EXEC_TIMEOUT_MS

// Injectable for tests; production injects the real CDN <script>.
let scriptLoader = defaultScriptLoader

function defaultScriptLoader() {
  return new Promise((resolve, reject) => {
    if (globalThis.loadPyodide) return resolve()
    const existing = document.getElementById('pyodide-cdn')
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('pyodide-script-failed')))
      return
    }
    const s = document.createElement('script')
    s.id = 'pyodide-cdn'
    s.src = `${CDN_BASE}pyodide.js`
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('pyodide-script-failed'))
    document.head.appendChild(s)
  })
}

/** TEST ONLY: swap the script-injection step. */
export function __setScriptLoaderForTest(fn) {
  scriptLoader = fn
}

/** TEST ONLY: override the boot timeout (ms). */
export function __setBootTimeoutForTest(ms) {
  bootTimeoutMs = ms
}

/** TEST ONLY: override the package-load and code-execution timeouts (ms). */
export function __setExecTimeoutsForTest({ packageMs, execMs } = {}) {
  if (packageMs != null) packageTimeoutMs = packageMs
  if (execMs != null) execTimeoutMs = execMs
}

/** Reject if `promise` doesn't settle within `ms`; always clears its timer. */
function withTimeout(promise, ms, message) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

/**
 * Ensure Pyodide is downloaded and booted. Memoized: the heavy work happens
 * once per session; later calls resolve instantly.
 * @param {(msg: string) => void} [onProgress]
 */
export function ensureLoaded(onProgress) {
  if (pyodidePromise) return pyodidePromise
  pyodidePromise = (async () => {
    onProgress?.('Downloading Python…')
    await scriptLoader()
    if (!globalThis.loadPyodide) throw new Error('pyodide-global-missing')
    onProgress?.('Booting Python…')
    const pyodide = await withTimeout(globalThis.loadPyodide({ indexURL: CDN_BASE }), bootTimeoutMs, 'pyodide-boot-timeout')
    onProgress?.('Ready')
    return pyodide
  })().catch((err) => {
    pyodidePromise = null // allow retry after a failure
    throw err
  })
  return pyodidePromise
}

/** Strip a raw Python traceback down to its final, learner-readable line. */
function cleanError(err) {
  const msg = String(err?.message ?? err)
  const lines = msg.trim().split('\n').filter(Boolean)
  return lines[lines.length - 1] || 'Something went wrong running your code.'
}

/**
 * Run learner code. Loads any packages its imports need, captures stdout/stderr.
 * @returns {Promise<{ ok: boolean, stdout: string, error: string|null }>}
 */
export async function runCell(code, { packages = [] } = {}) {
  const pyodide = await ensureLoaded()
  let out = ''
  pyodide.setStdout({ batched: (s) => (out += s) })
  pyodide.setStderr({ batched: (s) => (out += s) })
  try {
    // Load packages two ways: explicit list from the lesson, plus auto-detected
    // imports. Bounded so a stalled package download can't hang the Run button.
    if (packages.length) {
      await withTimeout(
        pyodide.loadPackage(packages),
        packageTimeoutMs,
        'Loading the required Python packages took too long. Check your connection and run again.',
      )
    }
    await withTimeout(
      pyodide.loadPackagesFromImports(code),
      packageTimeoutMs,
      'Loading the required Python packages took too long. Check your connection and run again.',
    )
    // Bound execution too, so an accidental infinite loop fails fast.
    await withTimeout(
      pyodide.runPythonAsync(code),
      execTimeoutMs,
      'Your code took too long to run (it may have an infinite loop). Edit it and run again.',
    )
    return { ok: true, stdout: out, error: null }
  } catch (err) {
    return { ok: false, stdout: out, error: cleanError(err) }
  }
}

/**
 * Run hidden assertion code in the SAME namespace as the learner's last run.
 * @returns {Promise<{ passed: boolean, message: string }>}
 */
export async function runTests(testCode) {
  const pyodide = await ensureLoaded()
  try {
    await withTimeout(
      pyodide.runPythonAsync(testCode),
      execTimeoutMs,
      'Checking your answer took too long. Run again.',
    )
    return { passed: true, message: '' }
  } catch (err) {
    return { passed: false, message: cleanError(err) }
  }
}

/** Clear interpreter globals so the next lesson starts clean. */
export async function resetNamespace() {
  const pyodide = await ensureLoaded()
  pyodide.globals.clear()
}
