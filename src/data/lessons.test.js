import { describe, it, expect } from 'vitest'
import { TRACKS, LEVELS } from './tracks.js'
import { ACTIVITIES } from '../components/activities/index.js'

const codeLessons = LEVELS.filter((l) => l.kind === 'code')

describe('lesson data integrity', () => {
  it('every track composes only defined lessons', () => {
    for (const track of TRACKS) {
      for (const level of track.levels) {
        expect(level, `track ${track.id} has an undefined lesson id`).toBeTruthy()
        expect(typeof level.id).toBe('string')
      }
    }
  })

  it('every code lesson has a complete notebook activity', () => {
    for (const l of codeLessons) {
      expect(l.activity.type, `${l.id} must use the notebook activity`).toBe('notebook')
      const d = l.activity.data
      expect(typeof d.starter, `${l.id} needs starter code`).toBe('string')
      expect(typeof d.tests, `${l.id} needs hidden tests`).toBe('string')
      expect(Array.isArray(d.packages), `${l.id} needs a packages array`).toBe(true)
      expect(Array.isArray(d.hints), `${l.id} needs hints`).toBe(true)
      expect(l.activity.feedback.correct, `${l.id} needs correct feedback`).toBeTruthy()
      expect(l.activity.feedback.incorrect, `${l.id} needs incorrect feedback`).toBeTruthy()
    }
  })

  it('beginner levels L0 and L1 are code-free', () => {
    const beginner = TRACKS.filter((t) => t.id === 'level-0' || t.id === 'level-1')
    for (const track of beginner) {
      for (const level of track.levels) {
        expect(level.kind, `${level.id} in ${track.id} must not be a code lesson`).not.toBe('code')
      }
    }
  })

  it('within every level, concept lessons come before code lessons', () => {
    for (const track of TRACKS) {
      let seenCode = false
      for (const level of track.levels) {
        if (level.kind === 'code') seenCode = true
        else if (seenCode) {
          throw new Error(
            `Concept lesson "${level.id}" appears after a code lesson in ${track.id}; concept must come first.`,
          )
        }
      }
    }
  })

  it('code lessons only appear at Level 2 or later', () => {
    const earlyTrackIds = ['level-0', 'level-1']
    for (const track of TRACKS) {
      if (!earlyTrackIds.includes(track.id)) continue
      expect(track.levels.some((l) => l.kind === 'code')).toBe(false)
    }
  })

  it('every lesson activity type is registered in the ACTIVITIES map', () => {
    for (const l of LEVELS) {
      expect(l.activity, `${l.id} has no activity`).toBeTruthy()
      expect(
        ACTIVITIES[l.activity.type],
        `${l.id} uses unregistered activity type "${l.activity.type}"`,
      ).toBeTruthy()
      expect(l.activity.feedback?.correct, `${l.id} needs correct feedback`).toBeTruthy()
      expect(l.activity.feedback?.incorrect, `${l.id} needs incorrect feedback`).toBeTruthy()
    }
  })
})

describe('Level 4 — Computer Vision', () => {
  const trackIds = TRACKS.map((t) => t.id)
  const l4 = TRACKS.find((t) => t.id === 'level-4')

  it('Level 4 exists in the track navigation, labeled "Computer Vision"', () => {
    expect(l4, 'level-4 track must exist').toBeTruthy()
    expect(l4.title).toBe('Computer Vision')
    expect(l4.levels.length).toBeGreaterThanOrEqual(12) // a real path, not a placeholder
  })

  it('Level 4 sits between Level 3 and Level 5 in track order', () => {
    expect(trackIds.indexOf('level-3')).toBeLessThan(trackIds.indexOf('level-4'))
    expect(trackIds.indexOf('level-4')).toBeLessThan(trackIds.indexOf('level-5'))
  })

  it('unlock flow: every L4 lesson sits (by flat index) after all L3 and before all L5', () => {
    const flatIndex = (id) => LEVELS.findIndex((l) => l.id === id)
    const l3 = TRACKS.find((t) => t.id === 'level-3').levels.map((l) => flatIndex(l.id))
    const l4i = l4.levels.map((l) => flatIndex(l.id))
    const l5 = TRACKS.find((t) => t.id === 'level-5').levels.map((l) => flatIndex(l.id))
    expect(Math.max(...l3)).toBeLessThan(Math.min(...l4i)) // L4 unlocks after L3
    expect(Math.max(...l4i)).toBeLessThan(Math.min(...l5)) // L5 unlocks after L4
  })

  it('Level 4 lesson ids are unique and defined', () => {
    const ids = l4.levels.map((l) => l && l.id)
    expect(ids.every(Boolean), 'no undefined L4 lessons').toBe(true)
    expect(new Set(ids).size).toBe(ids.length) // unique
  })

  it('Level 4 heavy/GPU lessons use the colab launcher, never in-browser code', () => {
    // The platform cannot run PyTorch/GPU client-side; such lessons must use the
    // 'colab' launcher and must NOT be kind:'code' (which implies a Pyodide notebook).
    const colab = l4.levels.filter((l) => l.activity.type === 'colab')
    expect(colab.length).toBeGreaterThanOrEqual(1)
    for (const l of l4.levels) {
      if (l.kind === 'code') {
        expect(l.activity.type, `${l.id} is kind:code so must be a notebook`).toBe('notebook')
      }
    }
  })

  it('no lesson id collides across the whole curriculum', () => {
    const ids = LEVELS.map((l) => l.id)
    expect(new Set(ids).size, 'duplicate lesson id somewhere in the curriculum').toBe(ids.length)
  })
})
