# Bilingual i18n — Phase B Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Translate core curriculum metadata — all 37 lesson titles + concepts and all 6 track tags/titles/blurbs/comingSoon — into Uzbek, and make the sidebar, overview, lesson header, dashboard, and Home curriculum cards bilingual. Lesson BODY content (explanation, example, workedExample, guided, goDeeper, activities) stays English (Phase C).

**Architecture:** A single `src/i18n/curriculum.uz.js` maps stable lesson/track IDs → Uzbek `{ title, concept }` / `{ tag, title, blurb, comingSoon }`. A pure resolver `localizeTracks(tracks, locale)` overlays the uz map onto the English base per-field (English fallback for any missing field). A `useLocalizedTracks()` hook exposes locale-overlaid `TRACKS`, `TRACKS_WITH_OFFSETS`, and `LEVELS`. Components read the localized data instead of importing the raw curriculum. `buildDashboardModel` gains an injectable tracks source so the dashboard localizes too. No data-file changes, no schema changes, stable IDs unchanged, progress untouched.

**Tech Stack:** React 18, Vite 6, Vitest + Testing Library. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-06-01-bilingual-i18n-design.md` (§6 content model, §7 Phase B scope).

**Branch:** continue on `feat/bilingual-i18n-phase-a` (Phase A not yet merged; Phase B builds on it). Do NOT merge or push.

---

## Decisions locked (from review)
- Resolver = `useLocalizedTracks()` hook returning locale-overlaid curriculum.
- Translations live in ONE file `src/i18n/curriculum.uz.js`, keyed by stable IDs; `src/data/*` untouched.
- Scope = lesson titles + concepts + track tag/title/blurb/comingSoon. Track tag "Level N" → translated to "Daraja N". Lesson body deferred to Phase C.
- English is the per-field fallback; a missing uz field shows English (expected partial state).

## Conventions for the executing engineer
- Uzbek is Latin only; use U+2019 (’) for the `oʻ`/`gʻ` modifier, NEVER U+2018 (‘), never Cyrillic. (There are guard tests.)
- AI/ML terms follow `src/i18n/glossary.js`: features→belgilar, labels→javoblar, training data→o’quv ma’lumotlari, dataset→ma’lumotlar to’plami, classification→klassifikatsiya, prediction→bashorat, bias→noxolislik (bias), overfitting→ortiqcha moslashuv (overfitting), neural network→neyron tarmoq, model→model, data→ma’lumot. Keep technical terms (CNN, PyTorch, ResNet, CIFAR-10, GPU, RGB, LLM) as-is.
- `npx vitest run <path>` for one file; `npm test` for all. `import.meta.env.DEV` is true under vitest.
- Commit after each task with trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`. Do NOT merge or push.

## File structure
**New:**
- `src/i18n/localizeTracks.js` — pure `localizeTracks(tracks, locale, uzMap)` + helpers.
- `src/i18n/curriculum.uz.js` — `LESSONS_UZ` + `TRACKS_UZ` maps (the translations).
- `src/i18n/useLocalizedTracks.js` — the hook.
- Tests: `localizeTracks.test.js`, `curriculum.uz.test.js`, `useLocalizedTracks.test.jsx`.

**Modified:**
- `src/data/dashboardModel.js` — accept an optional localized-tracks source (default = raw, preserving existing behavior + tests).
- `src/components/Sidebar.jsx`, `Overview.jsx`, `HomePage.jsx` — read localized tracks via the hook.
- `src/components/LevelView.jsx` — resolve the displayed `level.title`/`level.concept` for the active locale.
- `src/App.jsx` — pass the localized level to LevelView and localized model source to Dashboard (or Dashboard uses the hook internally).
- Existing tests as needed (provider wrapping already in place from Phase A).

**NOT touched:** `src/data/foundations.js|levels.js|intermediate.js|vision.js` (lesson body), `useProgress`, `cloudProgressService`, Supabase, lesson IDs.

---

### Task 1: Pure `localizeTracks` resolver + `curriculum.uz.js` skeleton

**Files:**
- Create: `src/i18n/localizeTracks.js`, `src/i18n/curriculum.uz.js` (skeleton with a FEW real entries), tests.

- [ ] **Step 1: Write the failing test** `src/i18n/localizeTracks.test.js`

```js
import { describe, it, expect } from 'vitest'
import { localizeTracks } from './localizeTracks.js'

const TRACKS = [
  {
    id: 'level-0', tag: 'Level 0', title: 'Foundations', blurb: 'The on-ramp.',
    levels: [{ id: 'what-is-data', title: 'What Is Data?', concept: 'Rows and columns' }],
  },
  {
    id: 'level-3', tag: 'Level 3', title: 'Search', blurb: 'BFS.',
    comingSoon: 'More soon.',
    levels: [{ id: 'code-bfs-maze', title: 'Maze', concept: 'BFS path', kind: 'code' }],
  },
]

const UZ = {
  tracks: {
    'level-0': { tag: 'Daraja 0', title: 'Asoslar', blurb: 'Boshlanish.' },
    // level-3 intentionally absent → falls back to English
  },
  lessons: {
    'what-is-data': { title: 'Ma’lumot nima?', concept: 'Satrlar va ustunlar' },
    // code-bfs-maze absent → English fallback
  },
}

describe('localizeTracks', () => {
  it('returns English unchanged for locale en', () => {
    const out = localizeTracks(TRACKS, 'en', UZ)
    expect(out[0].title).toBe('Foundations')
    expect(out[0].levels[0].title).toBe('What Is Data?')
  })

  it('overlays uz fields when locale is uz', () => {
    const out = localizeTracks(TRACKS, 'uz', UZ)
    expect(out[0].tag).toBe('Daraja 0')
    expect(out[0].title).toBe('Asoslar')
    expect(out[0].blurb).toBe('Boshlanish.')
    expect(out[0].levels[0].title).toBe('Ma’lumot nima?')
    expect(out[0].levels[0].concept).toBe('Satrlar va ustunlar')
  })

  it('falls back to English per-field when a uz entry/field is missing', () => {
    const out = localizeTracks(TRACKS, 'uz', UZ)
    // level-3 has no uz track entry at all
    expect(out[1].title).toBe('Search')
    expect(out[1].comingSoon).toBe('More soon.')
    // code-bfs-maze has no uz lesson entry
    expect(out[1].levels[0].title).toBe('Maze')
  })

  it('preserves non-translated fields (id, kind, levels structure)', () => {
    const out = localizeTracks(TRACKS, 'uz', UZ)
    expect(out[0].id).toBe('level-0')
    expect(out[1].levels[0].id).toBe('code-bfs-maze')
    expect(out[1].levels[0].kind).toBe('code')
    expect(out[0].levels).toHaveLength(1)
  })

  it('does not mutate the input tracks', () => {
    const snapshot = JSON.stringify(TRACKS)
    localizeTracks(TRACKS, 'uz', UZ)
    expect(JSON.stringify(TRACKS)).toBe(snapshot)
  })
})
```

- [ ] **Step 2: Run → FAIL** `npx vitest run src/i18n/localizeTracks.test.js`

- [ ] **Step 3: Implement** `src/i18n/localizeTracks.js`

```js
/* Pure per-field overlay of Uzbek curriculum strings onto the English base.
   English is the fallback for any missing locale field. Never mutates input. */

