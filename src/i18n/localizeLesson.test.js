import { describe, it, expect } from 'vitest'
import { localizeLesson, deepOverlay } from './localizeLesson.js'

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

// The patch MIRRORS the English structure (arrays by index, objects by key).
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
      buckets: [{ label: 'AI' }, { label: 'AI emas' }],
      tokens: [{ label: 'Yuz bilan ochish' }, { label: 'Kalkulyator' }],
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

  it('overlays activity prompt, feedback, and data arrays by index', () => {
    const out = localizeLesson(EN, PATCH)
    expect(out.activity.prompt).toBe('Har bir kartani torting.')
    expect(out.activity.feedback.correct).toBe('Aynan.')
    expect(out.activity.data.buckets[0].label).toBe('AI')
    expect(out.activity.data.buckets[1].label).toBe('AI emas')
    expect(out.activity.data.tokens[0].label).toBe('Yuz bilan ochish')
    // logic fields preserved (patch never supplied them)
    expect(out.activity.data.tokens[0].bucket).toBe('ai')
    expect(out.activity.data.tokens[0].id).toBe('t1')
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
    expect(out.title).toBe('What Is AI?')
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

describe('deepOverlay — generic rules', () => {
  it('never injects keys absent from the base (no phantom fields)', () => {
    const out = deepOverlay({ a: 'x' }, { a: 'y', b: 'NEW' })
    expect(out.a).toBe('y')
    expect('b' in out).toBe(false)
  })

  it('never translates a numeric field even if patch has a number there', () => {
    const base = { label: 320, why: 'big edge' }
    const out = deepOverlay(base, { why: 'katta chekka' })
    expect(out.label).toBe(320)
    expect(out.why).toBe('katta chekka')
  })

  it('does not change types (string patch over non-string base is ignored)', () => {
    const out = deepOverlay({ n: 5 }, { n: 'five' })
    expect(out.n).toBe(5)
  })

  it('merges nested arrays of objects by index, recursively', () => {
    const base = { rounds: [{ id: 'r1', clues: ['a', 'b'], correctId: 'bird' }] }
    const patch = { rounds: [{ clues: ['x', 'y'] }] }
    const out = deepOverlay(base, patch)
    expect(out.rounds[0].clues).toEqual(['x', 'y'])
    expect(out.rounds[0].correctId).toBe('bird')
    expect(out.rounds[0].id).toBe('r1')
  })

  it('returns the same reference when nothing changed', () => {
    const base = { a: 'x', n: 1 }
    expect(deepOverlay(base, { a: 'x' })).toBe(base)
    expect(deepOverlay(base, {})).toBe(base)
  })
})
