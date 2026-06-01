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

describe('curriculum.uz — C1 body coverage (L0 + L1)', () => {
  const C1 = ['what-is-data', 'what-ai', 'ai-ethics']
  it('each C1 lesson has translated explanation, workedExample, guided, goDeeper, activity', () => {
    for (const id of C1) {
      const u = LESSONS_UZ[id]
      expect(u.explanation, `${id}.explanation`).toBeTruthy()
      expect(u.example?.text, `${id}.example`).toBeTruthy()
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