const TRACK_FIELDS = ['tag', 'title', 'blurb', 'comingSoon']
const LESSON_FIELDS = ['title', 'concept']

function overlay(base, patch, fields) {
  if (!patch) return base
  let out = base
  for (const f of fields) {
    if (typeof patch[f] === 'string' && patch[f].length > 0) {
      if (out === base) out = { ...base }
      out[f] = patch[f]
    }
  }
  return out
}

/**
 * @param {Array} tracks  the English TRACKS array
 * @param {'en'|'uz'} locale
 * @param {{tracks: object, lessons: object}} uzMap  keyed by stable id
 * @returns {Array} new tracks array with uz overlaid (en untouched)
 */
export function localizeTracks(tracks, locale, uzMap) {
  if (locale !== 'uz' || !uzMap) return tracks
  const trackPatches = uzMap.tracks ?? {}
  const lessonPatches = uzMap.lessons ?? {}
  return tracks.map((track) => {
    const localizedLevels = track.levels.map((level) =>
      overlay(level, lessonPatches[level.id], LESSON_FIELDS),
    )
    const t = overlay(track, trackPatches[track.id], TRACK_FIELDS)
    const changedLevels = localizedLevels.some((l, i) => l !== track.levels[i])
    if (t === track && !changedLevels) return track
    return { ...t, levels: localizedLevels }
  })
}
```

- [ ] **Step 4: Create the translations skeleton** `src/i18n/curriculum.uz.js` with REAL entries for level-0 + its lesson only (the rest filled in Task 2). This keeps Task 1 self-contained and green:

```js
/* Uzbek (Latin) translations for curriculum METADATA only — lesson/track titles,
   lesson concepts, track blurbs + comingSoon. Keyed by STABLE ids. Lesson BODY
   content (explanation/example/workedExample/guided/goDeeper/activities) is NOT
   here — that is Phase C. English is the fallback for anything missing. */

