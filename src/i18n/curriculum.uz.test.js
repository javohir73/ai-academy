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
  it('is Latin-only (no Cyrillic) and never uses U+2018 (recursive over nested body)', () => {
    // Deep-collect every string value from the uz maps (titles, concepts, and
    // all nested body fields: workedExample.steps[], guided.hints[],
    // activity.data tokens/scenarios/options, etc.).
    const strings = []
    const walk = (v) => {
      if (typeof v === 'string') strings.push(v)
      else if (Array.isArray(v)) v.forEach(walk)
      else if (v && typeof v === 'object') Object.values(v).forEach(walk)
    }
    walk(TRACKS_UZ)
    walk(LESSONS_UZ)
    expect(strings.length).toBeGreaterThan(40)
    for (const s of strings) {
      expect(CYRILLIC.test(s), `Cyrillic in "${s}"`).toBe(false)
      expect(s.includes('‘'), `U+2018 in "${s}"`).toBe(false)
    }
  })
})

/*
 * Body coverage is data-driven: for every lesson whose body is "done" (its
 * track has been C-translated), assert that each body field the ENGLISH lesson
 * actually HAS is also present in the uz entry. As each level's body lands, add
 * its ids to DONE_BODY. This auto-checks explanation/example/workedExample/
 * guided/goDeeper/video/activity prompt+feedback against the real source shape.
 */
const byIdEn = Object.fromEntries(LEVELS.map((l) => [l.id, l]))
const DONE_BODY = [
  // L0 + L1 (C1)
  'what-is-data', 'what-ai', 'ai-ethics',
  // L2 (C2)
  'what-ml', 'training-data', 'features-labels', 'classification', 'prediction',
  'bias', 'overfitting', 'neural-networks', 'code-first-classifier', 'code-metrics-overfitting',
]

describe('curriculum.uz — body coverage (matches English source shape)', () => {
  it.each(DONE_BODY)('%s has every body field its English source has', (id) => {
    const e = byIdEn[id]
    const u = LESSONS_UZ[id]
    expect(u, `${id} uz entry`).toBeTruthy()
    if (e.explanation) expect(u.explanation, `${id}.explanation`).toBeTruthy()
    if (e.example?.text) expect(u.example?.text, `${id}.example.text`).toBeTruthy()
    if (e.workedExample) {
      expect(u.workedExample?.intro, `${id}.we.intro`).toBeTruthy()
      expect(u.workedExample?.steps?.length, `${id}.we.steps`).toBe(e.workedExample.steps.length)
      expect(u.workedExample?.takeaway, `${id}.we.takeaway`).toBeTruthy()
    }
    if (e.guided) {
      expect(u.guided?.prompt, `${id}.guided.prompt`).toBeTruthy()
      expect(u.guided?.hints?.length, `${id}.guided.hints`).toBe(e.guided.hints.length)
      expect(u.guided?.answer, `${id}.guided.answer`).toBeTruthy()
      expect(u.guided?.explanation, `${id}.guided.explanation`).toBeTruthy()
    }
    if (e.goDeeper) {
      expect(u.goDeeper?.title, `${id}.goDeeper.title`).toBeTruthy()
      expect(u.goDeeper?.body, `${id}.goDeeper.body`).toBeTruthy()
    }
    if (e.video) {
      expect(u.video?.title, `${id}.video.title`).toBeTruthy()
      expect(u.video?.description, `${id}.video.description`).toBeTruthy()
    }
    if (e.activity) {
      expect(u.activity?.prompt, `${id}.activity.prompt`).toBeTruthy()
      if (e.activity.feedback) {
        expect(u.activity?.feedback?.correct, `${id}.activity.feedback.correct`).toBeTruthy()
        expect(u.activity?.feedback?.incorrect, `${id}.activity.feedback.incorrect`).toBeTruthy()
      }
    }
  })
})
