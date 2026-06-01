# Bilingual i18n (English + Uzbek) — Design Spec

**Status:** Approved design. Implementation pending (Phase A only).
**Date:** 2026-06-01
**Author:** senior fullstack architect (pairing session)

**Goal:** Make AI Academy bilingual (English + Uzbek), with a first-visit language
choice, a persistent header switcher, and language-independent progress — delivered
in review-gated phases. **Phase A only** is in scope for the first implementation.

**Architecture:** A React Context `LanguageProvider` owns the active locale, persists
it to `localStorage`, and exposes `useLanguage() → { locale, setLocale, t }`. UI chrome
is translated via a central, testable `t()` catalog with English fallback. Lesson
*content* will later be translated via an optional per-lesson `i18n: { uz: {...} }`
field (Phases B/C) — out of scope for Phase A. No router, no new runtime dependency,
no Supabase schema change.

**Tech stack:** React 18, Vite 6, Vitest + Testing Library. No new dependencies.

---

## 1. Hard rules (apply to every phase)

- Locale values: `'en'` and `'uz'` only.
- **Uzbek is Latin script only** (no Cyrillic). Enforced by test.
- A shared **glossary** of AI/ML terms is the single source of terminology; used
  consistently across chrome (Phase A) and content (Phases B/C).
- Translate in **phases**, never all at once. Each phase is review-gated.
- **Progress is language-independent.** Progress is keyed by stable `lesson.id`
  (`completed: { [id]: stars }`). Completing a lesson in Uzbek completes it in
  English — automatically, with no data change.
- **Stable lesson IDs** are never translated.
- **No Supabase schema change.** Selected language is saved to `localStorage` only
  for now. `setLocale` is the single seam where a future phase may also persist to a
  Supabase profile field — no breaking API shape now.
- **Do not merge or push** until explicitly approved.

## 2. Locale resolution & fallback

On first mount, `LanguageProvider` resolves the initial locale with pure
`detectLocale(saved, navigatorLanguages)`:

1. `saved` is `'en'` or `'uz'` → use it.
2. else first `navigator.language(s)` matching `/^uz/i` → `'uz'`.
3. else → `'en'` (default).

**First-visit modal visibility is driven by a *separate* check:** the modal shows
when `localStorage['ai-academy:lang.v1']` is **absent**, independent of the resolved
locale. So a browser-detected Uzbek user sees the UI in Uzbek *and* is still asked to
confirm English / O‘zbekcha. Once a choice is persisted, the modal never returns.

**Storage resilience:**
- If `localStorage` read throws/unavailable → treat as "no saved preference"
  (detection runs; modal shows; app is never blocked; modal is dismissible).
- If `localStorage` write throws → swallow the error; keep `locale` in React state
  (in-memory); the user continues uninterrupted.

## 3. String resolution & missing-translation behavior

`t(key)` resolves `strings[locale][key] ?? strings.en[key] ?? key`.

- **Users always see English fallback**, never a raw key or broken text.
- **Developers see missing keys:** on the first fallback step (active-locale string
  missing) `t` emits a `console.warn` **only when `import.meta.env.DEV`** is true.
- Returning the `key` itself is a last resort; the no-missing-keys test makes that
  unreachable for implemented (Phase-A) scope.

## 4. Runtime data flow

- **Switching language** (`setLocale(next)`) updates Context state **and** writes
  `localStorage`. All `useLanguage()` consumers re-render with new `t()` output.
  No `window.location` change, no `App` remount, no router, no reload.
- **Progress is a separate state tree** (`useProgress`); a locale change never touches
  it. Switching EN↔UZ does not reset progress and does not change the current
  view/lesson.
- **Modal and switcher share one code path** (both call `setLocale`); the modal also
  persists + closes on choice.
- **`LanguageModal` and `AuthModal` are independent overlays** (separate state); they
  cannot deadlock or affect each other, and neither touches progress.
- **Mobile:** `LanguageSwitcher` is a compact globe + `EN/UZ` segmented control,
  placed beside the existing account control following the mobile-topbar-polish
  pattern (no overflow at 390px).

## 5. Runtime architecture (Option A — chosen)

React Context provider + pure resolvers. Chosen over (B) i18next — a ~40KB dependency
and a flat key/value model we explicitly rejected — and (C) URL/route-driven locale,
which would force a router and SPA rewrites onto a deliberately router-free, statically
hosted app. Option A is the smallest, fully-testable design that satisfies every rule,
adds no dependency, and reuses two patterns already proven here (pure selectors like
`buildDashboardModel`, and the spread-merge used in `tracks.js` `BY_ID`).

