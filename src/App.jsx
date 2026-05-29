import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { LEVELS } from './data/tracks.js'
import { useProgress } from './hooks/useProgress.js'
import Sidebar from './components/Sidebar.jsx'
import Overview from './components/Overview.jsx'
import LevelView from './components/LevelView.jsx'

/*
 * App is the layout shell: a persistent sidebar (course navigation) plus a
 * content panel that shows either the course Overview or a single lesson.
 * On mobile the sidebar becomes a slide-in drawer toggled from the top bar.
 */
export default function App() {
  const progress = useProgress()
  const [view, setView] = useState('overview') // 'overview' | 'lesson'
  const [levelIndex, setLevelIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuBtnRef = useRef(null)
  const sidebarRef = useRef(null)
  const wasOpen = useRef(false)

  // The next lesson to play: first unlocked + not completed (-1 if all done).
  const currentIndex = LEVELS.findIndex(
    (lvl, i) => progress.isUnlocked(i) && !progress.completed[lvl.id],
  )

  const isMobile = () => window.matchMedia('(max-width: 900px)').matches

  // Move focus into the drawer when it opens; return it to the menu button
  // when it closes. (WCAG 2.4.3 — focus order.)
  useEffect(() => {
    if (sidebarOpen && isMobile()) {
      sidebarRef.current?.querySelector('button:not([disabled])')?.focus()
    } else if (!sidebarOpen && wasOpen.current) {
      menuBtnRef.current?.focus()
    }
    wasOpen.current = sidebarOpen
  }, [sidebarOpen])

  // While the mobile drawer is open: Escape closes it, and Tab is trapped inside.
  useEffect(() => {
    if (!sidebarOpen) return
    function onKey(e) {
      if (e.key === 'Escape') {
        setSidebarOpen(false)
        return
      }
      if (e.key === 'Tab' && isMobile()) {
        const focusables = sidebarRef.current?.querySelectorAll(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        )
        if (!focusables || focusables.length === 0) return
        const list = Array.from(focusables)
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [sidebarOpen])

  function openLevel(index) {
    if (!progress.isUnlocked(index)) return
    setLevelIndex(index)
    setView('lesson')
    setSidebarOpen(false)
    progress.setOnboarded()
    window.scrollTo({ top: 0 })
  }

  function goOverview() {
    setView('overview')
    setSidebarOpen(false)
    window.scrollTo({ top: 0 })
  }

  const isLastLevel = levelIndex >= LEVELS.length - 1

  return (
    <div className="layout">
      <Sidebar
        panelRef={sidebarRef}
        progress={progress}
        view={view}
        activeIndex={levelIndex}
        currentIndex={currentIndex}
        open={sidebarOpen}
        onOverview={goOverview}
        onSelectLevel={openLevel}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`backdrop${sidebarOpen ? ' backdrop--show' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="main">
        <div className="topbar">
          <button
            className="icon-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open course menu"
          >
            <Menu size={20} />
          </button>
          <span className="topbar__brand">AI Academy</span>
        </div>

        <main className="content fade-in" key={view === 'lesson' ? LEVELS[levelIndex].id : 'overview'}>
          {view === 'overview' ? (
            <Overview progress={progress} currentIndex={currentIndex} onOpenLevel={openLevel} />
          ) : (
            <LevelView
              level={LEVELS[levelIndex]}
              levelIndex={levelIndex}
              totalLevels={LEVELS.length}
              onComplete={progress.completeLevel}
              onBack={goOverview}
              onNext={isLastLevel ? null : () => openLevel(levelIndex + 1)}
            />
          )}
        </main>
      </div>
    </div>
  )
}
