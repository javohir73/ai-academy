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
 * mount. The editor renders immediately so the learner can start reading/typing;
 * a non-blocking banner reports boot progress, and Run waits for boot to finish.
 * Concept lessons never mount this.
 */
export default function NotebookGame({ data, onResult }) {
  const [code, setCode] = useState(data.starter ?? '')
  const [boot, setBoot] = useState('booting') // booting | ready | error
  const [running, setRunning] = useState(false)
  const [bootMsg, setBootMsg] = useState('Booting your Python environment…')
  const [output, setOutput] = useState('')
  const [hintLevel, setHintLevel] = useState(0) // how many hints to reveal
  // A single boot promise shared by mount + Run, so a click before boot
  // finishes simply awaits the same load instead of racing it.
  const bootPromise = useRef(null)

  function startBoot() {
    setBoot('booting')
    bootPromise.current = ensureLoaded(setBootMsg)
      .then(() => resetNamespace())
      .catch((err) => {
        bootPromise.current = null // allow Retry to start a fresh load
        throw err
      })
    return bootPromise.current
  }

  useEffect(() => {
    let alive = true
    startBoot()
      .then(() => {
        if (alive) setBoot('ready')
      })
      .catch(() => {
        if (alive) setBoot('error')
      })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function retryBoot() {
    startBoot()
      .then(() => setBoot('ready'))
      .catch(() => setBoot('error'))
  }

  async function run() {
    if (running) return
    setRunning(true)
    setOutput('')
    try {
      // Make sure the runtime is up before we run. If the learner clicked
      // during boot, this awaits the in-flight load instead of starting a new one.
      await (bootPromise.current ?? startBoot())
      setBoot('ready')
    } catch {
      setBoot('error')
      setRunning(false)
      return
    }

    const cell = await runCell(code, { packages: data.packages ?? [] })
    let combined = cell.stdout || ''
    if (!cell.ok && cell.error) combined += (combined ? '\n' : '') + cell.error
    setOutput(combined)

    if (!cell.ok) {
      setHintLevel((n) => Math.min(data.hints?.length ?? 0, n + 1))
      setRunning(false)
      onResult({ correct: false })
      return
    }

    const verdict = await runTests(data.tests ?? '')
    setRunning(false)
    if (verdict.passed) {
      onResult({ correct: true })
    } else {
      setHintLevel((n) => Math.min(data.hints?.length ?? 0, n + 1))
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

      {boot === 'error' ? (
        <div className="notebook__boot">
          <p className="feedback feedback--incorrect" role="alert">
            <AlertTriangle size={18} aria-hidden="true" /> Couldn’t load the Python
            environment — check your connection and try again.
          </p>
          <button className="btn btn--primary" onClick={retryBoot}>
            <RotateCcw size={16} /> Retry
          </button>
        </div>
      ) : (
        boot === 'booting' && (
          <p className="notebook__boot notebook--booting" role="status">
            <Loader2 size={16} className="spin" aria-hidden="true" /> {bootMsg}
          </p>
        )
      )}

      <div className="btn-row">
        <button
          className="btn btn--primary"
          onClick={run}
          disabled={running || boot === 'error'}
        >
          {running ? (
            <>
              <Loader2 size={16} className="spin" /> Running…
            </>
          ) : (
            <>
              <Play size={16} /> Run
            </>
          )}
        </button>
        <button className="btn btn--ghost" onClick={resetCell} disabled={running}>
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