## 6. File structure

### New files

**Pure / framework-light (no React except Context creation):**
- `src/i18n/LanguageContext.js` — `createContext` for `{ locale, setLocale, t }`.
- `src/i18n/detectLocale.js` — pure `detectLocale(saved, navigatorLanguages) → 'en'|'uz'`.
- `src/i18n/strings.js` — chrome catalog `{ en: {...}, uz: {...} }` (flat dotted keys);
  exports `createT(locale)` → pure `t` (EN fallback + dev-only `console.warn`).
- `src/i18n/glossary.js` — `{ term: { en, uz } }` + `bilingual(term)` →
  `"features (belgilar)"`. Single source of AI/ML terminology.

**React components (`.jsx`):**
- `src/i18n/LanguageProvider.jsx` — holds `locale` state, runs the fallback chain on
  mount, persists to `localStorage`, builds memoized `t`, renders children.
- `src/components/LanguageModal.jsx` — first-visit choice modal (mirrors `AuthModal`
  structure/classes; `role="dialog"`, `aria-modal="true"`, labelled buttons).
- `src/components/LanguageSwitcher.jsx` — compact EN/UZ segmented control (globe +
  segmented on mobile); used in topbar, sidebar, and Home nav.

**Hook:**
- `src/i18n/useLanguage.js` — `useLanguage()` reads the context; throws if used outside
  the provider.

**Styles:**
- `src/styles/redesign-i18n.css` — scoped modal + switcher styles; imported in `main.jsx`.

**Tests:**
- `src/i18n/detectLocale.test.js`
- `src/i18n/strings.test.js`
- `src/i18n/glossary.test.js`
- `src/i18n/LanguageProvider.test.jsx`
- `src/components/LanguageModal.test.jsx`
- `src/components/LanguageSwitcher.test.jsx`

### Modified files (Phase A)

- `src/main.jsx` — wrap `<App/>` in `<LanguageProvider>`; import `redesign-i18n.css`.
- `src/App.jsx` — render `LanguageModal` (first-visit) + place `LanguageSwitcher` in
  the topbar; thread the switcher into Home nav.
- Phase-A chrome components — swap inline strings for `t()`:
  `HomePage`, `Dashboard`, `Sidebar`, `Overview`, `AuthModal`, `AccountMenu`,
  `AccountPrompt`, `LevelView` (chrome labels only).

### Deliberately NOT touched in Phase A

`src/data/*` lesson content, activity components' body content, `useProgress`,
`cloudProgressService`, Supabase schema.

## 7. Phase A scope (what ships, what stops)

**Ships:** all i18n infrastructure; fully-populated EN+UZ chrome catalog for nav/topbar,
Home (hero, CTAs "Start learning"/"Explore curriculum", headings, marketing copy),
Dashboard (labels/stats/empty-state), AuthModal (sign in/up, reset, field labels,
errors), AccountMenu/AccountPrompt (sync states, "Saved on this device", sign out),
Sidebar (overall progress, streak, locked hints), Overview (chrome), and **LevelView
chrome** (I do / We do / You do, phase titles, "Course overview" back-link, continue
buttons, and **shared/generic** activity-shell buttons like "Check answers" that are
chrome — not per-activity body text); first-visit `LanguageModal`;
permanent `LanguageSwitcher` (topbar + sidebar + Home nav, mobile-compact);
localStorage persistence only.

**Deferred (NOT Phase A):**
- **Phase B:** lesson `i18n:{uz}` fields for **track titles / level names / lesson
  titles / concepts / track blurbs**; sidebar + overview content bilingual.
- **Phase C:** full lesson + activity body content, level by level (L0/L1 → L2 →
  L3/L4/L5).
- Any Supabase persistence of language.

### Expected mixed-language state in Phase A (NOT a bug)

After Phase A, with Uzbek selected, **UI chrome renders in Uzbek while lesson content,
track titles, level names, and lesson titles remain in English** (they fall back, by
design, until Phases B/C). This mixed state is **expected and correct** for Phase A.
The language modal copy and any "what's translated so far" affordance must not imply
the whole course is translated. Phase A acceptance explicitly allows English content
under an Uzbek chrome.

## 8. Glossary seed (Latin Uzbek; bilingual convention)

