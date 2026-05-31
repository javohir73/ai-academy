import { useMemo, useState } from 'react'
import { Check, X, Grid3x3, Layers } from 'lucide-react'
import { shuffle } from '../../utils/shuffle.js'

/*
 * Convolve — see how a convolution / pooling window slides over a grid, then
 * compute ONE highlighted output cell yourself (level: CNN intuition).
 *
 * Two modes share the same visual language (a numeric input grid with a
 * bright "window" outline over the patch that feeds the highlighted output):
 *
 *   mode 'kernel' — a 3x3 kernel (blur / sharpen / sobel / emboss) is applied.
 *     The learner reads the highlighted 3x3 patch, multiplies it element-wise
 *     by the kernel, sums, and picks/enters that single output number.
 *
 *   mode 'pool'   — a 2x2 max- or average-pool window. The learner computes the
 *     pooled value of the highlighted 2x2 region.
 *
 * The component is deterministic: the correct answer is taken straight from
 * data.choices (the choice with correct:true) so it always agrees with the
 * authored explanation — no in-browser float surprises. Choices are shuffled
 * with the shared util (stable per mount) so order isn't a giveaway.
 *
 * Contract: renders the interaction + a single "Check answer" .btn--primary,
 * calls onResult({ correct }) EXACTLY ONCE. No feedback/stars/next here — the
 * shared ActivityShell handles those.
 *
 * data = {
 *   mode: 'kernel' | 'pool',
 *   input: [[Number, ...], ...],        // the numeric source grid (any size)
 *   kernel?: [[Number×3]×3],            // mode 'kernel' only — the 3x3 filter
 *   kernelName?: String,               // optional label shown above the kernel
 *   op?: 'max' | 'avg',                // mode 'pool' only — pooling operator
 *   targetCell: { r, c },              // top-left of the window over `input`
 *                                      //   kernel: 3x3 patch starts here
 *                                      //   pool:   2x2 patch starts here
 *   choices: [{ id, label, correct, why }],  // label is the output number (string ok)
 * }
 */

const WINDOW = { kernel: 3, pool: 2 }

export default function Convolve({ data, onResult }) {
  const mode = data.mode === 'pool' ? 'pool' : 'kernel'
  const size = WINDOW[mode]
  const { r: tr, c: tc } = data.targetCell

  const choices = useMemo(() => shuffle(data.choices), [data])
  const [selected, setSelected] = useState(null) // choice id
  const [submitted, setSubmitted] = useState(false)

  // Is grid cell (r,c) inside the sliding window over the input?
  const inWindow = (r, c) => r >= tr && r < tr + size && c >= tc && c < tc + size

  const correctChoice = choices.find((ch) => ch.correct)

  function check() {
    if (selected == null || submitted) return
    setSubmitted(true)
    const picked = choices.find((ch) => ch.id === selected)
    onResult({ correct: !!picked?.correct })
  }

  const opLabel =
    mode === 'pool'
      ? data.op === 'max'
        ? 'Max pooling'
        : 'Average pooling'
      : data.kernelName || 'Kernel'

  const formula =
    mode === 'pool'
      ? data.op === 'max'
        ? 'Pick the largest value inside the 2×2 window.'
        : 'Add the four values inside the 2×2 window, then divide by 4.'
      : 'Multiply each cell in the highlighted 3×3 patch by the kernel cell in the same position, then add all nine products.'

  return (
    <div className="stack">
      <p className="count-hint" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
        {mode === 'pool' ? <Layers size={16} aria-hidden="true" /> : <Grid3x3 size={16} aria-hidden="true" />}
        <span>
          <strong>{opLabel}.</strong> The bright outline is the window. It feeds the highlighted output cell.
        </span>
      </p>

      <div className="conv-stage">
        {/* Input grid with sliding window ----------------------------- */}
        <figure className="conv-panel">
          <figcaption className="conv-panel__cap">Input</figcaption>
          <div
            className="conv-grid"
            role="img"
            aria-label={`Input grid; the ${size} by ${size} window covers rows ${tr + 1} to ${tr + size}, columns ${tc + 1} to ${tc + size}`}
            style={{ gridTemplateColumns: `repeat(${data.input[0].length}, 1fr)` }}
          >
            {data.input.map((row, r) =>
              row.map((v, c) => {
                const active = inWindow(r, c)
                // mark window corners so we can draw one continuous outline
                const wTop = active && r === tr
                const wBottom = active && r === tr + size - 1
                const wLeft = active && c === tc
                const wRight = active && c === tc + size - 1
                const cls = [
                  'conv-cell',
                  active ? 'conv-cell--active' : '',
                  wTop ? 'is-wtop' : '',
                  wBottom ? 'is-wbottom' : '',
                  wLeft ? 'is-wleft' : '',
                  wRight ? 'is-wright' : '',
                ]
                  .filter(Boolean)
                  .join(' ')
                return (
                  <div key={`${r}-${c}`} className={cls}>
                    {v}
                  </div>
                )
              }),
            )}
          </div>
        </figure>

        {/* Kernel (only in kernel mode) ------------------------------- */}
        {mode === 'kernel' && data.kernel && (
          <figure className="conv-panel">
            <figcaption className="conv-panel__cap">Kernel</figcaption>
            <div
              className="conv-grid conv-grid--kernel"
              role="img"
              aria-label="Kernel weights"
              style={{ gridTemplateColumns: `repeat(${data.kernel[0].length}, 1fr)` }}
            >
              {data.kernel.map((row, r) =>
                row.map((v, c) => (
                  <div key={`k-${r}-${c}`} className="conv-cell conv-cell--kernel">
                    {v}
                  </div>
                )),
              )}
            </div>
          </figure>
        )}
      </div>

      <p className="conv-formula">{formula}</p>

      <p className="prompt" style={{ marginBottom: 'var(--s3)' }}>
        What number lands in the highlighted output cell?
      </p>

      <div
        className="options"
        role="radiogroup"
        aria-label="Pick the output value"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))' }}
      >
        {choices.map((ch) => {
          const picked = selected === ch.id
          let cls = 'option conv-option'
          if (!submitted && picked) cls += ' option--selected'
          if (submitted && ch.correct) cls += ' option--correct'
          if (submitted && picked && !ch.correct) cls += ' option--wrong'
          return (
            <button
              key={ch.id}
              type="button"
              className={cls}
              role="radio"
              aria-checked={picked}
              disabled={submitted}
              onClick={() => setSelected(ch.id)}
            >
              <span className="conv-option__num">{ch.label}</span>
              {submitted && ch.correct && (
                <span className="option__mark">
                  <Check size={16} aria-hidden="true" />
                </span>
              )}
              {submitted && picked && !ch.correct && (
                <span className="option__mark">
                  <X size={16} aria-hidden="true" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {submitted && correctChoice?.why && (
        <p className="dataset__why" style={{ borderTop: 'none', paddingTop: 0 }}>
          {correctChoice.why}
        </p>
      )}

      <div className="btn-row btn-row--center">
        <button
          className="btn btn--primary"
          type="button"
          onClick={check}
          disabled={selected == null || submitted}
        >
          Check answer
        </button>
      </div>
    </div>
  )
}
