import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

/*
 * ReviewQueueGame — "what is AI evaluation?" (intermediate 1). Each AI answer
 * looks confident but hides a problem. The learner decides whether to ship it
 * or send it for review; the lesson is that all of them need review. After
 * checking, each hidden issue is revealed.
 *
 * data = { approveLabel, flagLabel, items: [{ id, prompt, answer, issue }] }
 */
export default function ReviewQueueGame({ data, onResult }) {
  const [choices, setChoices] = useState({}) // itemId -> 'approve' | 'flag'
  const [submitted, setSubmitted] = useState(false)
  const allAnswered = Object.keys(choices).length === data.items.length

  function choose(id, v) {
    if (submitted) return
    setChoices((c) => ({ ...c, [id]: v }))
  }
  function check() {
    if (!allAnswered || submitted) return
    setSubmitted(true)
    onResult({ correct: data.items.every((it) => choices[it.id] === 'flag') })
  }

  const options = [
    ['approve', data.approveLabel],
    ['flag', data.flagLabel],
  ]

  return (
    <div className="stack">
      {data.items.map((it) => {
        const picked = choices[it.id]
        return (
          <div className="eval-card" key={it.id}>
            <div className="eval-card__prompt">{it.prompt}</div>
            <div className="eval-card__answer">“{it.answer}”</div>
            <div className="seg" role="group" aria-label={`Decision for: ${it.prompt}`}>
              {options.map(([v, label]) => {
                let cls = 'seg__btn'
                if (!submitted && picked === v) cls += ' seg__btn--on'
                if (submitted && v === 'flag') cls += ' seg__btn--correct'
                if (submitted && picked === v && v !== 'flag') cls += ' seg__btn--wrong'
                return (
                  <button
                    key={v}
                    className={cls}
                    disabled={submitted}
                    aria-pressed={picked === v}
                    onClick={() => choose(it.id, v)}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            {submitted && (
              <p className="eval-issue">
                <AlertTriangle size={15} aria-hidden="true" />
                <span>{it.issue}</span>
              </p>
            )}
          </div>
        )
      })}
      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!allAnswered || submitted}>
          Check decisions
        </button>
      </div>
    </div>
  )
}
