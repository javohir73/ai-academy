import { describe, it, expect, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '../test/renderWithLang.jsx'
import Catalog from './Catalog.jsx'
import { LEVELS } from '../data/tracks.js'

const progressStub = {
  completedCount: 0,
  completed: {},
  isUnlocked: (i) => i === 0,
  starsFor: () => 0,
}

beforeEach(() => localStorage.clear())

describe('Catalog', () => {
  it('renders the curriculum heading and lesson cards', () => {
    render(<Catalog progress={progressStub} currentIndex={0} onOpenLevel={() => {}} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Curriculum' })).toBeInTheDocument()
    expect(screen.getByText(LEVELS[0].title, { exact: false })).toBeInTheDocument()
  })

  it('does NOT render the old resume hero CTA', () => {
    render(<Catalog progress={progressStub} currentIndex={0} onOpenLevel={() => {}} />)
    expect(screen.queryByText('Start the course')).not.toBeInTheDocument()
    expect(screen.queryByText('Continue learning')).not.toBeInTheDocument()
    expect(screen.queryByText('Review from the start')).not.toBeInTheDocument()
  })
})