export const TRACKS_UZ = {
  'level-0': {
    tag: 'Daraja 0',
    title: 'Asoslar',
    blurb: 'Kirish nuqtasi: ma’lumot nima va nega yaxshi misollar har qanday modeldan oldin keladi. Avval tushuncha, kod talab qilinmaydi.',
  },
}

export const LESSONS_UZ = {
  'what-is-data': {
    title: 'Ma’lumot nima?',
    concept: 'Satrlar, ustunlar va nega modellarga misollar kerak',
  },
}

/** Combined map shape consumed by localizeTracks(tracks, locale, CURRICULUM_UZ). */
export const CURRICULUM_UZ = { tracks: TRACKS_UZ, lessons: LESSONS_UZ }
```

- [ ] **Step 5: Run → PASS** `npx vitest run src/i18n/localizeTracks.test.js`

- [ ] **Step 6: Commit**

```bash
git add src/i18n/localizeTracks.js src/i18n/localizeTracks.test.js src/i18n/curriculum.uz.js
git commit -m "feat(i18n): pure localizeTracks resolver + curriculum.uz skeleton"
```

---

### Task 2: Full Uzbek translations for all 37 lessons + 6 tracks

**Files:** Modify `src/i18n/curriculum.uz.js` (fill in every entry). Create `src/i18n/curriculum.uz.test.js`.

The translator drafts natural Latin Uzbek using the glossary. Below is the COMPLETE English source to translate; produce a uz `{title, concept}` for EVERY lesson id and `{tag, title, blurb[, comingSoon]}` for EVERY track id. Keep technical tokens (CNN, PyTorch, ResNet, LeNet, CIFAR-10, GPU, RGB, BGR, LLM, Colab, Kaggle, Dijkstra, A*, C×H×W) intact.

**Tracks (translate tag/title/blurb, + comingSoon for level-3):**
- level-0 — tag "Level 0", title "Foundations", blurb "The on-ramp: what data is and why good examples come before any model. Concept-first, no code required."
- level-1 — "Level 1", "Fundamentals of AI", "What artificial intelligence is, how it is built, and how to use it responsibly — the conceptual map the rest of the curriculum hangs on."
- level-2 — "Level 2", "Introduction to Machine Learning", "How machines learn patterns from data: training data, features and labels, classification, prediction, bias, overfitting — then your first real models in Python."
- level-3 — "Level 3", "Problem Solving & Search", "How an agent reaches a goal in code: breadth-first search finds the shortest path through a maze — the skeleton that smarter algorithms (Dijkstra, A*) build on." comingSoon: "More Level 3 (neural networks) lessons are in development."
- level-4 — "Level 4", "Computer Vision", "Deep learning pointed at images — and you can see what the model learns. Inspect pixels and convolution, build CNNs, use transfer learning, then run a \"break-it\" study on how vision models fail. Heavy training runs in free GPU notebooks (Colab/Kaggle)."
- level-5 — "Level 5", "LLMs in Practice — Evaluation & Responsible AI", "Train like a real AI model evaluator: score outputs, rank answers, catch hallucinations, and improve weak responses against a rubric."

**Lessons (id | title | concept):**
- what-is-data | What Is Data? | Rows, columns, and why models need examples
- what-ai | What Is AI? | Machines that do smart tasks
- ai-ethics | Real-World AI Ethics | Using AI responsibly
- what-ml | What Is Machine Learning? | Learning patterns from examples
- training-data | Training Data | The examples a model learns from
- features-labels | Features & Labels | Inputs (clues) and outputs (answers)
- classification | Classification | Sorting items into groups
- prediction | Prediction | Estimating an answer for new input
- bias | Bias In Data | When data is not representative
- overfitting | Overfitting | Memorizing instead of generalizing
- neural-networks | Neural Networks | Layers of connected units
- code-first-classifier | Train Your First Classifier | Fit a model and measure its accuracy — in real Python
- code-metrics-overfitting | Spot Overfitting With Metrics | Compare train vs test accuracy to catch a model that memorized
- code-bfs-maze | Solve a Maze With Search | Find the shortest path with breadth-first search — pure Python
- cv-pixels | Images Are Just Grids of Numbers | Pixels, channels, and the C×H×W shape (plus the RGB-vs-BGR pitfall)
- cv-conv-by-hand | Convolution by Hand: Sliding a Filter | Kernels and the sliding dot product (edge / blur / sharpen)
- cv-why-fc-fails | Why Plain Networks Choke on Images | Parameter explosion, no spatial structure, no translation invariance
- cv-conv-layer | The Convolution Layer | Learnable kernels slide across the image to make feature maps
- cv-pooling | Pooling & Stride | Shrink feature maps on purpose — keep the signal, drop the resolution
- cv-build-cnn | Build a CNN in PyTorch (CIFAR-10) | Train a small convolutional network on real images, on a free GPU
- cv-feature-maps | Visualizing What Filters Learn | Early layers see edges and colors; deep layers see parts and objects
- cv-architectures | Classic CNN Architectures | LeNet to ResNet — and why deeper isn't always better
- cv-residual | Residual (Skip) Connections | Why a tiny shortcut made very deep networks trainable
- cv-transfer | Transfer Learning & Fine-Tuning | Reuse a pretrained backbone — freeze it or fine-tune it carefully
- cv-augmentation | Data Augmentation | Stretch your dataset with transforms — but never change the label
- cv-detect-segment | Detection & Segmentation Overview | Classification vs detection vs segmentation — different questions, different outputs
- cv-failures | When Vision Models Fail | Distribution shift, spurious features, and occlusion
- cv-adversarial | Adversarial Examples: Tiny Changes, Big Lies | Imperceptible perturbations can flip a confident prediction
- cv-project | Project P4: Image Classifier + Break-It Study | Train a real classifier on free GPU, then break it on purpose
- eval-intro | What Is AI Model Evaluation? | Why AI output needs human review
- eval-rubrics | Evaluation Rubrics | Scoring with clear criteria
- eval-rating | Rating AI Responses | Scoring answers from 1 to 5
- eval-ranking | Ranking Two AI Answers | Choosing the better response
- eval-hallucination | Hallucination Detection | Spotting confident but false claims
- eval-hhh | Helpful, Honest & Harmless | Balancing usefulness, truth & safety
- eval-rewrite | Rewrite to 5/5 | Turning a weak answer into a strong one
- eval-capstone | Capstone: Become an AI Model Evaluator | A full evaluation packet

- [ ] **Step 1: Fill in `src/i18n/curriculum.uz.js`** — every track (6) in `TRACKS_UZ` and every lesson (37) in `LESSONS_UZ`. Use the glossary; Latin only; U+2019.

- [ ] **Step 2: Write `src/i18n/curriculum.uz.test.js`** — coverage + quality guards:

```js
import { describe, it, expect } from 'vitest'
import { TRACKS, LEVELS } from '../data/tracks.js'
import { TRACKS_UZ, LESSONS_UZ } from './curriculum.uz.js'

