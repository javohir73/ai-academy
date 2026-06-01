import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from './LanguageProvider.jsx'
import LevelView from '../components/LevelView.jsx'
import { TRACKS } from '../data/tracks.js'
import { localizeTracks } from './localizeTracks.js'
import { CURRICULUM_UZ } from './curriculum.uz.js'

/*
 * Phase C1: the localized lesson BODY (explanation, etc.) renders for L0/L1
 * lessons under uz, English under en. We feed LevelView the resolved level the
 * way App does (App passes localizedLevels[levelIndex]).
 */
function levelFor(id, locale) {
  const tracks = locale === 'uz' ? localizeTracks(TRACKS, 'uz', CURRICULUM_UZ) : TRACKS
  return tracks.flatMap((t) => t.levels).find((l) => l.id === id)
}

beforeEach(() => localStorage.clear())

function renderLesson(level, locale) {
  localStorage.setItem(LANG_STORAGE_KEY, locale)
  return render(
    <LanguageProvider>
      <LevelView level={level} levelIndex={0} totalLevels={37} onComplete={() => {}} onBack={() => {}} onNext={() => {}} />
    </LanguageProvider>,
  )
}

describe('Phase C1 — localized lesson body render', () => {
  it('renders the English what-ai explanation under en', () => {
    renderLesson(levelFor('what-ai', 'en'), 'en')
    expect(
      screen.getByText(/Artificial Intelligence \(AI\) is when a computer/i),
    ).toBeInTheDocument()
  })

  it('renders the Uzbek what-ai explanation under uz', () => {
    renderLesson(levelFor('what-ai', 'uz'), 'uz')
    expect(
      screen.getByText(/bu kompyuter odatda inson aqlini talab qiladigan/i),
    ).toBeInTheDocument()
  })

  it('localizes the ai-ethics explanation under uz while keeping the lesson id stable', () => {
    const uzLevel = levelFor('ai-ethics', 'uz')
    expect(uzLevel.id).toBe('ai-ethics') // id never translated
    renderLesson(uzLevel, 'uz')
    expect(screen.getByText(/AI kuchli, shuning uchun undan adolatli/i)).toBeInTheDocument()
  })
})
