# In-Browser Code (Pyodide) + Curriculum Reframe — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real in-browser Python capability (Pyodide) to the AI Academy app, reframe the UI to curriculum level naming, keep beginner levels code-free, and ship three exemplar auto-graded code lessons gated behind concepts.

**Architecture:** Reuse the existing activity system untouched. Add Python as one new activity type (`notebook`) backed by one isolated singleton service (`pyodideService`). Pyodide loads lazily from a pinned jsDelivr CDN on first code-lesson use. Code lessons are pure data, badged "Code", and ordered after concept lessons within a level so the existing chained-unlock-by-index rule earns intuition before the keyboard.

**Tech Stack:** React 18, Vite 5, lucide-react, Pyodide (CDN), Vitest + React Testing Library + jsdom (new).

**Design spec:** `docs/superpowers/specs/2026-05-29-in-browser-code-and-curriculum-reframe-design.md`

---

## File Structure

**Create:**
- `src/utils/pyodideService.js` — singleton owning the Python runtime (load, run, test, reset).
- `src/components/activities/NotebookGame.jsx` — the `notebook` activity component.
- `src/data/foundations.js` — the new Level 0 lesson(s) as data (concept-only) + a home for new lesson data.
- `vitest.config.js` — test runner config.
- `src/test/setup.js` — RTL/jsdom test setup.
- `src/utils/pyodideService.test.js` — service unit tests (runtime mocked).
- `src/components/activities/NotebookGame.test.jsx` — component tests (service mocked).
- `src/data/lessons.test.js` — lesson-data integrity tests.
- `src/hooks/useProgress.test.js` — unlock/stars regression tests.

**Modify:**
- `package.json` — add `test` script + dev dependencies.
- `src/components/activities/index.js` — register `notebook: NotebookGame`.
- `src/data/levels.js` — add two L2 code lessons + one L3 code lesson (BFS).
- `src/data/tracks.js` — add Level 0 + Level 3 tracks; place code lessons after concept lessons; curriculum naming.
- `src/components/Sidebar.jsx` — render a "Code" badge for `kind: 'code'` lessons.
- `src/components/Overview.jsx` — render a "Code" badge for `kind: 'code'` lessons; update hero copy.
- `src/styles/global.css` — styles for the code cell, output panel, booting state, and "Code" badge.

> **Decision locked (was open in spec):** the BFS code lesson goes in a new **Level 3** track, NOT L1. L1 stays a code-free beginner level; placing BFS in L3 keeps "code starts at L2+" and the concept-before-code rule intact. (L3's deep-learning lessons are out of scope; this single pure-Python BFS lesson stands as L3's first hands-on.)

---

## Task 1: Test infrastructure (Vitest + RTL)

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`
- Create: `src/test/setup.js`
- Create: `src/utils/sanity.test.js` (temporary, deleted in Step 7)

- [ ] **Step 1: Add dev dependencies and test script**

Run:
```bash
npm install -D vitest@^2 @testing-library/react@^16 @testing-library/jest-dom@^6 jsdom@^25
```
Expected: packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Add the `test` script**

Edit `package.json` `scripts` to add:
```json
"test": "vitest run",
"test:watch": "vitest"
```
(Keep existing `dev`, `build`, `preview`.)

- [ ] **Step 3: Create `vitest.config.js`**

```js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
  },
})
```

- [ ] **Step 4: Create `src/test/setup.js`**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Create a temporary sanity test `src/utils/sanity.test.js`**

```js
import { describe, it, expect } from 'vitest'

describe('test harness', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2)
  })
})
```

- [ ] **Step 6: Run the suite to verify the harness works**

Run: `npm test`
Expected: PASS — 1 test passes, jsdom environment loads with no config errors.

- [ ] **Step 7: Delete the temporary sanity test**

```bash
rm src/utils/sanity.test.js
```

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.js src/test/setup.js
git commit -m "test: add Vitest + React Testing Library harness

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Pyodide service — load + memoize

**Files:**
- Create: `src/utils/pyodideService.js`
- Test: `src/utils/pyodideService.test.js`

The service is a singleton module. `loadPyodide` is injected by the CDN script onto `globalThis`. We make it injectable for tests via a small seam: the service reads `globalThis.loadPyodide` after ensuring the `<script>` tag exists. Tests set `globalThis.loadPyodide` to a fake before calling.

- [ ] **Step 1: Write the failing test for `ensureLoaded` memoization**

Create `src/utils/pyodideService.test.js`:
```js
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Fresh module per test so the singleton's memo is reset.
async function freshService() {
  vi.resetModules()
  return await import('./pyodideService.js')
}

function fakePyodide() {
  return {
    loadPackagesFromImports: vi.fn().mockResolvedValue(undefined),
    runPythonAsync: vi.fn().mockResolvedValue(undefined),
    globals: { clear: vi.fn() },
    setStdout: vi.fn(),
    setStderr: vi.fn(),
  }
}

