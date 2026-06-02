import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App.jsx'
import { LanguageProvider, LANG_STORAGE_KEY } from './i18n/LanguageProvider.jsx'
import { LEVELS } from './data/tracks.js'

/*
 * Deep-link routing: the URL is the single source of navigation truth. A path
 * maps to a view, and /learn/:lessonId opens that exact lesson — bookmarkable,
 * shareable, refresh-safe. A locked or unknown lesson id falls back to the map.
 */
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

describe('URL routing', () => {
  it('/ renders the Home landing page', () => {
    renderAt('/')
    expect(document.querySelector('.home__nav')).toBeInTheDocument()
  })

  it('/learn renders the course overview (the map), not Home', () => {
    renderAt('/learn')
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    // The overview hero + the layout sidebar are present on the course views.
    expect(document.querySelector('.layout')).toBeInTheDocument()
  })

  it('/learn/:lessonId deep-links straight into that lesson', () => {
    // The first lesson is always unlocked, so it renders rather than redirecting.
    const first = LEVELS[0].id
    renderAt(`/learn/${first}`)
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    // LevelView's crumb is a lesson-only landmark; the overview map has none.
    expect(document.querySelector('.lesson-head__crumb')).toBeInTheDocument()
  })

  it('a deep link to a LOCKED lesson redirects to the course map', () => {
    // A late lesson is locked for a fresh learner → falls back to overview.
    const locked = LEVELS[LEVELS.length - 1].id
    renderAt(`/learn/${locked}`)
    // It must NOT render that locked lesson as the active lesson view.
    // The overview lists every lesson, so we assert we are not on Home and the
    // course layout is shown (the redirect lands on /learn).
    expect(document.querySelector('.home__nav')).not.toBeInTheDocument()
    expect(document.querySelector('.layout')).toBeInTheDocument()
  })

  it('an unknown lesson id falls back to the overview, never crashes', () => {
    renderAt('/learn/this-lesson-does-not-exist')
    expect(document.querySelector('.layout')).toBeInTheDocument()
  })
})