const CYRILLIC = /[Ѐ-ӿ]/

describe('curriculum.uz — coverage', () => {
  it('translates every track (tag, title, blurb)', () => {
    for (const tr of TRACKS) {
      const u = TRACKS_UZ[tr.id]
      expect(u, `track ${tr.id}`).toBeTruthy()
      expect(u.tag, `${tr.id}.tag`).toBeTruthy()
      expect(u.title, `${tr.id}.title`).toBeTruthy()
      expect(u.blurb, `${tr.id}.blurb`).toBeTruthy()
      if (tr.comingSoon) expect(u.comingSoon, `${tr.id}.comingSoon`).toBeTruthy()
    }
  })

  it('translates every lesson (title + concept)', () => {
    for (const l of LEVELS) {
      const u = LESSONS_UZ[l.id]
      expect(u, `lesson ${l.id}`).toBeTruthy()
      expect(u.title, `${l.id}.title`).toBeTruthy()
      if (l.concept) expect(u.concept, `${l.id}.concept`).toBeTruthy()
    }
  })

  it('has no extra ids that do not exist in the curriculum (stable-id check)', () => {
    const trackIds = new Set(TRACKS.map((t) => t.id))
    const lessonIds = new Set(LEVELS.map((l) => l.id))
    for (const id of Object.keys(TRACKS_UZ)) expect(trackIds.has(id), `unknown track ${id}`).toBe(true)
    for (const id of Object.keys(LESSONS_UZ)) expect(lessonIds.has(id), `unknown lesson ${id}`).toBe(true)
  })
})

