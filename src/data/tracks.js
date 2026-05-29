/* =====================================================================
   TRACKS — the course is organized into curriculum LEVELS (a concept-course
   slice of the full 7-level AI Academy curriculum; see ../../curriculum/).
   The levels shipped here are 1 (Fundamentals of AI), 2 (Introduction to ML)
   and 5 (LLMs — Evaluation & Responsible AI).

   The flat `LEVELS` array (all lessons, in order) drives the shared, chained
   unlock rule in useProgress: each lesson unlocks when the previous one is
   completed, so each level naturally unlocks only after the one before it.

   Lessons live in levels.js / intermediate.js and are composed into levels
   here BY ID, so re-grouping a lesson is a one-line change and never moves
   content between files. To add a lesson, add it to a data file and list its
   id in the right level below.
   ===================================================================== */
import { BEGINNER_LEVELS } from './levels.js'
import { INTERMEDIATE_LEVELS } from './intermediate.js'

// Index every lesson by id so tracks can be composed by curriculum level.
const BY_ID = Object.fromEntries([...BEGINNER_LEVELS, ...INTERMEDIATE_LEVELS].map((l) => [l.id, l]))
const pick = (...ids) => ids.map((id) => BY_ID[id])

export const TRACKS = [
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
      'How machines learn patterns from data: training data, features and labels, classification, prediction, bias, overfitting, and a first look at neural networks.',
    levels: pick(
      'what-ml',
      'training-data',
      'features-labels',
      'classification',
      'prediction',
      'bias',
      'overfitting',
      'neural-networks',
    ),
  },
  {
    id: 'level-5',
    tag: 'Level 5',
    pro: true, // career-focused evaluation track — gets the distinct "pro" styling
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
 * Tracks annotated with the flat (global) index of each of their levels, so
 * the sidebar / overview can map a level-local lesson back to its position in
 * LEVELS (used for unlock checks and navigation).
 */
export const TRACKS_WITH_OFFSETS = (() => {
  let offset = 0
  return TRACKS.map((track) => {
    const levels = track.levels.map((level, i) => ({ level, index: offset + i }))
    offset += track.levels.length
    return { ...track, levels }
  })
})()
