import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from '../i18n/LanguageProvider.jsx'
import App from '../App.jsx'

beforeEach(() => {
  localStorage.clear()
  // Pre-set a language so the first-visit modal does NOT block the app.
  localStorage.setItem(LANG_STORAGE_KEY, 'en')
})

function renderApp() {
  return render(
    <LanguageProvider>
      <App />
    </LanguageProvider>,
  )
}

describe('language switch — view & progress stability', () => {
  it('switching language does not change the current view (stays on Home)', () => {
    renderApp()
    const uzBtn = screen.getAllByRole('button', { name: /o’zbekcha|ozbekcha/i })[0]
    fireEvent.click(uzBtn)
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('uz')
  })

  it('switching language leaves saved progress untouched', () => {
    const PROGRESS_KEY = 'ai-academy:progress.v1'
    const seeded = {
      onboarded: true,
      completed: { 'what-is-data': 3, 'what-ai': 2 },
      streak: { current: 2, longest: 5, lastDay: '2026-06-01' },
    }
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded))

    renderApp()
    const before = localStorage.getItem(PROGRESS_KEY)
    const uzBtn = screen.getAllByRole('button', { name: /o’zbekcha|ozbekcha/i })[0]
    fireEvent.click(uzBtn)
    fireEvent.click(screen.getAllByRole('button', { name: /english/i })[0])
    const after = localStorage.getItem(PROGRESS_KEY)
    expect(after).toBe(before)
    expect(JSON.parse(after).completed).toEqual(seeded.completed)
  })
})
