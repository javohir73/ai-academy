import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { LEVELS } from './data/tracks.js'
import { useLocalizedTracks } from './i18n/useLocalizedTracks.js'
import { useProgress } from './hooks/useProgress.js'
import { useAuth } from './hooks/useAuth.js'
import Sidebar from './components/Sidebar.jsx'
import Catalog from './components/Catalog.jsx'
import HomeError from './components/HomeError.jsx'
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
 * App is the layout shell. The rendered view is derived from the URL + progress:
 *   'home'      — the marketing/landing page (HomePage); new visitors at /
 *   'deciding'  — neutral shell while a signed-in user's cloud progress resolves
 *   'dashboard' — the learner's home base (progress, continue, review); / when
 *                 the learner has progress (the progress-aware home)
 *   'catalog'   — the course browse grid (/learn)
 *   'lesson'    — a single lesson (/learn/:lessonId)
 * Home/deciding are full-bleed pages with no sidebar; the course views keep the
 * persistent sidebar (a slide-in drawer on mobile).
 */
// Map a URL pathname to a BASE view + lesson index. The URL is the single
// source of navigation truth (deep-linkable, bookmarkable, back/forward-safe).
//   /                  → 'home'    (resolved to dashboard/home/deciding in the body)
//   /dashboard         → 'home'    (legacy; redirected to / by an effect)
//   /learn             → 'catalog' (the browse view)
//   /learn/:lessonId   → 'lesson'  (lessonId is the STABLE lesson id)
// An unknown lessonId falls back to the catalog so a bad link never crashes.
function viewFromPath(pathname) {
  if (pathname === '/dashboard') return { view: 'home', levelIndex: 0 }
  if (pathname === '/learn' || pathname === '/learn/') {
    return { view: 'catalog', levelIndex: 0 }
  }
  const lessonMatch = pathname.match(/^\/learn\/([^/]+)\/?$/)
  if (lessonMatch) {
    const lessonId = decodeURIComponent(lessonMatch[1])
    const idx = LEVELS.findIndex((l) => l.id === lessonId)
    if (idx >= 0) return { view: 'lesson', levelIndex: idx }
    return { view: 'catalog', levelIndex: 0 } // unknown id → the catalog
  }
  return { view: 'home', levelIndex: 0 }
}

export default function App() {
  const auth = useAuth()
  const progress = useProgress(auth.user)
  const { levels: localizedLevels } = useLocalizedTracks()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  // Navigation derives from the URL; the home view is then resolved by progress.
  const { view: baseView, levelIndex } = viewFromPath(location.pathname)

  // Progress-aware home: '/' shows the dashboard for returning learners and the
  // marketing page for new visitors. completedCount is read synchronously from
  // localStorage on first paint, so most users resolve immediately. The one race
  // is a signed-in user whose local store is empty while the cloud fetch is in
  // flight (or has errored):
  //   - syncing → 'deciding' (neutral shell, NOT marketing) until it resolves;
  //   - error   → marketing + a quiet Retry banner (spec Decision A).
  const hasProgress = progress.completedCount > 0
  const cloudPending =
    Boolean(auth.user) && progress.completedCount === 0 && progress.syncState === 'syncing'
  const cloudErrored =
    Boolean(auth.user) && progress.completedCount === 0 && progress.syncState === 'error'

  let view = baseView
  if (baseView === 'home') {
    if (hasProgress) view = 'dashboard'
    else if (cloudPending) view = 'deciding'
    else view = 'home'
  }

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('signin')
  // First-visit language modal: shown only when no language preference is saved.
  const [langModalOpen, setLangModalOpen] = useState(() => !hasSavedLanguage())

  const menuBtnRef = useRef(null)
  const sidebarRef = useRef(null)
  const wasOpen = useRef(false)

  // Reset scroll on every navigation (each view starts at the top), matching
  // the behavior the old per-handler window.scrollTo calls provided.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  // /dashboard is a legacy URL — the home (/) is now progress-aware and shows the
  // dashboard to returning learners. Keep old bookmarks working without creating
  // a second canonical URL for the same surface.
  useEffect(() => {
    if (location.pathname === '/dashboard') navigate('/', { replace: true })
  }, [location.pathname, navigate])

  // The next lesson to play: first unlocked + not completed (-1 if all done).
  const currentIndex = LEVELS.findIndex(
    (lvl, i) => progress.isUnlocked(i) && !progress.completed[lvl.id],
  )

  // A deep link to a LOCKED lesson (e.g. someone shares /learn/cv-build-cnn
  // before earlier lessons are done) gracefully redirects to the course map
  // instead of rendering a lesson the unlock rules forbid.
  useEffect(() => {
    if (view === 'lesson' && !progress.isUnlocked(levelIndex)) {
      navigate('/learn', { replace: true })
    }
  }, [view, levelIndex, progress, navigate])

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
    setSidebarOpen(false)
    progress.setOnboarded()
    navigate(`/learn/${encodeURIComponent(LEVELS[index].id)}`)
  }

  function goCatalog() {
    setSidebarOpen(false)
    navigate('/learn')
  }

  function goDashboard() {
    progress.setOnboarded()
    setSidebarOpen(false)
    navigate('/')
  }

  function goHome() {
    setSidebarOpen(false)
    navigate('/')
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

  // Neutral "deciding" shell: a signed-in user with empty local progress while
  // the cloud merge is in flight. Show brand + a quiet spinner, never marketing
  // (which would flash before their dashboard resolves).
  if (view === 'deciding') {
    return (
      <main className="fade-in deciding">
        <div className="deciding__brand">AI Academy</div>
        <div className="deciding__spinner" aria-label={t('sync.syncing')} role="status" />
        {authChrome}
      </main>
    )
  }

  // Home is a standalone full-bleed page (no sidebar chrome). On a cloud-load
  // failure for a signed-in, locally-empty user, the marketing page also shows a
  // quiet Retry banner (Decision A) that re-triggers the merge.
  if (view === 'home') {
    return (
      <main className="fade-in">
        <HomePage
          onStart={enterCourse}
          onExplore={exploreCurriculum}
          accountSlot={accountMenu}
          errorSlot={cloudErrored ? <HomeError onRetry={progress.retrySync} /> : null}
        />
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
        onOverview={goCatalog}
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
              onOverview={goCatalog}
            />
          ) : view === 'catalog' ? (
            <Catalog progress={progress} currentIndex={currentIndex} onOpenLevel={openLevel} />
          ) : (
            <LevelView
              level={localizedLevels[levelIndex]}
              levelIndex={levelIndex}
              totalLevels={localizedLevels.length}
              onComplete={progress.completeLevel}
              onBack={goCatalog}
              onNext={isLastLevel ? null : () => openLevel(levelIndex + 1)}
            />
          )}
        </main>
      </div>

      {authChrome}
    </div>
  )
}
