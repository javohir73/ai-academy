import { useState } from 'react'
import { Check } from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage.js'

/*
 * ClassifyGame — read the clues for each mystery item and pick its class
 * (level 5). All rounds are shown at once; pick one option per round, then
 * check. After checking, each pick is marked and the right answer highlighted.
 *
 * data = {
 *   rounds: [{ clues: [..], options: [{ id, label }], correctId }]
 * }
 */
export default function ClassifyGame({ data, onResult }) {
  const { t } = useLanguage()
  const [answers, setAnswers] = useState({}) // roundIndex -> optionId
  const [submitted, setSubmitted] = useState(false)

  const allAnswered = Object.keys(answers).length === data.rounds.length

  function choose(roundIndex, optionId) {
    if (submitted) return
    setAnswers((a) => ({ ...a, [roundIndex]: optionId }))
  }

  function check() {
    if (!allAnswered || submitted) return
    setSubmitted(true)
    onResult({ correct: data.rounds.every((r, i) => answers[i] === r.correctId) })
  }

  return (
    <div className="stack">
      {data.rounds.map((round, i) => (
        <div className="subcard" key={round.id ?? i}>
          <div className="match-col__head">{t('classify.mystery')} {i + 1}</div>
          <ul className="clue-list">
            {round.clues.map((clue) => (
              <li key={clue}>{clue}</li>
            ))}
          </ul>
          <div
            className="options"
            role="radiogroup"
            aria-label={`${t('classify.mystery')} ${i + 1}`}
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}
          >
            {round.options.map((o) => {
              const picked = answers[i] === o.id
              let cls = 'option'
              if (!submitted && picked) cls += ' option--selected'
              if (submitted && o.id === round.correctId) cls += ' option--correct'
              if (submitted && picked && o.id !== round.correctId) cls += ' option--wrong'
              return (
                <button
                  key={o.id}
                  className={cls}
                  role="radio"
                  aria-checked={picked}
                  disabled={submitted}
                  onClick={() => choose(i, o.id)}
                >
                  {o.label}
                  {submitted && o.id === round.correctId && (
                    <span className="option__mark">
                      <Check size={16} aria-hidden="true" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!allAnswered || submitted}>
          {t('act.checkAnswers')}
        </button>
      </div>
    </div>
  )
}
