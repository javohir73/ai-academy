import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from '../i18n/LanguageProvider.jsx'
import LanguageModal from './LanguageModal.jsx'

beforeEach(() => localStorage.clear())

function setup(props = {}) {
  const onClose = props.onClose || vi.fn()
  const utils = render(
    <LanguageProvider>
      <LanguageModal open={props.open ?? true} onClose={onClose} />
    </LanguageProvider>,
  )
  return { ...utils, onClose }
}

describe('LanguageModal', () => {
  it('renders a dialog with aria-modal and labelled choice buttons', () => {
    setup()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /o’zbekcha|ozbekcha/i })).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    setup({ open: false })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('choosing a language persists it and calls onClose', () => {
    const { onClose } = setup()
    fireEvent.click(screen.getByRole('button', { name: /o’zbekcha|ozbekcha/i }))
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('uz')
    expect(onClose).toHaveBeenCalled()
  })

  it('choosing English persists en and closes', () => {
    const { onClose } = setup()
    fireEvent.click(screen.getByRole('button', { name: /english/i }))
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('en')
    expect(onClose).toHaveBeenCalled()
  })
})
