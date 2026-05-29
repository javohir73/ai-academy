import { useMemo, useState } from 'react'
import { User } from 'lucide-react'
import { shuffle } from '../../utils/shuffle.js'

/*
 * BiasGridGame — spot the missing group (level 7). Shows a training set as a
 * visual grid of labeled, color-coded sample cards. One whole group is absent;
 * the learner identifies which. After checking, per-group counts are revealed
 * so the gap is obvious and the lesson lands.
 *
 * data = {
 *   legend, question,
 *   samples: [groupName, ...]   // repeated; the correct group never appears
 *   options: [groupName, ...],  // index decides the color tint
 *   correct, why
 * }
 */
export default function BiasGridGame({ data, onResult }) {
  const cards = useMemo(
    () => shuffle(data.samples.map((g, i) => ({ g, key: i }))),
    [data],
  )
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const counts = data.options.reduce((m, o) => {
    m[o] = data.samples.filter((s) => s === o).length
    return m
  }, {})
  const tintOf = (g) => data.options.indexOf(g)

  function check() {
    if (!selected || submitted) return
    setSubmitted(true)
    onResult({ correct: selected === data.correct })
  }

  return (
    <div className="stack">
      <p className="count-hint">{data.legend}</p>

      <div className="bias-grid" role="img" aria-label="Training data samples by group">
        {cards.map((c) => (
          <div className={`bias-sample bias-tint-${tintOf(c.g)}`} key={c.key}>
            <User size={16} aria-hidden="true" />
            <span>{c.g}</span>
          </div>
        ))}
      </div>

      <p className="prompt" style={{ marginTop: 'var(--s2)', marginBottom: 'var(--s3)' }}>
        {data.question}
      </p>

      <div
        className="options"
        role="radiogroup"
        aria-label="Which group is missing"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}
      >
        {data.options.map((o) => {
          let cls = 'option'
          if (!submitted && selected === o) cls += ' option--selected'
          if (submitted && o === data.correct) cls += ' option--correct'
          if (submitted && selected === o && o !== data.correct) cls += ' option--wrong'
          return (
            <button
              key={o}
              className={cls}
              role="radio"
              aria-checked={selected === o}
              disabled={submitted}
              onClick={() => setSelected(o)}
            >
              <span className={`bias-dot bias-tint-${tintOf(o)}`} aria-hidden="true" />
              {o}
              {submitted && (
                <span className="option__mark">
                  {counts[o]} {counts[o] === 1 ? 'sample' : 'samples'}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {submitted && <p className="dataset__why" style={{ borderTop: 'none', paddingTop: 0 }}>{data.why}</p>}

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!selected || submitted}>
          Check answer
        </button>
      </div>
    </div>
  )
}
