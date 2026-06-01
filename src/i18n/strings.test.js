// src/i18n/strings.test.js
import { describe, it, expect, vi } from 'vitest'
import { UI, createT } from './strings.js'

const CYRILLIC = /[Ѐ-ӿ]/

describe('strings catalog', () => {
  it('en and uz have exactly the same key set (no missing keys)', () => {
    const en = Object.keys(UI.en).sort()
    const uz = Object.keys(UI.uz).sort()
    expect(uz).toEqual(en)
  })

  it('no Uzbek string contains Cyrillic', () => {
    for (const [k, v] of Object.entries(UI.uz)) {
      expect(CYRILLIC.test(v), `${k} has Cyrillic`).toBe(false)
    }
  })

  it('no string value is empty', () => {
    for (const locale of ['en', 'uz']) {
      for (const [k, v] of Object.entries(UI[locale])) {
        expect(v, `${locale}.${k}`).toBeTruthy()
      }
    }
  })
})

describe('createT', () => {
  it('returns the uz string when present', () => {
    const t = createT('uz')
    expect(t('nav.overview')).toBe(UI.uz['nav.overview'])
  })

  it('returns the en string for locale en', () => {
    const t = createT('en')
    expect(t('nav.overview')).toBe(UI.en['nav.overview'])
  })

  it('falls back to English when the active-locale key is missing', () => {
    // Simulate a missing uz key by asking for one that does not exist in uz
    // but does in en: we inject a temporary en-only key.
    const t = createT('uz')
    UI.en['__test.only'] = 'English only'
    try {
      expect(t('__test.only')).toBe('English only')
    } finally {
      delete UI.en['__test.only']
    }
  })

  it('returns the key itself as the last resort', () => {
    const t = createT('uz')
    expect(t('totally.unknown.key')).toBe('totally.unknown.key')
  })

  it('warns once (dev only) when falling back', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const t = createT('uz')
    t('totally.unknown.key')
    expect(warn).toHaveBeenCalled() // import.meta.env.DEV is true under vitest
    warn.mockRestore()
  })
})
