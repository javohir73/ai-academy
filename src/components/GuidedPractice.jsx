import { useState } from 'react'
import { Lightbulb, HelpCircle, CheckCircle2 } from 'lucide-react'

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
              <span className="guided__hint-label">Hint {i + 1}</span>
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
              {revealed === 0 ? 'Stuck? Reveal a hint' : `Reveal hint ${revealed + 1} of ${hints.length}`}
            </button>
          )}
          <button
            className="btn btn--ghost"
            onClick={() => setAnswerShown(true)}
            disabled={!allHintsSeen}
            title={allHintsSeen ? undefined : 'Work through the hints first'}
          >
            <HelpCircle size={16} /> Show the answer
          </button>
        </div>
      )}

      {!answerShown && !allHintsSeen && (
        <p className="guided__nudge">Give it a real think first — try a hint before peeking at the answer.</p>
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