describe('pyodideService.ensureLoaded', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    delete globalThis.loadPyodide
  })

  it('boots pyodide once and memoizes the instance', async () => {
    const py = fakePyodide()
    const loadPyodide = vi.fn().mockResolvedValue(py)
    // Simulate the CDN script having defined the global by the time it "loads".
    const svc = await freshService()
    // Stub the script-injection step so it resolves immediately and sets the global.
    svc.__setScriptLoaderForTest(async () => {
      globalThis.loadPyodide = loadPyodide
    })

    const a = await svc.ensureLoaded()
    const b = await svc.ensureLoaded()

    expect(a).toBe(py)
    expect(b).toBe(py)
    expect(loadPyodide).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/utils/pyodideService.test.js`
Expected: FAIL — `Cannot find module './pyodideService.js'`.

- [ ] **Step 3: Create `src/utils/pyodideService.js` with `ensureLoaded` + test seam**

```js
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/utils/pyodideService.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/pyodideService.js src/utils/pyodideService.test.js
git commit -m "feat: pyodideService.ensureLoaded with lazy CDN load + memoization

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Pyodide service — runCell, runTests, resetNamespace

**Files:**
- Modify: `src/utils/pyodideService.js`
- Test: `src/utils/pyodideService.test.js`

- [ ] **Step 1: Write failing tests for runCell / runTests / resetNamespace**

Append to `src/utils/pyodideService.test.js`:
```js
describe('pyodideService.runCell', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    delete globalThis.loadPyodide
  })

  async function bootedService(py) {
    const svc = await freshService()
    svc.__setScriptLoaderForTest(async () => {
      globalThis.loadPyodide = vi.fn().mockResolvedValue(py)
    })
    await svc.ensureLoaded()
    return svc
  }

  it('loads packages from imports and returns captured stdout on success', async () => {
    const py = fakePyodide()
    // Simulate stdout capture: when runPythonAsync runs, push to the batched writer.
    py.setStdout.mockImplementation(({ batched }) => {
      py.__emit = batched
    })
    py.runPythonAsync.mockImplementation(async () => {
      py.__emit('hello\n')
    })
    const svc = await bootedService(py)

    const res = await svc.runCell('print("hello")', { packages: ['numpy'] })

    expect(py.loadPackagesFromImports).toHaveBeenCalledWith('print("hello")')
    expect(res.ok).toBe(true)
    expect(res.stdout).toContain('hello')
    expect(res.error).toBeNull()
  })

  it('returns ok:false and the error message when the code raises', async () => {
    const py = fakePyodide()
    py.runPythonAsync.mockRejectedValue(new Error('NameError: name "x" is not defined'))
    const svc = await bootedService(py)

    const res = await svc.runCell('print(x)', { packages: [] })

    expect(res.ok).toBe(false)
    expect(res.error).toContain('NameError')
  })

  it('runTests returns passed:true when assertions do not raise', async () => {
    const py = fakePyodide()
    const svc = await bootedService(py)
    const res = await svc.runTests('assert 1 == 1')
    expect(res.passed).toBe(true)
  })

  it('runTests returns passed:false with the assertion message on failure', async () => {
    const py = fakePyodide()
    py.runPythonAsync.mockRejectedValue(new Error('AssertionError: accuracy too low'))
    const svc = await bootedService(py)
    const res = await svc.runTests('assert acc > 0.8, "accuracy too low"')
    expect(res.passed).toBe(false)
    expect(res.message).toContain('accuracy too low')
  })

  it('resetNamespace clears interpreter globals', async () => {
    const py = fakePyodide()
    const svc = await bootedService(py)
    await svc.resetNamespace()
    expect(py.globals.clear).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/utils/pyodideService.test.js`
Expected: FAIL — `runCell`, `runTests`, `resetNamespace` are not exported.

- [ ] **Step 3: Implement runCell, runTests, resetNamespace**

Append to `src/utils/pyodideService.js`:
```js
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
    // Pyodide can auto-detect imports; the explicit list is a hint for authors.
    await pyodide.loadPackagesFromImports(code)
    if (packages.length) {
      // no-op guard so the param is honored even when imports are dynamic
    }
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/utils/pyodideService.test.js`
Expected: PASS — all service tests green.

- [ ] **Step 5: Commit**

```bash
git add src/utils/pyodideService.js src/utils/pyodideService.test.js
git commit -m "feat: pyodideService runCell/runTests/resetNamespace with error cleanup

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: NotebookGame component

**Files:**
- Create: `src/components/activities/NotebookGame.jsx`
- Test: `src/components/activities/NotebookGame.test.jsx`

`NotebookGame` follows the activity contract: `({ data, onResult })`, calls `onResult({ correct })`. We mock `pyodideService` in tests so no runtime is needed.

`data` shape: `{ starter: string, packages: string[], tests: string, hints: string[] }`.

- [ ] **Step 1: Write failing component tests**

Create `src/components/activities/NotebookGame.test.jsx`:
```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('../../utils/pyodideService.js', () => ({
  ensureLoaded: vi.fn().mockResolvedValue({}),
  runCell: vi.fn(),
  runTests: vi.fn(),
  resetNamespace: vi.fn().mockResolvedValue(undefined),
}))

import NotebookGame from './NotebookGame.jsx'
import * as svc from '../../utils/pyodideService.js'

const baseData = {
  starter: 'acc = 0.9',
  packages: [],
  tests: 'assert acc > 0.8',
  hints: ['Think about the threshold.'],
}

describe('NotebookGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    svc.ensureLoaded.mockResolvedValue({})
    svc.resetNamespace.mockResolvedValue(undefined)
  })

  it('seeds the editor with starter code', () => {
    render(<NotebookGame data={baseData} onResult={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('acc = 0.9')
  })

  it('reports correct when the code runs and all tests pass', async () => {
    svc.runCell.mockResolvedValue({ ok: true, stdout: '', error: null })
    svc.runTests.mockResolvedValue({ passed: true, message: '' })
    const onResult = vi.fn()
    render(<NotebookGame data={baseData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('button', { name: /run/i }))

    await waitFor(() => expect(onResult).toHaveBeenCalledWith({ correct: true }))
  })

  it('reports incorrect and shows a hint when tests fail', async () => {
    svc.runCell.mockResolvedValue({ ok: true, stdout: '', error: null })
    svc.runTests.mockResolvedValue({ passed: false, message: 'AssertionError' })
    const onResult = vi.fn()
    render(<NotebookGame data={baseData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('button', { name: /run/i }))

    await waitFor(() => expect(onResult).toHaveBeenCalledWith({ correct: false }))
    expect(screen.getByText(/think about the threshold/i)).toBeInTheDocument()
  })

  it('shows the runtime error in the output panel when code raises', async () => {
    svc.runCell.mockResolvedValue({ ok: false, stdout: '', error: 'NameError: x' })
    svc.runTests.mockResolvedValue({ passed: false, message: '' })
    const onResult = vi.fn()
    render(<NotebookGame data={baseData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('button', { name: /run/i }))

    await waitFor(() => expect(screen.getByText(/NameError: x/)).toBeInTheDocument())
    expect(onResult).toHaveBeenCalledWith({ correct: false })
  })

  it('shows an error with retry when the environment fails to load', async () => {
    svc.ensureLoaded.mockRejectedValue(new Error('pyodide-script-failed'))
    render(<NotebookGame data={baseData} onResult={() => {}} />)
    await waitFor(() =>
      expect(screen.getByText(/couldn’t load the python environment/i)).toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/activities/NotebookGame.test.jsx`
Expected: FAIL — `Cannot find module './NotebookGame.jsx'`.

- [ ] **Step 3: Implement `NotebookGame.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Loader2, AlertTriangle } from 'lucide-react'
import { ensureLoaded, runCell, runTests, resetNamespace } from '../../utils/pyodideService.js'

/*
 * NotebookGame — the "notebook" activity type: a real, runnable Python cell.
 *
 * Same contract as every activity: ({ data, onResult }) and calls
 * onResult({ correct }) once the learner runs code that passes the hidden tests.
 *
 * data = {
 *   starter:  string   // code the cell is seeded with
 *   packages: string[] // hint for which packages the cell needs
 *   tests:    string   // hidden Python asserts, run in the same namespace
 *   hints:    string[] // escalating hints shown on failure (tutor ladder)
 * }
 *
 * The Python runtime (Pyodide) is owned by pyodideService and loaded lazily on
 * mount, behind a friendly "booting" state. Concept lessons never mount this.
 */
export default function NotebookGame({ data, onResult }) {
  const [code, setCode] = useState(data.starter ?? '')
  const [status, setStatus] = useState('booting') // booting | ready | running | error
  const [bootMsg, setBootMsg] = useState('Booting your Python environment…')
  const [output, setOutput] = useState('')
  const [hintLevel, setHintLevel] = useState(0) // how many hints to reveal
  const wrong = useRef(0)

  useEffect(() => {
    let alive = true
    setStatus('booting')
    ensureLoaded(setBootMsg)
      .then(() => resetNamespace())
      .then(() => {
        if (alive) setStatus('ready')
      })
      .catch(() => {
        if (alive) setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  function retryBoot() {
    setStatus('booting')
    ensureLoaded(setBootMsg)
      .then(() => resetNamespace())
      .then(() => setStatus('ready'))
      .catch(() => setStatus('error'))
  }

  async function run() {
    if (status !== 'ready' && status !== 'running') return
    setStatus('running')
    setOutput('')
    const cell = await runCell(code, { packages: data.packages ?? [] })
    let combined = cell.stdout || ''
    if (!cell.ok && cell.error) combined += (combined ? '\n' : '') + cell.error
    setOutput(combined)

    if (!cell.ok) {
      wrong.current += 1
      setHintLevel((n) => Math.min((data.hints?.length ?? 0), n + 1))
      setStatus('ready')
      onResult({ correct: false })
      return
    }

    const verdict = await runTests(data.tests ?? '')
    setStatus('ready')
    if (verdict.passed) {
      onResult({ correct: true })
    } else {
      wrong.current += 1
      setHintLevel((n) => Math.min((data.hints?.length ?? 0), n + 1))
      if (verdict.message) {
        setOutput((o) => (o ? o + '\n' : '') + verdict.message)
      }
      onResult({ correct: false })
    }
  }

  function resetCell() {
    setCode(data.starter ?? '')
    setOutput('')
  }

  // Tab inserts spaces instead of moving focus, so the cell feels like an editor.
  function onKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const el = e.target
      const start = el.selectionStart
      const end = el.selectionEnd
      const next = code.slice(0, start) + '    ' + code.slice(end)
      setCode(next)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4
      })
    }
  }

  if (status === 'error') {
    return (
      <div className="notebook">
        <p className="feedback feedback--incorrect" role="alert">
          <AlertTriangle size={18} aria-hidden="true" /> Couldn’t load the Python
          environment — check your connection and try again.
        </p>
        <button className="btn btn--primary" onClick={retryBoot}>
          <RotateCcw size={16} /> Retry
        </button>
      </div>
    )
  }

  if (status === 'booting') {
    return (
      <div className="notebook notebook--booting" role="status">
        <Loader2 size={20} className="spin" aria-hidden="true" />
        <span>{bootMsg}</span>
      </div>
    )
  }

  const hints = (data.hints ?? []).slice(0, hintLevel)

  return (
    <div className="notebook">
      <label className="notebook__label" htmlFor="code-cell">
        Your code
      </label>
      <textarea
        id="code-cell"
        className="code-cell"
        spellCheck={false}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        onKeyDown={onKeyDown}
        rows={Math.max(6, (code.match(/\n/g)?.length ?? 0) + 2)}
      />

      <div className="btn-row">
        <button
          className="btn btn--primary"
          onClick={run}
          disabled={status === 'running'}
        >
          {status === 'running' ? (
            <>
              <Loader2 size={16} className="spin" /> Running…
            </>
          ) : (
            <>
              <Play size={16} /> Run
            </>
          )}
        </button>
        <button className="btn btn--ghost" onClick={resetCell} disabled={status === 'running'}>
          <RotateCcw size={16} /> Reset cell
        </button>
      </div>

      {output && (
        <pre className="code-output" aria-label="Output">
          {output}
        </pre>
      )}

      {hints.length > 0 && (
        <div className="notebook__hints">
          {hints.map((h, i) => (
            <p key={i} className="hint">
              💡 {h}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/activities/NotebookGame.test.jsx`
Expected: PASS — all five component tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/activities/NotebookGame.jsx src/components/activities/NotebookGame.test.jsx
git commit -m "feat: NotebookGame runnable Python activity with auto-grading + hint ladder

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Register the `notebook` activity type

**Files:**
- Modify: `src/components/activities/index.js`

- [ ] **Step 1: Add the import and registry entry**

In `src/components/activities/index.js`, add the import alongside the others:
```js
import NotebookGame from './NotebookGame.jsx'
```
And add to the `ACTIVITIES` map (after the intermediate block):
```js
  // Hands-on code (Pyodide)
  notebook: NotebookGame,
```

- [ ] **Step 2: Verify the app still builds**

Run: `npm run build`
Expected: build succeeds (Vite compiles, no missing-module errors).

- [ ] **Step 3: Commit**

```bash
git add src/components/activities/index.js
git commit -m "feat: register notebook activity type

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Author the L2 scikit-learn lesson (first code lesson)

**Files:**
- Modify: `src/data/levels.js`

Add a new lesson object to `BEGINNER_LEVELS` export array. It uses `kind: 'code'` and `activity.type: 'notebook'`. The starter is intentionally incomplete (the learner fills the fit/predict). Tests assert accuracy on a held-out split.

- [ ] **Step 1: Append the lesson to `BEGINNER_LEVELS`**

Add this object at the end of the `BEGINNER_LEVELS` array in `src/data/levels.js` (before the closing `]`):
```js
  /* ----------------------- L2 hands-on: sklearn ---------------------- */
  {
    id: 'code-first-classifier',
    kind: 'code',
    title: 'Train Your First Classifier',
    concept: 'Fit a model and measure its accuracy — in real Python',
    explanation:
      'You have seen what classification is. Now you will actually train a model. We use scikit-learn on the classic Iris flowers dataset: fit a model on training data, predict on data it has never seen, and measure how often it is right.',
    example: {
      text: 'Remember the spine: model = parameters + loss + optimization. scikit-learn runs that whole loop for you behind a single .fit() call — your job is to wire it up and judge the result.',
    },
    workedExample: {
      intro:
        'Watch the shape of every scikit-learn program: load data → split into train/test → fit on train → predict on test → score. The key idea: we ALWAYS test on data the model did not train on.',
      steps: [
        'Load Iris and split it: X_train/y_train teach the model; X_test/y_test are held back to grade it honestly.',
        'Create a model (KNeighborsClassifier) and call model.fit(X_train, y_train). That is the whole training step.',
        'Predict with model.predict(X_test), then compare to y_test with accuracy_score. Testing on unseen data is how we catch memorization.',
      ],
      takeaway: 'Every sklearn model is the same five beats: load → split → fit → predict → score.',
    },
    guided: {
      prompt:
        'Before the full exercise: which data should you call .fit() on?\n\nX_train / y_train  —  or  —  X_test / y_test ?',
      hints: [
        'The test set exists to grade the model. If the model trained on it, the grade would be a lie.',
        'We fit (teach) on the training split, then keep the test split untouched until scoring.',
      ],
      answer: 'Fit on X_train, y_train.',
      explanation:
        'You always train on the training split and reserve the test split to measure honest, unseen-data performance.',
    },
    goDeeper: {
      title: 'Why hold out a test set at all?',
      body: 'A model can score 100% by memorizing the training rows and still fail on anything new — that is overfitting. The held-out test set is the only honest measure of generalization: performance on data the model has never seen. From here on, every model you build will be judged this way.',
    },
    video: {
      title: 'Your first scikit-learn model',
      description: 'The five-beat shape of every sklearn program, from load to score.',
      duration: '4:00',
    },
    activity: {
      type: 'notebook',
      prompt:
        'Finish the two missing lines (fit the model, then predict on the test set) so the classifier reaches at least 90% accuracy.',
      data: {
        packages: ['scikit-learn'],
        starter: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

X, y = load_iris(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=0
)

model = KNeighborsClassifier(n_neighbors=3)
# 1) Train the model on the TRAINING data:
# model.fit(...)

# 2) Predict on the TEST data:
# preds = model.predict(...)

preds = model.predict(X_test)  # remove or keep — must end with predictions in `preds`
acc = accuracy_score(y_test, preds)
print("accuracy:", round(acc, 3))`,
        tests: `assert 'model' in dir(), "Create and fit a model named 'model'."
assert 'preds' in dir(), "Store predictions in a variable named 'preds'."
from sklearn.metrics import accuracy_score
_acc = accuracy_score(y_test, preds)
assert _acc >= 0.9, f"Accuracy is {_acc:.2f} — fit on the training data and predict on X_test to reach 0.90."`,
        hints: [
          'Call model.fit(X_train, y_train) before predicting — an unfit model cannot classify.',
          'Predict on the held-out set: preds = model.predict(X_test).',
          'Full shape: model.fit(X_train, y_train) then preds = model.predict(X_test). Then accuracy_score(y_test, preds) ≥ 0.90.',
        ],
      },
      feedback: {
        correct:
          'That is a trained, working classifier — fit on training data, judged on unseen data, over 90% accurate. You just ran the whole model = parameters + loss + optimization loop.',
        incorrect:
          'Not yet. Make sure you fit on the TRAINING data and predict on the TEST data — read the hint and try again.',
      },
    },
  },
```

- [ ] **Step 2: Verify it parses (build)**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/data/levels.js
git commit -m "content: add L2 hands-on sklearn classifier code lesson

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Author the L2 metrics & overfitting lesson

**Files:**
- Modify: `src/data/levels.js`

- [ ] **Step 1: Append the lesson to `BEGINNER_LEVELS`**

Add this object at the end of the `BEGINNER_LEVELS` array (after the sklearn lesson):
```js
  /* ----------------- L2 hands-on: metrics & overfitting ------------- */
  {
    id: 'code-metrics-overfitting',
    kind: 'code',
    title: 'Spot Overfitting With Metrics',
    concept: 'Compare train vs test accuracy to catch a model that memorized',
    explanation:
      'A model that scores far better on training data than on test data has memorized instead of learned. You will train a deliberately over-complex model, measure both scores, and compute the gap that proves it overfit.',
    example: {
      text: 'Remember overfitting from the intuition lesson? Here you will measure it: a big train-vs-test gap is overfitting made numeric.',
    },
    workedExample: {
      intro:
        'The tool: score the SAME model on both splits. A healthy model scores similarly on train and test. An overfit one aces train and stumbles on test.',
      steps: [
        'Train a decision tree with no depth limit — it can memorize the training set.',
        'Score it on the training data (likely ~1.0) and on the test data (lower).',
        'The gap = train_acc − test_acc. A large gap is the signature of overfitting.',
      ],
      takeaway: 'Overfitting is not a vibe — it is the measurable gap between train and test performance.',
    },
    guided: {
      prompt:
        'A model scores 1.00 on training data and 0.72 on test data. What is going on?',
      hints: [
        'Compare the two numbers. Near-perfect on data it has seen, much worse on data it has not.',
        'That gap means it memorized the training rows rather than learning a general rule.',
      ],
      answer: 'It is overfitting.',
      explanation:
        'A high train score with a much lower test score is the classic overfitting signature — the model generalizes poorly.',
    },
    goDeeper: {
      title: 'Why does an unlimited-depth tree overfit?',
      body: 'A decision tree with no max_depth keeps splitting until each training point sits in its own leaf — effectively a lookup table of the training set. It fits the noise, not just the signal, so it nails training data and fails on anything new. Limiting depth (or pruning) trades a little training accuracy for much better generalization.',
    },
    video: {
      title: 'Measuring overfitting',
      description: 'Train vs test scores and the gap that reveals memorization.',
      duration: '3:30',
    },
    activity: {
      type: 'notebook',
      prompt:
        'Compute train_acc and test_acc for the tree, then set gap = train_acc - test_acc. The hidden check confirms you have found a real overfitting gap.',
      data: {
        packages: ['scikit-learn'],
        starter: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=0
)

# An unlimited-depth tree can memorize the training data.
model = DecisionTreeClassifier(random_state=0)
model.fit(X_train, y_train)

# TODO: score the model on BOTH splits, then compute the gap.
# train_acc = accuracy_score(y_train, model.predict(X_train))
# test_acc  = accuracy_score(y_test,  model.predict(X_test))
# gap = train_acc - test_acc

print("train:", train_acc, "test:", test_acc, "gap:", round(gap, 3))`,
        tests: `assert 'train_acc' in dir() and 'test_acc' in dir(), "Define train_acc and test_acc."
assert 'gap' in dir(), "Define gap = train_acc - test_acc."
assert train_acc >= 0.99, "An unlimited-depth tree should score ~1.0 on the training data."
assert gap > 0.02, f"Expected a positive train-vs-test gap; got {gap:.3f}. Score on both splits."`,
        hints: [
          'Score training accuracy: train_acc = accuracy_score(y_train, model.predict(X_train)).',
          'Score test accuracy the same way but with y_test and X_test.',
          'Then gap = train_acc - test_acc — it should be clearly positive, exposing the overfit.',
        ],
      },
      feedback: {
        correct:
          'You measured overfitting directly: near-perfect on training, lower on test, with a real positive gap. That gap is the thing every honest evaluation watches for.',
        incorrect:
          'Not yet — make sure you score the model on BOTH the training and test splits, then subtract. Check the hint.',
      },
    },
  },
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/data/levels.js
git commit -m "content: add L2 metrics & overfitting code lesson

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Author the L3 BFS maze lesson (pure Python)

**Files:**
- Modify: `src/data/levels.js`

This lesson needs no packages (pure Python), so it loads fast. It is the first L3 hands-on.

- [ ] **Step 1: Append the lesson to `BEGINNER_LEVELS`**

Add this object at the end of the `BEGINNER_LEVELS` array (after the metrics lesson):
```js
  /* --------------------- L3 hands-on: BFS maze ---------------------- */
  {
    id: 'code-bfs-maze',
    kind: 'code',
    title: 'Solve a Maze With Search',
    concept: 'Find the shortest path with breadth-first search — pure Python',
    explanation:
      'Before a network can learn, an agent has to be able to search. Breadth-first search (BFS) explores a maze level by level, so the first time it reaches the goal it has found the SHORTEST path. You will complete the search loop.',
    example: {
      text: 'Spine callback: in L1 a model was a decision-maker that searches. BFS is that idea in code — systematically trying options until it reaches the goal, shortest route first.',
    },
    workedExample: {
      intro:
        'BFS uses a queue (first-in, first-out). The FIFO order is what guarantees the shortest path: we exhaust everything 1 step away before anything 2 steps away.',
      steps: [
        'Start with the start cell in the queue and mark it visited.',
        'Pop the front cell; if it is the goal, reconstruct the path. Otherwise add its unvisited neighbours to the BACK of the queue.',
        'Because we always expand the closest cells first, the goal is reached by the shortest route.',
      ],
      takeaway: 'A FIFO queue is what makes BFS find the shortest path, not just any path.',
    },
    guided: {
      prompt:
        'Why does BFS find the SHORTEST path while depth-first search might not?',
      hints: [
        'Think about the ORDER each explores in: BFS spreads out evenly, DFS dives deep down one branch first.',
        'BFS finishes all cells at distance 1, then distance 2, and so on — so the goal is first reached at its true minimum distance.',
      ],
      answer: 'Because BFS explores in order of distance (FIFO queue), so it reaches the goal by the shortest route first.',
      explanation:
        'BFS expands nodes nearest the start before farther ones, so the first time it reaches the goal it has used the fewest steps. DFS can plunge down a long branch and find a longer route first.',
    },
    goDeeper: {
      title: 'BFS vs Dijkstra vs A*',
      body: 'BFS finds the shortest path when every step costs the same. When steps have different costs, you need Dijkstra (a priority queue by total cost). A* adds a heuristic that steers the search toward the goal, expanding fewer nodes. They are all the same skeleton — a frontier of cells to expand — with smarter ordering.',
    },
    video: {
      title: 'Breadth-first search, visually',
      description: 'Why a FIFO queue guarantees the shortest path in an unweighted maze.',
      duration: '3:45',
    },
    activity: {
      type: 'notebook',
      prompt:
        'Complete the BFS loop: add each unvisited neighbour to the queue and record how you reached it, so the function returns the shortest path from S to G.',
      data: {
        packages: [],
        starter: `from collections import deque

# '#' = wall, '.' = open, 'S' = start, 'G' = goal
maze = [
    "S....",
    ".###.",
    ".#...",
    ".#.#.",
    "...#G",
]

def neighbours(r, c):
    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
        nr, nc = r+dr, c+dc
        if 0 <= nr < len(maze) and 0 <= nc < len(maze[0]) and maze[nr][nc] != '#':
            yield nr, nc

def find(ch):
    for r, row in enumerate(maze):
        for c, v in enumerate(row):
            if v == ch:
                return (r, c)

start, goal = find('S'), find('G')

def bfs():
    queue = deque([start])
    came_from = {start: None}
    while queue:
        cur = queue.popleft()
        if cur == goal:
            break
        for nb in neighbours(*cur):
            # TODO: if nb is unvisited, record came_from[nb] = cur and queue it
            pass
    # reconstruct path from goal back to start
    if goal not in came_from:
        return None
    path = []
    node = goal
    while node is not None:
        path.append(node)
        node = came_from[node]
    return path[::-1]

path = bfs()
print("path length:", len(path) if path else None)`,
        tests: `assert path is not None, "Your BFS returned no path — make sure you enqueue unvisited neighbours."
assert path[0] == start, "Path must start at S."
assert path[-1] == goal, "Path must end at G."
# steps must be adjacent and on open cells
for (r1, c1), (r2, c2) in zip(path, path[1:]):
    assert abs(r1 - r2) + abs(c1 - c2) == 1, "Path steps must be to adjacent cells."
    assert maze[r2][c2] != '#', "Path runs through a wall."
assert len(path) == 9, f"Shortest path is 9 cells; yours is {len(path)}. BFS (FIFO) guarantees shortest."`,
        hints: [
          'Inside the neighbour loop: check `if nb not in came_from:` so you do not revisit cells.',
          'When a neighbour is new, set came_from[nb] = cur and queue.append(nb).',
          'Full body: `if nb not in came_from: came_from[nb] = cur; queue.append(nb)`. The FIFO order gives the shortest path.',
        ],
      },
      feedback: {
        correct:
          'Your agent searched the maze and found the shortest route — BFS done right. That frontier-of-cells skeleton is the same one Dijkstra and A* build on.',
        incorrect:
          'Not quite. Enqueue only UNVISITED neighbours and record how you reached each one, so you can rebuild the path. Read the hint.',
      },
    },
  },
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/data/levels.js
git commit -m "content: add L3 BFS maze pure-Python code lesson

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Author Level 0 concept lesson (code-free)

**Files:**
- Create: `src/data/foundations.js`

L0 is the beginner on-ramp and stays code-free. We add one concept lesson that teaches "what is data / a dataset" using an existing code-free activity type (`pick-dataset`), so beginners get an L0 without any Python. (Reuses the existing `PickDatasetGame`.)

- [ ] **Step 1: Create `src/data/foundations.js`**

```js
/* =====================================================================
   LEVEL 0 — FOUNDATIONS (concept, code-free).
   The beginner on-ramp. Per the platform's concept-first model, L0 and L1
   contain NO code lessons — they build intuition with the same interactive
   activities as the rest of the beginner experience. Runnable Python begins
   at L2 (see the `kind: 'code'` lessons in levels.js).

   Same lesson shape as levels.js. Composed into the Level 0 track in tracks.js.
   ===================================================================== */

export const FOUNDATIONS_LEVELS = [
  {
    id: 'what-is-data',
    title: 'What Is Data?',
    concept: 'Rows, columns, and why models need examples',
    explanation:
      'Everything a model learns from is data: a table of examples, where each row is one thing and each column is one fact about it. Before any machine learning, you need good examples laid out this way.',
    example: {
      text: 'A spreadsheet of houses — one row per house, columns for size, bedrooms, and price — is a dataset. The model studies these rows to learn patterns.',
    },
    workedExample: {
      intro:
        'The test for a good dataset: is it a clean table of EXAMPLES, where each row is one item and each column is one measurable fact? Watch me judge a few.',
      steps: [
        'A table of emails labelled spam / not-spam: each row an email, a column for the label. Clean examples — great for learning.',
        'A single paragraph of prose: no rows, no columns, nothing to compare. Not a dataset yet — it needs structure first.',
        'Photos sorted into folders "cat" and "dog": each image is an example and the folder is its label. That IS a dataset.',
      ],
      takeaway: 'A dataset is a table of examples: rows are items, columns are facts, and often one column is the label.',
    },
    guided: {
      prompt:
        'Which of these is ready to learn from?\n\nA) 1,000 customer reviews each tagged positive or negative\nB) One long unlabelled essay',
      hints: [
        'Learning needs many comparable EXAMPLES, ideally with a label saying what each one is.',
        'A is a thousand labelled examples; B is a single block of text with no structure.',
      ],
      answer: 'A — the labelled reviews.',
      explanation:
        'A is a structured set of labelled examples a model can learn patterns from. B is unstructured and unlabelled, so there is nothing to learn from yet.',
    },
    goDeeper: {
      title: 'Why "garbage in, garbage out" starts here',
      body: 'A model can only be as good as its examples. Biased, mislabelled, or too-few rows produce a weak model no algorithm can rescue. That is why real ML work spends most of its time on data, not models — a theme you will meet again in every level.',
    },
    video: {
      title: 'Data, rows, and columns',
      description: 'What a dataset is and what makes examples good enough to learn from.',
      duration: '2:45',
    },
    activity: {
      type: 'pick-dataset',
      prompt: 'A team wants to predict house prices. Pick the dataset that can actually teach that.',
      data: {
        options: [
          {
            id: 'good',
            title: 'Past home sales',
            detail: '5,000 sold homes with size, bedrooms, location, and final sale price.',
            correct: true,
          },
          {
            id: 'no-label',
            title: 'Homes with no prices',
            detail: '5,000 homes with size and location — but the price column is blank.',
            correct: false,
          },
          {
            id: 'tiny',
            title: 'Three homes',
            detail: 'Just 3 homes with full details and prices.',
            correct: false,
          },
        ],
        explain: {
          good: 'Many examples, with the answer (sale price) included — exactly what supervised learning needs.',
          'no-label': 'Without the price column there is no answer to learn from.',
          tiny: 'Three rows is far too few to learn a reliable pattern.',
        },
      },
      feedback: {
        correct:
          'Right — lots of labelled examples (price included) is what makes price prediction learnable. Good data first, always.',
        incorrect:
          'Look again: you need MANY examples that include the answer you want to predict (the sale price).',
      },
    },
  },
]
```

> **Author note:** confirm `PickDatasetGame`’s expected `data` shape while implementing (open `src/components/activities/PickDatasetGame.jsx`). If its props differ from `{ options: [{id,title,detail,correct}], explain }`, adapt this lesson's `activity.data` to match the component — the component is the source of truth. Adjust and re-run the build before committing.

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/data/foundations.js
git commit -m "content: add Level 0 Foundations concept lesson (code-free)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Reframe tracks to curriculum levels + place code lessons

**Files:**
- Modify: `src/data/tracks.js`

Add Level 0 and Level 3 tracks, fold the new code lessons into their levels AFTER the concept lessons, and confirm curriculum naming. The chained-unlock-by-index rule then guarantees concept-before-code automatically.

- [ ] **Step 1: Rewrite `src/data/tracks.js`**

Replace the file contents with:
```js
/* =====================================================================
   TRACKS — the course organized into curriculum LEVELS (L0, L1, L2, L3, L5).

   Concept-first model: beginner levels (L0, L1) are code-free; runnable-code
   lessons (kind: 'code') begin at L2 and are listed AFTER each level's concept
   lessons. Because useProgress unlocks each lesson only when the previous one
   (by flat index) is done, ordering concept-before-code makes the platform earn
   intuition before the keyboard — no unlock-logic changes needed.

   Lessons live in the data files and are composed here BY ID, so re-grouping a
   lesson is a one-line change.
   ===================================================================== */
import { FOUNDATIONS_LEVELS } from './foundations.js'
import { BEGINNER_LEVELS } from './levels.js'
import { INTERMEDIATE_LEVELS } from './intermediate.js'

// Index every lesson by id so tracks can be composed by curriculum level.
const BY_ID = Object.fromEntries(
  [...FOUNDATIONS_LEVELS, ...BEGINNER_LEVELS, ...INTERMEDIATE_LEVELS].map((l) => [l.id, l]),
)
const pick = (...ids) => ids.map((id) => BY_ID[id])

export const TRACKS = [
  {
    id: 'level-0',
    tag: 'Level 0',
    title: 'Foundations',
    blurb:
      'The on-ramp: what data is and why good examples come before any model. Concept-first, no code required.',
    levels: pick('what-is-data'),
  },
  {
    id: 'level-1',
    tag: 'Level 1',
    title: 'Fundamentals of AI',
    blurb:
      'What artificial intelligence is, how it is built, and how to use it responsibly — the conceptual map the rest of the curriculum hangs on.',
    levels: pick('what-ai', 'ai-ethics'),
  },
  {
    id: 'level-2',
    tag: 'Level 2',
    title: 'Introduction to Machine Learning',
    blurb:
      'How machines learn patterns from data: training data, features and labels, classification, prediction, bias, overfitting — then your first real models in Python.',
    levels: pick(
      // concept lessons first…
      'what-ml',
      'training-data',
      'features-labels',
      'classification',
      'prediction',
      'bias',
      'overfitting',
      'neural-networks',
      // …then hands-on code (gated behind the concepts by the chained unlock)
      'code-first-classifier',
      'code-metrics-overfitting',
    ),
  },
  {
    id: 'level-3',
    tag: 'Level 3',
    title: 'Neural Networks & Problem Solving',
    blurb:
      'The bridge from rules to learning. Start hands-on with search — an agent that finds the shortest path in code — the skeleton smarter algorithms build on.',
    levels: pick('code-bfs-maze'),
  },
  {
    id: 'level-5',
    tag: 'Level 5',
    pro: true,
    title: 'LLMs in Practice — Evaluation & Responsible AI',
    blurb:
      'Train like a real AI model evaluator: score outputs, rank answers, catch hallucinations, and improve weak responses against a rubric.',
    levels: pick(
      'eval-intro',
      'eval-rubrics',
      'eval-rating',
      'eval-ranking',
      'eval-hallucination',
      'eval-hhh',
      'eval-rewrite',
      'eval-capstone',
    ),
  },
]

/** All lessons across every level, in play order. */
export const LEVELS = TRACKS.flatMap((t) => t.levels)

/** Total stars available (3 per lesson). */
export const MAX_STARS = LEVELS.length * 3

/**
 * Tracks annotated with the flat (global) index of each of their levels, so the
 * sidebar / overview can map a level-local lesson back to its position in LEVELS
 * (used for unlock checks and navigation).
 */
export const TRACKS_WITH_OFFSETS = (() => {
  let offset = 0
  return TRACKS.map((track) => {
    const levels = track.levels.map((level, i) => ({ level, index: offset + i }))
    offset += track.levels.length
    return { ...track, levels }
  })
})()
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds; no undefined lessons (every id in `pick(...)` exists in a data file).

- [ ] **Step 3: Add a levelIcon for the new ids (avoid missing-icon fallback)**

Open `src/components/levelIcons.js`, and ensure `iconForLevel` returns a sensible icon for `what-is-data`, `code-first-classifier`, `code-metrics-overfitting`, and `code-bfs-maze`. If the file maps ids explicitly, add entries (e.g. import `Database`, `Code2`, `GitBranch`, `Route` from `lucide-react` and map them); if it already has a default fallback, no change is needed. Follow the file's existing pattern.

- [ ] **Step 4: Verify build again**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/data/tracks.js src/components/levelIcons.js
git commit -m "feat: reframe tracks to curriculum levels (L0/L1/L2/L3/L5), place code lessons after concepts

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: "Code" badge in Sidebar and Overview

**Files:**
- Modify: `src/components/Sidebar.jsx`
- Modify: `src/components/Overview.jsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add the badge in Sidebar**

In `src/components/Sidebar.jsx`, inside the `nav__body` span (after the `nav__concept` line, around line 127), add a badge when the lesson is a code lesson:
```jsx
                      <span className="nav__body">
                        <span className="nav__title">
                          {level.title}
                          {level.kind === 'code' && <span className="code-badge">Code</span>}
                        </span>
                        <span className="nav__concept">{level.concept}</span>
                      </span>
```

- [ ] **Step 2: Add the badge in Overview**

In `src/components/Overview.jsx`, inside `module-card__body` (after the `module-card__title` line, around line 95), add:
```jsx
                    <span className="module-card__body">
                      <span className="module-card__index">Lesson {index + 1}</span>
                      <span className="module-card__title">
                        {level.title}
                        {level.kind === 'code' && <span className="code-badge">Code</span>}
                      </span>
                      <span className="module-card__concept">{level.concept}</span>
                    </span>
```

- [ ] **Step 3: Update the hero copy in Overview to reflect hands-on + curriculum levels**

In `src/components/Overview.jsx`, replace the `.lead` and following `.muted` paragraphs (around lines 23–30) with:
```jsx
        <p className="lead">
          A hands-on course of {total} interactive lessons — from the fundamentals of AI, through
          how machine learning works (with real Python you run in the browser), to evaluating AI
          models responsibly. Each lesson pairs a plain-English idea with something you actually do.
        </p>
        <p className="muted" style={{ marginTop: 'var(--s2)' }}>
          Levels 0, 1, 2, 3 &amp; 5 of the AI Academy curriculum. Code lessons (badged{' '}
          <span className="code-badge">Code</span>) start at Level 2. More levels are in development.
        </p>
```

- [ ] **Step 4: Add styles for the code cell, output, booting state, spinner, and badge**

Append to `src/styles/global.css`:
```css
/* ---- Hands-on code (notebook) activity ---------------------------- */
.code-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 1px 8px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  border-radius: 999px;
  background: var(--accent, #6366f1);
  color: #fff;
  vertical-align: middle;
}

.notebook {
  display: flex;
  flex-direction: column;
  gap: var(--s3, 12px);
}

.notebook--booting {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: var(--s5, 24px);
  color: var(--muted, #64748b);
  justify-content: center;
}

.notebook__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted, #64748b);
}

.code-cell {
  width: 100%;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  tab-size: 4;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid var(--border, #e2e8f0);
  background: #0f172a;
  color: #e2e8f0;
  resize: vertical;
  white-space: pre;
  overflow-x: auto;
}

.code-output {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #0f172a;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  max-height: 240px;
  overflow: auto;
}

.notebook__hints .hint {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: var(--muted, #475569);
}

.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/Sidebar.jsx src/components/Overview.jsx src/styles/global.css
git commit -m "feat: Code badge + notebook activity styling; update overview copy

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: Lesson-data integrity tests

**Files:**
- Create: `src/data/lessons.test.js`

Guards the rules that make the product model true: code lessons are well-formed; L0/L1 are code-free; concept precedes code within each level.

- [ ] **Step 1: Write the integrity tests**

Create `src/data/lessons.test.js`:
```js
import { describe, it, expect } from 'vitest'
import { TRACKS, LEVELS } from './tracks.js'

const codeLessons = LEVELS.filter((l) => l.kind === 'code')

describe('lesson data integrity', () => {
  it('every track composes only defined lessons', () => {
    for (const track of TRACKS) {
      for (const level of track.levels) {
        expect(level, `track ${track.id} has an undefined lesson id`).toBeTruthy()
        expect(typeof level.id).toBe('string')
      }
    }
  })

  it('every code lesson has a complete notebook activity', () => {
    for (const l of codeLessons) {
      expect(l.activity.type, `${l.id} must use the notebook activity`).toBe('notebook')
      const d = l.activity.data
      expect(typeof d.starter, `${l.id} needs starter code`).toBe('string')
      expect(typeof d.tests, `${l.id} needs hidden tests`).toBe('string')
      expect(Array.isArray(d.packages), `${l.id} needs a packages array`).toBe(true)
      expect(Array.isArray(d.hints), `${l.id} needs hints`).toBe(true)
      expect(l.activity.feedback.correct, `${l.id} needs correct feedback`).toBeTruthy()
      expect(l.activity.feedback.incorrect, `${l.id} needs incorrect feedback`).toBeTruthy()
    }
  })

  it('beginner levels L0 and L1 are code-free', () => {
    const beginner = TRACKS.filter((t) => t.id === 'level-0' || t.id === 'level-1')
    for (const track of beginner) {
      for (const level of track.levels) {
        expect(level.kind, `${level.id} in ${track.id} must not be a code lesson`).not.toBe('code')
      }
    }
  })

  it('within every level, concept lessons come before code lessons', () => {
    for (const track of TRACKS) {
      let seenCode = false
      for (const level of track.levels) {
        if (level.kind === 'code') seenCode = true
        else if (seenCode) {
          throw new Error(
            `Concept lesson "${level.id}" appears after a code lesson in ${track.id}; concept must come first.`,
          )
        }
      }
    }
  })

  it('code lessons only appear at Level 2 or later', () => {
    const earlyTrackIds = ['level-0', 'level-1']
    for (const track of TRACKS) {
      if (!earlyTrackIds.includes(track.id)) continue
      expect(track.levels.some((l) => l.kind === 'code')).toBe(false)
    }
  })
})
```

- [ ] **Step 2: Run the tests**

Run: `npx vitest run src/data/lessons.test.js`
Expected: PASS — all integrity checks green. (If any fail, the bug is in the data/tracks from earlier tasks; fix the data, not the test.)

- [ ] **Step 3: Commit**

```bash
git add src/data/lessons.test.js
git commit -m "test: lesson-data integrity (code-free beginner levels, concept-before-code)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 13: useProgress regression tests

**Files:**
- Create: `src/hooks/useProgress.test.js`

Confirms the chained unlock and totals still hold after the new lessons.

- [ ] **Step 1: Write the tests**

Create `src/hooks/useProgress.test.js`:
```js
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress.js'
import { LEVELS, MAX_STARS } from '../data/tracks.js'

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('MAX_STARS equals 3 per lesson', () => {
    expect(MAX_STARS).toBe(LEVELS.length * 3)
  })

  it('only the first lesson is unlocked initially', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.isUnlocked(0)).toBe(true)
    expect(result.current.isUnlocked(1)).toBe(false)
  })

  it('completing a lesson unlocks the next one', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      result.current.completeLevel(LEVELS[0].id, 3)
    })
    expect(result.current.isUnlocked(1)).toBe(true)
  })

  it('keeps the best star score for a lesson', () => {
    const { result } = renderHook(() => useProgress())
    act(() => result.current.completeLevel(LEVELS[0].id, 2))
    act(() => result.current.completeLevel(LEVELS[0].id, 1))
    expect(result.current.starsFor(LEVELS[0].id)).toBe(2)
  })
})
```

- [ ] **Step 2: Run the tests**

Run: `npx vitest run src/hooks/useProgress.test.js`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useProgress.test.js
git commit -m "test: useProgress unlock + totals regression

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 14: Full suite, build, and manual smoke

**Files:** none (verification only)

- [ ] **Step 1: Run the entire test suite**

Run: `npm test`
Expected: PASS — all suites (pyodideService, NotebookGame, lessons, useProgress) green.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Manual smoke test (the one path needing the real runtime)**

Run: `npm run dev`, open the printed local URL, then:
1. Confirm the sidebar/overview show **Level 0, 1, 2, 3, 5** with curriculum titles, and that L2/L3 code lessons carry the **"Code"** badge while L0/L1 do not.
2. (To skip the unlock chain for testing, complete lessons or temporarily clear `localStorage` and step through — or open the L2 sklearn lesson if reachable.) On first open of a code lesson, confirm **"Booting your Python environment…"** appears, then the cell becomes runnable.
3. In the sklearn lesson: click **Run** with the starter as-is → it should report incorrect (accuracy gate / missing fit) with a hint. Then complete `model.fit(X_train, y_train)` and `preds = model.predict(X_test)` → **Run** → it passes and awards stars.
4. Confirm a deliberately broken edit (e.g. delete a variable) surfaces the error in the output panel rather than crashing the page.

Document the result of this smoke test in the PR/commit description.

- [ ] **Step 4: Final commit (if any smoke fixes were needed)**

```bash
git add -A
git commit -m "fix: address manual smoke-test findings for code lessons

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

(If no fixes were needed, skip this commit.)

---

## Notes for the implementer

- **Pyodide version** is pinned to `0.26.4` in `pyodideService.js`. If a newer stable exists at implementation time, you may bump it, but keep it pinned (never `latest`).
- **The real runtime is never loaded in tests** — every test mocks `pyodideService` or its script loader. Only the Task 14 manual smoke exercises real Pyodide.
- **Component-is-source-of-truth** for reused activities: when authoring the L0 `pick-dataset` lesson (Task 9), match `PickDatasetGame`'s actual prop shape; adapt the lesson data if it differs.
- **No backend, static build preserved** — Pyodide is loaded from CDN at runtime, never bundled or committed.
