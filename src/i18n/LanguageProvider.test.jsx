import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from './LanguageProvider.jsx'
import { useLanguage } from './useLanguage.js'

// A tiny probe component that surfaces the context for assertions.
function Probe() {
  const { locale, setLocale, t } = useLanguage()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="overview">{t('nav.overview')}</span>
      <button onClick={() => setLocale('uz')}>to-uz</button>
      <button onClick={() => setLocale('en')}>to-en</button>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})
afterEach(() => {
  localStorage.clear()
})

describe('LanguageProvider', () => {
  it('defaults to English when no saved pref and browser is not Uzbek', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('locale').textContent).toBe('en')
  })

  it('persists the chosen locale to localStorage', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    render(<LanguageProvider><Probe /></LanguageProvider>)
    fireEvent.click(screen.getByText('to-uz'))
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('uz')
    expect(screen.getByTestId('locale').textContent).toBe('uz')
    expect(screen.getByTestId('overview').textContent).toBe('Kurs sharhi')
  })

  it('reads a saved preference back on remount', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'uz')
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('locale').textContent).toBe('uz')
  })

  it('keeps locale in memory when localStorage write throws', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(() => fireEvent.click(screen.getByText('to-uz'))).not.toThrow()
    expect(screen.getByTestId('locale').textContent).toBe('uz')
    setItem.mockRestore()
  })

  it('mounts without crashing when localStorage read throws', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => render(<LanguageProvider><Probe /></LanguageProvider>)).not.toThrow()
    expect(screen.getByTestId('locale').textContent).toBe('en')
  })
})
