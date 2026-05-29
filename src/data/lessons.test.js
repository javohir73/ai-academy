import { describe, it, expect } from 'vitest'
import { TRACKS, LEVELS } from './tracks.js'

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
})
