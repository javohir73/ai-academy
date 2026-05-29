import { useState } from 'react'
import { Check } from 'lucide-react'

/*
 * CompareAnswersGame — pairwise ranking (intermediate 4). Two answers to the
 * same prompt are shown side by side; the learner picks the better one.
 * Reveals which is better and why.
 *
 * data = { rounds: [{ id, promptText, a, b, better, why }] }
 */
export default function CompareAnswersGame({ data, onResult }) {
  const [picks, setPicks] = useState({}) // roundId -> 'a' | 'b'
  const [submitted, setSubmitted] = useState(false)
  const allPicked = Object.keys(picks).length === data.rounds.length

  function pick(rid, v) {
    if (submitted) return
    setPicks((p) => ({ ...p, [rid]: v }))
  }
  function check() {
    if (!allPicked || submitted) return
    setSubmitted(true)
    onResult({ correct: data.rounds.every((r) => picks[r.id] === r.better) })
  }

  return (
    <div className="stack">
      {data.rounds.map((r) => (
        <div key={r.id}>
          <div className="eval-card__prompt" style={{ marginBottom: 'var(--s3)' }}>{r.promptText}</div>
          <div className="compare">
            {['a', 'b'].map((side) => {
              const picked = picks[r.id] === side
              const isBetter = r.better === side
              let cls = 'compare__card'
              if (!submitted && picked) cls += ' option--selected'
              if (submitted && isBetter) cls += ' option--correct'
              if (submitted && picked && !isBetter) cls += ' option--wrong'
              return (
                <button
                  key={side}
                  className={cls}
                  disabled={submitted}
                  aria-pressed={picked}
                  onClick={() => pick(r.id, side)}
                >
                  <span className="compare__tag">
                    Answer {side.toUpperCase()}
                    {submitted && isBetter && <Check size={15} aria-hidden="true" />}
                  </span>
                  <span className="compare__text">{r[side]}</span>
                </button>
              )
            })}
          </div>
          {submitted && (
            <p className="eval-issue">
              <Check size={15} aria-hidden="true" />
              <span>{r.why}</span>
            </p>
          )}
        </div>
      ))}
      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!allPicked || submitted}>
          Check choices
        </button>
      </div>
    </div>
  )
}
