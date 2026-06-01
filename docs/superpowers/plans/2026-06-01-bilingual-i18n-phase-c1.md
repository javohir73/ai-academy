# Bilingual i18n — Phase C1 (L0 + L1 lesson body) Implementation Plan

> Execute task-by-task. Per user instruction: the verification gate is `npm test` + `npm run build` ONLY — NO security scan, NO browser smoke for Phase C work.

**Goal:** Translate the FULL lesson-body content of Level 0 + Level 1 (3 lessons: `what-is-data`, `what-ai`, `ai-ethics`) into natural Latin Uzbek — explanations, examples, worked examples, guided practice, goDeeper, video captions, activity prompts/feedback, and in-activity card text (sort tokens, ethics scenarios, pick-dataset options) — with English fallback. L2–L5 bodies stay English (later C-phases).

**Architecture:** Extend the existing Phase-B curriculum resolver. A new pure `localizeLesson(level, patch)` deep-overlays body fields (strings, arrays-by-index, and activity `data` keyed by id) onto the English lesson; `localizeTracks` calls it instead of the shallow title/concept overlay. Body translations live in the SAME `src/i18n/curriculum.uz.js` `LESSONS_UZ` map (each entry gains nested body fields). Because `useLocalizedTracks` → App → LevelView already pass the localized level, **no component wiring is needed** — extending the resolver + adding translations is the whole change. Stable IDs, structure, unlock logic untouched.

**Tech Stack:** React 18, Vite 6, Vitest. No new deps.

**Branch:** continue on `feat/bilingual-i18n-phase-a`. Do NOT merge/push.

## Conventions
- Latin Uzbek only; U+2019 (’) for o’/g’ + apostrophes; NEVER U+2018; no Cyrillic.
- Glossary (src/i18n/glossary.js): features→belgilar, labels→javoblar, training data→o’quv ma’lumotlari, dataset→ma’lumotlar to’plami, data→ma’lumot, model→model, prediction→bashorat, classification→klassifikatsiya, bias→noxolislik (bias), overfitting→ortiqcha moslashuv (overfitting), neural network→neyron tarmoq. Keep AI as "AI" (or "sun’iy intellekt" where natural in prose). Keep technical tokens as-is.
- Commit per task; trailer `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- GATE = `npm test` + `npm run build` only.

## The translatable body shape (per lesson)
- `explanation` (string), `example.text` (string)
- `workedExample.{ intro, steps[], takeaway }`
- `guided.{ prompt, hints[], answer, explanation }`
- `goDeeper.{ title, body }`
- `video.{ title, description }`  (duration is not translated)
- `activity.{ prompt, feedback.{correct, incorrect} }`
- activity `data` (translate USER-FACING text only, keyed by the item's stable `id`; never translate ids/buckets logic):
  - pick-dataset (`what-is-data`): `options[id].{ title, sample, why }`
  - sort (`what-ai`): `buckets[id].label`, `tokens[id].label`
  - ethics (`ai-ethics`): `scenarios[id].situation`, `scenarios[id].options[id].{ text, why }`

---

### Task 1: Deep `localizeLesson` resolver + tests

**Files:** Create `src/i18n/localizeLesson.js`, `src/i18n/localizeLesson.test.js`. Modify `src/i18n/localizeTracks.js` to use it.

The resolver overlays a uz `patch` onto an English `level`:
- top-level string fields: `title, concept, explanation`
- nested string-bag objects (overlay listed string fields, keep others): `example{text}`, `workedExample{intro,takeaway}`, `guided{prompt,answer,explanation}`, `goDeeper{title,body}`, `video{title,description}`, `activity{prompt}`
- string ARRAYS by index (uz array overlays element-wise; missing/blank index → English): `workedExample.steps`, `guided.hints`
- `activity.feedback{correct,incorrect}`
- `activity.data` — overlay USER-FACING strings by id (see shapes above). The patch supplies `data` as id-keyed maps; unknown ids ignored; missing → English.
- Anything absent in patch → English (per-field). Never mutate input. Locale guard handled by caller.

- [ ] **Step 1: failing test** `src/i18n/localizeLesson.test.js`

```js
import { describe, it, expect } from 'vitest'
import { localizeLesson } from './localizeLesson.js'

