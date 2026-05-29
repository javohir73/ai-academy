import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('../../utils/pyodideService.js', () => ({
  ensureLoaded: vi.fn().mockResolvedValue({}),
  runCell: vi.fn(),
  runTests: vi.fn(),
  resetNamespace: vi.fn().mockResolvedValue(undefined),
}))

import NotebookGame from './NotebookGame.jsx'
import * as svc from '../../utils/pyodideService.js'

const baseData = {
  starter: 'acc = 0.9',
  packages: [],
  tests: 'assert acc > 0.8',
  hints: ['Think about the threshold.'],
}

describe('NotebookGame', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    svc.ensureLoaded.mockResolvedValue({})
    svc.resetNamespace.mockResolvedValue(undefined)
  })

  it('seeds the editor with starter code', () => {
    render(<NotebookGame data={baseData} onResult={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('acc = 0.9')
  })

  it('reports correct when the code runs and all tests pass', async () => {
    svc.runCell.mockResolvedValue({ ok: true, stdout: '', error: null })
    svc.runTests.mockResolvedValue({ passed: true, message: '' })
    const onResult = vi.fn()
    render(<NotebookGame data={baseData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('button', { name: /run/i }))

    await waitFor(() => expect(onResult).toHaveBeenCalledWith({ correct: true }))
  })

  it('reports incorrect and shows a hint when tests fail', async () => {
    svc.runCell.mockResolvedValue({ ok: true, stdout: '', error: null })
    svc.runTests.mockResolvedValue({ passed: false, message: 'AssertionError' })
    const onResult = vi.fn()
    render(<NotebookGame data={baseData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('button', { name: /run/i }))

    await waitFor(() => expect(onResult).toHaveBeenCalledWith({ correct: false }))
    expect(screen.getByText(/think about the threshold/i)).toBeInTheDocument()
  })

  it('shows the runtime error in the output panel when code raises', async () => {
    svc.runCell.mockResolvedValue({ ok: false, stdout: '', error: 'NameError: x' })
    svc.runTests.mockResolvedValue({ passed: false, message: '' })
    const onResult = vi.fn()
    render(<NotebookGame data={baseData} onResult={onResult} />)

    fireEvent.click(screen.getByRole('button', { name: /run/i }))

    await waitFor(() => expect(screen.getByText(/NameError: x/)).toBeInTheDocument())
    expect(onResult).toHaveBeenCalledWith({ correct: false })
  })

  it('shows an error with retry when the environment fails to load', async () => {
    svc.ensureLoaded.mockRejectedValue(new Error('pyodide-script-failed'))
    render(<NotebookGame data={baseData} onResult={() => {}} />)
    await waitFor(() =>
      expect(screen.getByText(/couldn’t load the python environment/i)).toBeInTheDocument(),
    )
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })
})
