# Manual Smoke Test Results — In-Browser Code + Curriculum Reframe

_Date: 2026-05-30. Plan: `2026-05-29-in-browser-code-and-curriculum-reframe.md`, Task 14._

Ran `npm run dev` and drove the live app in a real browser (chrome-devtools).

## ✅ Verified working

- **Curriculum reframe renders correctly.** Sidebar + overview show **Level 0 Foundations, Level 1 Fundamentals of AI, Level 2 Introduction to ML, Level 3 Neural Networks & Problem Solving, Level 5 LLMs in Practice** with the authored titles/blurbs. 22 lessons total.
- **"Code" badge placement is exactly right.** The badge appears on the 3 code lessons only — *Train Your First Classifier*, *Spot Overfitting With Metrics* (L2), *Solve a Maze With Search* (L3). **L0 and L1 carry no Code badge** (beginner levels stay code-free, as designed).
- **Concept-before-code ordering** holds: L2 lists its 8 concept lessons, then the 2 code lessons.
- **Chained unlock** works: only L0's first lesson is open initially; each subsequent lesson/level locks behind the previous.
- **Teaching-method lesson structure intact** for a code lesson: I DO / WE DO / YOU DO step nav, Concept, Worked Example with narrated steps, a "Go Deeper" disclosure, and the notebook in the YOU DO (mastery check) step.
- **NotebookGame mounts correctly.** On opening the L2 sklearn lesson's YOU DO step: the code cell renders immediately, seeded with the real scikit-learn starter code; the "Booting your Python environment…" status shows; Run + Reset cell buttons present. (Editor-renders-immediately behavior confirmed.)
- **Pyodide CDN script loads:** `window.loadPyodide` became a function (the pinned jsDelivr `pyodide.js` downloaded and executed).
- **Grading logic verified end-to-end** against a fake runtime in-page: `runCell` captures stdout and `runTests` pass → drives `onResult({ correct: true })`. (Mirrors the unit tests.)

## ⚠️ Environmental limitation (not a code defect)

- The sandboxed test browser could **not complete the large Pyodide WASM / scikit-learn download** from the CDN — console showed `ERR_QUIC_PROTOCOL_ERROR`, "wasm instantiation failed!", "WebAssembly compilation aborted: Network error". The `.js` loaded but the `.wasm`/package fetch was aborted by the environment's QUIC transport. In a normal browser/network this completes. The real end-to-end "click Run → sklearn trains → passes" path therefore could not be exercised *in this sandbox*, but the code path is correct (script loads, component mounts, starter seeds, boot state shows) and the grading wiring is proven against a fake runtime + full unit-test coverage.

## 🛠 Finding → fix (surfaced by the smoke test)

- The hung CDN fetch did **not** cleanly reject — Pyodide's internal fetch retried/hung, so `ensureLoaded` stayed *pending* and the cell sat on "Booting…" indefinitely with no escape. The component handled boot *rejection* (error + Retry) but not a *hang*.
- **Fixed** (commit `638f4f5`): bound the boot in a 60s timeout race so a hang rejects, reusing the existing memo-clear + error/Retry path. Covered by a new unit test (`rejects (and clears the memo) if booting hangs past the timeout`). On a flaky real-world network, learners now get an actionable error + Retry instead of an infinite spinner.

## Suite + build at smoke-test time

- `npm test`: **24 passing** across 4 files (pyodideService 8, NotebookGame 7, lessons 5, useProgress 4).
- `npm run build`: succeeds.