const EN = {
  id: 'what-ai', title: 'What Is AI?', concept: 'Machines that do smart tasks',
  explanation: 'AI is when a computer does smart things.',
  example: { text: 'Face unlock is AI.' },
  workedExample: { intro: 'Watch me decide.', steps: ['Face unlock learned.', 'Calculator did not.'], takeaway: 'Did it LEARN?' },
  guided: { prompt: 'Is autocomplete AI?', hints: ['Use the test.', 'It learned from text.'], answer: 'It is AI.', explanation: 'It learns patterns.' },
  goDeeper: { title: 'Where does ML fit?', body: 'AI is the umbrella.' },
  video: { title: 'What counts as AI?', description: 'A tour.', duration: '2:30' },
  activity: {
    type: 'sort', prompt: 'Drag each card.',
    data: {
      buckets: [{ id: 'ai', label: 'AI' }, { id: 'not', label: 'Not AI' }],
      tokens: [{ id: 't1', label: 'Face unlock', bucket: 'ai' }, { id: 't3', label: 'Calculator', bucket: 'not' }],
    },
    feedback: { correct: 'Exactly.', incorrect: 'Not quite.' },
  },
}

const PATCH = {
  title: 'Sun’iy intellekt nima?', concept: 'Aqlli vazifalar',
  explanation: 'AI — bu kompyuter aqlli ishlarni qilishi.',
  example: { text: 'Yuz bilan ochish — bu AI.' },
  workedExample: { intro: 'Qarang.', steps: ['Yuz bilan ochish o’rgandi.', 'Kalkulyator o’rganmadi.'], takeaway: 'U O’RGANDIMI?' },
  guided: { prompt: 'Avtomatik to’ldirish AImi?', hints: ['Testdan foydalaning.', 'U matndan o’rgandi.'], answer: 'Bu AI.', explanation: 'U qonuniyatlarni o’rganadi.' },
  goDeeper: { title: 'ML qayerda?', body: 'AI — bu katta soyabon.' },
  video: { title: 'Nima AI hisoblanadi?', description: 'Sayohat.' },
  activity: {
    prompt: 'Har bir kartani torting.',
    data: {
      buckets: { ai: 'AI', not: 'AI emas' },
      tokens: { t1: 'Yuz bilan ochish', t3: 'Kalkulyator' },
    },
    feedback: { correct: 'Aynan.', incorrect: 'Unchalik emas.' },
  },
}

