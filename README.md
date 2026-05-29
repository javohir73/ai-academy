# AI Academy

AI Academy is a browser-based learning platform for students who want to learn
AI and Machine Learning from scratch. It is built as a concept-first course:
students start with friendly explanations and interactive practice, then move
into real Python only when they are ready.

The app currently ships **22 interactive lessons** across curriculum Levels 0,
1, 2, 3, and 5. Levels 0 and 1 are code-free. Code lessons begin in Level 2 and
run directly in the browser with Pyodide, so there is no backend setup for the
learner.

## Current Curriculum

| Level | Title | Status |
|-------|-------|--------|
| L0 | Foundations | What data is and why examples matter |
| L1 | Fundamentals of AI | AI basics and responsible AI |
| L2 | Introduction to Machine Learning | ML concepts plus first Python models |
| L3 | Problem Solving & Search | BFS maze search in Python |
| L4 | Computer Vision | Coming soon |
| L5 | LLMs in Practice - Evaluation & Responsible AI | AI model evaluation practice |

The full curriculum files live in `curriculum/`. The running app uses the lesson
data in `src/data/`.

## Learning Model

Each lesson follows the same beginner-friendly rhythm:

1. **I do** - plain-English concept, everyday example, and worked example.
2. **We do** - guided practice with hints.
3. **You do** - an interactive mastery check with feedback and stars.

This keeps the experience closer to Khan Academy or Coursera than a raw coding
notebook. Students earn their way into code instead of being dropped into it on
day one.

## Features

- Responsive React app with sidebar navigation and mobile drawer.
- Chained lesson unlocks, progress tracking, stars, and streaks.
- Code badges for Python lessons.
- In-browser Python powered by Pyodide.
- Notebook-style activities with starter code, hidden tests, hints, retry, and
  reset.
- Concept activities including sorting, matching, dataset choice, prediction
  sliders, bias spotting, overfitting comparison, neural-network building, and
  AI-evaluation tasks.
- Progress saved locally in `localStorage`; no account or backend required.

## Tech Stack

- React 18 + Vite 5
- JavaScript
- Plain CSS in `src/styles/global.css`
- `lucide-react` icons
- Pyodide loaded lazily from a pinned CDN at runtime
- Vitest + Testing Library

## Running Locally

You need Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

Useful commands:

```bash
npm test
npm run build
npm run preview
```

## Deploying Online

The app builds to static files in `dist/`, so it can be hosted on Vercel,
Netlify, GitHub Pages, Cloudflare Pages, S3, or any static web host.

Typical hosted build settings:

```text
Build command: npm run build
Publish directory: dist
```

There is no backend to provision. Pyodide and Python packages load in the
learner's browser from the pinned CDN at runtime, so the hosted site needs normal
internet access to that CDN.

## Project Structure

```text
src/
  App.jsx                         layout shell and view state
  data/
    foundations.js                Level 0 lesson data
    levels.js                     Levels 1-3 lesson data
    intermediate.js               Level 5 evaluator lesson data
    tracks.js                     track composition and flat lesson order
  hooks/
    useProgress.js                localStorage progress and unlock rules
  utils/
    pyodideService.js             singleton Pyodide runtime owner
  components/
    LevelView.jsx                 I-do / We-do / You-do lesson renderer
    ActivityShell.jsx             shared grading, feedback, stars, retry
    Overview.jsx                  course home and track cards
    Sidebar.jsx                   course navigation
    activities/
      NotebookGame.jsx            runnable Python code-cell activity
      index.js                    activity type registry
```

## In-Browser Python

`src/utils/pyodideService.js` owns the Pyodide runtime:

- lazy-loads the pinned Pyodide CDN script
- memoizes boot so Python starts once per session
- resets the namespace between notebook activities
- captures stdout and stderr
- loads requested Python packages
- runs hidden assertion tests in the same namespace
- applies timeouts around boot, package loading, code execution promises, and
  tests so network stalls fail with friendly retry paths

Notebook activities use the same activity contract as the rest of the app:

```jsx
function Activity({ data, onResult }) {
  onResult({ correct: true })
}
```

This lets code lessons plug into the existing feedback, stars, and progression
system.

## Adding A Lesson

1. Add the lesson object to the right data file:
   - `src/data/foundations.js` for Level 0
   - `src/data/levels.js` for Levels 1-3
   - `src/data/intermediate.js` for Level 5
2. Add the lesson id to the appropriate track in `src/data/tracks.js`.
3. Add an icon mapping in `src/components/levelIcons.js`.
4. Use an existing activity type from `src/components/activities/index.js`, or
   create and register a new one.

Code lessons should use:

```js
{
  kind: 'code',
  activity: {
    type: 'notebook',
    data: {
      packages: ['scikit-learn'],
      starter: '...',
      tests: '...',
      hints: ['...']
    }
  }
}
```

## Progress Storage

Progress is stored under:

```text
ai-academy:progress.v1
```

To reset progress in the browser console:

```js
localStorage.removeItem('ai-academy:progress.v1')
```

## Roadmap

- Add more Level 3 neural-network lessons.
- Add Level 4 Computer Vision.
- Add richer projects and portfolio artifacts.
- Move Pyodide execution into a Web Worker before heavy public use, so long or
  infinite CPU-bound Python code can be interrupted without blocking the main UI
  thread.
- Add real lesson videos or short animations to replace placeholders.

## Current Verification

The expected local quality gate is:

```bash
npm test
npm run build
```

Both should pass before shipping changes.
