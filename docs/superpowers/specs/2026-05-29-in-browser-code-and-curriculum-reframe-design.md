# In-Browser Code (Pyodide) + Curriculum Reframe — Design

_Date: 2026-05-29_

## Context

AI Academy today is a static, no-backend React/Vite app: a polished **concept-literacy game** (drag/sort/slider/match activities) covering a concept slice of curriculum Levels 1, 2, and 5. The curriculum spec (`curriculum/`) describes a far larger **hands-on engineering program** whose north-star is "% of learners who can **build AND explain** a working model," with most lessons requiring learners to run/write real code.

`curriculum/GAP-ANALYSIS.md` identified the central gap as a **missing capability: in-app code execution**, and laid out a phased build (A→D). This design implements **Phase A** (reframe existing content to the curriculum's levels + apply the teaching method) **and Phase B** (in-browser Python via Pyodide, no backend).

A product correction shaped the model: the platform must stay **beginner-friendly** — beginners should not be dropped into writing code. Modeled on Khan Academy → Coursera, the result is a **concept-first, code-when-ready** program.

## Goals

- Reframe the UI to curriculum level naming: **L0 Foundations, L1 Fundamentals of AI, L2 Intro to ML, L5 LLMs in Practice**.
- Keep **beginner levels (L0, L1) 100% code-free** — existing interactive activities only.
- Add a real **in-browser Python capability** (Pyodide) usable from **L2 onward**, with code lessons **badged "Code"** and **gated behind each level's concept lesson**, inside the single chained spine (L0→L1→L2→L5). No separate code track.
- Author **three exemplar runnable-code lessons** end-to-end, each following the full teaching-method template (I do → We do → You do, Go Deeper, auto-graded "You do").
- Preserve the **static, no-backend** constraint and keep `dist/` lightweight.

## Non-Goals (YAGNI)

- Authoring the full L0 (~24) / L2 (~10+) lesson sets — only the vertical slice now.
- Deep-learning (L3–L5) GPU/PyTorch execution — out of scope (Phase C; needs external notebooks/backend).
- A backend execution service of any kind.
- A rich code editor (CodeMirror/Monaco) — a styled `<textarea>` for v1.
- Web-Worker-hosted Python / cancellation — documented future upgrade.
- E2E/browser-automation test harness.

## Product Model — concept-first, code-when-ready

One ordered spine, escalating modality:

- **L0, L1 (beginner):** pure intuition. Existing drag/sort/slider/match activities + teaching-method polish. A learner **never sees Python** here.
- **L2+ :** each level **leads with its concept lesson(s)**; runnable-code lessons follow, each **visibly badged "Code"** and **gated behind the concept lesson** for that level — so intuition is always earned before the keyboard, and code is never a surprise.
- **Single spine:** L0→L1→L2→L5 stays one chained path (matches curriculum "Full AI Engineer 0→6"); no parallel code track.

## Architecture

Reuse the existing activity system untouched; add Python as **one new activity type** backed by **one isolated service**. The activity contract is unchanged: a component receives `({ data, onResult })` and calls `onResult({ correct: boolean })`; `ActivityShell` handles stars/feedback/retry; `useProgress` does chained unlock by index.

### Approach chosen

**Singleton Pyodide service + thin `NotebookGame` activity.** (Alternatives rejected: per-lesson Pyodide instance — far too heavy to boot per component; Web-Worker-hosted Pyodide — more complexity than a beginner platform with tiny cells needs, kept as a future upgrade.)

### Pyodide delivery & loading

- **Delivery:** load Pyodide lazily from the **official jsDelivr CDN**, version **pinned**, via a `<script>` injected on first use. No npm package, no Vite/build changes — keeps repo and `dist/` light; fits the static-site constraint. The app is an online platform, so network-at-first-code-load is acceptable.
- **Loading strategy:** **lazy + cached**. Pyodide initializes the first time a learner opens a code lesson, behind a friendly "Booting your Python environment…" progress state. Memoized for the session; browser HTTP cache across visits. Concept lessons (L0/L1, L5 eval) never pay the cost.

## Components & Files

### New files

1. **`src/utils/pyodideService.js`** — singleton owning the runtime. One job: run Python.
   - `ensureLoaded(onProgress)` — lazy-injects the pinned CDN `pyodide.js` on first call, boots Pyodide, **memoizes the promise** (later calls resolve instantly). Reports progress via `onProgress`.
   - `runCell(code, { packages })` — loads needed packages on demand (e.g. `loadPackagesFromImports`), captures `stdout`/`stderr`, returns `{ ok, stdout, error }`.
   - `runTests(testCode)` — runs the lesson's hidden assertion code **in the same namespace** as the learner's code; returns `{ passed, message }`.
   - `resetNamespace()` — clears interpreter globals so one lesson's variables never leak into the next.
   - Dependency: the CDN script only.

2. **`src/components/activities/NotebookGame.jsx`** — new activity component, same `{ data, onResult }` contract.
   - Renders: prompt, editable code area seeded with `data.starter`, **Run** button, output panel (stdout/errors), **reset cell** button.
   - On Run: `pyodideService.runCell` → show output → `runTests(data.tests)`. All pass → `onResult({ correct: true })`; any fail → show which check failed + hint ladder → `onResult({ correct: false })`.
   - First-ever load shows the "Booting your Python environment…" state (wired to `onProgress`); instant thereafter.
   - Editor: a controlled **`<textarea>`** styled as a code cell (monospace, tab handling). Zero new deps.

3. **`src/data/foundations.js`** (new data module; existing data files extended where a lesson belongs to an existing level) — new code lessons as **pure data**:
   ```
   {
     id, title, concept, explanation, kind: 'code',
     workedExample, guided, goDeeper,
     activity: {
       type: 'notebook',
       prompt,
       data: { starter, packages: [...], tests, expected },
       feedback: { correct, incorrect },
     },
   }
   ```
   Authoring future code lessons = adding data, no new components.

### Modified files (minimal)

- **`src/components/activities/index.js`** — add one entry: `notebook: NotebookGame`. (Only touch to core activity plumbing.)
- **`src/data/tracks.js`** — add a **Level 0 — Foundations** track at the front; place the new code lessons into their levels (L2 lessons in L2; the problem-solving lesson in L1 or L3). Concept lessons listed **before** code lessons within each level. Update track titles to curriculum naming.
- **`src/components/Sidebar.jsx`, `src/components/Overview.jsx`** — render a small **"Code"** badge for lessons with `kind: 'code'`.

### Lessons authored (the vertical slice)

All in code-appropriate levels (none in L0/L1 beginner):
1. **L2 — Train your first classifier (scikit-learn):** fit a model, predict, report accuracy. Test asserts `accuracy >= threshold`.
2. **L2 — Metrics & overfitting:** compute/inspect train-vs-test performance. Test asserts on computed metrics / detection of overfitting gap.
3. **L1-or-L3 — Solve a maze with BFS:** pure-Python problem solving (Pyodide-friendly, no heavy packages). Test asserts the returned path is valid and shortest.

Each lesson is built to the full template: Hook → I do (`workedExample`) → We do (`guided` + hint ladder) → You do (auto-graded `notebook`) → Go Deeper (optional) → takeaway/bridge.

## Data Flow

```
Learner edits textarea → clicks Run
  → pyodideService.ensureLoaded()         (instant after first boot)
  → runCell(code)        → capture stdout/stderr → render output panel
  → runTests(data.tests) → hidden asserts run in the SAME namespace
       all pass → onResult({ correct: true })   → ActivityShell awards stars
       any fail → show failed check + hint ladder → onResult({ correct: false })
```

`NotebookGame` only emits `{ correct }`, so `ActivityShell`'s existing star/feedback/retry logic is reused verbatim.

## Grading (assertion-based)

- Each lesson carries hidden `tests` — Python that asserts on the learner's result (value, DataFrame shape, array contents, or `accuracy >= threshold`).
- A failed `assert` is caught; its message becomes the learner-facing "what's off" hint.
- Errors in the learner's own code (syntax/exception) surface in the output panel with the first hint — not a raw traceback dump.

## State Isolation

`resetNamespace()` runs on `NotebookGame` mount, so each lesson starts with clean globals despite the shared singleton runtime — Approach 1's speed without cross-lesson variable leakage.

## "Code" Badge & Gating

- Optional `kind: 'code'` field on a lesson drives a **"Code"** badge in the sidebar/overview, so a learner always sees it coming.
- **Ordering rule:** concept lesson(s) listed **before** code lessons within each level in `tracks.js`. Because `useProgress.isUnlocked` already gates each lesson behind the previous by index, this means intuition is earned before the keyboard **with zero unlock-logic changes**.
- **L0 and L1 contain no `kind: 'code'` lessons.**

## Error Handling & Edge Cases

- **Pyodide fails to load** (offline/CDN down): notebook shows "Couldn't load the Python environment — check your connection and retry" + Retry button. Never crashes the app; concept lessons are unaffected (they don't touch the service).
- **Long-running / infinite loop:** documented v1 limitation (cells are tiny). A Web Worker with cancellation is the noted future upgrade; v1 adds a guard note rather than a worker.
- **Progress math:** `MAX_STARS` and totals derive from `LEVELS` length, so adding lessons updates totals automatically.

## Testing Strategy

The project currently has **no test runner**. Add one once, then test the new units.

1. **Setup:** add **Vitest + React Testing Library + jsdom** and a `test` script — standard near-zero-config pair for Vite/React. Contained addition serving the whole project.
2. **`pyodideService`** — unit tests with the runtime **mocked** (fake Pyodide): `ensureLoaded` injects script once + memoizes; `runCell` routes code + captures stdout/errors; `runTests` reports pass/fail; `resetNamespace` clears globals. Fast, deterministic, no 10MB download in CI.
3. **`NotebookGame`** — component tests with service mocked: renders starter; Run on passing code → `onResult({ correct: true })`; failing asserts → `onResult({ correct: false })` + hint; load-failure → error + Retry; booting state on first load.
4. **Lesson-data integrity** — every `notebook` lesson has `starter`, `tests`, `packages`, `feedback`; no L0/L1 lesson has `kind: 'code'`; within each level concept precedes code.
5. **`useProgress` regression** — chained unlock and `MAX_STARS` hold after new lessons added.
6. **Manual smoke (documented):** `npm run dev`, open the L2 sklearn lesson, confirm real Pyodide boots, a correct solution passes and a wrong one fails — the one path needing the actual runtime.

## Constraints Preserved

- Static, no-backend site; `dist/` stays lightweight (Pyodide from CDN, not committed/bundled).
- Existing activity/progress/unlock architecture reused; core plumbing change is a single registry line.
- Beginner experience remains code-free and unchanged in feel.
