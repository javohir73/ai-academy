import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CNNBuilder from './CNNBuilder.jsx'

const data = {
  targetPrompt: 'Assemble one conv block plus a classifier head.',
  tiles: [
    { id: 'conv', label: 'Conv2d' },
    { id: 'relu', label: 'ReLU' },
    { id: 'pool', label: 'MaxPool2d' },
    { id: 'flatten', label: 'Flatten' },
    { id: 'fc', label: 'Linear → classes' },
  ],
  correct: ['conv', 'relu', 'pool', 'flatten', 'fc'],
  mismatch: {
    fc: 'A Linear head needs a Flatten before it — you cannot feed a 4-D volume into nn.Linear.',
  },
}

function build(order) {
  for (const label of order) {
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${label}`, 'i') }))
  }
}

describe('CNNBuilder', () => {
  it('placing layers in the canonical order scores correct, exactly once', () => {
    const onResult = vi.fn()
    render(<CNNBuilder data={data} onResult={onResult} />)

    build(['Conv2d', 'ReLU', 'MaxPool2d', 'Flatten', 'Linear → classes'])
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('a wrong order scores incorrect and explains the first mistake', () => {
    const onResult = vi.fn()
    render(<CNNBuilder data={data} onResult={onResult} />)

    // Flatten and FC swapped: ...pool, fc, flatten → first wrong at the FC step
    build(['Conv2d', 'ReLU', 'MaxPool2d', 'Linear → classes', 'Flatten'])
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: false })
    expect(screen.getByText(/needs a Flatten before it/i)).toBeInTheDocument()
  })

  it('an incomplete pipeline scores incorrect (missing layer)', () => {
    const onResult = vi.fn()
    render(<CNNBuilder data={data} onResult={onResult} />)

    build(['Conv2d', 'ReLU']) // stops short
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledWith({ correct: false })
  })

  it('tapping a placed layer removes it and everything after it', () => {
    render(<CNNBuilder data={data} onResult={vi.fn()} />)

    build(['Conv2d', 'ReLU', 'MaxPool2d'])
    // remove from the ReLU step (step 2) → Conv stays, ReLU+Pool gone, both reappear in palette
    fireEvent.click(screen.getByRole('button', { name: /ReLU: step 2, tap to remove/i }))

    // ReLU and MaxPool2d are addable again (back in the palette)
    expect(screen.getByRole('button', { name: /^ReLU$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^MaxPool2d$/i })).toBeInTheDocument()
  })

  it('grades by label, so interchangeable same-label tiles (e.g. repeated ReLU) are accepted in any assignment', () => {
    // Two distinct tile ids share the label "ReLU"; the canonical order uses
    // both. A learner can only see labels, so any tap order producing the right
    // LABEL sequence must score correct — even if the underlying ids differ
    // from the literal `correct` id list.
    const repeated = {
      tiles: [
        { id: 'conv', label: 'Conv2d' },
        { id: 'relu1', label: 'ReLU' },
        { id: 'relu2', label: 'ReLU' },
        { id: 'fc', label: 'Linear → classes' },
      ],
      correct: ['conv', 'relu1', 'fc', 'relu2'], // label order: Conv2d, ReLU, Linear, ReLU
    }
    const onResult = vi.fn()
    render(<CNNBuilder data={repeated} onResult={onResult} />)

    // Build the LABEL order Conv2d → ReLU → Linear → ReLU. The engine will pick
    // whichever physical ReLU tile is available; ids needn't match `correct`.
    fireEvent.click(screen.getByRole('button', { name: /^Conv2d/i }))
    fireEvent.click(screen.getAllByRole('button', { name: /^ReLU/i })[0])
    fireEvent.click(screen.getByRole('button', { name: /^Linear → classes/i }))
    fireEvent.click(screen.getAllByRole('button', { name: /^ReLU/i })[0])
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('Check is disabled with an empty pipeline and cannot fire twice', () => {
    const onResult = vi.fn()
    render(<CNNBuilder data={data} onResult={onResult} />)

    const checkBtn = screen.getByRole('button', { name: /check answer/i })
    expect(checkBtn).toBeDisabled()

    build(['Conv2d', 'ReLU', 'MaxPool2d', 'Flatten', 'Linear → classes'])
    fireEvent.click(checkBtn)
    fireEvent.click(checkBtn) // ignored after submit

    expect(onResult).toHaveBeenCalledTimes(1)
  })
})