describe('curriculum.uz — quality', () => {
  it('is Latin-only (no Cyrillic) and never uses U+2018', () => {
    const all = [...Object.values(TRACKS_UZ), ...Object.values(LESSONS_UZ)]
      .flatMap((o) => Object.values(o))
    for (const s of all) {
      expect(CYRILLIC.test(s), `Cyrillic in "${s}"`).toBe(false)
      expect(s.includes('‘'), `U+2018 in "${s}"`).toBe(false)
    }
  })
})
```

- [ ] **Step 3: Run → PASS** `npx vitest run src/i18n/curriculum.uz.test.js` (this is the "no missing translation for Phase B scope" gate — every track + lesson must be present).

- [ ] **Step 4: Commit**

```bash
git add src/i18n/curriculum.uz.js src/i18n/curriculum.uz.test.js
git commit -m "feat(i18n): full Uzbek translations for 37 lesson titles/concepts + 6 tracks"
```

---

### Task 3: `useLocalizedTracks()` hook

**Files:** Create `src/i18n/useLocalizedTracks.js` + `src/i18n/useLocalizedTracks.test.jsx`.

- [ ] **Step 1: Write the failing test** `src/i18n/useLocalizedTracks.test.jsx`

```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from './LanguageProvider.jsx'
import { useLocalizedTracks } from './useLocalizedTracks.js'

beforeEach(() => localStorage.clear())

const wrap = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

describe('useLocalizedTracks', () => {
  it('returns English curriculum under en', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en')
    const { result } = renderHook(() => useLocalizedTracks(), { wrapper: wrap })
    const l0 = result.current.tracks.find((t) => t.id === 'level-0')
    expect(l0.title).toBe('Foundations')
    expect(result.current.levels.find((l) => l.id === 'what-is-data').title).toBe('What Is Data?')
  })

  it('returns Uzbek curriculum under uz', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'uz')
    const { result } = renderHook(() => useLocalizedTracks(), { wrapper: wrap })
    const l0 = result.current.tracks.find((t) => t.id === 'level-0')
    expect(l0.title).toBe('Asoslar')
    expect(result.current.levels.find((l) => l.id === 'what-is-data').title).toBe('Ma’lumot nima?')
  })

  it('exposes tracks, tracksWithOffsets (with index), and flat levels', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'uz')
    const { result } = renderHook(() => useLocalizedTracks(), { wrapper: wrap })
    expect(result.current.tracks.length).toBe(6)
    expect(result.current.levels.length).toBe(37)
    const two = result.current.tracksWithOffsets.find((t) => t.id === 'level-2')
    expect(two.levels[0]).toHaveProperty('index')
    // offsets preserved: first lesson of level-1 is global index 1
    const one = result.current.tracksWithOffsets.find((t) => t.id === 'level-1')
    expect(one.levels[0].index).toBe(1)
  })
})
```

- [ ] **Step 2: Run → FAIL**

- [ ] **Step 3: Implement** `src/i18n/useLocalizedTracks.js`

```js
import { useMemo } from 'react'
import { TRACKS } from '../data/tracks.js'
import { useLanguage } from './useLanguage.js'
import { localizeTracks } from './localizeTracks.js'
import { CURRICULUM_UZ } from './curriculum.uz.js'

