import { useState } from 'react'
import { Check, X, CheckCircle2, AlertTriangle, Eye } from 'lucide-react'

/*
 * PixelGrid — the Pixel Inspector ('pixel-grid' type). Makes "an image is just
 * a grid of numbers, stacked into channels" tangible: the learner sees a small
 * RGB image rendered as colored swatches, can toggle the Red / Green / Blue
 * channels on and off to watch the picture change, clicks a pixel to read its
 * exact (R, G, B) values, then answers a prediction/check about what a pixel
 * or channel does.
 *
 * Pure intuition-builder — no library, no canvas. Each pixel is a CSS color
 * computed from the currently-enabled channels, so toggling Green off literally
 * zeroes the green contribution everywhere, exactly like setting that channel
 * to 0 in code. This is the C×H×W story you can poke.
 *
 * Same activity contract as every other engine: ({ data, onResult }), renders
 * the interaction plus ONE "Check answer" .btn--primary, and calls
 * onResult({ correct }) EXACTLY ONCE. ActivityShell handles feedback/stars/next.
 *
 * data = {
 *   pixels: [[ [r,g,b], ... ], ...],   // H rows × W cols, each an [R,G,B] 0–255
 *   channels?: ['r','g','b'],          // which toggles to show (default all 3)
 *   check: {
 *     question: string,                // the prediction/check prompt
 *     choices: [{ id, label, correct: bool, why: string }],
 *   },
 * }
 *
 * Scoring: single-best — correct iff the chosen choice's `correct` is true.
 */

const CHANNEL_META = {
  r: { label: 'Red', idx: 0, swatch: '#ef4444' },
  g: { label: 'Green', idx: 1, swatch: '#22c55e' },
  b: { label: 'Blue', idx: 2, swatch: '#3b82f6' },
}

export default function PixelGrid({ data, onResult }) {
  const pixels = data.pixels ?? []
  const channels = data.channels ?? ['r', 'g', 'b']
  const check = data.check ?? { question: '', choices: [] }

  // Which channels are currently visible (all on to start).
  const [enabled, setEnabled] = useState(() => new Set(channels))
  const [inspect, setInspect] = useState(null) // { r, c } of clicked pixel
  const [picked, setPicked] = useState(null) // self-check choice id
  const [submitted, setSubmitted] = useState(false)

  const rows = pixels.length
  const cols = rows ? pixels[0].length : 0

  function toggleChannel(ch) {
    setEnabled((prev) => {
      const next = new Set(prev)
      if (next.has(ch)) next.delete(ch)
      else next.add(ch)
      return next
    })
  }

  // Color a pixel using only the channels currently switched on; a disabled
  // channel contributes 0 — the same as zeroing that channel in code.
  function cssFor([r, g, b]) {
    const rr = enabled.has('r') ? r : 0
    const gg = enabled.has('g') ? g : 0
    const bb = enabled.has('b') ? b : 0
    return `rgb(${rr}, ${gg}, ${bb})`
  }

  function select(id) {
    if (submitted) return
    setPicked((prev) => (prev === id ? null : id))
  }

  function submit() {
    if (picked == null || submitted) return
    setSubmitted(true)
    const correct = !!check.choices.find((c) => c.id === picked)?.correct
    onResult({ correct })
  }

  const inspected = inspect ? pixels[inspect.r]?.[inspect.c] : null

  return (
    <div className="stack">
      <p className="count-hint" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s2)' }}>
        <Eye size={16} aria-hidden="true" />
        <span>
          This image is a grid of <strong>(R, G, B)</strong> numbers. Toggle a channel to see its
          contribution, and click any pixel to read its exact values.
        </span>
      </p>

      {/* Channel toggles — flip a channel's contribution on/off everywhere. */}
      <div className="pixel-toggles" role="group" aria-label="Channel toggles">
        {channels.map((ch) => {
          const meta = CHANNEL_META[ch]
          const on = enabled.has(ch)
          return (
            <button
              key={ch}
              type="button"
              className={`pixel-toggle${on ? ' is-on' : ''}`}
              aria-pressed={on}
              onClick={() => toggleChannel(ch)}
            >
              <span
                className="pixel-toggle__dot"
                style={{ background: on ? meta.swatch : 'transparent', borderColor: meta.swatch }}
                aria-hidden="true"
              />
              {meta.label}
            </button>
          )
        })}
      </div>

      {/* The image: colored swatches sized to the container so it never overflows. */}
      <div className="pixel-stage">
        <div
          className="pixel-grid"
          role="img"
          aria-label={`A ${rows} by ${cols} RGB image; click a pixel to read its values`}
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {pixels.map((row, r) =>
            row.map((px, c) => {
              const isSel = inspect && inspect.r === r && inspect.c === c
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  className={`pixel-cell${isSel ? ' is-selected' : ''}`}
                  style={{ background: cssFor(px) }}
                  aria-label={`Pixel row ${r + 1}, column ${c + 1}: R ${px[0]}, G ${px[1]}, B ${px[2]}`}
                  onClick={() => setInspect({ r, c })}
                />
              )
            }),
          )}
        </div>

        {/* Read-out for the clicked pixel. */}
        <div className="pixel-readout" aria-live="polite">
          {inspected ? (
            <>
              <span className="pixel-readout__label">
                Pixel ({inspect.r + 1}, {inspect.c + 1})
              </span>
              <span className="pixel-readout__vals">
                <span style={{ color: CHANNEL_META.r.swatch }}>R {inspected[0]}</span>
                <span style={{ color: CHANNEL_META.g.swatch }}>G {inspected[1]}</span>
                <span style={{ color: CHANNEL_META.b.swatch }}>B {inspected[2]}</span>
              </span>
            </>
          ) : (
            <span className="pixel-readout__hint">Click a pixel to inspect its (R, G, B).</span>
          )}
        </div>
      </div>

      {/* Prediction / self-check keeps progression + mastery working. */}
      <div className="pixel-check">
        <p className="scenario">{check.question}</p>

        {!submitted && (
          <p className="count-hint" style={{ margin: 0 }}>
            Use the toggles and pixel read-out above, then pick the best answer.
          </p>
        )}

        <div className="options" role="radiogroup" aria-label="Prediction choices">
          {check.choices.map((c) => {
            const isPicked = picked === c.id
            let cls = 'option'
            if (!submitted && isPicked) cls += ' option--selected'
            if (submitted && c.correct) cls += ' option--correct'
            if (submitted && isPicked && !c.correct) cls += ' option--wrong'
            const showWhy = submitted && (isPicked || c.correct)

            return (
              <div key={c.id}>
                <button
                  className={cls}
                  type="button"
                  role="radio"
                  aria-checked={isPicked}
                  disabled={submitted}
                  onClick={() => select(c.id)}
                >
                  <span className="scenario-choice__label">
                    <span>{c.label}</span>
                  </span>
                  {submitted && c.correct && (
                    <span className="option__mark">
                      <Check size={15} /> correct
                    </span>
                  )}
                  {submitted && isPicked && !c.correct && (
                    <span className="option__mark">
                      <X size={15} /> not this
                    </span>
                  )}
                </button>
                {showWhy && c.why && (
                  <p className="ethics-why">
                    {c.correct ? (
                      <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" />
                    ) : (
                      <AlertTriangle size={16} color="var(--danger)" aria-hidden="true" />
                    )}
                    <span>{c.why}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={submit} disabled={picked == null || submitted}>
          Check answer
        </button>
      </div>
    </div>
  )
}
