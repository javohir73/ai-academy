import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/renderWithLang.jsx'
import FeatureMap from './FeatureMap.jsx'

const depthData = {
  mode: 'depth',
  layers: [
    {
      id: 'early',
      label: 'Early',
      caption: 'Edges and color blobs — generic, present in any image.',
      grid: [
        [9, 0, 0],
        [9, 0, 0],
        [9, 0, 0],
      ],
    },
    {
      id: 'mid',
      label: 'Mid',
      caption: 'Textures and small motifs.',
      grid: [
        [5, 5, 5],
        [0, 9, 0],
        [5, 5, 5],
      ],
    },
    {
      id: 'deep',
      label: 'Deep',
      caption: 'A whole object part — class-specific.',
      grid: [
        [0, 9, 0],
        [9, 9, 9],
        [0, 9, 0],
      ],
    },
  ],
  check: {
    question: 'Would a FIRST-layer map fire specifically on "dog face"?',
    choices: [
      { id: 'no', label: 'No — early layers see generic edges/colors', correct: true, why: 'Specificity grows with depth.' },
      { id: 'yes', label: 'Yes — every layer is equally specific', correct: false, why: 'Early layers only see raw pixels.' },
    ],
  },
}

const advData = {
  mode: 'adversarial',
  base: [
    [4, 4, 4],
    [4, 4, 4],
    [4, 4, 4],
  ],
  trueLabel: 'panda',
  wrongLabel: 'gibbon',
  maxEps: 8,
  flipAt: 5,
  check: {
    question: 'What does the demo show?',
    choices: [
      { id: 'flip', label: 'A tiny invisible change flips a confident prediction', correct: true, why: 'Aligned perturbations accumulate.' },
      { id: 'visible', label: 'The image becomes obviously different', correct: false, why: 'The change stays imperceptible.' },
    ],
  },
}

describe('FeatureMap — depth mode', () => {
  it('switching depth tabs swaps the caption', () => {
    render(<FeatureMap data={depthData} onResult={vi.fn()} />)

    expect(screen.getByText(/generic, present in any image/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: /^Deep$/i }))
    expect(screen.getByText(/whole object part/i)).toBeInTheDocument()
  })

  it('correct self-check scores correct, exactly once', () => {
    const onResult = vi.fn()
    render(<FeatureMap data={depthData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('radio', { name: /generic edges\/colors/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('wrong self-check scores incorrect', () => {
    const onResult = vi.fn()
    render(<FeatureMap data={depthData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('radio', { name: /equally specific/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledWith({ correct: false })
  })
})

describe('FeatureMap — adversarial mode', () => {
  it('the prediction flips to the wrong label once ε crosses the threshold', () => {
    render(<FeatureMap data={advData} onResult={vi.fn()} />)

    // ε = 0 → true label
    expect(screen.getByText('panda')).toBeInTheDocument()

    const slider = screen.getByLabelText(/perturbation strength epsilon/i)
    fireEvent.change(slider, { target: { value: '6' } }) // past flipAt = 5
    expect(screen.getByText('gibbon')).toBeInTheDocument()
  })

  it('correct self-check scores correct, exactly once; check disabled until picked', () => {
    const onResult = vi.fn()
    render(<FeatureMap data={advData} onResult={onResult} />)

    const checkBtn = screen.getByRole('button', { name: /check answer/i })
    expect(checkBtn).toBeDisabled()

    fireEvent.click(screen.getByRole('radio', { name: /flips a confident prediction/i }))
    fireEvent.click(checkBtn)
    fireEvent.click(checkBtn) // ignored after submit

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })
})