describe('localizeLesson', () => {
  it('overlays top-level + nested string fields', () => {
    const out = localizeLesson(EN, PATCH)
    expect(out.explanation).toBe('AI — bu kompyuter aqlli ishlarni qilishi.')
    expect(out.example.text).toBe('Yuz bilan ochish — bu AI.')
    expect(out.workedExample.intro).toBe('Qarang.')
    expect(out.workedExample.takeaway).toBe('U O’RGANDIMI?')
    expect(out.guided.answer).toBe('Bu AI.')
    expect(out.goDeeper.body).toBe('AI — bu katta soyabon.')
    expect(out.video.title).toBe('Nima AI hisoblanadi?')
  })

  it('overlays string arrays element-wise (steps, hints)', () => {
    const out = localizeLesson(EN, PATCH)
    expect(out.workedExample.steps).toEqual(['Yuz bilan ochish o’rgandi.', 'Kalkulyator o’rganmadi.'])
    expect(out.guided.hints[0]).toBe('Testdan foydalaning.')
  })

  it('overlays activity prompt, feedback, and data by id', () => {
    const out = localizeLesson(EN, PATCH)
    expect(out.activity.prompt).toBe('Har bir kartani torting.')
    expect(out.activity.feedback.correct).toBe('Aynan.')
    // bucket + token labels overlaid by id; structure/bucket logic preserved
    expect(out.activity.data.buckets.find((b) => b.id === 'ai').label).toBe('AI')
    expect(out.activity.data.buckets.find((b) => b.id === 'not').label).toBe('AI emas')
    const t1 = out.activity.data.tokens.find((t) => t.id === 't1')
    expect(t1.label).toBe('Yuz bilan ochish')
    expect(t1.bucket).toBe('ai') // logic field untouched
  })

  it('preserves non-translated fields (id, type, duration, bucket)', () => {
    const out = localizeLesson(EN, PATCH)
    expect(out.id).toBe('what-ai')
    expect(out.activity.type).toBe('sort')
    expect(out.video.duration).toBe('2:30')
  })

  it('falls back to English per-field when patch is partial', () => {
    const out = localizeLesson(EN, { explanation: 'Faqat shu.' })
    expect(out.explanation).toBe('Faqat shu.')
    expect(out.title).toBe('What Is AI?')          // not in patch → English
    expect(out.workedExample.intro).toBe('Watch me decide.')
    expect(out.activity.data.tokens[0].label).toBe('Face unlock')
  })

  it('returns the base unchanged and does not mutate when patch is null', () => {
    const snapshot = JSON.stringify(EN)
    const out = localizeLesson(EN, null)
    expect(out).toBe(EN)
    expect(JSON.stringify(EN)).toBe(snapshot)
  })
})
```

- [ ] **Step 2: run → FAIL** `npx vitest run src/i18n/localizeLesson.test.js`

- [ ] **Step 3: implement** `src/i18n/localizeLesson.js`

```js
/* Deep per-field overlay of a Uzbek lesson-body patch onto the English lesson.
   English is the fallback for every missing field. Never mutates input.
   Activity `data` user-facing text is overlaid by the item's stable id; all
   logic fields (id, bucket, type, correctId, best, duration, isCorrect) are
   preserved untouched. */

const str = (v) => typeof v === 'string' && v.length > 0

// Overlay listed string fields of `patch` onto a shallow clone of `base`.
function overlayStrings(base, patch, fields) {
  if (!base || !patch) return base
  let out = base
  for (const f of fields) {
    if (str(patch[f]) && patch[f] !== base[f]) {
      if (out === base) out = { ...base }
      out[f] = patch[f]
    }
  }
  return out
}

// Overlay a string array element-wise; uz[i] wins when a non-empty string.
function overlayArray(baseArr, patchArr) {
  if (!Array.isArray(baseArr) || !Array.isArray(patchArr)) return baseArr
  let changed = false
  const out = baseArr.map((el, i) => {
    if (str(patchArr[i]) && patchArr[i] !== el) {
      changed = true
      return patchArr[i]
    }
    return el
  })
  return changed ? out : baseArr
}

// Overlay an id-keyed map of label strings onto an array of { id, ... } items.
function overlayByIdLabel(items, patchMap, labelField) {
  if (!Array.isArray(items) || !patchMap) return items
  let changed = false
  const out = items.map((it) => {
    const v = patchMap[it.id]
    if (str(v) && v !== it[labelField]) {
      changed = true
      return { ...it, [labelField]: v }
    }
    return it
  })
  return changed ? out : items
}

