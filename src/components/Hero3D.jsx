import { useEffect, useRef, useState } from 'react'
import NeuralBackground from './NeuralBackground.jsx'

/*
 * Hero3D — premium light-futuristic hero backdrop.
 *
 * Renders a floating 3D "neural constellation" (glowing points + connecting
 * data lines) on a transparent canvas using three@0.184.0, with gentle
 * continuous drift and soft cursor parallax. It is purely decorative:
 * aria-hidden, pointer-events:none (in CSS), and it sits behind the hero text.
 *
 * Design + perf contract (see Phase 2 brief):
 *   - three is imported DYNAMICALLY (await import('three')) inside an effect so
 *     it never lands in the initial bundle. The SVG <NeuralBackground/> paints
 *     immediately and is upgraded to the canvas only once three has loaded.
 *   - FALLBACK to the static SVG (never the canvas) when ANY of:
 *       · prefers-reduced-motion: reduce
 *       · no usable WebGL context (detected in a try/catch)
 *       · viewport < 640px (mobile perf + battery)
 *   - Rendering PAUSES when the hero scrolls offscreen (IntersectionObserver)
 *     and when the tab is hidden (visibilitychange); it never runs a RAF loop
 *     it doesn't need to.
 *   - devicePixelRatio capped at 1.5; ResizeObserver keeps the drawing buffer
 *     in sync with the element box.
 *   - Everything (renderer, geometries, materials, listeners, observers,
 *     RAF) is disposed on unmount.
 *
 * No external assets/CDNs are used; colors are passed in JS to match the
 * light-theme accent palette (cyan / electric / indigo / violet).
 */

// Light-theme accent palette (hex ints) — mirrors design tokens
// --cyan #06b6d4, --electric #3b82f6, --indigo #4f46e5, --violet #8b5cf6.
const PALETTE = [0x06b6d4, 0x3b82f6, 0x4f46e5, 0x8b5cf6, 0x6366f1]

const MOBILE_MAX = 640 // < this width => static fallback

// Safe WebGL probe. Returns true only if we can actually get a context.
function hasWebGL() {
  if (typeof window === 'undefined' || !window.WebGLRenderingContext) return false
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return Boolean(gl)
  } catch {
    return false
  }
}

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

