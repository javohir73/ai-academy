import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'
import { LanguageProvider, LANG_STORAGE_KEY } from './i18n/LanguageProvider.jsx'
import { LEVELS } from './data/tracks.js'

/*
 * Deep-link routing + the progress-aware home. The URL is the single source of
 * navigation truth, but '/' resolves to marketing (new visitor) or the
 * dashboard (returning learner). completedCount is read synchronously from
 * localStorage on first paint, so a returning learner's dashboard renders
 * immediately with no marketing flash.
 */
const PROGRESS_KEY = 'ai-academy:progress.v1'

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem(LANG_STORAGE_KEY, 'en') // skip the first-visit modal
})

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </MemoryRouter>,
  )
}

function seedProgress() {
  // One completed lesson → hasProgress is true on first paint (synchronous read).
  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({
      onboarded: true,
      completed: { [LEVELS[0].id]: 3 },
      streak: { current: 1, longest: 1, lastDay: null },
    }),
  )
}

describe('URL routing', () => {
  it('/ renders marketing Home for a new visitor (no progress)', () => {
    renderAt('/')
    expect(document.querySelector('.home__nav')).toBeInTheDocument()
  })

  it('/ renders the Dashboard for a returning learner (has progress)', () => {
    seedProgress()
    renderAt('/')
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    expect(document.querySelector('.dash')).toBeInTheDocument()
  })

  it('/dashboard redirects to / (no second canonical URL)', async () => {
    seedProgress()
    renderAt('/dashboard')
    // The redirect lands on / which (with progress) shows the dashboard.
    await waitFor(() => expect(document.querySelector('.dash')).toBeInTheDocument())
  })

  it('/learn renders the Catalog (browse view), not Home', () => {
    renderAt('/learn')
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    expect(document.querySelector('.layout')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Curriculum' })).toBeInTheDocument()
  })

  it('/learn/:lessonId deep-links straight into that lesson', () => {
    // The first lesson is always unlocked, so it renders rather than redirecting.
    const first = LEVELS[0].id
    renderAt(`/learn/${first}`)
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    // LevelView's crumb is a lesson-only landmark; the catalog has none.
    expect(document.querySelector('.lesson-head__crumb')).toBeInTheDocument()
  })

  it('a deep link to a LOCKED lesson redirects to the catalog', () => {
    // A late lesson is locked for a fresh learner → falls back to the catalog.
    const locked = LEVELS[LEVELS.length - 1].id
    renderAt(`/learn/${locked}`)
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    expect(document.querySelector('.layout')).toBeInTheDocument()
  })

  it('an unknown lesson id falls back to the catalog, never crashes', () => {
    renderAt('/learn/this-lesson-does-not-exist')
    expect(document.querySelector('.layout')).toBeInTheDocument()
  })
})
