import { describe, it, expect } from 'vitest'
import { detectLocale } from './detectLocale.js'

describe('detectLocale — fallback chain', () => {
  it('uses a valid saved preference', () => {
    expect(detectLocale('uz', ['en-US'])).toBe('uz')
    expect(detectLocale('en', ['uz-UZ'])).toBe('en')
  })

  it('ignores an invalid saved preference and detects from browser', () => {
    expect(detectLocale('fr', ['uz-UZ', 'en'])).toBe('uz')
    expect(detectLocale('', ['en-US'])).toBe('en')
    expect(detectLocale(null, ['uz'])).toBe('uz')
    expect(detectLocale(undefined, ['en-GB'])).toBe('en')
  })

  it('detects Uzbek from any navigator language matching /^uz/i', () => {
    expect(detectLocale(null, ['ru-RU', 'uz-Latn-UZ', 'en'])).toBe('uz')
    expect(detectLocale(null, ['UZ'])).toBe('uz')
  })

  it('defaults to English when nothing matches or input is empty', () => {
    expect(detectLocale(null, [])).toBe('en')
    expect(detectLocale(null, undefined)).toBe('en')
    expect(detectLocale(null, ['ru-RU', 'de'])).toBe('en')
  })
})
