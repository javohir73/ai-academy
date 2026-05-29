import { useLayoutEffect, useRef, useState } from 'react'

/*
 * NeuralGame — "build a neural network by connecting nodes" (level 9).
 * Three layers: input → hidden → output. Tap a neuron, then tap a neuron in
 * the NEXT layer to wire them (tap again to remove). The network is complete
 * when every adjacent pair is connected; then the output neuron lights up.
 *
 * data = { layers: { input:[{id,label}], hidden:[...], output:[...] } }
 */
export default function NeuralGame({ data, onResult }) {
  const { input, hidden, output } = data.layers
  const layers = [input, hidden, output]

  // Map each node id -> its layer index (0,1,2), for adjacency checks.
  const layerOf = {}
  layers.forEach((nodes, li) => nodes.forEach((n) => (layerOf[n.id] = li)))

  // All required edges = every adjacent pair (input↔hidden, hidden↔output).
  const required = []
  input.forEach((a) => hidden.forEach((b) => required.push(`${a.id}->${b.id}`)))
  hidden.forEach((a) => output.forEach((b) => required.push(`${a.id}->${b.id}`)))

  const [edges, setEdges] = useState(() => new Set())
  const [active, setActive] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  const complete = edges.size === required.length

  // ---- Node click logic -------------------------------------------------
  function clickNode(id) {
    if (submitted) return
    if (active === null) {
      setActive(id)
      return
    }
    if (active === id) {
      setActive(null)
      return
    }
    // Connect only to the immediately next layer.
    if (layerOf[id] === layerOf[active] + 1) {
      const key = `${active}->${id}`
      setEdges((prev) => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        return next
      })
      setActive(null)
    } else {
      // Not a valid forward target — treat as selecting a new source instead.
      setActive(id)
    }
  }

  function check() {
    if (submitted) return
    setSubmitted(true)
    onResult({ correct: complete })
  }

  // ---- Measure node centers so we can draw SVG wires --------------------
  const containerRef = useRef(null)
  const nodeRefs = useRef({})
  const [coords, setCoords] = useState({})

  useLayoutEffect(() => {
    function measure() {
      const c = containerRef.current
      if (!c) return
      const box = c.getBoundingClientRect()
      const next = {}
      for (const [id, el] of Object.entries(nodeRefs.current)) {
        if (!el) continue
        const r = el.getBoundingClientRect()
        next[id] = { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 }
      }
      setCoords(next)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const layerMeta = [
    { key: 'input', label: 'Input', nodes: input },
    { key: 'hidden', label: 'Hidden', nodes: hidden },
    { key: 'output', label: 'Output', nodes: output },
  ]

  return (
    <div className="stack">
      <div className="nn" ref={containerRef}>
        {/* Wires */}
        <svg className="nn__svg">
          {[...edges].map((key) => {
            const [a, b] = key.split('->')
            const p1 = coords[a]
            const p2 = coords[b]
            if (!p1 || !p2) return null
            return (
              <line
                key={key}
                className="nn__wire"
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            )
          })}
        </svg>

        {/* Neurons */}
        <div className="nn__layers">
          {layerMeta.map((layer) => (
            <div className="nn__layer" key={layer.key}>
              <div className="nn__layer-label">{layer.label}</div>
              {layer.nodes.map((node) => {
                const lit =
                  active === node.id ||
                  (layer.key === 'output' && complete) ||
                  [...edges].some((e) => e.startsWith(`${node.id}->`) || e.endsWith(`->${node.id}`))
                return (
                  <button
                    key={node.id}
                    ref={(el) => (nodeRefs.current[node.id] = el)}
                    className={`nn-node ${lit ? 'nn-node--active' : ''}`}
                    onClick={() => clickNode(node.id)}
                    disabled={submitted}
                    aria-pressed={active === node.id}
                  >
                    <span className="nn-node__dot" aria-hidden="true" />
                    {node.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="nn__hint">
        Connections: <strong>{edges.size}</strong> of {required.length}
        {active && ' · now select a neuron in the next layer'}
      </p>

      <div className="btn-row btn-row--center">
        <button className="btn btn--primary" onClick={check} disabled={submitted}>
          Check network
        </button>
      </div>
    </div>
  )
}
