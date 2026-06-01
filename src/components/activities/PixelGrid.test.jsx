import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../../test/renderWithLang.jsx'
import PixelGrid from './PixelGrid.jsx'

const data = {
  // 2×2 image: top-left pure red, others mixed.
  pixels: [
    [
      [255, 0, 0],
      [0, 255, 0],
    ],
    [
      [0, 0, 255],
      [200, 200, 200],
    ],
  ],
  channels: ['r', 'g', 'b'],
  check: {
    question: 'The top-left pixel is (255, 0, 0) in RGB order. What color is it?',
    choices: [
      { id: 'red', label: 'Pure red', correct: true, why: 'Red maxed, green and blue off.' },
      { id: 'blue', label: 'Pure blue', correct: false, why: 'That would be (0, 0, 255).' },
      { id: 'white', label: 'White', correct: false, why: 'White needs all three maxed.' },
    ],
  },
}

describe('PixelGrid', () => {
  it('picking the correct prediction scores correct, exactly once', () => {
    const onResult = vi.fn()
    render(<PixelGrid data={data} onResult={onResult} />)

    fireEvent.click(screen.getByRole('radio', { name: /pure red/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: true })
  })

  it('a wrong prediction scores incorrect', () => {
    const onResult = vi.fn()
    render(<PixelGrid data={data} onResult={onResult} />)

    fireEvent.click(screen.getByRole('radio', { name: /pure blue/i }))
    fireEvent.click(screen.getByRole('button', { name: /check answer/i }))

    expect(onResult).toHaveBeenCalledTimes(1)
    expect(onResult).toHaveBeenCalledWith({ correct: false })
  })

  it('clicking a pixel reveals its R/G/B values in the read-out', () => {
    render(<PixelGrid data={data} onResult={vi.fn()} />)

    // top-left pixel exposes its values in its accessible name
    fireEvent.click(screen.getByRole('button', { name: /Pixel row 1, column 1: R 255, G 0, B 0/i }))

    // read-out now shows the channel numbers
    expect(screen.getByText('R 255')).toBeInTheDocument()
    expect(screen.getByText('G 0')).toBeInTheDocument()
    expect(screen.getByText('B 0')).toBeInTheDocument()
  })

  it('channel toggles flip their pressed state (image contribution on/off)', () => {
    render(<PixelGrid data={data} onResult={vi.fn()} />)

    const green = screen.getByRole('button', { name: /^Green$/i })
    expect(green).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(green)
    expect(green).toHaveAttribute('aria-pressed', 'false')
  })

  it('Check is disabled until a choice is picked and cannot fire twice', () => {
    const onResult = vi.fn()
    render(<PixelGrid data={data} onResult={onResult} />)

    const checkBtn = screen.getByRole('button', { name: /check answer/i })
    expect(checkBtn).toBeDisabled()

    fireEvent.click(screen.getByRole('radio', { name: /pure red/i }))
    fireEvent.click(checkBtn)
    fireEvent.click(checkBtn) // ignored after submit

    expect(onResult).toHaveBeenCalledTimes(1)
  })
})
