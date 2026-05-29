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

let pyodidePromise = null

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
    const pyodide = await globalThis.loadPyodide({ indexURL: CDN_BASE })
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
    // Load packages two ways: explicit list from the lesson, plus auto-detected imports.
    if (packages.length) await pyodide.loadPackage(packages)
    await pyodide.loadPackagesFromImports(code)
    await pyodide.runPythonAsync(code)
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
    await pyodide.runPythonAsync(testCode)
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
