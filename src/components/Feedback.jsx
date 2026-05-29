import { CheckCircle2, AlertCircle } from 'lucide-react'
import Stars from './Stars.jsx'

/*
 * The feedback panel shown after a learner submits an answer. `status` is
 * 'correct' or 'incorrect'. On success it shows the earned stars (1-3).
 * `actions` are the buttons (Continue / Try again) supplied by ActivityShell.
 */
export default function Feedback({ status, message, stars, actions }) {
  const correct = status === 'correct'
  return (
    <div className={`feedback ${correct ? 'feedback--correct' : 'feedback--incorrect'}`} role="alert">
      <div className="feedback__head">
        {correct ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
        <span>{correct ? 'Correct' : 'Not quite — try again'}</span>
      </div>

      {correct && typeof stars === 'number' && (
        <div className="feedback__stars">
          <Stars value={stars} size={20} />
        </div>
      )}

      <p className="feedback__body">{message}</p>

      <div className="feedback__actions btn-row">{actions}</div>
    </div>
  )
}
