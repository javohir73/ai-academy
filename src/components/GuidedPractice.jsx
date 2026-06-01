import { useState } from 'react'
import { Lightbulb, HelpCircle, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * GuidedPractice — the "We do" phase. One scaffolded attempt with an escalating
 * hint ladder, then the answer. This brings the Socratic-tutor *method* without
 * a live model: the hints are author-written and revealed one at a time, and
 * the answer stays locked until the learner has worked through the ladder
 * (a light guard against just farming for the solution).
 *
 * Data shape (level.guided):
 *   { prompt, hints: string[], answer, explanation }
 */
export default function GuidedPractice({ data }) {
  const { t } = useLanguage()
  // How many hints the learner has chosen to reveal, and whether the answer is shown.
  const [revealed, setRevealed] = useState(0)
  const [answerShown, setAnswerShown] = useState(false)

  if (!data) return null

  const hints = data.hints || []
  const allHintsSeen = revealed >= hints.length

  return (
    <div className="guided">
      <p className="guided__prompt">{data.prompt}</p>

      {/* Hints reveal one at a time, escalating from a question to a worked analogy. */}
      {revealed > 0 && (
        <ol className="guided__hints">
          {hints.slice(0, revealed).map((hint, i) => (
            <li key={i} className="guided__hint">
              <span className="guided__hint-label">{t('guided.hint')} {i + 1}</span>
              <span>{hint}</span>
            </li>
          ))}
        </ol>
      )}

      {!answerShown && (
        <div className="guided__actions">
          {!allHintsSeen && (
            <button
              className="btn btn--secondary"
              onClick={() => setRevealed((r) => r + 1)}
            >
              <Lightbulb size={16} />
              {revealed === 0
                ? t('guided.revealFirst')
                : `${t('guided.revealMore.pre')}${revealed + 1}${t('guided.revealMore.mid')}${hints.length}`}
            </button>
          )}
          <button
            className="btn btn--ghost"
            onClick={() => setAnswerShown(true)}
            disabled={!allHintsSeen}
            title={allHintsSeen ? undefined : t('guided.workThroughFirst')}
          >
            <HelpCircle size={16} /> {t('guided.showAnswer')}
          </button>
        </div>
      )}

      {!answerShown && !allHintsSeen && (
        <p className="guided__nudge">{t('guided.nudge')}</p>
      )}

      {answerShown && (
        <div className="guided__answer">
          <div className="guided__answer-head">
            <CheckCircle2 size={18} /> {data.answer}
          </div>
          <p className="guided__answer-body">{data.explanation}</p>
        </div>
      )}
    </div>
  )
}
