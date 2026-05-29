import { ChevronRight, Sigma } from 'lucide-react'

/*
 * GoDeeper — optional rigor that NEVER blocks progression. Renders as a native
 * <details> disclosure so it is keyboard- and screen-reader-friendly and stays
 * collapsed by default. A learner can finish the whole course without ever
 * opening one. Use it for the math / mechanics behind a concept.
 *
 * Data shape (level.goDeeper):
 *   { title, body, formula?, formulaLegend?: [{ sym, plain }] }
 */
export default function GoDeeper({ data }) {
  if (!data) return null
  return (
    <details className="go-deeper">
      <summary className="go-deeper__summary">
        <ChevronRight className="go-deeper__chevron" size={16} aria-hidden="true" />
        <Sigma size={15} aria-hidden="true" />
        <span>{data.title}</span>
        <span className="go-deeper__tag">Optional</span>
      </summary>
      <div className="go-deeper__body">
        <p>{data.body}</p>
        {data.formula && (
          <div className="go-deeper__formula">
            <code>{data.formula}</code>
            {data.formulaLegend && (
              <ul className="go-deeper__legend">
                {data.formulaLegend.map((item) => (
                  <li key={item.sym}>
                    <strong>{item.sym}</strong> — {item.plain}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </details>
  )
}
