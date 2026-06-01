import { useState } from 'react'
import { History, Check, X } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * SpacedReview — a tiny, ungraded warm-up that resurfaces a concept from an
 * EARLIER lesson before the new one begins. This is the retention side of the
 * method: a concept met in lesson N reappears a few lessons later so it sticks.
 * It never blocks progress — it is just a quick recall check with feedback.
 *
 * Data shape (level.spacedReview):
 *   { question, options: string[], answerIndex, note }
 */
export default function SpacedReview({ data }) {
  const { t } = useLanguage()
  const [chosen, setChosen] = useState(null) // index | null
  if (!data) return null

  const answered = chosen !== null
  const correct = chosen === data.answerIndex

  return (
    <aside className="spaced" aria-label={t('spaced.aria')}>
      <div className="spaced__label">
        <History size={14} /> {t('spaced.label')}
      </div>
      <p className="spaced__q">{data.question}</p>
      <div className="spaced__opts">
        {data.options.map((opt, i) => {
          const state = !answered
            ? ''
            : i === data.answerIndex
            ? ' spaced__opt--right'
            : i === chosen
            ? ' spaced__opt--wrong'
            : ''
          return (
            <button
              key={i}
              className={`spaced__opt${state}`}
              onClick={() => !answered && setChosen(i)}
              disabled={answered}
            >
              {answered && i === data.answerIndex && <Check size={15} aria-hidden="true" />}
              {answered && i === chosen && i !== data.answerIndex && <X size={15} aria-hidden="true" />}
              {opt}
            </button>
          )
        })}
      </div>
      {answered && (
        <p className={`spaced__note${correct ? '' : ' spaced__note--miss'}`}>
          {correct ? data.note : `${t('spaced.miss.pre')}${data.note}`}
        </p>
      )}
    </aside>
  )
}
