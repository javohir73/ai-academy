import { useState } from 'react'
import { Check, X } from 'lucide-react'

/*
 * OverfitCompareGame — compare two model diagrams (level 8). Two small SVG
 * charts show the SAME training points: Model A draws a wiggly line through
 * every point (memorizing / overfitting); Model B draws a smooth trend line
 * (generalizing). The learner picks the better model for NEW data and then the
 * reason. Both must be right. Visual + explanation, per the brief.
 *
 * data = {
 *   question, models: [{ id, label, kind, caption }], correctModel,
 *   reasonPrompt, reasons: [{ id, text, correct }], why
 * }
 */
const POINTS = [
  [22, 90],
  [48, 76],
  [74, 82],
  [100, 58],
  [126, 54],
  [152, 36],
  [178, 30],
]

function ModelChart({ kind }) {
  const dots = POINTS.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" className="of-dot" />)
  const line =
    kind === 'overfit' ? (
      <path d={'M ' + POINTS.map(([x, y]) => `${x} ${y}`).join(' L ')} className="of-line of-line--wiggly" fill="none" />
    ) : (
      <line x1="16" y1="92" x2="184" y2="26" className="of-line of-line--smooth" />
    )
  return (
    <svg viewBox="0 0 200 110" className="of-svg" role="img" aria-label={kind === 'overfit' ? 'A line that bends to pass through every dot' : 'A straight line through the middle of the dots'}>
      {line}
      <g>{dots}</g>
    </svg>
  )
}

export default function OverfitCompareGame({ data, onResult }) {
  const [model, setModel] = useState(null)
  const [reason, setReason] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const ready = model && reason

  function check() {
    if (!ready || submitted) return
    setSubmitted(true)
    const ok = model === data.correctModel && data.reasons.find((r) => r.id === reason)?.correct
    onResult({ correct: Boolean(ok) })
  }

  return (
    <div className="stack">
      <p className="prompt" style={{ marginBottom: 'var(--s3)' }}>{data.question}</p>

      <div className="overfit-compare">
        {data.models.map((m) => {
          let cls = 'model-card'
          if (!submitted && model === m.id) cls += ' option--selected'
          if (submitted && m.id === data.correctModel) cls += ' option--correct'
          if (submitted && model === m.id && m.id !== data.correctModel) cls += ' option--wrong'
          return (
            <button
              key={m.id}
              className={cls}
              disabled={submitted}
              aria-pressed={model === m.id}
              onClick={() => setModel(m.id)}
            >
              <span className="model-card__label">
                {m.label}
                {submitted && m.id === data.correctModel && <Check size={16} aria-hidden="true" />}
                {submitted && model === m.id && m.id !== data.correctModel && <X size={16} aria-hidden="true" />}
              </span>
              <ModelChart kind={m.kind} />
              <span className="model-card__cap">{m.caption}</span>
            </button>
          )
        })}
      </div>

      <p className="match-col__head" style={{ margin: 'var(--s2) 0 var(--s1)' }}>{data.reasonPrompt}</p>
      <div className="options" role="radiogroup" aria-label={data.reasonPrompt}>
        {data.reasons.map((r) => {
          let cls = 'option'
          if (!submitted && reason === r.id) cls += ' option--selected'
          if (submitted && r.correct) cls += ' option--correct'
          if (submitted && reason === r.id && !r.correct) cls += ' option--wrong'
          return (
            <button
              key={r.id}
              className={cls}
              role="radio"
              aria-checked={reason === r.id}
              disabled={submitted}
              onClick={() => setReason(r.id)}
            >
              {r.text}
              {submitted && r.correct && (
                <span className="option__mark">
                  <Check size={15} aria-hidden="true" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {submitted && <p className="dataset__why" style={{ borderTop: 'none', paddingTop: 0 }}>{data.why}</p>}

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!ready || submitted}>
          Check answer
        </button>
      </div>
    </div>
  )
}
