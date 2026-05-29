import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('../utils/pyodideService.js', () => ({
  ensureLoaded: vi.fn().mockResolvedValue({}),
  runCell: vi.fn(),
  runTests: vi.fn(),
  resetNamespace: vi.fn().mockResolvedValue(undefined),
}))

import ActivityShell from './ActivityShell.jsx'
import * as svc from '../utils/pyodideService.js'

const notebookActivity = {
  type: 'notebook',
  data: {
    starter: 'answer = 1',
    packages: [],
    tests: 'assert answer == 2',
    hints: ['Change the answer.'],
  },
  feedback: {
    correct: 'Nice work.',
    incorrect: 'Try again.',
  },
}

describe('ActivityShell notebook retries', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    svc.ensureLoaded.mockResolvedValue({})
    svc.resetNamespace.mockResolvedValue(undefined)
  })

  it('keeps learner code after a failed notebook attempt', async () => {
    svc.runCell.mockResolvedValue({ ok: true, stdout: '', error: null })
    svc.runTests.mockResolvedValue({ passed: false, message: 'AssertionError' })

    render(
      <ActivityShell
        activity={notebookActivity}
        onComplete={() => {}}
        onNext={() => {}}
        onBack={() => {}}
      />,
    )

    const editor = screen.getByRole('textbox')
    fireEvent.change(editor, { target: { value: 'answer = 999' } })
    fireEvent.click(screen.getByRole('button', { name: /run/i }))

    await waitFor(() => expect(screen.getByText('Try again.')).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    expect(screen.getByRole('textbox')).toHaveValue('answer = 999')
    await waitFor(() => expect(svc.resetNamespace).toHaveBeenCalled())
  })

  it('Reset cell still restores the starter code on demand', async () => {
    svc.runCell.mockResolvedValue({ ok: true, stdout: '', error: null })
    svc.runTests.mockResolvedValue({ passed: false, message: 'AssertionError' })

    render(
      <ActivityShell
        activity={notebookActivity}
        onComplete={() => {}}
        onNext={() => {}}
        onBack={() => {}}
      />,
    )

    const editor = screen.getByRole('textbox')
    fireEvent.change(editor, { target: { value: 'answer = 999' } })

    // The learner explicitly asks to start over → starter code comes back.
    fireEvent.click(screen.getByRole('button', { name: /reset cell/i }))

    expect(screen.getByRole('textbox')).toHaveValue('answer = 1')
    await waitFor(() => expect(svc.resetNamespace).toHaveBeenCalled())
  })
})