function localizeActivityData(data, patch) {
  if (!data || !patch) return data
  let out = data
  const set = (key, val) => {
    if (val !== data[key]) {
      if (out === data) out = { ...data }
      out[key] = val
    }
  }
  // sort: buckets + tokens (label by id)
  if (data.buckets && patch.buckets) set('buckets', overlayByIdLabel(data.buckets, patch.buckets, 'label'))
  if (data.tokens && patch.tokens) set('tokens', overlayByIdLabel(data.tokens, patch.tokens, 'label'))
  // pick-dataset: options[id].{title,sample,why}
  if (data.options && patch.options) {
    const opts = data.options.map((o) => overlayStrings(o, patch.options[o.id], ['title', 'sample', 'why', 'label', 'text']))
    if (opts.some((o, i) => o !== data.options[i])) set('options', opts)
  }
  // ethics: scenarios[id].{situation, options[id].{text,why}}
  if (data.scenarios && patch.scenarios) {
    const scn = data.scenarios.map((s) => {
      const sp = patch.scenarios[s.id]
      if (!sp) return s
      let so = overlayStrings(s, sp, ['situation'])
      if (s.options && sp.options) {
        const o2 = s.options.map((o) => overlayStrings(o, sp.options[o.id], ['text', 'why']))
        if (o2.some((o, i) => o !== s.options[i])) {
          if (so === s) so = { ...s }
          so.options = o2
        }
      }
      return so
    })
    if (scn.some((s, i) => s !== data.scenarios[i])) set('scenarios', scn)
  }
  return out
}

function localizeActivity(activity, patch) {
  if (!activity || !patch) return activity
  let out = overlayStrings(activity, patch, ['prompt'])
  if (activity.feedback && patch.feedback) {
    const fb = overlayStrings(activity.feedback, patch.feedback, ['correct', 'incorrect'])
    if (fb !== activity.feedback) { if (out === activity) out = { ...activity }; out.feedback = fb }
  }
  if (activity.data && patch.data) {
    const d = localizeActivityData(activity.data, patch.data)
    if (d !== activity.data) { if (out === activity) out = { ...activity }; out.data = d }
  }
  return out
}

// nested string-bag fields and their translatable keys
const BAGS = {
  example: ['text'],
  goDeeper: ['title', 'body'],
  video: ['title', 'description'],
}

/**
 * @param {object} level  English lesson object
 * @param {object|null} patch  uz overlay (title/concept/body fields), or null
 * @returns {object} new lesson with uz overlaid, English fallback per field
 */
export function localizeLesson(level, patch) {
  if (!level || !patch) return level
  let out = overlayStrings(level, patch, ['title', 'concept', 'explanation'])
  const clone = () => { if (out === level) out = { ...level } }

  for (const [key, fields] of Object.entries(BAGS)) {
    if (level[key] && patch[key]) {
      const merged = overlayStrings(level[key], patch[key], fields)
      if (merged !== level[key]) { clone(); out[key] = merged }
    }
  }

  if (level.workedExample && patch.workedExample) {
    let we = overlayStrings(level.workedExample, patch.workedExample, ['intro', 'takeaway'])
    const steps = overlayArray(level.workedExample.steps, patch.workedExample.steps)
    if (steps !== level.workedExample.steps) { if (we === level.workedExample) we = { ...level.workedExample }; we.steps = steps }
    if (we !== level.workedExample) { clone(); out.workedExample = we }
  }

  if (level.guided && patch.guided) {
    let g = overlayStrings(level.guided, patch.guided, ['prompt', 'answer', 'explanation'])
    const hints = overlayArray(level.guided.hints, patch.guided.hints)
    if (hints !== level.guided.hints) { if (g === level.guided) g = { ...level.guided }; g.hints = hints }
    if (g !== level.guided) { clone(); out.guided = g }
  }

  if (level.activity && patch.activity) {
    const a = localizeActivity(level.activity, patch.activity)
    if (a !== level.activity) { clone(); out.activity = a }
  }

  return out
}
```

- [ ] **Step 4: wire into `localizeTracks.js`** — replace the shallow lesson overlay with the deep one:

Change the import + the `.map` body:
```js
import { localizeLesson } from './localizeLesson.js'
// ...
  return tracks.map((track) => {
    const localizedLevels = track.levels.map((level) =>
      localizeLesson(level, lessonPatches[level.id]),
    )
    const t = overlay(track, trackPatches[track.id], TRACK_FIELDS)
    const changedLevels = localizedLevels.some((l, i) => l !== track.levels[i])
    if (t === track && !changedLevels) return track
    return { ...t, levels: localizedLevels }
  })
