import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from './LanguageProvider.jsx'
import Catalog from '../components/Catalog.jsx'
import { LEVELS } from '../data/tracks.js'
import { __resetCurriculumUzForTest } from './loadCurriculumUz.js'

/*
 * End-to-end check that the curriculum metadata (track + lesson titles) renders
 * in the active locale via useLocalizedTracks, while stable lesson IDs (the
 * progress keys) are never translated.
 */
beforeEach(() => {
  localStorage.clear()
  __resetCurriculumUzForTest()
})

const progress = {
  completed: {},
  completedCount: 0,
  isUnlocked: (i) => i === 0,
  starsFor: () => 0,
}

function renderOverview() {
  return render(
    <LanguageProvider>
      <Catalog progress={progress} currentIndex={0} onOpenLevel={() => {}} />
    </LanguageProvider>,
  )
}

describe('curriculum localized render', () => {
  it('shows English track + lesson titles under en', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en')
    renderOverview()
    expect(screen.getAllByText('Foundations').length).toBeGreaterThan(0)
    expect(screen.getAllByText('What Is Data?').length).toBeGreaterThan(0)
  })

  it('shows Uzbek track + lesson titles under uz, with stable lesson ids unchanged', async () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'uz')
    renderOverview()
    // The uz corpus is code-split: titles render in English first, then swap to
    // Uzbek once the chunk loads. findBy* waits for that re-render.
    expect((await screen.findAllByText('Asoslar')).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Ma’lumot nima?').length).toBeGreaterThan(0)
    // ID stability: progress keys are ids, never translated.
    expect(LEVELS[0].id).toBe('what-is-data')
  })
})
