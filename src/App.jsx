import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { LEVELS } from './data/tracks.js'
import { useLocalizedTracks } from './i18n/useLocalizedTracks.js'
import { useProgress } from './hooks/useProgress.js'
import { useAuth } from './hooks/useAuth.js'
import Sidebar from './components/Sidebar.jsx'
import Overview from './components/Overview.jsx'
import LevelView from './components/LevelView.jsx'
import Dashboard from './components/Dashboard.jsx'
import HomePage from './components/HomePage.jsx'
import AuthModal from './components/AuthModal.jsx'
import AccountMenu from './components/AccountMenu.jsx'
import AccountPrompt from './components/AccountPrompt.jsx'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'
import LanguageModal from './components/LanguageModal.jsx'
import { hasSavedLanguage } from './i18n/LanguageProvider.jsx'
import { useLanguage } from './i18n/useLanguage.js'

/*
 * App is the layout shell. It has four views, tracked in `view`:
 *   'home'      — the marketing/landing page (HomePage), shown first
 *   'dashboard' — the learner's home base (progress, continue, review)
 *   'overview'  — the course home (lesson grid)
 *   'lesson'    — a single lesson
 * Home is a full-bleed page with no sidebar; the course views keep the
 * persistent sidebar (a slide-in drawer on mobile). Using view state instead
 * of a router keeps deployment a plain static build (no SPA rewrites needed).
 */
export default function App() {
  const auth = useAuth()
  const progress = useProgress(auth.user)
  const { levels: localizedLevels } = useLocalizedTracks()
  const { t } = useLanguage()
  const [view, setView] = useState('home') // 'home' | 'dashboard' | 'overview' | 'lesson'
  const [levelIndex, setLevelIndex] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  // First-visit language modal: shown only when no language preference is saved.
  const [langModalOpen, setLangModalOpen] = useState(() => !hasSavedLanguage())

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

  function goDashboard() {
    progress.setOnboarded()
    setView('dashboard')
    setSidebarOpen(false)
    window.scrollTo({ top: 0 })
  }

  function goHome() {
    setView('home')
    setSidebarOpen(false)
    window.scrollTo({ top: 0 })
  }

  async function handleSignOut() {
    await auth.signOut()
  }

  function openAuth(mode = 'signin') {
    setAuthMode(mode)
    setAuthOpen(true)
  }

  // The auth dialog + the deferred "save your progress" prompt are mounted on
  // every view, so they overlay Home and the course alike.
  const authChrome = (
    <>
      <LanguageModal open={langModalOpen} onClose={() => setLangModalOpen(false)} />
      <AuthModal
        open={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onSignIn={auth.signIn}
        onSignUp={auth.signUp}
        onReset={auth.resetPassword}
      />
      <AccountPrompt
        configured={auth.configured}
        user={auth.user}
        completedCount={progress.completedCount}
        onSignUpClick={() => openAuth('signup')}
      />
    </>
  )

  const accountMenu = (
    <AccountMenu
      configured={auth.configured}
      user={auth.user}
      syncState={progress.syncState}
      onSignInClick={() => openAuth('signin')}
      onSignOut={handleSignOut}
    />
  )

  // "Start learning" from Home:
  //   - a returning learner (any completed lessons) lands on their Dashboard,
  //   - a brand-new learner goes straight into the first lesson (fastest first win),
  //   - if everything is done, the Dashboard (which shows the completed state).
  function enterCourse() {
    progress.setOnboarded()
    if (progress.completedCount > 0) {
      goDashboard()
    } else if (currentIndex >= 0 && progress.isUnlocked(currentIndex)) {
      openLevel(currentIndex)
    } else {
      goDashboard()
    }
  }

  // "Explore curriculum" from Home: smooth-scroll to the curriculum section on
  // the Home page itself (falls back to no-op if the section isn't present).
  function exploreCurriculum() {
    const el = document.getElementById('curriculum')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isLastLevel = levelIndex >= LEVELS.length - 1

  // Home is a standalone full-bleed page (no sidebar chrome).
  if (view === 'home') {
    return (
      <main className="fade-in">
        <HomePage onStart={enterCourse} onExplore={exploreCurriculum} accountSlot={accountMenu} />
        {authChrome}
      </main>
    )
  }

  return (
    <div className="layout">
      <Sidebar
        panelRef={sidebarRef}
        progress={progress}
        view={view}
        activeIndex={levelIndex}
        currentIndex={currentIndex}
        open={sidebarOpen}
        onHome={goHome}
        onDashboard={goDashboard}
        onOverview={goOverview}
        onSelectLevel={openLevel}
        onClose={() => setSidebarOpen(false)}
        accountSlot={accountMenu}
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
            aria-label={t('topbar.openMenu')}
          >
            <Menu size={20} />
          </button>
          <button className="topbar__brand" onClick={goHome}>
            AI Academy
          </button>
          <button
            className={`topbar__nav${view === 'dashboard' ? ' topbar__nav--active' : ''}`}
            onClick={goDashboard}
          >
            {t('topbar.dashboard')}
          </button>
          <span className="topbar__spacer" />
          <LanguageSwitcher className="topbar__lang" />
          {accountMenu}
        </div>

        <main className="content fade-in" key={view === 'lesson' ? LEVELS[levelIndex].id : view}>
          {view === 'dashboard' ? (
            <Dashboard
              progress={progress}
              user={auth.user}
              configured={auth.configured}
              syncState={progress.syncState}
              onOpenLevel={openLevel}
              onOverview={goOverview}
              onHome={goHome}
            />
          ) : view === 'overview' ? (
            <Overview progress={progress} currentIndex={currentIndex} onOpenLevel={openLevel} />
          ) : (
            <LevelView
              level={localizedLevels[levelIndex]}
              levelIndex={levelIndex}
              totalLevels={localizedLevels.length}
              onComplete={progress.completeLevel}
              onBack={goOverview}
              onNext={isLastLevel ? null : () => openLevel(levelIndex + 1)}
            />
          )}
        </main>
      </div>

      {authChrome}
    </div>
  )
}
