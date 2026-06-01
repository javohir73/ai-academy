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