First mention of a hard term uses the bilingual form `"features (belgilar)"`; the
glossary is the single source so later phases stay consistent.

| en | uz |
|---|---|
| features | belgilar |
| labels | javoblar |
| training data | o‘quv ma’lumotlari |
| dataset | ma’lumotlar to‘plami |
| model | model |
| data | ma’lumot |
| prediction | bashorat |
| classification | klassifikatsiya |
| bias | noxolislik (bias) |
| overfitting | ortiqcha moslashuv (overfitting) |
| neural network | neyron tarmoq |

Translations are **drafted by the implementer and reviewed by the product owner**
before each phase merges.

## 9. Testing strategy

**Pure-unit (no React):**
- `detectLocale.test.js` — saved `uz`→uz; saved `en`→en; no-save + `['uz-UZ','en']`→uz;
  no-save + `['en-US']`→en; no-save + `[]`→en; malformed saved (`'fr'`,`''`,`null`)→
  falls through to detection.
- `strings.test.js` — (a) **no missing keys**: `Set(keys(en)) === Set(keys(uz))` for
  Phase-A chrome scope; (b) `t()` returns UZ when present; (c) `t()` falls back to EN
  when a UZ key is missing; (d) dev-warn fires on fallback when `import.meta.env.DEV`;
  (e) **Latin-only guard**: no Cyrillic (regex `/[Ѐ-ӿ]/`) anywhere in `strings.uz`.
- `glossary.test.js` — every entry has non-empty `en` + Latin-only `uz`;
  `bilingual('features') === 'features (belgilar)'`.

**Provider / integration (React):**
- `LanguageProvider.test.jsx`:
  - **preference saves**: `setLocale('uz')` writes `ai-academy:lang.v1='uz'`; remount
    reads it back as uz.
  - **switch doesn't reset progress**: seed `useProgress` `completed` keys, switch
    EN↔UZ, assert the actual `completed` map + stars are **byte-identical** after.
  - localStorage write throws → locale updates in memory, no throw to user.
  - localStorage read throws → provider mounts at detected/`en`, no crash.
- `LanguageModal.test.jsx`: shows when no saved pref; hidden when pref exists; picking
  English / O‘zbekcha calls `setLocale` + closes; dismissible (never blocks) when
  storage unavailable; doesn't touch auth or progress; **a11y**: `role="dialog"`,
  `aria-modal="true"`, headline-labelled, both buttons have clear accessible names.
- `LanguageSwitcher.test.jsx`: renders EN/UZ; reflects active locale
  (aria-pressed/active class); clicking toggles via `setLocale`; operable at a mobile
  viewport.
- **View/lesson stability**: open a lesson, switch EN↔UZ, assert the active view is
  still `'lesson'` and the same `levelIndex`/lesson ID remains active.

**Regression guard:** existing `useProgress.*.test`, `Dashboard.test`, `lessons.test`
stay green — proving Phase A is additive and progress/content are untouched.

## 10. Verification gate (before reporting; no merge/push)

1. `npm run security` (audit + secret scan) — clean.
2. `npm test` — all new + existing green.
3. `npm run build` — succeeds.
4. **Browser smoke (Chrome DevTools MCP):** first-visit modal appears → pick
   O‘zbekcha → chrome renders Uzbek (content English, by design); toggle switcher
   EN↔UZ live (no reload); open a lesson, switch, same lesson stays; mobile 390px —
   switcher compact, no overflow, modal usable; reload → preference persisted, no
   modal; auth modal + dashboard still work; console clean.

Then stop and report: files changed, tests, screenshots/visual summary, caveats
(including the expected mixed-language state). **No merge. No push.**

## 11. Risks & mitigations

- **Risk:** chrome refactor (~10 components) introduces a missing/typo'd key →
  **Mitigation:** no-missing-keys test + dev-warn + EN fallback (users never see breakage).
- **Risk:** mobile topbar overflow from the new switcher →
  **Mitigation:** reuse the compact/icon-only mobile pattern; 390px smoke check.
- **Risk:** users confused by Uzbek chrome over English content →
  **Mitigation:** §7 documents this as expected; modal copy avoids over-promising;
  Phases B/C close the gap.
- **Risk:** localStorage disabled (private mode) →
  **Mitigation:** in-memory fallback; app never blocked (§2).
- **Risk:** scope creep into content translation →
  **Mitigation:** §6 "NOT touched" + §7 deferred lists; data files untouched in Phase A.
