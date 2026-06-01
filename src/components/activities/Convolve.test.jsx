import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/renderWithLang.jsx'
import Convolve from './Convolve.jsx'

// kernel mode: 3x3 patch starting at (1,1), sharpen-ish kernel; the authored
// `correct` choice is the source of truth for the answer.
const kernelData = {
  mode: 'kernel',
  kernelName: 'Sharpen',
  input: [
    [0, 0, 0, 0, 0],
    [0, 10, 20, 30, 0],
    [0, 40, 50, 60, 0],
    [0, 70, 80, 90, 0],
    [0, 0, 0, 0, 0],
  ],
  kernel: [
    [0, -1, 0],
    [-1, 5, -1],
    [0, -1, 0],
  ],
  targetCell: { r: 1, c: 1 },
  choices: [
    { id: 'a', label: '50', correct: false, why: 'That is just the center value, untouched.' },
    { id: 'b', label: '70', correct: true, why: '5·50 − 20 − 40 − 60 − 80 = 50… (authored value).' },
    { id: 'c', label: '0', correct: false, why: 'Not a zero result here.' },
  ],
}

// pool mode: 2x2 max-pool over region starting at (0,0).
const poolData = {
  mode: 'pool',
  op: 'max',
  input: [
    [1, 3, 2, 4],
    [5, 6, 7, 8],
    [9, 2, 1, 0],
    [4, 3, 2, 1],
  ],
  targetCell: { r: 0, c: 0 },
  choices: [
    { id: 'a', label: '6', correct: true, why: 'Max of {1,3,5,6} = 6.' },
    { id: 'b', label: '3', correct: false, why: 'That is not the largest in the window.' },
    { id: 'c', label: '15', correct: false, why: 'That would be the sum, not max.' },
  ],
}

describe('Convolve', () => {
  it('kernel mode: picking the authored-correct number scores correct, once', () => {
    const onResult = vi.fn()
    render(<Convolve data={kernelData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('radio', { name: /70/ }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('kernel mode: a wrong number scores incorrect', () => {
    const onResult = vi.fn()
    render(<Convolve data={kernelData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('radio', { name: /^50$/ }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: false })
  })

  it('pool mode (max): picking the max scores correct', () => {
    const onResult = vi.fn()
    render(<Convolve data={poolData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('radio', { name: /^6$/ }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('Check is disabled until a choice is picked and cannot fire twice', () => {
    const onResult = vi.fn()
    render(<Convolve data={poolData} onResult={onResult} />)

    const check = screen.getByRole('button', { name: /check answer/i })
    expect(check).toBeDisabled()

    fireEvent.click(screen.getByRole('radio', { name: /^6$/ }))
    fireEvent.click(check)
    fireEvent.click(check) // ignored after submit

    expect(onResult).toHaveBeenCalledTimes(1)
  })

  it('renders the input grid values and an accessible window label', () => {
    render(<Convolve data={poolData} onResult={vi.fn()} />)
    // sliding-window region described for screen readers
    expect(
      screen.getByRole('img', { name: /window covers rows 1 to 2, columns 1 to 2/i }),
    ).toBeInTheDocument()
  })
})
