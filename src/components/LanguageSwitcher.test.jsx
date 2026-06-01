import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from '../i18n/LanguageProvider.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'

beforeEach(() => localStorage.clear())

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  )
}

describe('LanguageSwitcher', () => {
  it('renders an EN and a UZ option', () => {
    setup()
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /o’zbekcha|ozbekcha|uzbek/i })).toBeInTheDocument()
  })

  it('marks the active locale with aria-pressed', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en')
    setup()
    const en = screen.getByRole('button', { name: /english/i })
    expect(en).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches locale on click and persists it', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en')
    setup()
    fireEvent.click(screen.getByRole('button', { name: /o’zbekcha|ozbekcha|uzbek/i }))
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('uz')
    expect(screen.getByRole('button', { name: /o’zbekcha|ozbekcha|uzbek/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
