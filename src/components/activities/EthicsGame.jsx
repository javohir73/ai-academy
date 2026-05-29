import { useState } from 'react'
import { Check, CheckCircle2, AlertTriangle } from 'lucide-react'

/*
 * EthicsGame — make responsible AI decisions (level 10). For each real-world
 * scenario the learner chooses one action; the best choice keeps a human in
 * charge / respects privacy. After checking, every relevant option explains
 * WHY, so learners understand the reasoning, not just the "right answer".
 *
 * data = { scenarios: [{ situation, options: [{ id, text, best, why }] }] }
 */
export default function EthicsGame({ data, onResult }) {
  const [answers, setAnswers] = useState({}) // scenarioIndex -> optionId
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = Object.keys(answers).length === data.scenarios.length

  function choose(si, optionId) {
    if (submitted) return
    setAnswers((a) => ({ ...a, [si]: optionId }))
  }

  function check() {
    if (!allAnswered || submitted) return
    setSubmitted(true)
    const correct = data.scenarios.every((s, i) => s.options.find((o) => o.id === answers[i])?.best)
    onResult({ correct })
  }

  return (
    <div className="stack">
      {data.scenarios.map((scenario, si) => (
        <div key={scenario.id ?? si}>
          <div className="scenario">{scenario.situation}</div>
          <div className="options" role="radiogroup" aria-label={`Scenario ${si + 1} options`}>
            {scenario.options.map((o) => {
              const picked = answers[si] === o.id
              let cls = 'option'
              if (!submitted && picked) cls += ' option--selected'
              if (submitted && o.best) cls += ' option--correct'
              if (submitted && picked && !o.best) cls += ' option--wrong'
              const showWhy = submitted && (picked || o.best)
              return (
                <div key={o.id}>
                  <button
                    className={cls}
                    role="radio"
                    aria-checked={picked}
                    disabled={submitted}
                    onClick={() => choose(si, o.id)}
                  >
                    <span>{o.text}</span>
                    {submitted && o.best && (
                      <span className="option__mark">
                        <Check size={15} /> recommended
                      </span>
                    )}
                  </button>
                  {showWhy && (
                    <p className="ethics-why">
                      {o.best ? (
                        <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" />
                      ) : (
                        <AlertTriangle size={16} color="var(--danger)" aria-hidden="true" />
                      )}
                      <span>{o.why}</span>
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!allAnswered || submitted}>
          Check decisions
        </button>
      </div>
    </div>
  )
}
