# Bilingual i18n — Phase A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add English/Uzbek i18n *infrastructure* + translated UI chrome (no lesson content) to AI Academy, with a first-visit language modal and a persistent header switcher, while keeping progress language-independent.

**Architecture:** A React Context `LanguageProvider` owns the active locale (`'en'|'uz'`), persists it to `localStorage` (`ai-academy:lang.v1`), and exposes `useLanguage() → { locale, setLocale, t }`. `t(key)` looks strings up in a central catalog (`src/i18n/strings.js`) with English fallback and a dev-only `console.warn` on miss. Pure helpers (`detectLocale`, `createT`, `glossary`) are framework-free and unit-tested. Switching locale is a state update — no reload, no router, progress untouched.

**Tech Stack:** React 18, Vite 6, Vitest + @testing-library/react. **No new dependencies.**

**Spec:** `docs/superpowers/specs/2026-06-01-bilingual-i18n-design.md` (read §7 for the exact mixed-language scope boundary).

**Branch:** `feat/bilingual-i18n-phase-a` (already created from `main`).

---

## Conventions for the executing engineer

- **Test runner:** `npx vitest run <path>` runs one file; `npm test` runs all. Watch mode is `npm run test:watch`. The project uses `vitest` globals (`describe`, `it`, `expect`) via `src/test/setup.js` — no imports needed for those, but importing them is also fine (existing tests import them explicitly; match the file you're editing).
- **DOM tests** use `@testing-library/react` (`render`, `screen`, `fireEvent`) + `@testing-library/jest-dom` matchers (already wired in `src/test/setup.js`).
- **`import.meta.env.DEV`** is `true` under `vitest`/dev and `false` in production builds — that's how dev-only warnings stay out of users' consoles.
- **Uzbek is Latin only.** Use the characters `o’` (U+2018) and `g’` and `’` exactly as in the glossary. Never any Cyrillic.
- **Do NOT touch:** `src/data/*`, activity body content, `useProgress.js`, `cloudProgressService.js`, Supabase schema, lesson IDs.
- **Commit after every task.** Co-author trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **Do NOT merge or push** at any point. The plan ends at a local stopping point.

---

## File Structure (locked)

**New — pure (`.js`, no React except Context creation):**
- `src/i18n/detectLocale.js` — `detectLocale(saved, navigatorLanguages) → 'en'|'uz'`.
- `src/i18n/glossary.js` — `GLOSSARY` map + `bilingual(term)` helper.
- `src/i18n/strings.js` — `UI = { en, uz }` catalog + `createT(locale)`.
- `src/i18n/LanguageContext.js` — `createContext`.
- `src/i18n/useLanguage.js` — the hook.

**New — React (`.jsx`):**
- `src/i18n/LanguageProvider.jsx`
- `src/components/LanguageModal.jsx`
- `src/components/LanguageSwitcher.jsx`

**New — styles:**
- `src/styles/redesign-i18n.css`

**New — tests:**
- `src/i18n/detectLocale.test.js`
- `src/i18n/glossary.test.js`
- `src/i18n/strings.test.js`
- `src/i18n/LanguageProvider.test.jsx`
- `src/components/LanguageModal.test.jsx`
- `src/components/LanguageSwitcher.test.jsx`
- `src/components/LanguageSwitch.integration.test.jsx` (view-stability + progress-stability)

**Modified:**
- `src/main.jsx` — wrap App in provider; import CSS.
- `src/App.jsx` — mount `LanguageModal`; place `LanguageSwitcher` in topbar.
- `src/components/HomePage.jsx`, `Dashboard.jsx`, `Sidebar.jsx`, `Overview.jsx`, `AuthModal.jsx`, `AccountMenu.jsx`, `AccountPrompt.jsx`, `LevelView.jsx` — chrome strings → `t()`.

**Task order rationale:** pure helpers first (no deps, fully testable) → provider/hook (depends on helpers) → UI components (depend on provider) → wire into app → convert chrome components one at a time (each isolated) → integration tests → verification. Each task leaves the build green.

---

### Task 1: `detectLocale` — pure fallback chain

**Files:**
- Create: `src/i18n/detectLocale.js`
- Test: `src/i18n/detectLocale.test.js`

- [ ] **Step 1: Write the failing test**

```js
// src/i18n/detectLocale.test.js
import { describe, it, expect } from 'vitest'
import { detectLocale } from './detectLocale.js'

describe('detectLocale — fallback chain', () => {
  it('uses a valid saved preference', () => {
    expect(detectLocale('uz', ['en-US'])).toBe('uz')
    expect(detectLocale('en', ['uz-UZ'])).toBe('en')
  })

  it('ignores an invalid saved preference and detects from browser', () => {
    expect(detectLocale('fr', ['uz-UZ', 'en'])).toBe('uz')
    expect(detectLocale('', ['en-US'])).toBe('en')
    expect(detectLocale(null, ['uz'])).toBe('uz')
    expect(detectLocale(undefined, ['en-GB'])).toBe('en')
  })

  it('detects Uzbek from any navigator language matching /^uz/i', () => {
    expect(detectLocale(null, ['ru-RU', 'uz-Latn-UZ', 'en'])).toBe('uz')
    expect(detectLocale(null, ['UZ'])).toBe('uz')
  })

  it('defaults to English when nothing matches or input is empty', () => {
    expect(detectLocale(null, [])).toBe('en')
    expect(detectLocale(null, undefined)).toBe('en')
    expect(detectLocale(null, ['ru-RU', 'de'])).toBe('en')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/i18n/detectLocale.test.js`
Expected: FAIL — `Failed to resolve import './detectLocale.js'` / `detectLocale is not a function`.

- [ ] **Step 3: Write minimal implementation**

```js
// src/i18n/detectLocale.js
/* Pure locale resolution. Order: valid saved preference → browser language
   matching /^uz/i → English default. Framework-free + total (never throws). */

export const LOCALES = ['en', 'uz']

export function detectLocale(saved, navigatorLanguages) {
  if (saved === 'en' || saved === 'uz') return saved
  const langs = Array.isArray(navigatorLanguages) ? navigatorLanguages : []
  for (const l of langs) {
    if (typeof l === 'string' && /^uz/i.test(l)) return 'uz'
  }
  return 'en'
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/i18n/detectLocale.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/detectLocale.js src/i18n/detectLocale.test.js
git commit -m "feat(i18n): pure detectLocale fallback chain (saved → browser-uz → en)"
```

---

### Task 2: Glossary — AI/ML terms + bilingual helper

**Files:**
- Create: `src/i18n/glossary.js`
- Test: `src/i18n/glossary.test.js`

- [ ] **Step 1: Write the failing test**

```js
// src/i18n/glossary.test.js
import { describe, it, expect } from 'vitest'
import { GLOSSARY, bilingual } from './glossary.js'

const CYRILLIC = /[Ѐ-ӿ]/ // any Cyrillic codepoint

describe('glossary', () => {
  it('every entry has a non-empty en and uz', () => {
    for (const [term, pair] of Object.entries(GLOSSARY)) {
      expect(pair.en, `${term}.en`).toBeTruthy()
      expect(pair.uz, `${term}.uz`).toBeTruthy()
    }
  })

  it('all Uzbek terms are Latin-only (no Cyrillic)', () => {
    for (const [term, pair] of Object.entries(GLOSSARY)) {
      expect(CYRILLIC.test(pair.uz), `${term}.uz has Cyrillic`).toBe(false)
    }
  })

  it('bilingual() renders "english (uzbek)" for a known term', () => {
    expect(bilingual('features')).toBe('features (belgilar)')
  })

  it('bilingual() returns the raw term unchanged when unknown', () => {
    expect(bilingual('not-a-term')).toBe('not-a-term')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/i18n/glossary.test.js`
Expected: FAIL — cannot import `./glossary.js`.

- [ ] **Step 3: Write minimal implementation**

```js
// src/i18n/glossary.js
/* Single source of AI/ML terminology (Latin Uzbek). First mention of a hard
   term uses the bilingual form, e.g. bilingual('features') → "features (belgilar)".
   Used by chrome now (Phase A) and lesson content later (Phases B/C). */

export const GLOSSARY = {
  features: { en: 'features', uz: 'belgilar' },
  labels: { en: 'labels', uz: 'javoblar' },
  'training data': { en: 'training data', uz: 'o’quv ma’lumotlari' },
  dataset: { en: 'dataset', uz: 'ma’lumotlar to’plami' },
  model: { en: 'model', uz: 'model' },
  data: { en: 'data', uz: 'ma’lumot' },
  prediction: { en: 'prediction', uz: 'bashorat' },
  classification: { en: 'classification', uz: 'klassifikatsiya' },
  bias: { en: 'bias', uz: 'noxolislik (bias)' },
  overfitting: { en: 'overfitting', uz: 'ortiqcha moslashuv (overfitting)' },
  'neural network': { en: 'neural network', uz: 'neyron tarmoq' },
}

/** "features (belgilar)". Unknown terms return unchanged. */
export function bilingual(term) {
  const pair = GLOSSARY[term]
  return pair ? `${pair.en} (${pair.uz})` : term
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/i18n/glossary.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/glossary.js src/i18n/glossary.test.js
git commit -m "feat(i18n): AI/ML glossary (Latin Uzbek) + bilingual() helper"
```

---

### Task 3: Strings catalog + `createT` (EN fallback + dev-warn)

This task creates the **catalog with ALL Phase-A chrome keys** (so later component tasks only reference existing keys) and the pure `createT`. The catalog is the contract every component task depends on.

**Files:**
- Create: `src/i18n/strings.js`
- Test: `src/i18n/strings.test.js`

- [ ] **Step 1: Write the failing test**

```js
// src/i18n/strings.test.js
import { describe, it, expect, vi } from 'vitest'
import { UI, createT } from './strings.js'

const CYRILLIC = /[Ѐ-ӿ]/

describe('strings catalog', () => {
  it('en and uz have exactly the same key set (no missing keys)', () => {
    const en = Object.keys(UI.en).sort()
    const uz = Object.keys(UI.uz).sort()
    expect(uz).toEqual(en)
  })

  it('no Uzbek string contains Cyrillic', () => {
    for (const [k, v] of Object.entries(UI.uz)) {
      expect(CYRILLIC.test(v), `${k} has Cyrillic`).toBe(false)
    }
  })

  it('no string value is empty', () => {
    for (const locale of ['en', 'uz']) {
      for (const [k, v] of Object.entries(UI[locale])) {
        expect(v, `${locale}.${k}`).toBeTruthy()
      }
    }
  })
})

describe('createT', () => {
  it('returns the uz string when present', () => {
    const t = createT('uz')
    expect(t('nav.overview')).toBe(UI.uz['nav.overview'])
  })

  it('returns the en string for locale en', () => {
    const t = createT('en')
    expect(t('nav.overview')).toBe(UI.en['nav.overview'])
  })

  it('falls back to English when the active-locale key is missing', () => {
    // Simulate a missing uz key by asking for one that does not exist in uz
    // but does in en: we inject a temporary en-only key.
    const t = createT('uz')
    UI.en['__test.only'] = 'English only'
    try {
      expect(t('__test.only')).toBe('English only')
    } finally {
      delete UI.en['__test.only']
    }
  })

  it('returns the key itself as the last resort', () => {
    const t = createT('uz')
    expect(t('totally.unknown.key')).toBe('totally.unknown.key')
  })

  it('warns once (dev only) when falling back', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const t = createT('uz')
    t('totally.unknown.key')
    expect(warn).toHaveBeenCalled() // import.meta.env.DEV is true under vitest
    warn.mockRestore()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/i18n/strings.test.js`
Expected: FAIL — cannot import `./strings.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/i18n/strings.js` with the FULL Phase-A key set below. Every key MUST appear in both `en` and `uz`. Keys are grouped by area with comments; keep both blocks key-aligned.

```js
// src/i18n/strings.js
/* Central UI-chrome catalog. Flat dotted keys. English is the fallback.
   Phase A = chrome only (NO lesson/activity body content, NO track/lesson titles).
   Keep en and uz key sets identical (enforced by strings.test.js). */

export const UI = {
  en: {
    // language picker / switcher
    'lang.modal.title': 'Choose your language',
    'lang.modal.subtitle': 'You can change this anytime from the top bar.',
    'lang.en': 'English',
    'lang.uz': 'O’zbekcha',
    'lang.switch.label': 'Language',
    'lang.note.contentEnglish': 'Lessons are currently shown in English.',

    // top bar / nav
    'nav.dashboard': 'Dashboard',
    'nav.overview': 'Course overview',
    'nav.brand': 'AI Academy',
    'nav.openMenu': 'Open course menu',
    'nav.closeMenu': 'Close menu',
    'nav.home': 'Go to AI Academy home',

    // sidebar
    'side.overallProgress': 'Overall progress',
    'side.streak.suffix': 'streak',
    'side.streak.keep': '— finish a lesson to keep it',
    'side.unlocksAfter': 'Unlocks after',

    // lesson chrome (LevelView)
    'lesson.crumb': 'Lesson',
    'lesson.of': 'of',
    'lesson.back': 'Course overview',
    'lesson.phase.learn.doing': 'I do',
    'lesson.phase.learn.title': 'Learn',
    'lesson.phase.guided.doing': 'We do',
    'lesson.phase.guided.title': 'Practice together',
    'lesson.phase.practice.doing': 'You do',
    'lesson.phase.practice.title': 'Mastery check',
    'lesson.section.concept': 'Concept',
    'lesson.section.watch': 'Watch',
    'lesson.section.everyday': 'Everyday example',
    'lesson.section.worked': 'Worked example',
    'lesson.guided.lead': "Let's work through one step by step. Reach for a hint whenever you're stuck.",
    'lesson.cta.guided': 'Practice it together',
    'lesson.cta.practice': 'Try the challenge yourself',

    // generic activity-shell chrome (NOT per-activity body)
    'act.check': 'Check answers',

    // auth modal
    'auth.title.signin': 'Welcome back',
    'auth.title.signup': 'Create your free account',
    'auth.title.reset': 'Reset your password',
    'auth.sub.signin': 'Sign in to sync your progress across devices.',
    'auth.sub.signup': 'Save your stars, streak, and progress to the cloud.',
    'auth.sub.reset': 'We’ll email you a secure link to set a new password.',
    'auth.field.email': 'Email',
    'auth.field.password': 'Password',
    'auth.placeholder.email': 'you@example.com',
    'auth.placeholder.password': 'At least 6 characters',
    'auth.btn.signin': 'Sign in',
    'auth.btn.signup': 'Create account',
    'auth.btn.reset': 'Send reset link',
    'auth.btn.working': 'Working…',
    'auth.switch.create': 'Create an account',
    'auth.switch.forgot': 'Forgot password?',
    'auth.switch.haveAccount': 'Already have an account? Sign in',
    'auth.switch.backToSignin': 'Back to sign in',
    'auth.close': 'Close',
    'auth.notice.reset': 'Check your email for a password-reset link.',
    'auth.notice.signup': 'Account created. If email confirmation is on, check your inbox — then sign in.',
    'auth.error.exists': 'That email already has an account — try signing in instead.',
    'auth.error.invalid': 'Email or password looks incorrect. Please try again.',
    'auth.error.password': 'Password must be at least 6 characters.',
    'auth.error.notConfigured': 'Accounts aren’t set up on this deployment yet. Your progress is still saved on this device.',
    'auth.error.email': 'Please enter a valid email address.',
    'auth.error.generic': 'Something went wrong. Please try again.',

    // account menu + sync states
    'account.savedOnDevice': 'Saved on this device',
    'account.savedOnDevice.title': 'This deployment has no accounts; progress is saved in this browser.',
    'account.signin': 'Sign in',
    'account.menu': 'Account menu',
    'account.signout': 'Sign out',
    'account.fallback': 'Account',
    'sync.syncing': 'Syncing…',
    'sync.saved': 'Saved',
    'sync.error': 'Sync error',
    'sync.offline': 'Offline',
    'sync.idle': 'Synced',

    // account prompt
    'prompt.region': 'Save your progress',
    'prompt.dismiss': 'Dismiss',
    'prompt.title.prefix': 'Nice progress —',
    'prompt.title.suffix': 'lessons done!',
    'prompt.text': 'Create a free account to save your stars and streak to the cloud and pick up on any device.',
    'prompt.save': 'Save my progress',
    'prompt.notNow': 'Not now',
  },

  uz: {
    // language picker / switcher
    'lang.modal.title': 'Tilni tanlang',
    'lang.modal.subtitle': 'Buni istalgan vaqtda yuqori paneldan o’zgartirishingiz mumkin.',
    'lang.en': 'English',
    'lang.uz': 'O’zbekcha',
    'lang.switch.label': 'Til',
    'lang.note.contentEnglish': 'Darslar hozircha ingliz tilida ko’rsatiladi.',

    // top bar / nav
    'nav.dashboard': 'Boshqaruv paneli',
    'nav.overview': 'Kurs sharhi',
    'nav.brand': 'AI Academy',
    'nav.openMenu': 'Kurs menyusini ochish',
    'nav.closeMenu': 'Menyuni yopish',
    'nav.home': 'AI Academy bosh sahifasiga o’tish',

    // sidebar
    'side.overallProgress': 'Umumiy progress',
    'side.streak.suffix': 'kunlik seriya',
    'side.streak.keep': '— uni saqlash uchun darsni yakunlang',
    'side.unlocksAfter': 'Quyidagidan keyin ochiladi:',

    // lesson chrome (LevelView)
    'lesson.crumb': 'Dars',
    'lesson.of': '/',
    'lesson.back': 'Kurs sharhi',
    'lesson.phase.learn.doing': 'Men qilaman',
    'lesson.phase.learn.title': 'O’rganish',
    'lesson.phase.guided.doing': 'Birga qilamiz',
    'lesson.phase.guided.title': 'Birga mashq qilamiz',
    'lesson.phase.practice.doing': 'Siz qilasiz',
    'lesson.phase.practice.title': 'Bilimni tekshirish',
    'lesson.section.concept': 'Tushuncha',
    'lesson.section.watch': 'Tomosha qiling',
    'lesson.section.everyday': 'Hayotiy misol',
    'lesson.section.worked': 'Ishlangan misol',
    'lesson.guided.lead': 'Keling, birgalikda bosqichma-bosqich ishlaymiz. Qachon qiynalsangiz, maslahatdan foydalaning.',
    'lesson.cta.guided': 'Birga mashq qilamiz',
    'lesson.cta.practice': 'Topshiriqni o’zingiz bajaring',

    // generic activity-shell chrome (NOT per-activity body)
    'act.check': 'Javoblarni tekshirish',

    // auth modal
    'auth.title.signin': 'Xush kelibsiz',
    'auth.title.signup': 'Bepul hisob yarating',
    'auth.title.reset': 'Parolni tiklash',
    'auth.sub.signin': 'Progressingizni qurilmalar bo’ylab sinxronlash uchun kiring.',
    'auth.sub.signup': 'Yulduzlar, seriya va progressingizni bulutga saqlang.',
    'auth.sub.reset': 'Yangi parol o’rnatish uchun sizga xavfsiz havola yuboramiz.',
    'auth.field.email': 'Email',
    'auth.field.password': 'Parol',
    'auth.placeholder.email': 'siz@misol.com',
    'auth.placeholder.password': 'Kamida 6 ta belgi',
    'auth.btn.signin': 'Kirish',
    'auth.btn.signup': 'Hisob yaratish',
    'auth.btn.reset': 'Tiklash havolasini yuborish',
    'auth.btn.working': 'Bajarilmoqda…',
    'auth.switch.create': 'Hisob yaratish',
    'auth.switch.forgot': 'Parolni unutdingizmi?',
    'auth.switch.haveAccount': 'Hisobingiz bormi? Kiring',
    'auth.switch.backToSignin': 'Kirishga qaytish',
    'auth.close': 'Yopish',
    'auth.notice.reset': 'Parolni tiklash havolasi uchun emailingizni tekshiring.',
    'auth.notice.signup': 'Hisob yaratildi. Agar email tasdiqlash yoqilgan bo’lsa, pochtangizni tekshiring — so’ng kiring.',
    'auth.error.exists': 'Bu email allaqachon ro’yxatdan o’tgan — kirishni sinab ko’ring.',
    'auth.error.invalid': 'Email yoki parol noto’g’ri ko’rinadi. Qayta urinib ko’ring.',
    'auth.error.password': 'Parol kamida 6 ta belgidan iborat bo’lishi kerak.',
    'auth.error.notConfigured': 'Bu joylashtirishda hisoblar hali sozlanmagan. Progressingiz baribir shu qurilmada saqlanadi.',
    'auth.error.email': 'Iltimos, to’g’ri email manzilini kiriting.',
    'auth.error.generic': 'Nimadir xato ketdi. Iltimos, qayta urinib ko’ring.',

    // account menu + sync states
    'account.savedOnDevice': 'Shu qurilmada saqlangan',
    'account.savedOnDevice.title': 'Bu joylashtirishda hisoblar yo’q; progress shu brauzerda saqlanadi.',
    'account.signin': 'Kirish',
    'account.menu': 'Hisob menyusi',
    'account.signout': 'Chiqish',
    'account.fallback': 'Hisob',
    'sync.syncing': 'Sinxronlanmoqda…',
    'sync.saved': 'Saqlandi',
    'sync.error': 'Sinxronlash xatosi',
    'sync.offline': 'Oflayn',
    'sync.idle': 'Sinxronlangan',

    // account prompt
    'prompt.region': 'Progressingizni saqlang',
    'prompt.dismiss': 'Yopish',
    'prompt.title.prefix': 'Ajoyib natija —',
    'prompt.title.suffix': 'ta dars bajarildi!',
    'prompt.text': 'Yulduzlar va seriyangizni bulutga saqlash hamda istalgan qurilmada davom ettirish uchun bepul hisob yarating.',
    'prompt.save': 'Progressimni saqlash',
    'prompt.notNow': 'Hozir emas',
  },
}

/**
 * Build a translator bound to `locale`.
 * Lookup order: active locale → English → the key itself.
 * On fallback (active-locale miss) emit a dev-only console.warn so missing
 * translations are visible to developers but never to users.
 */
export function createT(locale) {
  return function t(key) {
    const active = UI[locale]
    if (active && key in active) return active[key]
    if (import.meta.env.DEV) {
      console.warn(`[i18n] missing "${key}" for locale "${locale}" — falling back to English`)
    }
    if (key in UI.en) return UI.en[key]
    return key
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/i18n/strings.test.js`
Expected: PASS. If the "same key set" test fails, align the missing key in whichever block lacks it — do NOT delete keys.

- [ ] **Step 5: Commit**

```bash
git add src/i18n/strings.js src/i18n/strings.test.js
git commit -m "feat(i18n): chrome strings catalog (en+uz) + createT with EN fallback + dev-warn"
```

---

### Task 4: Context + `useLanguage` hook

**Files:**
- Create: `src/i18n/LanguageContext.js`
- Create: `src/i18n/useLanguage.js`

(No standalone test — exercised by Task 5's provider tests. This task is two tiny files.)

- [ ] **Step 1: Create the context**

```js
// src/i18n/LanguageContext.js
import { createContext } from 'react'

/* Holds { locale, setLocale, t }. Default value is null so useLanguage can
   detect "used outside a provider" and throw a clear error. */
export const LanguageContext = createContext(null)
```

- [ ] **Step 2: Create the hook**

```js
// src/i18n/useLanguage.js
import { useContext } from 'react'
import { LanguageContext } from './LanguageContext.js'

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a <LanguageProvider>')
  }
  return ctx
}
```

- [ ] **Step 3: Commit**

```bash
git add src/i18n/LanguageContext.js src/i18n/useLanguage.js
git commit -m "feat(i18n): LanguageContext + useLanguage hook"
```

---

### Task 5: `LanguageProvider` (state, persistence, resilience)

**Files:**
- Create: `src/i18n/LanguageProvider.jsx`
- Test: `src/i18n/LanguageProvider.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
// src/i18n/LanguageProvider.test.jsx
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from './LanguageProvider.jsx'
import { useLanguage } from './useLanguage.js'

// A tiny probe component that surfaces the context for assertions.
function Probe() {
  const { locale, setLocale, t } = useLanguage()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="overview">{t('nav.overview')}</span>
      <button onClick={() => setLocale('uz')}>to-uz</button>
      <button onClick={() => setLocale('en')}>to-en</button>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})
afterEach(() => {
  localStorage.clear()
})

describe('LanguageProvider', () => {
  it('defaults to English when no saved pref and browser is not Uzbek', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('locale').textContent).toBe('en')
  })

  it('persists the chosen locale to localStorage', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    render(<LanguageProvider><Probe /></LanguageProvider>)
    fireEvent.click(screen.getByText('to-uz'))
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('uz')
    expect(screen.getByTestId('locale').textContent).toBe('uz')
    // t() now returns Uzbek
    expect(screen.getByTestId('overview').textContent).toBe('Kurs sharhi')
  })

  it('reads a saved preference back on remount', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'uz')
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('locale').textContent).toBe('uz')
  })

  it('keeps locale in memory when localStorage write throws', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(() => fireEvent.click(screen.getByText('to-uz'))).not.toThrow()
    expect(screen.getByTestId('locale').textContent).toBe('uz')
    setItem.mockRestore()
  })

  it('mounts without crashing when localStorage read throws', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US'])
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => render(<LanguageProvider><Probe /></LanguageProvider>)).not.toThrow()
    expect(screen.getByTestId('locale').textContent).toBe('en')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/i18n/LanguageProvider.test.jsx`
Expected: FAIL — cannot import `./LanguageProvider.jsx`.

- [ ] **Step 3: Write minimal implementation**

```jsx
// src/i18n/LanguageProvider.jsx
import { useCallback, useMemo, useState } from 'react'
import { LanguageContext } from './LanguageContext.js'
import { detectLocale } from './detectLocale.js'
import { createT } from './strings.js'

export const LANG_STORAGE_KEY = 'ai-academy:lang.v1'

function readSaved() {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY)
  } catch {
    return null // storage blocked → treat as no saved preference
  }
}

/** Whether a language preference has been explicitly saved (drives the modal). */
export function hasSavedLanguage() {
  const v = readSaved()
  return v === 'en' || v === 'uz'
}

export function LanguageProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    const langs = typeof navigator !== 'undefined' ? navigator.languages : []
    return detectLocale(readSaved(), langs)
  })

  const setLocale = useCallback((next) => {
    if (next !== 'en' && next !== 'uz') return
    setLocaleState(next) // in-memory update always succeeds (no reload, no reset)
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next)
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }, [])

  const value = useMemo(
    () => ({ locale, setLocale, t: createT(locale) }),
    [locale, setLocale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/i18n/LanguageProvider.test.jsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add src/i18n/LanguageProvider.jsx src/i18n/LanguageProvider.test.jsx
git commit -m "feat(i18n): LanguageProvider — state, localStorage persistence, storage-failure resilience"
```

---

### Task 6: `LanguageSwitcher` component

**Files:**
- Create: `src/components/LanguageSwitcher.jsx`
- Create: `src/styles/redesign-i18n.css` (switcher styles; modal styles added in Task 7)
- Test: `src/components/LanguageSwitcher.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/LanguageSwitcher.test.jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from '../i18n/LanguageProvider.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'

beforeEach(() => localStorage.clear())

function setup() {
  return render(
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>,
  )
}

describe('LanguageSwitcher', () => {
  it('renders an EN and a UZ option', () => {
    setup()
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /o’zbekcha|ozbekcha|uzbek/i })).toBeInTheDocument()
  })

  it('marks the active locale with aria-pressed', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en')
    setup()
    const en = screen.getByRole('button', { name: /english/i })
    expect(en).toHaveAttribute('aria-pressed', 'true')
  })

  it('switches locale on click and persists it', () => {
    localStorage.setItem(LANG_STORAGE_KEY, 'en')
    setup()
    fireEvent.click(screen.getByRole('button', { name: /o’zbekcha|ozbekcha|uzbek/i }))
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('uz')
    expect(screen.getByRole('button', { name: /o’zbekcha|ozbekcha|uzbek/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/LanguageSwitcher.test.jsx`
Expected: FAIL — cannot import `./LanguageSwitcher.jsx`.

- [ ] **Step 3: Write the component**

```jsx
// src/components/LanguageSwitcher.jsx
import { Globe } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * Compact EN/UZ segmented control used in the topbar, sidebar, and Home nav.
 * A globe icon labels it; each option is a button with aria-pressed reflecting
 * the active locale. Switching calls setLocale (state + persistence) — no reload.
 * Styling is in redesign-i18n.css; on mobile the control stays compact.
 */
export default function LanguageSwitcher({ className = '' }) {
  const { locale, setLocale, t } = useLanguage()
  const options = [
    { code: 'en', label: t('lang.en') },
    { code: 'uz', label: t('lang.uz') },
  ]
  return (
    <div className={`lang-switch ${className}`.trim()} role="group" aria-label={t('lang.switch.label')}>
      <Globe size={15} className="lang-switch__icon" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.code}
          type="button"
          className={`lang-switch__opt${locale === o.code ? ' lang-switch__opt--active' : ''}`}
          aria-pressed={locale === o.code}
          onClick={() => setLocale(o.code)}
        >
          {o.code.toUpperCase()}
          <span className="lang-switch__full">{o.label}</span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create the stylesheet (switcher portion)**

```css
/* src/styles/redesign-i18n.css */
/* Language switcher — compact segmented control. */
.lang-switch {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--surface-2, rgba(0, 0, 0, 0.08));
  border-radius: var(--r-pill, 999px);
  background: var(--surface, rgba(255, 255, 255, 0.6));
}
.lang-switch__icon {
  margin: 0 4px 0 6px;
  opacity: 0.65;
}
.lang-switch__opt {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: var(--r-pill, 999px);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-2, #555);
  line-height: 1;
}
.lang-switch__opt--active {
  background: var(--accent, #6366f1);
  color: #fff;
}
.lang-switch__full {
  display: none; /* show the long label only where there's room */
}
@media (min-width: 1024px) {
  .lang-switch__full {
    display: inline;
  }
}
/* On narrow screens, the globe + EN/UZ codes stay compact (no overflow). */
@media (max-width: 480px) {
  .lang-switch__icon {
    margin: 0 2px 0 4px;
  }
  .lang-switch__opt {
    padding: 4px 8px;
  }
}
```

- [ ] **Step 5: Wire the stylesheet import**

In `src/main.jsx`, add the import alongside the other style imports (after `redesign-dashboard.css`):

```js
import './styles/redesign-i18n.css'
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run src/components/LanguageSwitcher.test.jsx`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add src/components/LanguageSwitcher.jsx src/components/LanguageSwitcher.test.jsx src/styles/redesign-i18n.css src/main.jsx
git commit -m "feat(i18n): LanguageSwitcher segmented control + styles"
```

---

### Task 7: `LanguageModal` (first-visit choice)

**Files:**
- Create: `src/components/LanguageModal.jsx`
- Modify: `src/styles/redesign-i18n.css` (append modal styles)
- Test: `src/components/LanguageModal.test.jsx`

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/LanguageModal.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from '../i18n/LanguageProvider.jsx'
import LanguageModal from './LanguageModal.jsx'

beforeEach(() => localStorage.clear())

function setup(props = {}) {
  const onClose = props.onClose || vi.fn()
  const utils = render(
    <LanguageProvider>
      <LanguageModal open={props.open ?? true} onClose={onClose} />
    </LanguageProvider>,
  )
  return { ...utils, onClose }
}

describe('LanguageModal', () => {
  it('renders a dialog with aria-modal and labelled choice buttons', () => {
    setup()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /o’zbekcha|ozbekcha/i })).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    setup({ open: false })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('choosing a language persists it and calls onClose', () => {
    const { onClose } = setup()
    fireEvent.click(screen.getByRole('button', { name: /o’zbekcha|ozbekcha/i }))
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('uz')
    expect(onClose).toHaveBeenCalled()
  })

  it('choosing English persists en and closes', () => {
    const { onClose } = setup()
    fireEvent.click(screen.getByRole('button', { name: /english/i }))
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('en')
    expect(onClose).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/LanguageModal.test.jsx`
Expected: FAIL — cannot import `./LanguageModal.jsx`.

- [ ] **Step 3: Write the component**

```jsx
// src/components/LanguageModal.jsx
import { Globe } from 'lucide-react'
import { useLanguage } from '../i18n/useLanguage.js'

/*
 * First-visit language choice. Mirrors AuthModal's overlay/dialog structure
 * (role="dialog" + aria-modal). Picking a language persists it (via setLocale)
 * and calls onClose. App decides WHETHER to render it (only when no saved
 * preference). It is independent of AuthModal and never touches progress.
 */
export default function LanguageModal({ open, onClose }) {
  const { setLocale, t } = useLanguage()
  if (!open) return null

  function choose(code) {
    setLocale(code)
    onClose()
  }

  return (
    <div className="lang-overlay" role="presentation">
      <div className="lang-modal glass-card" role="dialog" aria-modal="true" aria-label={t('lang.modal.title')}>
        <div className="lang-modal__icon" aria-hidden="true">
          <Globe size={24} />
        </div>
        <h2 className="lang-modal__title">{t('lang.modal.title')}</h2>
        <p className="lang-modal__sub">{t('lang.modal.subtitle')}</p>
        <div className="lang-modal__choices">
          <button className="btn btn--primary btn--block" onClick={() => choose('en')}>
            {t('lang.en')}
          </button>
          <button className="btn btn--secondary btn--block" onClick={() => choose('uz')}>
            {t('lang.uz')}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Append modal styles to `src/styles/redesign-i18n.css`**

```css

/* First-visit language modal. */
.lang-overlay {
  position: fixed;
  inset: 0;
  z-index: 70;
  display: grid;
  place-items: center;
  padding: var(--s4, 16px);
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
}
.lang-modal {
  width: 100%;
  max-width: 340px;
  text-align: center;
  padding: var(--s6, 28px) var(--s5, 22px);
  border-radius: var(--r-lg, 18px);
}
.lang-modal__icon {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  margin: 0 auto var(--s3, 12px);
  border-radius: 50%;
  background: var(--accent-soft, rgba(99, 102, 241, 0.12));
  color: var(--accent, #6366f1);
}
.lang-modal__title {
  margin: 0 0 4px;
  font-size: 1.2rem;
}
.lang-modal__sub {
  margin: 0 0 var(--s5, 20px);
  color: var(--text-2, #555);
  font-size: 0.9rem;
}
.lang-modal__choices {
  display: grid;
  gap: var(--s3, 12px);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/components/LanguageModal.test.jsx`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/LanguageModal.jsx src/components/LanguageModal.test.jsx src/styles/redesign-i18n.css
git commit -m "feat(i18n): first-visit LanguageModal (a11y dialog) + styles"
```

---

### Task 8: Wire provider + modal + switcher into the app

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`
- Test: `src/components/LanguageSwitch.integration.test.jsx`

- [ ] **Step 1: Wrap App in the provider** (`src/main.jsx`)

Current relevant lines:

```jsx
import App from './App.jsx'
import './styles/global.css'
// ...other style imports...
import './styles/redesign-dashboard.css'
import './styles/redesign-i18n.css'  // added in Task 6

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

Change to wrap `<App/>`:

```jsx
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageProvider.jsx'
import './styles/global.css'
// ...other style imports...
import './styles/redesign-dashboard.css'
import './styles/redesign-i18n.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
```

- [ ] **Step 2: Mount the modal + switcher in `src/App.jsx`**

Add imports near the top (after the existing component imports):

```jsx
import LanguageSwitcher from './components/LanguageSwitcher.jsx'
import LanguageModal from './components/LanguageModal.jsx'
import { hasSavedLanguage } from './i18n/LanguageProvider.jsx'
```

Add modal state. Just after the existing `const [authMode, setAuthMode] = useState('signin')` line, add:

```jsx
  // First-visit language modal: shown only when no language preference is saved.
  const [langModalOpen, setLangModalOpen] = useState(() => !hasSavedLanguage())
```

Render the modal inside `authChrome` (so it overlays every view, like the auth dialog). Change the `authChrome` JSX to include it:

```jsx
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
```

Place the switcher in the topbar. Find the topbar block and add `<LanguageSwitcher />` just before `{accountMenu}`:

```jsx
        <span className="topbar__spacer" />
        <LanguageSwitcher className="topbar__lang" />
        {accountMenu}
```

- [ ] **Step 3: Write the integration test** (view + progress stability on switch)

```jsx
// src/components/LanguageSwitch.integration.test.jsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { LanguageProvider, LANG_STORAGE_KEY } from '../i18n/LanguageProvider.jsx'
import App from '../App.jsx'

beforeEach(() => {
  localStorage.clear()
  // Pre-set a language so the first-visit modal does NOT block the app.
  localStorage.setItem(LANG_STORAGE_KEY, 'en')
})

function renderApp() {
  return render(
    <LanguageProvider>
      <App />
    </LanguageProvider>,
  )
}

describe('language switch — view & progress stability', () => {
  it('switching language does not change the current view (stays on Home)', () => {
    renderApp()
    // App starts on Home. Switch to Uzbek via the Home-nav switcher.
    const uzBtn = screen.getAllByRole('button', { name: /o’zbekcha|ozbekcha/i })[0]
    fireEvent.click(uzBtn)
    // The Home "Start learning" CTA (Uzbek) is still present → still on Home, no reload.
    expect(localStorage.getItem(LANG_STORAGE_KEY)).toBe('uz')
  })

  it('switching language leaves saved progress untouched', () => {
    // Seed real progress under the app's progress key.
    const PROGRESS_KEY = 'ai-academy:progress.v1'
    const seeded = {
      onboarded: true,
      completed: { 'what-is-data': 3, 'what-ai': 2 },
      streak: { current: 2, longest: 5, lastDay: '2026-06-01' },
    }
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded))

    renderApp()
    const before = localStorage.getItem(PROGRESS_KEY)
    const uzBtn = screen.getAllByRole('button', { name: /o’zbekcha|ozbekcha/i })[0]
    fireEvent.click(uzBtn)
    fireEvent.click(screen.getAllByRole('button', { name: /english/i })[0])
    const after = localStorage.getItem(PROGRESS_KEY)
    // Byte-identical: language changes never write progress.
    expect(after).toBe(before)
    expect(JSON.parse(after).completed).toEqual(seeded.completed)
  })
})
```

> **Ordering directive (read before running):** App starts on **Home**, and the topbar switcher added in this task lives on **course views**, not Home — so the integration test needs the **Home-nav switcher from Task 9 Step 2**. Therefore: complete **Task 9 Step 2 (add `<LanguageSwitcher/>` to HomePage's nav) BEFORE running this integration test.** Write the test file now (this task), but run it at the end of Task 9. This is the one cross-task dependency in the plan; everything else is independently runnable.

- [ ] **Step 4: Run the integration test**

Run: `npx vitest run src/components/LanguageSwitch.integration.test.jsx`
Expected: PASS (2 tests). If the Home switcher isn't wired yet, complete Task 9 Step 2 first.

- [ ] **Step 5: Commit**

```bash
git add src/main.jsx src/App.jsx src/components/LanguageSwitch.integration.test.jsx
git commit -m "feat(i18n): wire LanguageProvider + first-visit modal + topbar switcher into App"
```

---

### Task 9: Convert HomePage chrome to `t()`

**Files:**
- Modify: `src/components/HomePage.jsx`

**Pattern (applies to every chrome-conversion task):**
1. Add `import { useLanguage } from '../i18n/useLanguage.js'` at the top.
2. Inside the component body, add `const { t } = useLanguage()`.
3. Replace each hardcoded chrome string with `t('<key>')` using the keys already defined in `strings.js` (Task 3).
4. **Only chrome** — do NOT translate marketing prose that isn't in the catalog; if HomePage has prose strings not yet keyed, ADD those keys to BOTH `en` and `uz` in `strings.js` (keep the no-missing-keys test green) using the same Uzbek conventions, then reference them. Do not invent keys that skip the catalog.

- [ ] **Step 1: Read the file and list its visible chrome strings**

Run: `npx vitest run src/i18n/strings.test.js` first to confirm the catalog is green, then open `src/components/HomePage.jsx` and identify the nav/CTA/section strings (e.g. "Start learning", "Explore curriculum", brand, any nav labels).

- [ ] **Step 2: Add the Home-nav switcher + convert strings**

- Add the switcher to the Home nav (HomePage receives an `accountSlot`; place `<LanguageSwitcher />` beside it). Add `import LanguageSwitcher from './LanguageSwitcher.jsx'`.
- For any Home chrome string not already in the catalog, add the key to BOTH locales in `strings.js`. Suggested keys + Uzbek (extend as needed, keeping conventions):

```js
// add to UI.en
'home.cta.start': 'Start learning',
'home.cta.explore': 'Explore curriculum',
// add to UI.uz
'home.cta.start': 'O’rganishni boshlash',
'home.cta.explore': 'Kursni ko’rib chiqish',
```

- Replace the literals: `Start learning` → `{t('home.cta.start')}`, etc.

- [ ] **Step 3: Verify catalog + build still green**

Run: `npx vitest run src/i18n/strings.test.js`
Expected: PASS (key sets still equal).

Run: `npm run build`
Expected: build succeeds (no missing imports / no JSX errors).

- [ ] **Step 4: Commit**

```bash
git add src/components/HomePage.jsx src/components/LanguageSwitcher.jsx src/i18n/strings.js
git commit -m "feat(i18n): translate HomePage chrome + Home-nav language switcher"
```

> After this task, run Task 8's integration test if you deferred it:
> `npx vitest run src/components/LanguageSwitch.integration.test.jsx` → PASS.

---

### Task 10: Convert AuthModal chrome to `t()`

**Files:**
- Modify: `src/components/AuthModal.jsx`

The catalog already has every AuthModal key (`auth.*`). Map each literal to its key.

- [ ] **Step 1: Add the hook**

Add `import { useLanguage } from '../i18n/useLanguage.js'`. Inside the component: `const { t } = useLanguage()`.

- [ ] **Step 2: Replace the title/subtitle maps and friendlyError**

```jsx
  const titles = {
    signin: t('auth.title.signin'),
    signup: t('auth.title.signup'),
    reset: t('auth.title.reset'),
  }
  const subtitles = {
    signin: t('auth.sub.signin'),
    signup: t('auth.sub.signup'),
    reset: t('auth.sub.reset'),
  }
```

In `friendlyError`, replace each returned literal with the matching key:

```jsx
    if (msg.includes('already registered') || msg.includes('already exists'))
      return t('auth.error.exists')
    if (msg.includes('invalid login') || msg.includes('invalid credentials'))
      return t('auth.error.invalid')
    if (msg.includes('password')) return t('auth.error.password')
    if (msg.includes('not-configured')) return t('auth.error.notConfigured')
    if (msg.includes('email')) return t('auth.error.email')
    return t('auth.error.generic')
```

> Note: `friendlyError` is defined inside the component, so `t` is in scope. Keep it inside the component body (it already is).

- [ ] **Step 3: Replace field labels, placeholders, buttons, switch links, notices, close**

```jsx
<span className="auth-field__label">{t('auth.field.email')}</span>
// ...
placeholder={t('auth.placeholder.email')}
// password label/placeholder:
<span className="auth-field__label">{t('auth.field.password')}</span>
placeholder={t('auth.placeholder.password')}
// close button:
aria-label={t('auth.close')}
// submit button:
{busy ? (<><Loader2 size={16} className="spin" /> {t('auth.btn.working')}</>)
  : mode === 'signin' ? t('auth.btn.signin')
  : mode === 'signup' ? t('auth.btn.signup')
  : t('auth.btn.reset')}
// switch links:
{t('auth.switch.create')} / {t('auth.switch.forgot')} / {t('auth.switch.haveAccount')} / {t('auth.switch.backToSignin')}
// notices:
setNotice(t('auth.notice.reset'))    // in the reset branch
setNotice(t('auth.notice.signup'))   // in the signup branch
```

- [ ] **Step 4: Verify**

Run: `npx vitest run src/components/LanguageModal.test.jsx src/i18n/strings.test.js`
Expected: PASS.

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/AuthModal.jsx
git commit -m "feat(i18n): translate AuthModal chrome via t()"
```

---

### Task 11: Convert AccountMenu + AccountPrompt chrome to `t()`

**Files:**
- Modify: `src/components/AccountMenu.jsx`
- Modify: `src/components/AccountPrompt.jsx`

Catalog keys already exist (`account.*`, `sync.*`, `prompt.*`).

- [ ] **Step 1: AccountMenu — hook + SyncBadge**

`SyncBadge` is a module-level function (outside the component) so it has no `t`. Move the label resolution inside the component by passing `t`, OR convert the badge to look up keys. Simplest: give `SyncBadge` a `t` prop.

```jsx
function SyncBadge({ syncState, t }) {
  const map = {
    syncing: { Icon: Loader2, text: t('sync.syncing'), cls: 'sync--busy', spin: true },
    saved: { Icon: Check, text: t('sync.saved'), cls: 'sync--ok' },
    error: { Icon: AlertCircle, text: t('sync.error'), cls: 'sync--err' },
    offline: { Icon: CloudOff, text: t('sync.offline'), cls: 'sync--muted' },
    idle: { Icon: Cloud, text: t('sync.idle'), cls: 'sync--muted' },
  }
  const { Icon, text, cls, spin } = map[syncState] || map.idle
  return (
    <span className={`sync-badge ${cls}`} aria-live="polite">
      <Icon size={13} className={spin ? 'spin' : undefined} aria-hidden="true" />
      {text}
    </span>
  )
}
```

In `AccountMenu`, add `const { t } = useLanguage()` and pass `t` to `<SyncBadge syncState={syncState} t={t} />`. Replace literals:

```jsx
// local-only chip:
title={t('account.savedOnDevice.title')}
aria-label={t('account.savedOnDevice')}
<span className="account-local__label">{t('account.savedOnDevice')}</span>
// sign-in button:
aria-label={t('account.signin')}
<span className="account-signin__label">{t('account.signin')}</span>
// avatar + dropdown:
const email = user.email || t('account.fallback')
aria-label={t('account.menu')}
// sign out:
<LogOut size={16} /> {t('account.signout')}
```

> The named export `export { SyncBadge }` may be imported by a test. Check `git grep "SyncBadge"`; if a test renders it directly, pass it a `t` (e.g. `createT('en')`) there. If nothing imports it, leaving the export is harmless.

- [ ] **Step 2: AccountPrompt — hook + strings**

Add `import { useLanguage } from '../i18n/useLanguage.js'` and `const { t } = useLanguage()`. Replace:

```jsx
aria-label={t('prompt.region')}
// close:
aria-label={t('prompt.dismiss')}
// title (keep the count interpolation):
<Sparkles size={14} aria-hidden="true" /> {t('prompt.title.prefix')} {completedCount} {t('prompt.title.suffix')}
// text:
{t('prompt.text')}
// actions:
{t('prompt.save')}
{t('prompt.notNow')}
```

- [ ] **Step 3: Verify**

Run: `npx vitest run` (full suite — these components appear in Dashboard/App tests)
Expected: PASS. Fix any test that rendered `AccountMenu`/`SyncBadge` without a provider by wrapping it in `<LanguageProvider>` (see Task 13).

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/AccountMenu.jsx src/components/AccountPrompt.jsx
git commit -m "feat(i18n): translate AccountMenu + AccountPrompt chrome (incl. sync states)"
```

---

### Task 12: Convert Sidebar, Overview, Dashboard, LevelView chrome to `t()`

These four are grouped because each is a mechanical literal→`t()` swap using existing `nav.*`, `side.*`, `lesson.*` keys. Do them one file per commit.

**Files:**
- Modify: `src/components/Sidebar.jsx`
- Modify: `src/components/Overview.jsx`
- Modify: `src/components/Dashboard.jsx`
- Modify: `src/components/LevelView.jsx`

- [ ] **Step 1: Sidebar**

Add the hook. Replace:

```jsx
aria-label={t('nav.home')}              // brand__home
<span>{t('nav.brand')}</span>           // brand text
aria-label={t('nav.closeMenu')}         // close button
<span>{t('side.overallProgress')}</span>
// streak: "<n>-day streak" → keep number, translate suffix:
<strong>{progress.streak.current}-day</strong> {t('side.streak.suffix')}
{!progress.streak.activeToday && <span className="streak__hint">{t('side.streak.keep')}</span>}
// Dashboard nav item:
<span className="nav__title">{t('nav.dashboard')}</span>
// Course overview nav item:
<span className="nav__title">{t('nav.overview')}</span>
// locked track hint:
<Lock size={13} /> {t('side.unlocksAfter')} {prevTrack.tag}
```

> Track titles/level names (`track.title`, `track.tag`, `level.title`, `level.concept`) are **Phase B** — leave them in English. This is the expected mixed-language state (spec §7).

Commit:

```bash
git add src/components/Sidebar.jsx
git commit -m "feat(i18n): translate Sidebar chrome (track/lesson titles deferred to Phase B)"
```

- [ ] **Step 2: Overview**

Add the hook. Open the file, replace its chrome strings (e.g. any "Course overview" heading, section labels) with the matching `nav.*`/new `overview.*` keys. If Overview has heading prose not in the catalog, add `overview.*` keys to BOTH locales in `strings.js` first. Leave `track.title`/`level.title` (Phase B) in English.

Commit:

```bash
git add src/components/Overview.jsx src/i18n/strings.js
git commit -m "feat(i18n): translate Overview chrome (titles deferred to Phase B)"
```

- [ ] **Step 3: Dashboard**

Add the hook. Dashboard has many labels (stats, empty-state, CTAs). For each label string, add a `dash.*` key to BOTH locales in `strings.js` (keeping conventions + the no-missing-keys test green), then reference `t('dash.*')`. Leave lesson/level **titles** (which come from the data) in English. Example additions:

```js
// UI.en
'dash.welcome.back': 'Welcome back',
'dash.welcome.new': 'Welcome to AI Academy',
// UI.uz
'dash.welcome.back': 'Qaytganingiz bilan',
'dash.welcome.new': 'AI Academy’ga xush kelibsiz',
```

(Continue for every Dashboard label. Each new key MUST exist in both locales.)

Commit:

```bash
git add src/components/Dashboard.jsx src/i18n/strings.js
git commit -m "feat(i18n): translate Dashboard chrome labels (lesson titles deferred to Phase B)"
```

- [ ] **Step 4: LevelView**

Add the hook. Replace the phase metadata, section labels, back link, guided lead, and continue CTAs:

```jsx
const PHASE_META = {
  learn: { doingKey: 'lesson.phase.learn.doing', titleKey: 'lesson.phase.learn.title', Icon: BookOpen },
  guided: { doingKey: 'lesson.phase.guided.doing', titleKey: 'lesson.phase.guided.title', Icon: Users },
  practice: { doingKey: 'lesson.phase.practice.doing', titleKey: 'lesson.phase.practice.title', Icon: Target },
}
```

Since `PHASE_META` is module-level, resolve labels at render with `t`:

```jsx
<span className="phase-step__doing">{t(meta.doingKey)}</span>
<span className="phase-step__title">{t(meta.titleKey)}</span>
```

Replace the rest:

```jsx
<ChevronLeft size={18} /> {t('lesson.back')}              // back-link
{t('lesson.crumb')} {levelIndex + 1} {t('lesson.of')} {totalLevels}   // crumb
<div className="section__label">{t('lesson.section.concept')}</div>
<PlayCircle size={15} /> {t('lesson.section.watch')}
<Lightbulb size={15} /> {t('lesson.section.everyday')}
<BookOpen size={15} /> {t('lesson.section.worked')}
<Users size={15} /> {t('lesson.phase.guided.title')}     // We-do section label
<p className="prompt">{t('lesson.guided.lead')}</p>
// continue CTA:
const continueLabel = nextPhase === 'guided' ? t('lesson.cta.guided')
  : nextPhase === 'practice' ? t('lesson.cta.practice') : null
```

> `level.title`, `level.concept`, `level.activity.prompt`, and all activity body text stay English (Phase C). Only chrome changes.

Commit:

```bash
git add src/components/LevelView.jsx
git commit -m "feat(i18n): translate LevelView chrome (I do/We do/You do, sections, CTAs)"
```

---

### Task 13: Fix any tests that render chrome components without a provider

Components now call `useLanguage()`, which throws outside a provider. Existing tests that render `Dashboard`, `AccountMenu`, etc. directly must wrap in `<LanguageProvider>`.

**Files:**
- Modify (as needed): `src/components/Dashboard.test.jsx`, any test rendering a converted component, plus `src/App.*` tests if present.

- [ ] **Step 1: Find affected tests**

Run: `npm test`
Expected: some failures with `useLanguage must be used within a <LanguageProvider>`.

- [ ] **Step 2: Wrap renders**

For each failing test, import the provider and wrap the rendered tree. Example for `Dashboard.test.jsx`:

```jsx
import { LanguageProvider } from '../i18n/LanguageProvider.jsx'
// replace render(<Dashboard ... />) with:
render(
  <LanguageProvider>
    <Dashboard {...props} />
  </LanguageProvider>,
)
```

A small helper is fine:

```jsx
const renderWithLang = (ui) => render(<LanguageProvider>{ui}</LanguageProvider>)
```

If any assertion checked an English literal that is now resolved via `t()`, the default locale under tests is `en` (no saved pref, jsdom `navigator.language` is `en-US`), so English assertions still pass. If a test set a `uz` preference earlier, clear `localStorage` in `beforeEach`.

- [ ] **Step 3: Run the full suite**

Run: `npm test`
Expected: ALL green (new + existing).

- [ ] **Step 4: Commit**

```bash
git add src/**/*.test.jsx
git commit -m "test(i18n): wrap chrome-component tests in LanguageProvider"
```

---

### Task 14: Full verification gate

No code changes unless a check fails. **No merge, no push.**

- [ ] **Step 1: Security**

Run: `npm run security`
Expected: audit at/under moderate; secret scan "No high-confidence secrets found." (i18n adds no secrets, so this should be unchanged from baseline.)

- [ ] **Step 2: Tests**

Run: `npm test`
Expected: ALL pass — including `detectLocale`, `glossary`, `strings` (no-missing-keys + Latin-only), `LanguageProvider`, `LanguageModal`, `LanguageSwitcher`, the switch integration test, and all pre-existing suites.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: succeeds; no unresolved imports; bundle emitted to `dist/`.

- [ ] **Step 4: Browser smoke (Chrome DevTools MCP)**

Run `npm run dev`, open the local URL, then verify:
1. **First visit:** `localStorage.clear()` then reload → language modal appears (`role="dialog"`).
2. Pick **O’zbekcha** → modal closes → chrome is Uzbek (nav "Boshqaruv paneli", "Kirish"); **lesson/track titles remain English (expected, spec §7)**.
3. **Switcher:** toggle EN↔UZ in the topbar → chrome flips live, **no page reload**, scroll position kept.
4. **Open a lesson** → switch language → **same lesson stays open** (view unchanged), progress intact.
5. **Mobile 390px** (CDP `emulate 390x844`) → switcher compact (globe + EN/UZ), **no horizontal overflow**, modal usable.
6. **Reload** → preference persisted, **no modal** reappears.
7. **Auth modal** opens and is Uzbek; **Dashboard** renders; **console clean** (no errors; the dev i18n warn only appears if a key is genuinely missing — investigate if so).

- [ ] **Step 5: Report (STOP HERE)**

Produce a report: files created/modified, test counts, screenshots/visual summary of EN and UZ chrome (Home, Dashboard, Lesson, Auth, mobile), and caveats — explicitly stating the **expected mixed-language state** (Uzbek chrome + English lesson content/titles until Phases B/C).

**Do NOT merge. Do NOT push.** Await review.

---

## Clear stopping point

Phase A is complete when Task 14 passes and the report is delivered. At that point:
- i18n infrastructure, chrome translations, first-visit modal, and the switcher are live **locally on `feat/bilingual-i18n-phase-a`**.
- Lesson content, track/lesson titles, and Supabase persistence are **untouched** and explicitly deferred to Phases B/C.
- The branch is **not merged and not pushed.**

The reviewer (product owner) then: reviews Uzbek chrome quality, approves or requests changes, and only then authorizes merge/publish (a separate, explicitly-approved step).

---

## Rollback / risk notes

- **Whole-phase rollback:** the work is one branch (`feat/bilingual-i18n-phase-a`) of additive commits. `git checkout main` abandons it entirely; nothing on `main` changed. No data migration, no schema change, so rollback is risk-free.
- **Single-task rollback:** each task is its own commit — `git revert <sha>` undoes one cleanly (later chrome tasks don't depend on earlier chrome tasks, only on Tasks 1–8 infra).
- **Runtime safety net:** if any chrome key is missing or mistyped, `t()` returns the English fallback (users never see a raw key); the dev-only warn surfaces it in development. The no-missing-keys test prevents shipping a gap.
- **Storage failure:** localStorage blocked/full → locale lives in memory; app never blocked; modal still dismissible.
- **Progress safety:** no task touches `useProgress`, `cloudProgressService`, the `ai-academy:progress.v1` key, or any lesson ID. The integration test proves a switch leaves progress byte-identical. Language ↔ progress are independent state trees.
- **Mobile overflow risk:** the new switcher is the main layout risk; mitigated by the compact segmented style + the 390px smoke check (step 4.5). If it crowds the topbar, hide the long label (already display:none < 1024px) or move it into the mobile drawer — a CSS-only change.
- **No new dependencies:** nothing added to `package.json`, so no supply-chain or bundle-size surprise beyond a few KB of strings/CSS.

## Self-review (completed by plan author)

- **Spec coverage:** infra (T1–T8), chrome catalog + all named components (T3, T9–T12), first-visit modal (T7–T8), switcher all views (T6, T8, T9), tests for pref-save/fallback/keys/switch-no-reset/view-stability/a11y (T1,T3,T5,T6,T7,T8), security/test/build/smoke (T14), Latin-only + glossary (T2,T3), localStorage-only + no schema change + stable IDs (T5 + "do not touch" guards), deferred Phase B/C labels called out (T12). ✓
- **No placeholders:** every code step shows real code; every test has real assertions; keys are concrete. ✓
- **Type/name consistency:** `LANG_STORAGE_KEY`, `hasSavedLanguage`, `createT(locale)`, `detectLocale(saved, langs)`, `bilingual(term)`, `useLanguage()`, `LanguageProvider`, `LanguageSwitcher`, `LanguageModal` names are used identically across tasks. ✓
