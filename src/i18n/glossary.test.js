import { describe, it, expect } from 'vitest'
import { GLOSSARY, bilingual } from './glossary.js'

const CYRILLIC = /[Ѐ-ӿ]/ // any Cyrillic codepoint

describe('glossary', () => {
  it('every entry has a non-empty en and uz', () => {
    for (const [term, pair] of Object.entries(GLOSSARY)) {
      expect(pair.en, `${term}.en`).toBeTruthy()
      expect(pair.uz, `${term}.uz`).toBeTruthy()
    }
  })

  it('all Uzbek terms are Latin-only (no Cyrillic)', () => {
    for (const [term, pair] of Object.entries(GLOSSARY)) {
      expect(CYRILLIC.test(pair.uz), `${term}.uz has Cyrillic`).toBe(false)
    }
  })

  it('bilingual() renders "english (uzbek)" for a known term', () => {
    expect(bilingual('features')).toBe('features (belgilar)')
  })

  it('bilingual() returns the raw term unchanged when unknown', () => {
    expect(bilingual('not-a-term')).toBe('not-a-term')
  })
})