const BY_LOCALE = { uz: CURRICULUM_UZ }

/**
 * Curriculum localized to the active locale. Returns:
 *   { tracks, tracksWithOffsets, levels }
 * tracks: localized TRACKS; levels: flat play order; tracksWithOffsets: each
 * level annotated with its global flat index (for unlock/nav), like the raw
 * TRACKS_WITH_OFFSETS export.
 */
export function useLocalizedTracks() {
  const { locale } = useLanguage()
  return useMemo(() => {
    const tracks = localizeTracks(TRACKS, locale, BY_LOCALE[locale])
    const levels = tracks.flatMap((t) => t.levels)
    let offset = 0
    const tracksWithOffsets = tracks.map((track) => {
      const lv = track.levels.map((level, i) => ({ level, index: offset + i }))
      offset += track.levels.length
      return { ...track, levels: lv }
    })
    return { tracks, tracksWithOffsets, levels }
  }, [locale])
}
```

- [ ] **Step 4: Run → PASS**

- [ ] **Step 5: Commit**

```bash
git add src/i18n/useLocalizedTracks.js src/i18n/useLocalizedTracks.test.jsx
git commit -m "feat(i18n): useLocalizedTracks hook (locale-overlaid curriculum)"
```

---

### Task 4: Wire components to the localized curriculum

**Files:** Modify `src/components/Sidebar.jsx`, `Overview.jsx`, `HomePage.jsx`, `LevelView.jsx`, `src/data/dashboardModel.js`, `src/App.jsx`.

The principle: components that currently import `TRACKS_WITH_OFFSETS`/`TRACKS`/`LEVELS` for DISPLAY should instead read from `useLocalizedTracks()`. Unlock logic and indexing stay on the raw `LEVELS` (IDs are locale-independent), so DO NOT change `useProgress` or the `currentIndex` computation in App (those operate on IDs/indices, not titles).

- [ ] **Step 1: dashboardModel.js — make the tracks source injectable**

Change the signature so the dashboard can pass localized tracks while existing callers/tests keep working:

```js
// at top, keep the existing imports; add a default param
export function buildDashboardModel(progress, tracksWithOffsets = TRACKS_WITH_OFFSETS) {
  // ...everything that referenced TRACKS_WITH_OFFSETS now references the param...
}
```
Find each use of `TRACKS_WITH_OFFSETS` inside the function body and replace with the `tracksWithOffsets` param. `LEVELS`/`MAX_STARS` stay as imports (length + max are locale-independent). Existing `dashboardModel.test.js` calls `buildDashboardModel(mockProgress(...))` with one arg → default keeps them green.

Run: `npx vitest run src/data/dashboardModel.test.js` → must still PASS unchanged.

- [ ] **Step 2: Dashboard.jsx — feed localized tracks into the model**

Dashboard currently calls `buildDashboardModel(progress)`. Add the hook and pass the localized offsets:
```jsx
import { useLocalizedTracks } from '../i18n/useLocalizedTracks.js'
// inside the component:
const { tracksWithOffsets } = useLocalizedTracks()
const model = buildDashboardModel(progress, tracksWithOffsets)
```
(Find the existing `buildDashboardModel(progress)` call and add the second arg. The model's `levelTag`/`title` now come out localized.)

Run: `npx vitest run src/components/Dashboard.test.jsx` → still PASS (tests force `en`, so titles remain English).

- [ ] **Step 3: Sidebar.jsx — read localized tracks**

Replace `import { TRACKS_WITH_OFFSETS, LEVELS } from '../data/tracks.js'` usage for DISPLAY with the hook:
```jsx
import { useLocalizedTracks } from '../i18n/useLocalizedTracks.js'
// inside component (t already present from Phase A):
const { tracksWithOffsets, levels } = useLocalizedTracks()
```
Then use `tracksWithOffsets` where `TRACKS_WITH_OFFSETS` was iterated, and `levels.length` where `LEVELS.length` was used for the progress count denominator. Keep `progress.isUnlocked(index)` etc. exactly as-is (index-based). The lesson `level.title`/`level.concept` and `track.tag`/`track.title` now render localized. If `LEVELS` is still imported only for `.length`, you may keep the import or switch to `levels.length` — prefer `levels.length` for consistency and drop the now-unused import to avoid a lint warning.

Run: `npm run build` → succeeds.

- [ ] **Step 4: Overview.jsx — read localized tracks**

Same pattern: add `const { tracksWithOffsets, levels } = useLocalizedTracks()`, iterate `tracksWithOffsets`, use `levels.length` for `total`. `track.tag/title/blurb/comingSoon` and `level.title/concept` render localized. Keep all index/unlock logic unchanged.

Run: `npm run build` → succeeds.

- [ ] **Step 5: HomePage.jsx — localized curriculum path cards**

HomePage imports `{ TRACKS, LEVELS }` for the curriculum path section. Add `const { tracks, levels } = useLocalizedTracks()` and use `tracks`/`levels` for the path cards' `track.tag/title/blurb` and any lesson counts. (Marketing prose stays as Phase-A chrome via `t()`.) Keep `LEVELS.length`→`levels.length` for the "37 lessons" count if it's derived; if "37" is hardcoded copy, leave it.

Run: `npm run build` → succeeds.

- [ ] **Step 6: LevelView.jsx + App.jsx — localize the open lesson header**

LevelView renders `level.title` and `level.concept` from the `level` prop. App passes `LEVELS[levelIndex]` (raw English). Two clean options — use (a):
(a) In `App.jsx`, localize the level passed to LevelView:
```jsx
import { useLocalizedTracks } from './i18n/useLocalizedTracks.js'
// inside App:
const { levels: localizedLevels } = useLocalizedTracks()
// where LevelView is rendered:
<LevelView level={localizedLevels[levelIndex]} levelIndex={levelIndex} totalLevels={localizedLevels.length} ... />
```
Keep `LEVELS` (raw) for `currentIndex` and unlock math elsewhere in App — only the DISPLAYED level passed to LevelView becomes localized. `localizedLevels` is index-aligned with `LEVELS` (same order), so `levelIndex` still maps correctly.
LevelView itself needs NO change for title/concept (it reads the prop), but it imports `TRACKS` for the color index (`LEVEL_COLOR_INDEX`) — that uses `track.tag`/`level.id`; since color is keyed by id and tag's digit, and uz tag is "Daraja N" (still contains the digit N), the `parseInt(...replace(/\D/g,''))` still extracts N. VERIFY this: if the color index relies on the tag digit, "Daraja 3" → 3 still works. If it breaks, switch `LEVEL_COLOR_INDEX` to read from the raw `TRACKS` import (color is presentational, locale-independent) — raw TRACKS is fine here. Prefer keeping `LEVEL_COLOR_INDEX` on raw `TRACKS` so color never depends on translation.

Run: `npm run build` → succeeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/Sidebar.jsx src/components/Overview.jsx src/components/HomePage.jsx src/components/LevelView.jsx src/data/dashboardModel.js src/App.jsx
git commit -m "feat(i18n): render localized curriculum (titles/concepts/tracks) across sidebar, overview, home, lesson, dashboard"
```

