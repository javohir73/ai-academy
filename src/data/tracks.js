/* =====================================================================
   TRACKS — the course organized into curriculum LEVELS (L0, L1, L2, L3, L4, L5).

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
import { VISION_LEVELS } from './vision.js'
import { ENRICHMENT } from './enrichment.js'

// Index every lesson by id so tracks can be composed by curriculum level.
// Lessons that originally shipped with only an "I do" concept + "You do"
// activity get their "We do" scaffold (workedExample + guided + goDeeper)
// merged in from enrichment.js here — additive, and reversible by dropping the
// import. The merged blocks override nothing else on the lesson.
const BY_ID = Object.fromEntries(
  [...FOUNDATIONS_LEVELS, ...BEGINNER_LEVELS, ...INTERMEDIATE_LEVELS, ...VISION_LEVELS].map((l) => [
    l.id,
    ENRICHMENT[l.id] ? { ...l, ...ENRICHMENT[l.id] } : l,
  ]),
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
      'what-ml',
      'training-data',
      'features-labels',
      'classification',
      'prediction',
      'bias',
      'overfitting',
      'neural-networks',
      'code-first-classifier',
      'code-metrics-overfitting',
    ),
  },
  {
    id: 'level-3',
    tag: 'Level 3',
    title: 'Problem Solving & Search',
    blurb:
      'How an agent reaches a goal in code: breadth-first search finds the shortest path through a maze — the skeleton that smarter algorithms (Dijkstra, A*) build on.',
    // L3 currently ships one hands-on search lesson; more deep-learning (backprop,
    // PyTorch) lessons are on the roadmap.
    comingSoon: 'More Level 3 (neural networks) lessons are in development.',
    levels: pick('code-bfs-maze'),
  },
  {
    id: 'level-4',
    tag: 'Level 4',
    title: 'Computer Vision',
    blurb:
      'Deep learning pointed at images — and you can see what the model learns. Inspect pixels and convolution, build CNNs, use transfer learning, then run a "break-it" study on how vision models fail. Heavy training runs in free GPU notebooks (Colab/Kaggle).',
    levels: pick(
      'cv-pixels',
      'cv-conv-by-hand',
      'cv-why-fc-fails',
      'cv-conv-layer',
      'cv-pooling',
      'cv-build-cnn',
      'cv-feature-maps',
      'cv-architectures',
      'cv-residual',
      'cv-transfer',
      'cv-augmentation',
      'cv-detect-segment',
      'cv-failures',
      'cv-adversarial',
      'cv-project',
    ),
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