```
(Keep the `overlay` helper + `TRACK_FIELDS` for tracks; remove the now-unused `LESSON_FIELDS` constant. `localizeTracks.test.js` from Phase B still passes — its lesson patches only set title/concept, which `localizeLesson` handles via the top-level string overlay.)

- [ ] **Step 5: run → PASS** `npx vitest run src/i18n/localizeLesson.test.js src/i18n/localizeTracks.test.js` (both green).

- [ ] **Step 6: commit**
```bash
git add src/i18n/localizeLesson.js src/i18n/localizeLesson.test.js src/i18n/localizeTracks.js
git commit -m "feat(i18n): deep localizeLesson resolver (body + activity data) wired into localizeTracks"
```

---

### Task 2: L0 + L1 body translations (what-is-data, what-ai, ai-ethics)

**Files:** Modify `src/i18n/curriculum.uz.js` — extend the existing `LESSONS_UZ` entries for the 3 lessons with full nested body fields. Modify `src/i18n/curriculum.uz.test.js` — add a C1 body-coverage block.

Translate EVERY user-facing string for the 3 lessons (the English source for all three is reproduced in this task from the data files). For each lesson, add to its `LESSONS_UZ[id]` entry (keeping existing title/concept): `explanation`, `example.text`, `workedExample{intro,steps[],takeaway}`, `guided{prompt,hints[],answer,explanation}`, `goDeeper{title,body}`, `video{title,description}`, `activity{prompt,feedback{correct,incorrect},data{...}}`.

Use the exact shapes the resolver expects:
- pick-dataset (`what-is-data`): `activity.data.options = { good:{title,sample,why}, 'no-label':{...}, tiny:{...} }`
- sort (`what-ai`): `activity.data.buckets = { ai:'…', not:'…' }`, `activity.data.tokens = { t1:'…', …, t6:'…' }`
- ethics (`ai-ethics`): `activity.data.scenarios = { s1:{situation, options:{a:{text,why}, b:{...}, c:{...}}}, s2:{situation, options:{a:{...}, b:{...}}} }`

**English source — what-is-data** (foundations.js): explanation "Everything a model learns from is data: a table of examples, where each row is one thing and each column is one fact about it. Before any machine learning, you need good examples laid out this way." | example "A spreadsheet of houses — one row per house, columns for size, bedrooms, and price — is a dataset. The model studies these rows to learn patterns." | workedExample.intro "The test for a good dataset: is it a clean table of EXAMPLES, where each row is one item and each column is one measurable fact? Watch me judge a few." | steps: ["A table of emails labelled spam / not-spam: each row an email, a column for the label. Clean examples — great for learning.","A single paragraph of prose: no rows, no columns, nothing to compare. Not a dataset yet — it needs structure first.","Photos sorted into folders \"cat\" and \"dog\": each image is an example and the folder is its label. That IS a dataset."] | takeaway "A dataset is a table of examples: rows are items, columns are facts, and often one column is the label." | guided.prompt "Which of these is ready to learn from?\n\nA) 1,000 customer reviews each tagged positive or negative\nB) One long unlabelled essay" | hints: ["Learning needs many comparable EXAMPLES, ideally with a label saying what each one is.","A is a thousand labelled examples; B is a single block of text with no structure."] | answer "A — the labelled reviews." | explanation "A is a structured set of labelled examples a model can learn patterns from. B is unstructured and unlabelled, so there is nothing to learn from yet." | goDeeper.title "Why \"garbage in, garbage out\" starts here" | body "A model can only be as good as its examples. Biased, mislabelled, or too-few rows produce a weak model no algorithm can rescue. That is why real ML work spends most of its time on data, not models — a theme you will meet again in every level." | video.title "Data, rows, and columns" | video.description "What a dataset is and what makes examples good enough to learn from." | activity.prompt "A team wants to predict house prices. Pick the dataset that can actually teach that." | options: good{title "Past home sales", sample "5,000 sold homes with size, bedrooms, location, and final sale price.", why "Many examples, with the answer (sale price) included — exactly what supervised learning needs."}, no-label{title "Homes with no prices", sample "5,000 homes with size and location — but the price column is blank.", why "Without the price column there is no answer to learn from."}, tiny{title "Three homes", sample "Just 3 homes with full details and prices.", why "Three rows is far too few to learn a reliable pattern."} | feedback.correct "Right — lots of labelled examples (price included) is what makes price prediction learnable. Good data first, always." | feedback.incorrect "Look again: you need MANY examples that include the answer you want to predict (the sale price)."

**English source — what-ai** (levels.js:36–101): explanation "Artificial Intelligence (AI) is when a computer does things that usually need human smarts — like understanding language, recognizing pictures, or making choices. It is not magic and it is not alive. It is a very capable program." | example "When your phone unlocks by looking at your face, that is AI recognizing you. A pocket calculator adding numbers just follows fixed steps a person wrote — so it is not AI." | workedExample.intro "Watch how I decide whether something counts as AI. The one test I keep asking: did it LEARN from examples, or does it just FOLLOW fixed steps a person wrote?" | steps: ["Take face unlock. It gets better at recognizing you over time and copes with new angles and lighting. It clearly learned from examples — so I call it AI.","Now a pocket calculator. \"2 + 2\" always runs the exact steps a person programmed. Nothing was learned. So it is not AI.","A trickier one: a spam filter. Nobody wrote a rule for every junk email — it studied thousands of messages and found the patterns itself. Learned from examples, so it is AI."] | takeaway "The test: did it LEARN from examples (AI) or just FOLLOW fixed steps (not AI)?" | guided.prompt "Let's do one together before you try the full set. Is this AI or not?\n\n\"Email autocomplete that finishes your sentence as you type.\"" | hints: ["Start with our test — does it follow a fixed rule a person wrote, or does it figure something out from patterns?","Autocomplete suggests your next words by drawing on huge amounts of text it has seen before. That sounds a lot like learning from examples.","Think of the spam filter: it learned from thousands of emails. Autocomplete learned from billions of sentences — it is the same idea, not a hand-written rule."] | answer "It is AI." | explanation "Autocomplete learns patterns from massive amounts of text, then predicts the most likely next words. Learning patterns from examples is machine learning — a kind of AI." | goDeeper.title "Where does \"machine learning\" fit?" | body "AI is the big umbrella: any program doing tasks that need human-like smarts. Machine Learning is the most common way we build AI today — instead of hand-writing rules, we let a program learn patterns from examples. So every ML system is AI, but a few old-fashioned AIs (hand-written rule systems) are not ML. The rest of this track is really about machine learning." | video.title "What counts as AI?" | video.description "A two-minute tour of everyday AI, from face unlock to recommendations — and what is just an ordinary program." | activity.prompt "Drag each card into AI or Not AI — or tap a card, then tap a group." | buckets: ai "AI", not "Not AI" | tokens: t1 "Face unlock on a phone", t2 "A spam filter that spots junk mail", t3 "A pocket calculator", t4 "A voice assistant answering questions", t5 "A light switch turning on a bulb", t6 "A service suggesting a show you might like" | feedback.correct "Exactly. AI handles tasks that need judgement — recognizing, understanding, and choosing. Simple machines just follow fixed steps." | feedback.incorrect "Not quite. AI learns or makes smart choices. A calculator and a light switch only follow fixed steps a person built in."

**English source — ai-ethics** (levels.js:522–567 body + enrichment.js We-do): explanation "AI is powerful, so it must be used fairly and responsibly. Good AI ethics means thinking about who could be helped or hurt, being honest that AI can make mistakes, protecting people's privacy, and keeping a human in charge of important decisions." | example "A hospital wants AI to help spot disease in X-rays. That is helpful — but a doctor should always review the result, because a wrong call could hurt someone." | video.title "Using AI responsibly" | video.description "Fairness, privacy, honesty about mistakes, and keeping humans in charge of big decisions." | workedExample.intro "Let me walk through how I judge a real AI proposal, thinking aloud about who it touches and who stays in charge." | steps: ["A bank wants an AI to approve or reject loan applications on its own. First I ask: who is affected, and how badly if it is wrong? A wrongly rejected loan can change someone's life — high stakes.","Next I ask whether the AI could be unfair. If it learned from past decisions that favoured one group, it may quietly repeat that bias against people who look different.","Then I ask: is a person still in charge of the important call? Letting the AI send final rejections alone removes the human check.","So the responsible design is: let the AI flag and sort applications, but a loan officer reviews every rejection before it is final — and the bank checks the AI for unfair patterns."] | takeaway "Responsible AI use comes down to four habits: weigh who is helped or hurt, watch for unfairness, protect people's privacy, and keep a human in charge of decisions that really matter." | guided.prompt "Let's reason about one together. A hiring team wants an AI to automatically reject job applicants and send the rejection emails, with no recruiter ever looking. What is the single most responsible change to make?" | hints: ["Think about the stakes. A rejected job application is an important decision for a real person.","The problem is not that AI helps sort applications — it is that no human reviews the final call.","The fix keeps the AI as an assistant but puts a person back in charge of the decision that matters."] | answer "Have the AI shortlist or sort applicants, but a recruiter reviews the decisions before any rejection is sent." | explanation "AI can help by sorting and surfacing applications quickly, but a hiring decision is high-stakes and the model can be wrong or biased. Keeping a human in charge of the final call — and able to catch unfair patterns — is the responsible choice. Banning the tool entirely throws away a useful helper; letting it act alone removes the human check." | goDeeper.title "Bias can hide inside \"neutral\" data" | body "A system can be unfair even when no one intended it to be. If the examples it learned from already reflect a lopsided past — say, mostly one kind of person was hired before — the model can simply repeat that pattern, dressed up as an \"objective\" score. That is why responsible teams do not just trust the output; they test the system on different groups, look for gaps, and keep a human reviewing the decisions that affect people's lives." | activity.prompt "For each real-world situation, choose the most responsible action, then check your decisions." | scenarios: s1.situation "A school wants AI to grade essays and email final grades to students, with no teacher ever reviewing them." options a{text "Let the AI grade and send final grades automatically.", why "AI can make mistakes and miss meaning. An important decision like a grade needs a human to review it."} b{text "Use AI to suggest a grade, but a teacher reviews it before it counts.", why "A human stays in charge of the important decision. AI assists; people decide."} c{text "Ban all computers from the school entirely.", why "AI can be a useful tool. The goal is to use it responsibly, not to ban it outright."} ; s2.situation "An app wants to train its chatbot on users' private messages without telling them." options a{text "Use the private messages quietly — it improves the bot.", why "That breaks people's privacy and trust. People should know and agree first."} b{text "Ask users for permission first, and let them decline.", why "Respecting privacy and asking for consent is responsible use of AI."} | feedback.correct "Sound decisions. Responsible AI keeps a human in charge of important choices and respects people's privacy." | feedback.incorrect "Weigh fairness, honesty, and privacy. The most responsible choice usually keeps a human in control and respects people's rights."

- [ ] **Step 1:** Extend `LESSONS_UZ['what-is-data']`, `['what-ai']`, `['ai-ethics']` in `src/i18n/curriculum.uz.js` with the full translated body per the shapes above. Keep existing title/concept. Latin Uzbek, U+2019, glossary.

- [ ] **Step 2:** Add a C1 body-coverage test to `src/i18n/curriculum.uz.test.js`:

```js
describe('curriculum.uz — C1 body coverage (L0 + L1)', () => {
  const C1 = ['what-is-data', 'what-ai', 'ai-ethics']
  it('each C1 lesson has translated explanation, workedExample, guided, goDeeper, activity', () => {
    for (const id of C1) {
      const u = LESSONS_UZ[id]
      expect(u.explanation, `${id}.explanation`).toBeTruthy()
      expect(u.workedExample?.intro, `${id}.we.intro`).toBeTruthy()
      expect(Array.isArray(u.workedExample?.steps) && u.workedExample.steps.length, `${id}.we.steps`).toBeTruthy()
      expect(u.workedExample?.takeaway, `${id}.we.takeaway`).toBeTruthy()
      expect(u.guided?.prompt, `${id}.guided.prompt`).toBeTruthy()
      expect(Array.isArray(u.guided?.hints) && u.guided.hints.length, `${id}.guided.hints`).toBeTruthy()
      expect(u.guided?.answer, `${id}.guided.answer`).toBeTruthy()
      expect(u.goDeeper?.body, `${id}.goDeeper.body`).toBeTruthy()
      expect(u.activity?.prompt, `${id}.activity.prompt`).toBeTruthy()
      expect(u.activity?.feedback?.correct, `${id}.activity.feedback`).toBeTruthy()
    }
  })
})
```

(The existing Latin-only/no-U+2018 quality test must be updated to recurse into nested objects+arrays so it also guards the new body strings — change the `all` collector to deep-collect all string values from each lesson/track entry. Implement a small recursive string collector in the test.)

- [ ] **Step 3: run → PASS** `npx vitest run src/i18n/curriculum.uz.test.js`

- [ ] **Step 4: commit**
```bash
git add src/i18n/curriculum.uz.js src/i18n/curriculum.uz.test.js
git commit -m "feat(i18n): full Uzbek body for L0+L1 lessons (what-is-data, what-ai, ai-ethics)"
```

---

### Task 3: Verification + render check

- [ ] **Step 1:** `npm test` → all pass (existing + new). Fix any test that breaks ONLY if it's a test-harness issue (no source changes to work around translations).
- [ ] **Step 2:** Add a render assertion to the existing `src/i18n/curriculumRender.integration.test.jsx` OR a new small test: render `LevelView` for `what-ai` under uz via the localized levels and assert the Uzbek `explanation` shows; under en the English shows. (Use `useLocalizedTracks` levels or `localizeLesson` directly.) Keep it light.
- [ ] **Step 3:** `npm run build` → succeeds.
- [ ] **Step 4: commit** any test additions:
```bash
git add -A && git commit -m "test(i18n): L0+L1 localized body render + deep Latin-only guard"
```
- [ ] **Step 5: STOP and report.** Files, tests, the EN/UZ body diff summary, caveats (L2–L5 body still English = expected). Do NOT merge/push. NO security scan, NO browser smoke (per user instruction).

## Rollback / risk
- Additive commits; `localizeLesson` is pure + English-fallback per field, so a missing/partial uz body degrades to English, never crashes. `localizeTracks` under `en` still returns the input array unchanged.
- Activity `data` overlay matches by stable id and preserves ALL logic fields (bucket, correctId, best, isCorrect) — gameplay/scoring identical in both locales.
- No data-file, schema, id, or progress changes.

## Self-review (author)
- Scope = L0+L1 body only (3 lessons), every user-facing field incl. activity card text. L2–L5 untouched. ✓
- Deep resolver pure, id/index-matched, English fallback, no mutation, logic fields preserved. ✓
- Translations in the single curriculum.uz.js; stable ids; Latin/U+2019/glossary; tests for coverage + deep Latin-only guard + render. ✓
- Gate = test + build only (no security/smoke per instruction). ✓
