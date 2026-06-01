import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage.js'

/*
 * RateResponseGame — score AI answers 1-5 with a slider (intermediate 3).
 * Correct when each score lands within an expert's tolerance. Reveals the
 * expert score and rationale on check.
 *
 * data = { items: [{ id, promptText, answer, ideal, tolerance, rationale }] }
 */
export default function RateResponseGame({ data, onResult }) {
  const { t } = useLanguage()
  const [scores, setScores] = useState(() => Object.fromEntries(data.items.map((i) => [i.id, 3])))
  const [submitted, setSubmitted] = useState(false)

  function setScore(id, v) {
    if (submitted) return
    setScores((s) => ({ ...s, [id]: Number(v) }))
  }
  function check() {
    if (submitted) return
    setSubmitted(true)
    const ok = data.items.every((i) => Math.abs(scores[i.id] - i.ideal) <= i.tolerance)
    onResult({ correct: ok })
  }

  return (
    <div className="stack">
      {data.items.map((it) => {
        const ok = submitted && Math.abs(scores[it.id] - it.ideal) <= it.tolerance
        return (
          <div className="eval-card" key={it.id}>
            <div className="eval-card__prompt">{it.promptText}</div>
            <div className="eval-card__answer">“{it.answer}”</div>
            <div className="rate">
              <div className="rate__head">
                <span>{t('rate.yourScore')}</span>
                <span className="rate__value">
                  {scores[it.id]}
                  <span className="muted">/5</span>
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={scores[it.id]}
                disabled={submitted}
                onChange={(e) => setScore(it.id, e.target.value)}
                aria-label={`${t('rate.scoreAria.pre')}${it.promptText}`}
              />
              <div className="rate__scale">
                <span>{t('rate.scale.poor')}</span>
                <span>3</span>
                <span>{t('rate.scale.excellent')}</span>
              </div>
            </div>
            {submitted && (
              <p className={`eval-verdict ${ok ? 'is-ok' : 'is-bad'}`}>
                {ok ? <Check size={15} aria-hidden="true" /> : <X size={15} aria-hidden="true" />}
                <span>
                  {t('rate.expertScore.pre')}{it.ideal}/5. {it.rationale}
                </span>
              </p>
            )}
          </div>
        )
      })}
      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={submitted}>
          {t('act.checkScores')}
        </button>
      </div>
    </div>
  )
}
