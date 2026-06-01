import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage.js'

/*
 * RewriteGame — improve a weak answer to 5/5 (intermediate 7). The learner
 * writes a better version in a text box and selects exactly the changes it
 * needed. Correct when the right improvements are chosen and a real rewrite is
 * written. Reveals a model 5/5 answer.
 *
 * data = { promptText, weakAnswer, placeholder, improvements: [{ id, text, needed }], modelAnswer }
 */
const MIN_REWRITE = 12

export default function RewriteGame({ data, onResult }) {
  const { t } = useLanguage()
  const [text, setText] = useState('')
  const [picked, setPicked] = useState([])
  const [submitted, setSubmitted] = useState(false)

  function toggle(id) {
    if (submitted) return
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }
  function check() {
    if (submitted) return
    setSubmitted(true)
    const needed = data.improvements.filter((i) => i.needed).map((i) => i.id)
    const exact = needed.length === picked.length && needed.every((id) => picked.includes(id))
    onResult({ correct: exact && text.trim().length >= MIN_REWRITE })
  }

  return (
    <div className="stack">
      <div className="eval-card__prompt">{data.promptText}</div>
      <div className="eval-weak">
        <span className="eval-weak__tag">{t('rewrite.weakTag')}</span>“{data.weakAnswer}”
      </div>

      <label className="rewrite-label" htmlFor="rewrite-box">
        {t('rewrite.improvedLabel')}
      </label>
      <textarea
        id="rewrite-box"
        className="rewrite-box"
        rows={4}
        placeholder={data.placeholder}
        value={text}
        disabled={submitted}
        onChange={(e) => setText(e.target.value)}
      />

      <p className="match-col__head" style={{ margin: 0 }}>
        {t('rewrite.whatNeeded')}
      </p>
      <div className="options" role="group" aria-label={t('rewrite.improvementsAria')}>
        {data.improvements.map((im) => {
          const on = picked.includes(im.id)
          let cls = 'option'
          if (!submitted && on) cls += ' option--selected'
          if (submitted && im.needed) cls += ' option--correct'
          if (submitted && on && !im.needed) cls += ' option--wrong'
          return (
            <button
              key={im.id}
              className={cls}
              disabled={submitted}
              aria-pressed={on}
              onClick={() => toggle(im.id)}
            >
              {im.text}
              {submitted && im.needed && (
                <span className="option__mark">
                  <Check size={15} aria-hidden="true" />
                </span>
              )}
              {submitted && on && !im.needed && (
                <span className="option__mark">
                  <X size={15} aria-hidden="true" />
                </span>
              )}
            </button>
          )
        })}
      </div>

      {submitted && data.modelAnswer && (
        <div className="eval-model">
          <span className="eval-model__tag">
            <Check size={14} aria-hidden="true" /> {t('rewrite.modelTag')}
          </span>
          {data.modelAnswer}
        </div>
      )}

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={submitted}>
          {t('rewrite.submit')}
        </button>
      </div>
    </div>
  )
}
