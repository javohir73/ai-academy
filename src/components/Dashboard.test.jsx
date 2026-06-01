import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import Dashboard from './Dashboard.jsx'
import { LEVELS } from '../data/tracks.js'

/* Mirrors useProgress()'s return shape, driven by a { lessonId: stars } map. */
function mockProgress(completed = {}, streak = { current: 0, longest: 0, activeToday: false }) {
  return {
    completed,
    starsFor: (id) => completed[id] ?? 0,
    isUnlocked: (index) => index <= 0 || Boolean(completed[LEVELS[index - 1]?.id]),
    completedCount: Object.keys(completed).length,
    totalStars: Object.values(completed).reduce((a, b) => a + b, 0),
    streak,
    syncState: 'idle',
  }
}

const noop = () => {}

function renderDash(progress, props = {}) {
  return render(
    <Dashboard
      progress={progress}
      onOpenLevel={props.onOpenLevel ?? noop}
      onOverview={props.onOverview ?? noop}
      onHome={props.onHome ?? noop}
      user={props.user ?? null}
      configured={props.configured ?? false}
      syncState={props.syncState ?? 'idle'}
    />,
  )
}

describe('Dashboard — empty / new user', () => {
  it('renders an intentional welcome + "Start learning" hero pointing at lesson 0', () => {
    const onOpenLevel = vi.fn()
    renderDash(mockProgress({}), { onOpenLevel })

    expect(screen.getByText(/Welcome to AI Academy/i)).toBeInTheDocument()
    // hero is framed as Start (not Continue) for a brand-new learner
    const hero = screen.getByRole('button', { name: /Start: .*/i })
    fireEvent.click(hero)
    expect(onOpenLevel).toHaveBeenCalledWith(0)
  })

  it('shows zeroed stats and a friendly empty review message', () => {
    renderDash(mockProgress({}))
    expect(screen.getByText(/Lessons completed/i)).toBeInTheDocument()
    expect(screen.getByText(/show up here to revisit/i)).toBeInTheDocument()
  })

  it('renders all six level cards (L0–L5)', () => {
    renderDash(mockProgress({}))
    for (const tag of ['Level 0', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5']) {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0)
    }
  })
})

describe('Dashboard — anonymous with progress', () => {
  const progress = mockProgress(
    { 'what-is-data': 3, 'what-ai': 2, 'ai-ethics': 1 },
    { current: 2, longest: 5, activeToday: true },
  )

  it('renders "Welcome back" and the continue card (not start)', () => {
    renderDash(progress)
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Continue: .*/i })).toBeInTheDocument()
  })

  it('shows the streak and completed counts from progress', () => {
    renderDash(progress)
    // current streak value 2 appears in a stat tile
    expect(screen.getByText('Current streak')).toBeInTheDocument()
    expect(screen.getByText('Longest streak')).toBeInTheDocument()
  })

  it('lists low-star lessons under review and opens one on click', () => {
    const onOpenLevel = vi.fn()
    renderDash(progress, { onOpenLevel })
    // ai-ethics (1 star) is the weakest → appears in review
    const review = screen.getByLabelText(/Topics to review/i)
    const row = within(review).getByText('Real-World AI Ethics')
    fireEvent.click(row)
    expect(onOpenLevel).toHaveBeenCalled()
  })

  it('shows "Saved on this device" when not configured', () => {
    renderDash(progress, { configured: false })
    expect(screen.getByText(/Saved on this device/i)).toBeInTheDocument()
  })
})

describe('Dashboard — signed-in (mock user)', () => {
  it('shows a synced account line and the user is reflected subtly', () => {
    const progress = mockProgress({ 'what-is-data': 3 }, { current: 1, longest: 1, activeToday: true })
    renderDash(progress, {
      user: { id: 'u1', email: 'learner@example.com' },
      configured: true,
      syncState: 'saved',
    })
    expect(screen.getByText(/Synced to your account/i)).toBeInTheDocument()
  })
})

describe('Dashboard — course complete', () => {
  it('shows the completed hero and no recommendation', () => {
    const all = Object.fromEntries(LEVELS.map((l) => [l.id, 3]))
    renderDash(mockProgress(all))
    expect(screen.getByText(/Course complete/i)).toBeInTheDocument()
    expect(screen.getByText(/completed the course/i)).toBeInTheDocument()
  })
})
