import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/renderWithLang.jsx'
import ShapeCalc, { convOutput, paramExplosion, flattenSize } from './ShapeCalc.jsx'

describe('ShapeCalc formulas (pure helpers)', () => {
  it('convOutput: valid whole-number result', () => {
    // (32 − 5 + 0)/1 + 1 = 28
    expect(convOutput({ W: 32, F: 5, P: 0, S: 1 })).toEqual({ valid: true, size: 28 })
    // 'same' padding keeps size: (32 − 5 + 4)/1 + 1 = 32
    expect(convOutput({ W: 32, F: 5, P: 2, S: 1 })).toEqual({ valid: true, size: 32 })
  })

  it('convOutput: non-divisible stride is invalid', () => {
    // (10 − 3 + 0)/2 + 1 = 4.5 → invalid
    expect(convOutput({ W: 10, F: 3, P: 0, S: 2 })).toEqual({ valid: false })
  })

  it('paramExplosion: fc, conv, and ratio', () => {
    const cfg = { H: 200, W: 200, C: 3, kernel: 3 }
    expect(paramExplosion({ ...cfg, ask: 'fc' })).toBe(120000)
    expect(paramExplosion({ ...cfg, ask: 'conv' })).toBe(27)
    expect(paramExplosion({ ...cfg, ask: 'ratio' })).toBe(4444) // round(120000/27)
  })

  it('flattenSize: C·H·W', () => {
    expect(flattenSize({ c: 64, h: 8, w: 8 })).toBe(4096)
  })
})

describe('ShapeCalc component', () => {
  it('conv-output: typing the correct side length scores correct, once', () => {
    const onResult = vi.fn()
    render(<ShapeCalc data={{ mode: 'conv-output', W: 32, F: 5, P: 0, S: 1 }} onResult={onResult} />)

    fireEvent.change(screen.getByLabelText(/your answer/i), { target: { value: '28' } })
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('conv-output: a wrong number scores incorrect', () => {
    const onResult = vi.fn()
    render(<ShapeCalc data={{ mode: 'conv-output', W: 32, F: 5, P: 0, S: 1 }} onResult={onResult} />)

    fireEvent.change(screen.getByLabelText(/your answer/i), { target: { value: '27' } })
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledWith({ correct: false })
  })

  it('conv-output: ticking "invalid" is correct for a non-divisible config', () => {
    const onResult = vi.fn()
    render(<ShapeCalc data={{ mode: 'conv-output', W: 10, F: 3, P: 0, S: 2 }} onResult={onResult} />)

    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('param-explosion (ratio): correct ratio scores correct', () => {
    const onResult = vi.fn()
    render(
      <ShapeCalc
        data={{ mode: 'param-explosion', H: 200, W: 200, C: 3, kernel: 3, ask: 'ratio' }}
        onResult={onResult}
      />,
    )

    fireEvent.change(screen.getByLabelText(/your answer/i), { target: { value: '4444' } })
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('flatten: correct C·H·W scores correct', () => {
    const onResult = vi.fn()
    render(<ShapeCalc data={{ mode: 'flatten', shape: { c: 64, h: 8, w: 8 } }} onResult={onResult} />)

    fireEvent.change(screen.getByLabelText(/your answer/i), { target: { value: '4096' } })
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('Check is disabled until a value is entered and cannot fire twice', () => {
    const onResult = vi.fn()
    render(<ShapeCalc data={{ mode: 'flatten', shape: { c: 16, h: 16, w: 16 } }} onResult={onResult} />)

    const checkBtn = screen.getByRole('button', { name: /check answer/i })
    expect(checkBtn).toBeDisabled()

    fireEvent.change(screen.getByLabelText(/your answer/i), { target: { value: '4096' } })
    fireEvent.click(checkBtn)
    fireEvent.click(checkBtn) // ignored after submit

    expect(onResult).toHaveBeenCalledTimes(1)
  })
})
