import { useMemo, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { shuffle } from '../../utils/shuffle.js'
import { useLanguage } from '../../i18n/useLanguage.js'

/*
 * PickDatasetGame — single-choice "evaluate the datasets and pick the right
 * one" (training data, level 3; spotting bias, level 7). After checking, every
 * card reveals WHY it is good or bad, so learners learn from wrong options too.
 *
 * data = { options: [{ id, title, sample, isCorrect, why }, ...] }
 */
export default function PickDatasetGame({ data, onResult }) {
  const { t } = useLanguage()
  const options = useMemo(() => shuffle(data.options), [data])
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  function check() {
    if (!selected || submitted) return
    setSubmitted(true)
    onResult({ correct: Boolean(options.find((o) => o.id === selected)?.isCorrect) })
  }

  return (
    <div className="stack">
      <div className="options" role="radiogroup" aria-label={t('dataset.chooseAria')}>
        {options.map((o) => {
          let cls = 'dataset'
          if (!submitted && selected === o.id) cls += ' dataset--selected'
          if (submitted && o.isCorrect) cls += ' dataset--correct'
          if (submitted && selected === o.id && !o.isCorrect) cls += ' dataset--wrong'
          return (
            <button
              key={o.id}
              className={cls}
              role="radio"
              aria-checked={selected === o.id}
              disabled={submitted}
              onClick={() => setSelected(o.id)}
            >
              <div className="dataset__title">
                {submitted && o.isCorrect && (
                  <CheckCircle2 size={18} color="var(--success)" aria-hidden="true" />
                )}
                {submitted && selected === o.id && !o.isCorrect && (
                  <XCircle size={18} color="var(--danger)" aria-hidden="true" />
                )}
                {o.title}
              </div>
              <div className="dataset__sample">{o.sample}</div>
              {submitted && <div className="dataset__why">{o.why}</div>}
            </button>
          )
        })}
      </div>

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={!selected || submitted}>
          {t('act.checkAnswer')}
        </button>
      </div>
    </div>
  )
}
