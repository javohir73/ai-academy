import { useRef, useState } from 'react'
import { ArrowRight, RotateCcw, LayoutGrid } from 'lucide-react'
import Feedback from './Feedback.jsx'
import { ACTIVITIES } from './activities/index.js'

/*
 * ActivityShell is the consistent wrapper around EVERY challenge. It:
 *   - looks up the right component from the registry by `activity.type`
 *   - listens for the result via onResult({ correct })
 *   - awards stars (3 on a first-try win, fewer after wrong attempts)
 *   - renders the shared Feedback panel with Try again / Continue actions
 *
 * Each challenge component only needs to render its interaction and call
 * onResult({ correct: boolean }) once the learner submits. The shell does the
 * rest, so every lesson behaves the same way.
 */
function starsForAttempts(wrongCount) {
  if (wrongCount === 0) return 3
  if (wrongCount === 1) return 2
  return 1
}

export default function ActivityShell({ activity, onComplete, onNext, onBack }) {
  const ActivityComponent = ACTIVITIES[activity.type]
  const [resetKey, setResetKey] = useState(0)
  const [result, setResult] = useState(null) // null | { correct, stars? }
  const wrongCount = useRef(0)

  if (!ActivityComponent) {
    return (
      <p className="feedback feedback--incorrect" role="alert">
        Unknown activity type: <strong>{activity.type}</strong>. Register it in
        components/activities/index.js.
      </p>
    )
  }

  function handleResult({ correct }) {
    if (correct) {
      const stars = starsForAttempts(wrongCount.current)
      setResult({ correct: true, stars })
      onComplete(stars)
    } else {
      wrongCount.current += 1
      setResult({ correct: false })
    }
  }

  // Retry after a wrong answer: keep the wrong-count so stars reflect effort.
  function tryAgain() {
    setResult(null)
    setResetKey((k) => k + 1)
  }

  // Fresh attempt after a win: reset the wrong-count for a clean score.
  function playAgain() {
    wrongCount.current = 0
    setResult(null)
    setResetKey((k) => k + 1)
  }

  const message = result?.correct ? activity.feedback.correct : activity.feedback.incorrect

  return (
    <div className="activity">
      <ActivityComponent key={resetKey} data={activity.data} onResult={handleResult} />

      {result && (
        <Feedback
          status={result.correct ? 'correct' : 'incorrect'}
          message={message}
          stars={result.correct ? result.stars : undefined}
          actions={
            result.correct ? (
              <>
                {onNext ? (
                  <button className="btn btn--primary" onClick={onNext}>
                    Next lesson <ArrowRight size={18} />
                  </button>
                ) : (
                  <button className="btn btn--primary" onClick={onBack}>
                    <LayoutGrid size={18} /> Back to overview
                  </button>
                )}
                {result.stars < 3 && (
                  <button className="btn btn--ghost" onClick={playAgain}>
                    <RotateCcw size={16} /> Replay for a better score
                  </button>
                )}
              </>
            ) : (
              <>
                <button className="btn btn--primary" onClick={tryAgain}>
                  <RotateCcw size={16} /> Try again
                </button>
                <button className="btn btn--ghost" onClick={onBack}>
                  Back to overview
                </button>
              </>
            )
          }
        />
      )}
    </div>
  )
}
