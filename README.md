# AI Academy

A clean, self‑paced course that teaches AI and Machine Learning **by doing**. Every lesson pairs a
plain‑English idea with a hands‑on, interactive challenge — no lectures, no walls of text, and (almost)
no plain multiple‑choice quizzes.

It runs entirely in the browser with **no backend**. All lesson content lives inside the project, and
progress is saved to `localStorage`.

The course has two tracks:

| Track | Title | For |
|-------|-------|-----|
| **Beginner** | AI & Machine Learning Foundations | Anyone new to AI. 10 lessons from “what is AI?” to ethics. |
| **Intermediate** | LLMs in Practice — AI Model Evaluation & Responsible AI | Learners who finished the beginner track. 8 modules that train you like a real AI model evaluator. |

The Intermediate track unlocks automatically once the Beginner track is complete.

---

## Tech stack

- **React 18** + **Vite 5**
- Plain **CSS** (one stylesheet, design‑token based — no CSS framework)
- **JavaScript** (no TypeScript)
- **lucide-react** for icons, **Inter** for type
- No backend, no database — progress persists in `localStorage`

---

## Running locally

You need **Node.js 18+** and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (hot reload)
npm run dev
# → open the printed URL, e.g. http://localhost:5173

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

The production build outputs static files to `dist/` that can be hosted on any static host
(GitHub Pages, Netlify, Vercel, S3, …). The Vite `base` is set to `./` so it also works from a
sub‑folder or opened relative to a static server.

---

## Project structure

```
ai-academy/
├── index.html                 # App shell + Inter font
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Layout shell: sidebar + content + mobile drawer; view state machine
    ├── styles/
    │   └── global.css         # The whole design system + every component's styles
    ├── data/
    │   ├── levels.js          # BEGINNER_LEVELS — all 10 beginner lessons (content + activity config)
    │   ├── intermediate.js    # INTERMEDIATE_LEVELS — all 8 evaluator modules
    │   └── tracks.js          # Composes the tracks; exports TRACKS, LEVELS (flat), MAX_STARS
    ├── hooks/
    │   └── useProgress.js     # localStorage progress: stars, completion, unlock rule
    ├── utils/
    │   └── shuffle.js         # Fisher–Yates shuffle (randomizes answer order)
    └── components/
        ├── Sidebar.jsx        # Track-grouped lesson navigation
        ├── Overview.jsx       # Course home (hero + module cards per track)
        ├── LevelView.jsx      # One lesson: Concept → Watch → Example → Practice
        ├── ActivityShell.jsx  # Wraps every challenge: feedback, stars, retry, continue
        ├── Feedback.jsx       # The correct / try-again banner
        ├── VideoCard.jsx      # Placeholder (or real) lesson video
        ├── ProgressBar.jsx, Stars.jsx
        ├── levelIcons.js      # Maps each lesson id → a Lucide icon
        └── activities/
            ├── index.js       # REGISTRY: activity `type` string → component
            ├── SortGame.jsx            (drag-and-drop sorting)
            ├── PipelineGame.jsx        (order an ML pipeline diagram)
            ├── PickDatasetGame.jsx     (choose the best/fair dataset)
            ├── MatchGame.jsx           (match clues to answers)
            ├── ClassifyGame.jsx        (classify by clues)
            ├── PredictGame.jsx         (slider prediction simulator)
            ├── BiasGridGame.jsx        (spot the missing group)
            ├── OverfitCompareGame.jsx  (compare two model diagrams)
            ├── NeuralGame.jsx          (connect neurons to build a network)
            ├── EthicsGame.jsx          (scenario decisions)
            ├── ReviewQueueGame.jsx     (decide what needs human review)
            ├── RateResponseGame.jsx    (score answers 1–5)
            ├── CompareAnswersGame.jsx  (rank two answers)
            ├── HighlightErrorGame.jsx  (highlight hallucinations)
            ├── LabelIssuesGame.jsx     (drag issue labels onto answers)
            ├── RewriteGame.jsx         (rewrite a weak answer to 5/5)
            └── CapstoneGame.jsx        (multi-step evaluation packet)
```

---

## How the course works

- **App** (`App.jsx`) is a small state machine with two views: the **Overview** (course home) and a
  single **Lesson**. A persistent **Sidebar** lists every lesson grouped by track; on mobile it
  collapses into a slide‑in drawer (with focus management and Escape‑to‑close).
- **Lessons** all follow the same structure, rendered by `LevelView.jsx`:
  1. **Concept** — the idea in plain language
  2. **Watch** — a short video (placeholder by default)
  3. **Everyday example**
  4. **Practice** — the interactive challenge
  5. **Feedback** → **Continue**
- **Activities** are decoupled from the shell. Each activity component only:
  1. receives `{ data, onResult }`
  2. renders its own interaction
  3. calls `onResult({ correct: boolean })` once the learner submits

  `ActivityShell.jsx` does everything else — it shows the shared feedback banner, awards **stars**
  (3 on a first‑try win, fewer after wrong attempts), offers **Try again** / **Replay**, and a
  **Next lesson** / **Back to overview** button.
