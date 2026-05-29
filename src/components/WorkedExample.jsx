import { Eye } from 'lucide-react'

/*
 * WorkedExample — the "I do" phase. A short, narrated walk-through of the
 * concept end to end, shown BEFORE the learner attempts anything. This is the
 * "watch an expert think out loud" step of gradual release.
 *
 * Data shape (level.workedExample):
 *   { intro: string, steps: string[], takeaway: string }
 */
export default function WorkedExample({ data }) {
  if (!data) return null
  return (
    <div className="worked">
      <p className="worked__intro">{data.intro}</p>
      <ol className="worked__steps">
        {data.steps.map((step, i) => (
          <li key={i} className="worked__step">
            <span className="worked__num" aria-hidden="true">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      {data.takeaway && (
        <p className="worked__takeaway">
          <Eye size={16} aria-hidden="true" />
          <span>{data.takeaway}</span>
        </p>
      )}
    </div>
  )
}
