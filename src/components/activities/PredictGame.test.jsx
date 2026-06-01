import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/renderWithLang.jsx'
import PredictGame from './PredictGame.jsx'

const data = {
  base: 20,
  unit: '%',
  target: { min: 85, label: 'Reach 85.' },
  inputs: [
    { id: 'study', label: 'Hours studied', min: 0, max: 10, step: 1, start: 2, weight: 7 },
    { id: 'sleep', label: 'Hours of sleep', min: 0, max: 10, step: 1, start: 4, weight: 3 },
    { id: 'phone', label: 'Hours on phone', min: 0, max: 10, step: 1, start: 8, weight: -4 },
  ],
}

describe('PredictGame', () => {
  it('lets learners adjust numeric inputs with stepper buttons', () => {
    const onResult = vi.fn()
    render(<PredictGame data={data} onResult={onResult} />)

    for (let i = 0; i < 8; i++) fireEvent.click(screen.getByRole('button', { name: 'Increase Hours studied' }))
    for (let i = 0; i < 6; i++) fireEvent.click(screen.getByRole('button', { name: 'Increase Hours of sleep' }))
    for (let i = 0; i < 8; i++) fireEvent.click(screen.getByRole('button', { name: 'Decrease Hours on phone' }))

    expect(screen.getByText('100%')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /lock in prediction/i }))
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })
})