- **Progress & unlocking** (`useProgress.js`): completion and best star score per lesson are saved to
  `localStorage` under `ai-academy:progress.v1`. The unlock rule is simple and **chained**: the first
  lesson is always open, and every other lesson unlocks once the previous one (in `LEVELS` order) is
  completed. Because the Intermediate track comes after the Beginner track in that flat list, its first
  module only unlocks after the last beginner lesson — so the whole track is gated for free.

**Reset progress:** clear the site’s storage in your browser dev tools, or run
`localStorage.removeItem('ai-academy:progress.v1')` in the console.

---

## Activity types

The course deliberately uses a **different format for almost every lesson** so it feels like an
interactive course, not a quiz. Each `type` below maps to a component in
`src/components/activities/index.js`.

**Beginner**

| Lesson | `type` | What you do |
|--------|--------|-------------|
| What Is AI? | `sort` | Drag (or tap) cards into AI / Not AI |
| What Is ML? | `pipeline` | Put the ML pipeline stages in order; tap to learn each |
| Training Data | `pick-dataset` | Choose the best training set |
| Features & Labels | `match` | Match features (clues) to labels (answers) |
| Classification | `classify` | Classify items from their clues |
| Prediction | `predict` | Move sliders and watch the prediction change |
| Bias In Data | `bias-grid` | Spot the group missing from a dataset |
| Overfitting | `overfit-compare` | Compare two model diagrams; pick the one that generalizes |
| Neural Networks | `neural` | Connect input → hidden → output neurons |
| AI Ethics | `ethics` | Choose the most responsible action |

**Intermediate (AI model evaluation)**

| Module | `type` | What you do |
|--------|--------|-------------|
| What Is AI Evaluation? | `review-queue` | Decide which AI answers need human review |
| Evaluation Rubrics | `match` | Match each rubric criterion to what it checks |
| Rating AI Responses | `rate` | Score answers 1–5 with a slider |
| Ranking Two Answers | `compare` | Pick the better of two answers |
| Hallucination Detection | `highlight` | Highlight the false sentences |
| Helpful, Honest & Harmless | `label-issues` | Drag issue labels onto answers |
| Rewrite to 5/5 | `rewrite` | Rewrite a weak answer in a text box |
| Capstone | `capstone` | A 5‑task evaluation packet with a progress checklist |

---

## Adding a new lesson

1. Open the right data file (`src/data/levels.js` for the beginner track, or
   `src/data/intermediate.js` for the intermediate track) and append a level object:

   ```js
   {
     id: 'my-new-lesson',              // unique across ALL tracks
     title: 'My New Lesson',
     concept: 'One-line summary',
     explanation: 'One or two simple sentences.',
     example: { text: 'An everyday example.' },
     video: {                          // optional — omit to hide the Watch section
       title: 'Video title',
       description: 'Short description.',
       duration: '2:30',
       // src: 'https://…/clip.mp4',   // add a URL to enable real playback
     },
     activity: {
       type: 'match',                  // must exist in activities/index.js
       prompt: 'Instruction shown above the challenge.',
       data: { /* shape depends on the activity type */ },
       feedback: { correct: '…', incorrect: '…' },
     },
   }
   ```

2. Give it an icon in `src/components/levelIcons.js`:

   ```js
   import { Rocket } from 'lucide-react'
   export const LEVEL_ICONS = { /* … */ 'my-new-lesson': Rocket }
   ```

That’s it — the sidebar, overview, progress bar, stars, and unlock chain all update automatically.

## Adding a new activity type

1. Create `src/components/activities/MyGame.jsx`. It must accept `{ data, onResult }` and call
   `onResult({ correct: true | false })` when the learner submits:

   ```jsx
   export default function MyGame({ data, onResult }) {
     // …render your interaction using the existing CSS classes…
     // when the learner submits:
     onResult({ correct: true })
   }
   ```

2. Register it in `src/components/activities/index.js`:

   ```js
   import MyGame from './MyGame.jsx'
   export const ACTIVITIES = { /* … */ 'my-game': MyGame }
   ```

3. Reference `type: 'my-game'` in a lesson’s `activity`.

## Adding a new track

Append another object to `TRACKS` in `src/data/tracks.js` with its own `levels` array (and import that
array from a new data file). The flat `LEVELS` list and the chained unlock rule pick it up
automatically; it will unlock after the track before it.

---

## Accessibility & responsiveness

- Mobile‑first; the layout collapses to a single column with a focus‑managed drawer below 900px.
- All interactions are keyboard‑operable. Drag‑and‑drop games also offer a tap‑to‑place fallback.
- Color contrast targets WCAG AA; motion respects `prefers-reduced-motion`.
- Real Lucide icons and a neutral palette — no emoji, no decorative gradients.

---

## Notes on the videos

Lesson videos are **placeholders** by default — a clean card with a play button, title, and duration.
To enable real playback, add a `src` (a video URL) to a lesson’s `video` object in the data file; the
`VideoCard` will render an inline `<video>` player instead of the placeholder.
