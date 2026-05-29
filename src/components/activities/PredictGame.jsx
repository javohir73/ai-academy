import { useState } from 'react'
import { Lock, CheckCircle2, Minus, Plus } from 'lucide-react'

/*
 * PredictGame — a tiny live "model" (level 6). The predicted value is a simple
 * weighted sum of the sliders, clamped to 0-100. Learners move the sliders and
 * watch the prediction change, then lock it in once it reaches the target.
 * Teaches: change the inputs → the prediction changes.
 *
 * data = {
 *   base, unit, target: { min, label },
 *   inputs: [{ id, label, min, max, step, start, weight }]
 * }
 */
function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n))
}

export default function PredictGame({ data, onResult }) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(data.inputs.map((i) => [i.id, i.start])),
  )
  const [submitted, setSubmitted] = useState(false)

  const raw = data.inputs.reduce((sum, i) => sum + values[i.id] * i.weight, data.base)
  const predicted = clamp(Math.round(raw), 0, 100)
  const reached = predicted >= data.target.min

  function update(id, value) {
    if (submitted) return
    setValues((v) => ({ ...v, [id]: Number(value) }))
  }

  function stepInput(input, direction) {
    if (submitted) return
    setValues((v) => {
      const next = clamp(v[input.id] + input.step * direction, input.min, input.max)
      return { ...v, [input.id]: next }
    })
  }

  function lockIn() {
    if (submitted) return
    setSubmitted(true)
    onResult({ correct: reached })
  }

  return (
    <div className="slider-game">
      <div className="predict-readout">
        <div className="predict-readout__label">Predicted exam score</div>
        <div className="predict-readout__value">
          {predicted}
          {data.unit}
        </div>
        <div className="predict-readout__bar" aria-hidden="true">
          <span className={reached ? 'is-reached' : ''} style={{ width: `${predicted}%` }} />
        </div>
        <p
          className="count-hint"
          style={{
            marginTop: 'var(--s3)',
            color: reached ? 'var(--success)' : 'var(--text-2)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {reached && <CheckCircle2 size={16} aria-hidden="true" />}
          {reached ? 'Target reached — lock it in.' : data.target.label}
        </p>
      </div>

      {data.inputs.map((input) => (
        <div className="slider-row" key={input.id}>
          <label htmlFor={`slider-${input.id}`}>
            <span>{input.label}</span>
            <span className="val">{values[input.id]}</span>
          </label>
          <div className="slider-control">
            <button
              className="icon-btn slider-step"
              onClick={() => stepInput(input, -1)}
              disabled={submitted || values[input.id] <= input.min}
              aria-label={`Decrease ${input.label}`}
            >
              <Minus size={16} />
            </button>
            <input
              id={`slider-${input.id}`}
              type="range"
              min={input.min}
              max={input.max}
              step={input.step}
              value={values[input.id]}
              disabled={submitted}
              onChange={(e) => update(input.id, e.target.value)}
            />
            <button
              className="icon-btn slider-step"
              onClick={() => stepInput(input, 1)}
              disabled={submitted || values[input.id] >= input.max}
              aria-label={`Increase ${input.label}`}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      ))}

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={lockIn} disabled={submitted}>
          <Lock size={16} /> Lock in prediction
        </button>
      </div>
    </div>
  )
}
