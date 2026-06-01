import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '../../i18n/useLanguage.js'

/*
 * HighlightErrorGame — hallucination detection (intermediate 5). The AI answer
 * is rendered as clickable sentences; the learner highlights the false ones.
 * Correct when the selected set exactly matches the bad sentences. Reveals the
 * specific issue for each.
 *
 * data = { promptText, sentences: [{ id, text, bad, issue? }], why }
 */
export default function HighlightErrorGame({ data, onResult }) {
  const { t } = useLanguage()
  const [selected, setSelected] = useState([])
  const [submitted, setSubmitted] = useState(false)

  function toggle(id) {
    if (submitted) return
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }
  function check() {
    if (submitted) return
    setSubmitted(true)
    const badIds = data.sentences.filter((s) => s.bad).map((s) => s.id)
    const ok = badIds.length === selected.length && badIds.every((id) => selected.includes(id))
    onResult({ correct: ok })
  }

  return (
    <div className="stack">
      <div className="eval-card__prompt">{data.promptText}</div>
      <p className="highlight-doc">
        {data.sentences.map((s) => {
          const picked = selected.includes(s.id)
          let cls = 'hl-sent'
          if (!submitted && picked) cls += ' hl-sent--sel'
          if (submitted && s.bad) cls += ' hl-sent--bad'
          if (submitted && picked && !s.bad) cls += ' hl-sent--wrongpick'
          return (
            <span key={s.id}>
              <button className={cls} disabled={submitted} onClick={() => toggle(s.id)}>
                {s.text}
              </button>{' '}
            </span>
          )
        })}
      </p>
      {submitted && (
        <div className="stack">
          {data.sentences
            .filter((s) => s.bad)
            .map((s) => (
              <p className="eval-issue" key={s.id}>
                <AlertTriangle size={15} aria-hidden="true" />
                <span>{s.issue}</span>
              </p>
            ))}
        </div>
      )}
      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={submitted}>
          {t('act.checkHighlights')}
        </button>
      </div>
    </div>
  )
}
