import { useState } from 'react'
import {
  Check,
  X,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  ExternalLink,
  Target,
  ListOrdered,
} from 'lucide-react'

/*
 * ColabLaunch — the GPU-lesson launcher ('colab' type). GPU lessons (training a
 * real model, fine-tuning, etc.) are too heavy to run in the browser, so this
 * activity does NOT execute code. Instead it:
 *   - states the lesson's goal,
 *   - lists the numbered steps the learner follows inside the notebook,
 *   - offers "Open in Colab" + "Open in Kaggle" buttons (free GPU notebooks,
 *     opened in a new tab), and
 *   - gives a short in-app self-check so progression/mastery still works even
 *     though no code runs here.
 *
 * Same contract as every activity: ({ data, onResult }) and calls
 * onResult({ correct }) EXACTLY ONCE when the learner submits the self-check.
 * ActivityShell renders the feedback, stars, and next-lesson button.
 *
 * data = {
 *   goal:     string,                 // one-line "what you'll accomplish"
 *   steps:    string[],               // ordered instructions for the notebook
 *   colabUrl: string,                 // opened in a new tab (Google Colab)
 *   kaggleUrl:string,                 // opened in a new tab (Kaggle Notebooks)
 *   check: {
 *     question: string,               // the self-check prompt
 *     choices: [
 *       { id, label, correct: bool, why: string }
 *     ],
 *   },
 * }
 *
 * Self-check scoring: single-best — correct iff the chosen choice's `correct`
 * is true. On submit we reveal the `why` on the picked choice and the right one.
 */
export default function ColabLaunch({ data, onResult }) {
  const check = data.check ?? { question: '', choices: [] }
  const steps = data.steps ?? []
  const [picked, setPicked] = useState(null) // selected choice id
  const [submitted, setSubmitted] = useState(false)

  function select(id) {
    if (submitted) return
    setPicked((prev) => (prev === id ? null : id))
  }

  function submit() {
    if (picked == null || submitted) return
    setSubmitted(true)
    const correct = !!check.choices.find((c) => c.id === picked)?.correct
    onResult({ correct })
  }

  return (
    <div className="stack">
      {/* What runs here — set the expectation up front. */}
      <p className="colab__runs-on" role="note">
        <Cpu size={16} aria-hidden="true" />
        <span>
          This runs in a <strong>free GPU notebook</strong> (Colab or Kaggle), not in your
          browser. Open it, follow the steps, then answer the check below to mark this lesson
          complete.
        </span>
      </p>

      {/* Goal */}
      {data.goal && (
        <div className="colab__goal">
          <span className="colab__goal-icon" aria-hidden="true">
            <Target size={18} />
          </span>
          <div>
            <span className="colab__eyebrow">Your goal</span>
            <p className="colab__goal-text">{data.goal}</p>
          </div>
        </div>
      )}

      {/* Numbered steps for the notebook */}
      {steps.length > 0 && (
        <div className="colab__steps">
          <p className="colab__eyebrow colab__eyebrow--row">
            <ListOrdered size={16} aria-hidden="true" /> In the notebook
          </p>
          <ol className="colab__step-list">
            {steps.map((step, i) => (
              <li key={i} className="colab__step">
                <span className="colab__step-num" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Launchers — open the free GPU notebooks in a new tab */}
      <div className="colab__launchers">
        {data.colabUrl && (
          <a
            className="btn btn--primary colab__launch"
            href={data.colabUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={18} aria-hidden="true" /> Open in Colab
          </a>
        )}
        {data.kaggleUrl && (
          <a
            className="btn btn--secondary colab__launch"
            href={data.kaggleUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={18} aria-hidden="true" /> Open in Kaggle
          </a>
        )}
      </div>

      {/* Self-check — keeps mastery/progression working without running code */}
      <div className="colab__check">
        <p className="colab__eyebrow">Quick self-check</p>
        <p className="scenario">{check.question}</p>

        {!submitted && (
          <p className="count-hint" style={{ margin: 0 }}>
            Pick the best answer based on what you saw in the notebook, then check it.
          </p>
        )}

        <div className="options" role="radiogroup" aria-label="Self-check choices">
          {check.choices.map((c) => {
            const isPicked = picked === c.id
            let cls = 'option'
            if (!submitted && isPicked) cls += ' option--selected'
            if (submitted && c.correct) cls += ' option--correct'
            if (submitted && isPicked && !c.correct) cls += ' option--wrong'
            const showWhy = submitted && (isPicked || c.correct)

            return (
              <div key={c.id}>
                <button
                  className={cls}
                  type="button"
                  role="radio"
                  aria-checked={isPicked}
                  disabled={submitted}
                  onClick={() => select(c.id)}
                >
                  <span className="scenario-choice__label">
                    <span>{c.label}</span>
                  </span>
                  {submitted && c.correct && (
                    <span className="option__mark">
                      <Check size={15} /> correct
                    </span>
                  )}
                  {submitted && isPicked && !c.correct && (
                    <span className="option__mark">
                      <X size={15} /> not this
                    </span>
                  )}
                </button>
                {showWhy && c.why && (
                  <p className="ethics-why">
                    {c.correct ? (
                      <CheckCircle2 size={16} color="var(--success)" aria-hidden="true" />
                    ) : (
                      <AlertTriangle size={16} color="var(--danger)" aria-hidden="true" />
                    )}
                    <span>{c.why}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="btn-row btn-row--center">
        <button
          className="btn btn--primary"
          onClick={submit}
          disabled={picked == null || submitted}
        >
          Check answer
        </button>
      </div>
    </div>
  )
}
