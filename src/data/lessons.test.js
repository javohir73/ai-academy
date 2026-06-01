import { describe, it, expect } from 'vitest'
import { TRACKS, LEVELS } from './tracks.js'
import { ACTIVITIES } from '../components/activities/index.js'
import { convOutput } from '../components/activities/ShapeCalc.jsx'

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

describe('lesson richness — every lesson has the full I-do → We-do scaffold', () => {
  // Every lesson (after enrichment is merged in tracks.js) must carry a narrated
  // worked example and a guided practice, so no lesson jumps straight from the
  // concept to the activity with no "We do" step. Code lessons author these
  // inline; concept lessons may receive them from enrichment.js — either way the
  // composed lesson must have them.
  it('every lesson has a workedExample with an intro, 3–4 steps, and a takeaway', () => {
    for (const l of LEVELS) {
      const we = l.workedExample
      expect(we, `${l.id} is missing a workedExample`).toBeTruthy()
      expect(typeof we.intro, `${l.id} workedExample needs an intro`).toBe('string')
      expect(we.intro.length, `${l.id} workedExample intro is empty`).toBeGreaterThan(0)
      expect(Array.isArray(we.steps), `${l.id} workedExample needs steps[]`).toBe(true)
      expect(we.steps.length, `${l.id} workedExample needs at least 3 steps`).toBeGreaterThanOrEqual(3)
      expect(we.steps.length, `${l.id} workedExample has an unreasonable number of steps`).toBeLessThanOrEqual(6)
      expect(typeof we.takeaway, `${l.id} workedExample needs a takeaway`).toBe('string')
      expect(we.takeaway.length, `${l.id} workedExample takeaway is empty`).toBeGreaterThan(0)
    }
  })

  it('every lesson has a guided practice with a prompt, 2–3 hints, an answer, and an explanation', () => {
    for (const l of LEVELS) {
      const g = l.guided
      expect(g, `${l.id} is missing a guided practice`).toBeTruthy()
      expect(typeof g.prompt, `${l.id} guided needs a prompt`).toBe('string')
      expect(g.prompt.length, `${l.id} guided prompt is empty`).toBeGreaterThan(0)
      expect(Array.isArray(g.hints), `${l.id} guided needs hints[]`).toBe(true)
      expect(g.hints.length, `${l.id} guided needs 2–3 hints`).toBeGreaterThanOrEqual(2)
      expect(g.hints.length, `${l.id} guided has too many hints`).toBeLessThanOrEqual(3)
      expect(typeof g.answer, `${l.id} guided needs an answer`).toBe('string')
      expect(g.answer.length, `${l.id} guided answer is empty`).toBeGreaterThan(0)
      expect(typeof g.explanation, `${l.id} guided needs an explanation`).toBe('string')
      expect(g.explanation.length, `${l.id} guided explanation is empty`).toBeGreaterThan(0)
    }
  })

  it('every goDeeper (when present) has a title and a body', () => {
    for (const l of LEVELS) {
      if (!l.goDeeper) continue
      expect(typeof l.goDeeper.title, `${l.id} goDeeper needs a title`).toBe('string')
      expect(l.goDeeper.title.length, `${l.id} goDeeper title is empty`).toBeGreaterThan(0)
      expect(typeof l.goDeeper.body, `${l.id} goDeeper needs a body`).toBe('string')
      expect(l.goDeeper.body.length, `${l.id} goDeeper body is empty`).toBeGreaterThan(0)
    }
  })

  it('enriched concept lessons keep their original activity (enrichment is additive only)', () => {
    // The enrichment merge must not have altered or removed any activity.
    for (const l of LEVELS) {
      expect(l.activity?.type, `${l.id} lost its activity after enrichment merge`).toBeTruthy()
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

describe('Level 4 — CV activity engines (data validity)', () => {
  const l4 = TRACKS.find((t) => t.id === 'level-4').levels
  const byType = (type) => l4.filter((l) => l.activity.type === type)

  // Helper: every single-best choice-set must have exactly one `correct: true`.
  const expectExactlyOneCorrect = (choices, where) => {
    const n = choices.filter((c) => c.correct).length
    expect(n, `${where} must have exactly one correct choice`).toBe(1)
  }

  it('uses all four new engines at least once', () => {
    for (const t of ['pixel-grid', 'calc', 'builder', 'featuremap']) {
      expect(byType(t).length, `Level 4 should use the ${t} engine`).toBeGreaterThanOrEqual(1)
    }
  })

  it('pixel-grid: pixels are an HxW grid of [R,G,B] 0–255 triples with one-correct self-check', () => {
    for (const l of byType('pixel-grid')) {
      const d = l.activity.data
      expect(Array.isArray(d.pixels) && d.pixels.length > 0, `${l.id} needs a pixels grid`).toBe(true)
      const width = d.pixels[0].length
      for (const row of d.pixels) {
        expect(row.length, `${l.id} pixel rows must be equal width`).toBe(width)
        for (const px of row) {
          expect(Array.isArray(px) && px.length === 3, `${l.id} pixel must be [R,G,B]`).toBe(true)
          for (const v of px) {
            expect(Number.isInteger(v) && v >= 0 && v <= 255, `${l.id} channel must be 0–255`).toBe(true)
          }
        }
      }
      expect(d.check?.choices?.length, `${l.id} needs self-check choices`).toBeGreaterThanOrEqual(2)
      expectExactlyOneCorrect(d.check.choices, `${l.id} pixel-grid check`)
      for (const c of d.check.choices) {
        expect(typeof c.id, `${l.id} choice needs id`).toBe('string')
        expect(c.why, `${l.id} choice ${c.id} needs a why`).toBeTruthy()
      }
    }
  })

  it('calc: each mode carries the fields it needs, and conv-output configs are integer-valid', () => {
    for (const l of byType('calc')) {
      const d = l.activity.data
      expect(['conv-output', 'param-explosion', 'flatten']).toContain(d.mode)
      if (d.mode === 'conv-output') {
        for (const k of ['W', 'F', 'P', 'S']) {
          expect(Number.isFinite(d[k]), `${l.id} conv-output needs numeric ${k}`).toBe(true)
        }
        // an authored conv-output exercise must be a VALID (whole-number) config,
        // otherwise the only correct answer is "invalid" and the lesson is a trap.
        expect(convOutput(d).valid, `${l.id} conv-output config must be a whole-number size`).toBe(true)
      } else if (d.mode === 'param-explosion') {
        for (const k of ['H', 'W', 'C', 'kernel']) {
          expect(Number.isFinite(d[k]), `${l.id} param-explosion needs numeric ${k}`).toBe(true)
        }
        expect(['fc', 'conv', 'ratio']).toContain(d.ask)
      } else {
        expect(d.shape && Number.isFinite(d.shape.c) && Number.isFinite(d.shape.h) && Number.isFinite(d.shape.w), `${l.id} flatten needs shape {c,h,w}`).toBe(true)
      }
    }
  })

  it('builder: every id in `correct` exists in `tiles`, and tiles cover the answer', () => {
    for (const l of byType('builder')) {
      const d = l.activity.data
      expect(Array.isArray(d.tiles) && d.tiles.length > 0, `${l.id} needs tiles`).toBe(true)
      expect(Array.isArray(d.correct) && d.correct.length > 0, `${l.id} needs a correct order`).toBe(true)
      const tileIds = new Set(d.tiles.map((t) => t.id))
      for (const t of d.tiles) {
        expect(typeof t.id, `${l.id} tile needs id`).toBe('string')
        expect(t.label, `${l.id} tile ${t.id} needs a label`).toBeTruthy()
      }
      for (const id of d.correct) {
        expect(tileIds.has(id), `${l.id} correct order references unknown tile "${id}"`).toBe(true)
      }
      // ids in correct are unique (each required layer used once)
      expect(new Set(d.correct).size, `${l.id} correct order has a duplicate id`).toBe(d.correct.length)
    }
  })

  it('featuremap: depth mode has labeled layer grids; adversarial mode has a flip threshold', () => {
    for (const l of byType('featuremap')) {
      const d = l.activity.data
      expect(['depth', 'adversarial']).toContain(d.mode)
      if (d.mode === 'depth') {
        expect(Array.isArray(d.layers) && d.layers.length >= 2, `${l.id} depth needs ≥2 layers`).toBe(true)
        for (const layer of d.layers) {
          expect(layer.label, `${l.id} layer needs a label`).toBeTruthy()
          expect(layer.caption, `${l.id} layer needs a caption`).toBeTruthy()
          expect(Array.isArray(layer.grid) && layer.grid.length > 0, `${l.id} layer needs a grid`).toBe(true)
        }
      } else {
        expect(Array.isArray(d.base) && d.base.length > 0, `${l.id} adversarial needs a base grid`).toBe(true)
        expect(d.trueLabel, `${l.id} needs a trueLabel`).toBeTruthy()
        expect(d.wrongLabel, `${l.id} needs a wrongLabel`).toBeTruthy()
        expect(Number.isFinite(d.maxEps) && d.maxEps > 0, `${l.id} needs maxEps`).toBe(true)
        expect(d.flipAt > 0 && d.flipAt <= d.maxEps, `${l.id} flipAt must be within (0, maxEps]`).toBe(true)
      }
      expect(d.check?.choices?.length, `${l.id} needs self-check choices`).toBeGreaterThanOrEqual(2)
      expectExactlyOneCorrect(d.check.choices, `${l.id} featuremap check`)
    }
  })
})