---

### Task 5: Tests + verification gate

- [ ] **Step 1: Run the full suite** `npm test`

Expected: all green. If any pre-existing test now fails because a component calls `useLocalizedTracks()` (which needs the provider) without a `<LanguageProvider>` wrapper, wrap it (Phase A already wrapped Dashboard; Sidebar/Overview/HomePage/App tests may need it IF they exist and render those components). Fix ONLY test files; the source/curriculum is the source of truth. Tests that assert English titles still pass because they force/ default to `en`.

- [ ] **Step 2: Add a localized-render integration test** `src/i18n/curriculumRender.integration.test.jsx`

```jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from './LanguageProvider.jsx'
import Overview from '../components/Overview.jsx'
import { LEVELS } from '../data/tracks.js'

beforeEach(() => localStorage.clear())

const progress = {
  completed: {},
  completedCount: 0,
  isUnlocked: (i) => i === 0,
  starsFor: () => 0,
}

function renderOverview() {
  return render(
    <LanguageProvider>
      <Overview progress={progress} currentIndex={0} onOpenLevel={() => {}} />
    </LanguageProvider>,
  )
}

describe('curriculum localized render', () => {
  it('shows English track + lesson titles under en', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en')
    renderOverview()
    expect(screen.getByText('Foundations')).toBeInTheDocument()
    expect(screen.getByText('What Is Data?')).toBeInTheDocument()
  })

  it('shows Uzbek track + lesson titles under uz, with stable lesson ids unchanged', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'uz')
    renderOverview()
    expect(screen.getByText('Asoslar')).toBeInTheDocument()
    expect(screen.getByText('Ma’lumot nima?')).toBeInTheDocument()
    // ID stability: progress keys are ids, never translated
    expect(LEVELS[0].id).toBe('what-is-data')
  })
})
```