export default function Hero3D() {
  const mountRef = useRef(null)
  // Decide ONCE on mount whether the animated canvas is allowed at all.
  // (Reduced-motion / mobile / no-WebGL => keep the calm static SVG.)
  const [canAnimate] = useState(() => {
    if (typeof window === 'undefined') return false
    if (prefersReducedMotion()) return false
    if (window.innerWidth < MOBILE_MAX) return false
    return hasWebGL()
  })
  // Becomes true only after three has loaded AND the scene built successfully.
  const [canvasReady, setCanvasReady] = useState(false)

  useEffect(() => {
    if (!canAnimate) return
    const mount = mountRef.current
    if (!mount) return

    let disposed = false
    // Mutable refs captured by closures; populated once three resolves.
    let THREE
    let renderer
    let scene
    let camera
    let points
    let lines
    let pointGeo
    let lineGeo
    let pointMat
    let lineMat
    let rafId = 0
    let resizeObserver
    let intersectionObserver
    let isVisible = true // in viewport
    let isTabVisible = !document.hidden

    // Pointer parallax target (normalized -1..1) + smoothed value.
    const pointer = { x: 0, y: 0 }
    const smoothed = { x: 0, y: 0 }

    const DPR_CAP = 1.5

    function getSize() {
      const rect = mount.getBoundingClientRect()
      // Guard against a 0-size box (e.g. display:none) — fall back to window.
      const w = Math.max(1, Math.round(rect.width || window.innerWidth))
      const h = Math.max(1, Math.round(rect.height || 1))
      return { w, h }
    }

    function maybeRun() {
      // Run the loop only when on-screen, tab visible, and not disposed.
      if (disposed) return
      if (isVisible && isTabVisible) {
        if (!rafId) rafId = requestAnimationFrame(tick)
      } else if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    function onPointerMove(e) {
      const { w, h } = getSize()
      // -1..1 relative to viewport center; clamps naturally near edges.
      pointer.x = (e.clientX / w) * 2 - 1
      pointer.y = (e.clientY / h) * 2 - 1
    }

    function onVisibility() {
      isTabVisible = !document.hidden
      maybeRun()
    }

    let start = 0
    function tick(now) {
      rafId = 0
      if (disposed || !renderer) return
      if (!start) start = now
      const t = (now - start) / 1000

      // Smooth the parallax (lerp) so it glides rather than snaps.
      smoothed.x += (pointer.x - smoothed.x) * 0.04
      smoothed.y += (pointer.y - smoothed.y) * 0.04

      // Gentle continuous rotation + subtle parallax offset.
      if (points && lines) {
        const ry = t * 0.05 + smoothed.x * 0.35
        const rx = Math.sin(t * 0.18) * 0.06 - smoothed.y * 0.22
        points.rotation.y = ry
        points.rotation.x = rx
        lines.rotation.y = ry
        lines.rotation.x = rx
        // Slow "breathing" so the constellation feels alive.
        const breathe = 1 + Math.sin(t * 0.6) * 0.015
        points.scale.setScalar(breathe)
        lines.scale.setScalar(breathe)
      }

      renderer.render(scene, camera)
      maybeRun()
    }

    function resize() {
      if (!renderer || !camera) return
      const { w, h } = getSize()
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      // Render one frame so a resize while paused still looks correct.
      if (!rafId && isTabVisible) renderer.render(scene, camera)
    }

    async function build() {
      try {
        THREE = await import('three')
      } catch {
        return // three failed to load — silently keep the SVG fallback.
      }
      if (disposed || !mountRef.current) return

      const { w, h } = getSize()

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100)
      camera.position.z = 16

      renderer = new THREE.WebGLRenderer({
        alpha: true, // transparent — the CSS scrim/gradient shows through
        antialias: true,
        powerPreference: 'low-power',
      })
      renderer.setClearColor(0x000000, 0) // fully transparent
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP))
      renderer.setSize(w, h, false)

      const canvas = renderer.domElement
      canvas.setAttribute('aria-hidden', 'true')
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      canvas.style.display = 'block'
      mount.appendChild(canvas)

      // --- Build the constellation -------------------------------------
      // Deterministic-ish scatter inside a soft ellipsoid. We seed with a
      // simple LCG so it looks designed (stable across reloads), not random.
      const COUNT = 90
      let seed = 1337
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296
        return seed / 4294967296
      }

      const positions = new Float32Array(COUNT * 3)
      const colors = new Float32Array(COUNT * 3)
      const nodes = []
      const c = new THREE.Color()
      for (let i = 0; i < COUNT; i++) {
        // Spread wider on X so it fills the hero band; flatter on Z.
        const x = (rand() * 2 - 1) * 13
        const y = (rand() * 2 - 1) * 6.5
        const z = (rand() * 2 - 1) * 5
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
        nodes.push([x, y, z])
        c.setHex(PALETTE[i % PALETTE.length])
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      }

      pointGeo = new THREE.BufferGeometry()
      pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      pointGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      // Soft round glow sprite drawn to a small canvas (no external asset).
      const sprite = makeGlowTexture(THREE)
      pointMat = new THREE.PointsMaterial({
        size: 0.62,
        map: sprite,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
      points = new THREE.Points(pointGeo, pointMat)
      scene.add(points)

      // Connect each node to its nearest few neighbours => "data paths".
      const linePositions = []
      const lineColors = []
      const lc = new THREE.Color()
      for (let i = 0; i < COUNT; i++) {
        // distance to all others, take 2 closest within a radius
        const dists = []
        for (let j = 0; j < COUNT; j++) {
          if (i === j) continue
          const dx = nodes[i][0] - nodes[j][0]
          const dy = nodes[i][1] - nodes[j][1]
          const dz = nodes[i][2] - nodes[j][2]
          dists.push([j, dx * dx + dy * dy + dz * dz])
        }
        dists.sort((a, b) => a[1] - b[1])
        const links = Math.min(2, dists.length)
        for (let k = 0; k < links; k++) {
          const j = dists[k][0]
          if (j < i) continue // avoid duplicate undirected edges
          if (dists[k][1] > 30) continue // keep links short/tasteful
          linePositions.push(
            nodes[i][0], nodes[i][1], nodes[i][2],
            nodes[j][0], nodes[j][1], nodes[j][2],
          )
          lc.setHex(PALETTE[i % PALETTE.length])
          lineColors.push(lc.r, lc.g, lc.b, lc.r, lc.g, lc.b)
        }
      }
      lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(linePositions), 3),
      )
      lineGeo.setAttribute(
        'color',
        new THREE.BufferAttribute(new Float32Array(lineColors), 3),
      )
      lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.22, // faint — lines are accents, never the focus
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      lines = new THREE.LineSegments(lineGeo, lineMat)
      scene.add(lines)

      // --- Observers + listeners ---------------------------------------
      resizeObserver = new ResizeObserver(() => resize())
      resizeObserver.observe(mount)

      intersectionObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((en) => en.isIntersecting)
          maybeRun()
        },
        { threshold: 0.01 },
      )
      intersectionObserver.observe(mount)

      document.addEventListener('visibilitychange', onVisibility)
      window.addEventListener('pointermove', onPointerMove, { passive: true })

      setCanvasReady(true)
      resize()
      maybeRun()
    }

    build()

    return () => {
      disposed = true
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      if (resizeObserver) resizeObserver.disconnect()
      if (intersectionObserver) intersectionObserver.disconnect()
      if (pointGeo) pointGeo.dispose()
      if (lineGeo) lineGeo.dispose()
      if (pointMat) {
        if (pointMat.map) pointMat.map.dispose()
        pointMat.dispose()
      }
      if (lineMat) lineMat.dispose()
      if (scene) scene.clear()
      if (renderer) {
        renderer.dispose()
        const el = renderer.domElement
        if (el && el.parentNode) el.parentNode.removeChild(el)
        // Best-effort GPU context release.
        const ext =
          typeof renderer.forceContextLoss === 'function'
            ? renderer.forceContextLoss
            : null
        if (ext) {
          try {
            renderer.forceContextLoss()
          } catch {
            /* ignore */
          }
        }
      }
    }
  }, [canAnimate])

  // The static SVG paints immediately AND remains the permanent fallback when
  // the canvas can't/shouldn't run. When the canvas is ready we fade the SVG
  // out (CSS handles the crossfade) but keep it mounted as a graceful base.
  return (
    <div
      className={`hero3d${canvasReady ? ' hero3d--canvas-ready' : ''}`}
      aria-hidden="true"
    >
      <div className="hero3d__svg">
        <NeuralBackground />
      </div>
      {canAnimate && <div className="hero3d__canvas" ref={mountRef} />}
    </div>
  )
}

// Build a soft radial-glow point sprite on a tiny offscreen canvas (kept in
// the closure so it is disposed with the material). No network assets.
function makeGlowTexture(THREE) {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)')
  g.addColorStop(0.55, 'rgba(255,255,255,0.25)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}
