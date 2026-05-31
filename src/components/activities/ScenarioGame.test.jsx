import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ScenarioGame from './ScenarioGame.jsx'

const single = {
  scenario:
    'Tiny dataset (300 images) that is very similar to ImageNet. What should you do?',
  choices: [
    { id: 'a', label: 'Train from scratch', correct: false, why: 'Too little data; it will overfit.' },
    { id: 'b', label: 'Freeze the backbone, train only the new head', correct: true, why: 'Small + similar → reuse features, train the head.' },
    { id: 'c', label: 'Fine-tune every layer with a high learning rate', correct: false, why: 'High LR on tiny data causes catastrophic forgetting.' },
  ],
}

const multi = {
  scenario: 'Pick every failure mode present in this break-it study.',
  multi: true,
  choices: [
    { id: 's', label: 'Spurious feature', correct: true, why: 'Model keyed on the snowy background.' },
    { id: 'o', label: 'Occlusion', correct: true, why: 'The object is half hidden.' },
    { id: 'd', label: 'Distribution shift', correct: false, why: 'Same domain as training here.' },
    { id: 'x', label: 'Adversarial', correct: false, why: 'No crafted perturbation present.' },
  ],
}

describe('ScenarioGame', () => {
  it('single-best: scores the correct choice and calls onResult exactly once', () => {
    const onResult = vi.fn()
    render(<ScenarioGame data={single} onResult={onResult} />)

    fireEvent.click(screen.getByRole('radio', { name: /freeze the backbone/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('single-best: wrong choice scores incorrect', () => {
    const onResult = vi.fn()
    render(<ScenarioGame data={single} onResult={onResult} />)

    fireEvent.click(screen.getByRole('radio', { name: /train from scratch/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: false })
  })

  it('multi: requires the EXACT correct set', () => {
    const onResult = vi.fn()
    render(<ScenarioGame data={multi} onResult={onResult} />)

    fireEvent.click(screen.getByRole('checkbox', { name: /spurious feature/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /occlusion/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('multi: a superset of the correct answers scores incorrect', () => {
    const onResult = vi.fn()
    render(<ScenarioGame data={multi} onResult={onResult} />)

    fireEvent.click(screen.getByRole('checkbox', { name: /spurious feature/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /occlusion/i }))
    fireEvent.click(screen.getByRole('checkbox', { name: /adversarial/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: false })
  })

  it('Check is disabled until something is selected and cannot fire twice', () => {
    const onResult = vi.fn()
    render(<ScenarioGame data={single} onResult={onResult} />)

    const check = screen.getByRole('button', { name: /check answer/i })
    expect(check).toBeDisabled()

    fireEvent.click(screen.getByRole('radio', { name: /freeze the backbone/i }))
    fireEvent.click(check)
    fireEvent.click(check) // second click after submit must be ignored

    expect(onResult).toHaveBeenCalledTimes(1)
  })
})