Run: `npx vitest run src/i18n/curriculumRender.integration.test.jsx` → PASS. (If `getByText('Foundations')` collides with another occurrence, use `getAllByText(...).length` ≥ 1.)

- [ ] **Step 3: Full gate**

```bash
npm run security   # clean
npm test           # all pass
npm run build      # succeeds
```

- [ ] **Step 4: Browser smoke (Chrome DevTools, npm run dev)**
1. Clear localStorage, reload → first-visit modal → pick O‘zbekcha.
2. Home curriculum cards show Uzbek track titles/blurbs (e.g. "Asoslar"); the "37 lessons" works.
3. Open the course → Sidebar shows Uzbek track names ("Daraja 0" … ) + Uzbek lesson titles + concepts; Overview likewise.
4. Open a lesson → header shows the Uzbek title + concept; lesson BODY (concept paragraph, worked example, activity) is still English (expected, Phase C).
5. Switch to English via the switcher → titles flip to English live, same lesson stays open, progress intact.
6. Console clean (no missing-key warns for curriculum — there is no t() for titles; they come from the resolver).

- [ ] **Step 5: Commit any test fixes**

```bash
git add -A
git commit -m "test(i18n): localized curriculum render + provider wrapping for Phase B"
```

- [ ] **Step 6: STOP and report.** Files changed, tests, smoke summary, caveats (lesson body still English = expected). Do NOT merge. Do NOT push.

---

## Rollback / risk notes
- All Phase B work is additive commits on the same branch; `git revert <sha>` undoes any single task. The resolver is pure and falls back to English per-field, so a missing/mistyped uz entry degrades to English (never a crash, never a raw id).
- `localizeTracks` never mutates input and returns the SAME array when locale=en (zero overhead, zero behavior change in English).
- `buildDashboardModel`'s new param defaults to the raw tracks → existing tests + any other caller unaffected.
- Unlock/index logic untouched (operates on raw LEVELS by id) → progress and lesson ordering identical in both locales; completing a lesson in uz == en (same id).
- Color index kept on raw TRACKS → theming never depends on translation.

## Self-review (plan author)
- Scope: titles + concepts + track tag/title/blurb/comingSoon (Task 2 lists all 37 + 6). Body deferred. ✓
- Resolver hook + single uz map + English fallback (Tasks 1,3). ✓
- All display consumers wired (Sidebar, Overview, HomePage, LevelView via App, Dashboard via model) (Task 4). ✓
- Tests: resolver purity/fallback, coverage (no missing), Latin-only/U+2019, hook locale switch, localized render, ID stability (Tasks 1–5). ✓
- No data-file/schema/ID/progress changes; names consistent (localizeTracks, CURRICULUM_UZ, useLocalizedTracks, tracksWithOffsets). ✓
