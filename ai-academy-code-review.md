# AI Academy — Senior Code Review

**Reviewer's framing:** I cloned the repo, installed it, ran the production build, ran the full test suite (234 tests), ran the secret scanner and `npm audit`, and read through the security-critical files line by line. This is a review written *to* you as the junior dev who owns it — so I explain not just *what* to change but *why* it matters and *what principle* sits underneath it, which is the part that makes you better for the next project.

**Headline verdict first, because you asked for honesty over diplomacy:** this is not "beginning stage" code. This is a well-architected, genuinely professional React codebase. The patterns here — a single service boundary for the backend, pure and heavily-tested merge logic, lazy-loaded WebGL with full resource cleanup, a plugin registry for activities, owner-only Row Level Security — are things I see *senior* developers get wrong. I went in expecting to find the usual beginner sins (hardcoded API keys, no tests, `console.log` everywhere, an `eval`, secrets in git) and found none of them. So this review is mostly *not* "you made mistakes." It is "here is what you did right and must not break, here are a small number of real issues, and here is the direction to take it from a strong personal project to a platform that scales."

---

## 1. How I checked it (so you can reproduce this yourself)

A senior dev's first move on any unfamiliar repo is to *make it run and make the checks scream*, before reading a single component. The repo already has the scripts for this, which is itself a good sign:

```bash
npm install
npm run build          # does it compile for production?
npm test               # do the 234 tests pass? (they do)
npm run security       # npm audit + custom secret scan
```

Results: build succeeds, all 31 test files / 234 tests pass, the secret scanner finds nothing, and `npm audit` reports exactly one issue (a dev-only one — covered below). That combination — green build, green tests, clean secret scan — is the baseline I'd want before touching anything, and you already have it wired into CI. Most "beginning stage" projects cannot say that.

---

## 2. What you did right (do not refactor these away)

I'm spending real space here on purpose. Knowing *why* something is correct is how you avoid "improving" it into a bug later.

**The single backend boundary (`src/utils/cloudProgressService.js`).** Every Supabase call in the entire app goes through this one file. Hooks and components never `import { createClient }` themselves. This is the single most important architectural decision in the codebase. It means: when Supabase changes, you edit one file; tests can inject a fake client via `__setClientForTest` and never touch the network; and the app degrades gracefully to "local-only mode" when env vars are absent (`isConfigured()` returns false and nothing ever hits the network). That last property is rare and valuable — the app is a fully working offline PWA *and* a cloud-synced app from the same code, with no branching spread across the UI. Principle: **isolate every external dependency behind a boundary you own.**

**Row Level Security is correct (`supabase/schema.sql`).** This is the part most people get dangerously wrong. Your policies are owner-only:

```sql
create policy "progress_select_own" on public.progress
  for select using (auth.uid() = user_id);
```

There is no anon read policy, RLS is enabled on the table, there's an `on delete cascade` so a deleted auth account takes its progress with it, and the script is idempotent (drop-then-create) so re-running it is safe. This means even though the anon key is shipped to the browser (which is *correct and expected* — see your own `.env.example`, which explains this well), a user physically cannot read another user's rows. The database, not the client, enforces the security. Principle: **never trust the client; enforce authorization in the data layer.**

**`mergeProgress` is pure and treated as load-bearing (`src/utils/mergeProgress.js`).** When a user signs in, their local (this-device) progress and their cloud (account) progress get merged so neither is lost — completed lessons union with the higher star score winning, streaks follow the most recent active day, `onboarded` is true if either side is. It's a pure function (no side effects), it never throws (`normalizeProgress` coerces garbage into a valid shape), and it has 14 unit tests. You correctly identified that "never erase a user's progress" is an invariant worth protecting with tests rather than hoping. Principle: **push your most important business rules into pure functions and test them exhaustively** — pure functions are trivial to test and reason about.

**The Pyodide service has timeouts on every async path (`src/utils/pyodideService.js`).** Running Python in the browser via WASM is genuinely hard, and the classic failure is a stalled CDN fetch or an infinite loop in student code freezing the Run button forever. You bounded all three: boot (60s), package load (60s), execution (15s), each via a `withTimeout` helper that always clears its timer. You also pinned the Pyodide version (`0.26.4`) rather than floating it, memoized the boot so it happens once per session, and added a test seam to swap the script loader. The one honest caveat *you already wrote in a comment*: a `withTimeout` rejects the promise but cannot truly *interrupt* CPU-bound Python on the main thread — that needs a Web Worker. Flagging your own known limitation in a comment is exactly right. Principle: **every await that crosses the network or runs untrusted code needs a finite timeout.**

**`Hero3D.jsx` is the best file in the repo.** It is purely decorative, and yet it does everything a performance- and accessibility-conscious senior would demand, unprompted:
- Three.js is imported **dynamically** (`await import('three')`) inside the effect, so it is a separate 732 kB chunk that never lands in the initial bundle and is only fetched when the hero actually mounts.
- It falls back to a static SVG (never the canvas) for `prefers-reduced-motion`, missing WebGL, or viewport < 640px — protecting battery, motion-sensitive users, and low-end devices.
- The render loop **pauses** when the hero scrolls offscreen (IntersectionObserver) and when the tab is hidden (visibilitychange). It never burns a frame it doesn't need.
- `devicePixelRatio` is capped at 1.5.
- And the cleanup function (lines 324–340) disposes *everything*: cancels the RAF, removes the pointer and visibility listeners, disconnects both observers, and disposes every geometry, material, the glow texture, and the renderer. **Forgetting to dispose WebGL resources on unmount is the #1 Three.js memory leak, and you handled it perfectly.** Principle: **anything you create in an effect (listeners, observers, timers, GPU resources) must be torn down in that effect's cleanup return.**

**The activity registry is a clean plugin pattern (`src/components/activities/index.js` + `ActivityShell.jsx`).** Adding a new interactive lesson type is a three-step recipe: build a component that takes `({ data, onResult })`, add it to the `ACTIVITIES` map under a string key, reference that key in a lesson's `activity.type`. The shell handles star-awarding, retry, and feedback uniformly so every lesson behaves the same. Twenty-five-plus activity types, most with their own tests. Principle: **map data to behavior through a registry, not a giant `switch` statement** — it keeps the system open for extension without editing the dispatcher.

**The pedagogy is engineered, not bolted on (`LevelView.jsx`).** The "I do / We do / You do" gradual-release-of-responsibility model is a real instructional-design framework, and it's implemented as data: a lesson with `guided` data gets the three-phase stepper; one without falls back gracefully to I-do → You-do. Content lives in data files (`src/data/*.js`) and is composed by ID in `tracks.js`, so re-grouping a lesson is a one-line change. This separation of content from rendering is exactly how you'd want a curriculum platform built.

**The supporting professional scaffolding is all present:** a `.gitignore` that correctly ignores `.env*` but allows `.env.example`; security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy) configured for both Vercel and Netlify with comments explaining *why* each CSP directive exists (Pyodide needs `wasm-unsafe-eval` and the jsdelivr origin); a custom secret scanner that greps for AWS/Google/GitHub/OpenAI key shapes; Dependabot; and a CI workflow that gates every push and PR on `security + test + build`. JSDoc is used consistently and accurately throughout. This is a mature setup.

---

## 3. Real issues, ranked by impact

There are not many, and none are catastrophic. I've ordered them by how much they matter, with the fix and the underlying lesson for each.

### 🔴 HIGH — The Uzbek translation corpus ships to every visitor (performance)

This is the one finding with a clear, measurable user impact, and it's very fixable.

**What's happening:** `useLocalizedTracks.js` statically imports `CURRICULUM_UZ` from `curriculum.uz.js`, which in turn statically imports the three large body files:

```js
// curriculum.uz.js
import { BODY_L2 } from './body.l2.uz.js'   // 44 KB
import { BODY_L4 } from './body.l4.uz.js'   // 100 KB
import { BODY_L5 } from './body.l5.uz.js'   // 44 KB
```

Because `useLocalizedTracks` is imported eagerly by `App.jsx`, a **static** import chain pulls the entire Uzbek lesson corpus — roughly 270 KB+ of uncompressed translation data, plus `curriculum.uz.js` (28 KB) and `strings.js` (52 KB) — into the main bundle. That's why your main chunk is 725 KB. **An English-only visitor downloads every word of the Uzbek course and never renders a character of it.** On a slow mobile connection in a region with expensive data — which, for an Uzbek-language learning platform, is a real and central audience — that's a meaningful tax on first load.

**The fix:** load each locale's body *on demand*. Statically import only the active locale's UI strings (small), and `import()` the heavy `uz` body bundle dynamically when, and only when, the locale is `uz`:

```js
// sketch — load the heavy locale bundle lazily
const loaders = {
  uz: () => import('./curriculum.uz.js').then(m => m.CURRICULUM_UZ),
}
// in the provider/hook, when locale === 'uz', await loaders.uz()
// English users never fetch it; Uzbek users fetch it once and it's cached.
```

Vite will automatically split each `import()` into its own chunk. You already proved you know this pattern — it's exactly what `Hero3D` does with Three.js and what `cloudProgressService` does with the Supabase SDK. This is applying the same instinct to the i18n layer.

**The principle:** *the initial bundle should contain only what's needed to render the first screen.* Everything conditional — a locale the user didn't pick, a 3D effect they may not see, an SDK they may not need — should be code-split behind a dynamic `import()`.

### 🟠 MEDIUM — No router: navigation is React state, not the URL (`App.jsx`)

You navigate with a `view` state variable (`'home' | 'dashboard' | 'overview' | 'lesson'`) instead of a router, and you've documented the trade-off honestly in a comment: it keeps deployment a plain static build with no SPA rewrite rules. **For an MVP, this is a legitimate and defensible choice, and I would not have made a different one to ship fast.** I'm flagging it not as a bug but because you described the ambition as a *"big learning online platform,"* and view-state navigation is the specific thing that puts a ceiling on that. Here's exactly what it costs you:

- **No deep links.** You cannot send someone a URL to lesson 7. Every link is the homepage.
- **The browser Back/Forward buttons don't work** the way users reflexively expect — Back leaves the app instead of going to the previous lesson.
- **Refresh always dumps the user back to Home**, losing their place in the navigation (their *progress* is safe in localStorage/cloud, but their current screen is not).
- **Analytics and SEO see one page.** You can't measure "how many people reached the CNN lesson" by URL, and search engines index a single route.

**The fix, when you're ready (not urgent today):** adopt a client router — `react-router-dom` is the standard, `@tanstack/router` if you want type-safe routes later. Map `/`, `/dashboard`, `/learn`, `/learn/:lessonId` to your existing views. Your data is already keyed by stable lesson `id`, so `/learn/cv-build-cnn` falls out almost for free. On a static host you add a single catch-all rewrite to `index.html` (you already have `vercel.json` and `netlify.toml`, so this is a two-line addition each). 

**The principle:** *in a web app, the URL is application state.* The moment you want to share, bookmark, measure, or browser-navigate to a place in the app, that place needs to live in the URL. Recognizing *when* a state-based shortcut has to graduate to a router is exactly the kind of judgment that separates "works as a demo" from "works as a platform."

### 🟠 MEDIUM — Build toolchain pinned to Node 18, which is end-of-life

Both `netlify.toml` and the two GitHub Actions workflows pin `NODE_VERSION = "18"` / `node-version: 18`. Node 18 ("Hydrogen") reached end-of-life in 2025 — it no longer receives security patches. Your *app* runs in the browser so this isn't a runtime risk to users, but it means your **build and CI environment** is running on an unmaintained Node, which is a supply-chain hygiene issue (no security fixes for the thing that compiles and publishes your site). Bump to Node 20 or 22 (both active LTS) in all three places. It's a one-character-ish change and your build already runs fine on Node 22 (that's what I tested it on). **Principle:** *keep the toolchain on a supported runtime; EOL software is a slow-moving security hole even when it "still works."*

### 🟡 LOW — One critical `npm audit` finding, but it's dev-only

`npm audit` flags one **critical** advisory in `vitest` (< 4.1.0; you're on 3.2.4): arbitrary file read/execute *when the Vitest UI server is listening*. Read the conditions carefully before you panic — this only bites if you run the Vitest UI server (`--ui`) and expose it on a reachable interface. It is a **devDependency**, it never ships to users, and you don't run the UI server in CI. So the *real-world* risk here is low. That said: fix it, because (a) defense in depth and (b) you already have a Dependabot PR open for the `vitest@4` bump. Merge it (it's a major version, so run the suite after — your 234 tests will tell you immediately if anything breaks). **Principle:** *triage vulnerabilities by reachability, not just by the scary-colored severity label* — but still clear them.

### 🟡 LOW — Dependabot PRs are accumulating unmerged

You have open Dependabot branches for React 19, Vite 8, Vitest 4, and `@vitejs/plugin-react` 6 sitting unmerged. Dependabot is doing its job; the gap is the *human triage cadence*. Dependency drift compounds — six months from now these become a painful big-bang upgrade instead of four small reviewed ones. Set a recurring habit (e.g. every other Friday): read each PR's changelog, let CI run, merge the safe ones. The React 19 and Vite 8 majors deserve a careful read and a manual smoke test; the rest are usually routine. **Principle:** *small, frequent dependency updates are cheap; deferred ones turn into projects.*

### 🟡 LOW — `const URL = import.meta.env...` shadows a global (`cloudProgressService.js`)

```js
const URL = import.meta.env?.VITE_SUPABASE_URL   // shadows the global URL
const ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY
```

`URL` is a built-in browser global (the `URL` constructor, `new URL(...)`). Naming a module constant `URL` shadows it inside this file. **There is no bug today** because this file never calls `new URL()`. But it's a latent footgun: the day someone adds URL parsing to this file, they'll get a confusing error or, worse, silently call your string. Rename to `SUPABASE_URL`. **Principle:** *don't shadow built-in globals* (`URL`, `name`, `location`, `event`, `top`, `length`...) — the bug it causes later is always more expensive than the rename now.

### ⚪ POLISH — A few doc comments have drifted as the project grew

Not bugs, but a senior keeps comments honest because stale comments actively mislead the next reader:
- `App.jsx` says *"It has three views"* then lists four (`home`, `dashboard`, `overview`, `lesson`).
- `tracks.js` header says the course is organized into *"LEVELS (L0, L1, L2, L3, L5)"* — it omits L4 (Computer Vision), which is right there in the same file.
- `levels.js` header describes *"The 10 lessons ... 10 DIFFERENT activity formats"* — there are now 20+ lessons and 25+ activity types.

These all read as comments written early and not updated as the curriculum expanded. **Principle:** *a wrong comment is worse than no comment* — when you change the shape of a thing, update the prose that describes it in the same commit.

### ⚪ POLISH — One hardcoded personal URL (`HomePage.jsx`)

There's a hardcoded `https://www.linkedin.com/in/javohiraz/` link. Completely fine for a personal portfolio project. *If* this becomes a multi-author platform, personal/brand links like this should move into a small config/constants module rather than living inline in a component — so there's one place to change them and no risk of a stray personal link shipping on a company property. Filing under "hardcoding," since you asked me to look for it — but it's the *only* instance I found, and it's benign.

---

## 4. Languages & stack — what to keep, add, and avoid

You asked specifically what languages and approaches to use and not use. Here's my direct take.

### The one big recommendation: adopt TypeScript

This is the highest-leverage change you can make to the codebase's future, and you've already done 80% of the conceptual work. Look at how much energy you're spending *manually* doing what a type system does for free:
- JSDoc `@param`/`@returns` annotations on most functions.
- `normalizeProgress()` exists to coerce arbitrary runtime values into a known shape because nothing guarantees that shape at compile time.
- `strings.test.js` exists partly to enforce that the `en` and `uz` key sets stay identical — a test doing a type-checker's job.
- Lesson objects have a rich, implicit shape (`id`, `title`, `activity.type`, `activity.data`, optional `guided`, `workedExample`, `video`...) documented only in a comment at the top of `levels.js`.

TypeScript would make all of that **compile-time guaranteed**: a `Lesson` type would catch a malformed lesson before it ever renders; an `ActivityType` union would make `ACTIVITIES` keys and `activity.type` values impossible to mismatch; a typed translation-key map would turn "missing i18n key" from a runtime fallback into a red squiggle in your editor. You don't have to migrate in a weekend — TS interoperates with JS file-by-file. Rename one `.js` to `.ts`, type it, repeat. Start with the data shapes (`tracks.js`, the progress snapshot) because that's where a shape bug is most expensive. **Verdict: should use, incrementally.**

### Keep these — they're the right calls

- **React 18 + Vite.** Correct, modern, fast. No reason to change. (Take the React 19 / Vite 8 upgrades deliberately, per the Dependabot note.)
- **Vitest + Testing Library.** The right test stack for Vite. Your tests assert *behavior* ("lets learners adjust numeric inputs") rather than implementation details, which is exactly how to write tests that don't shatter on every refactor.
- **Supabase (Postgres + Auth).** Excellent fit at this scale — you get auth, a real relational DB, and RLS without running a backend. It scales a long way before you'd outgrow it.
- **Pyodide for in-browser Python.** The clever heart of the product. No server to run student code, nothing to sandbox yourself, zero per-execution cost. Right tool.
- **Plain CSS with design tokens** (`redesign-tokens.css` + the `redesign-*.css` files). This is fine and intentionally lightweight. `global.css` is large (80 KB) and will eventually get unwieldy, but you don't have a problem yet.

### Add these only when you actually need them (not before)

- **A router** — `react-router-dom`. The trigger is the moment you want deep links / shareable lesson URLs (see the MEDIUM finding). That moment is coming if this becomes a platform.
- **CSS Modules** — *if and when* `global.css` becomes painful to navigate and you hit a class-name collision. It scopes styles per-component with zero runtime cost. Don't pre-emptively migrate; let the pain tell you.
- **A typed i18n library (`i18next`)** — *only if* your locale needs grow (pluralization rules, gendered strings, date/number formatting, 5+ languages). Your hand-rolled `detectLocale` + flat-key `t()` system is currently *lighter and perfectly adequate* for two languages, and I would not replace it today. Adding i18next now would be over-engineering.

### Avoid these — they'd be premature complexity

- **Redux / Zustand / any global state library.** Your `useProgress` and `useAuth` hooks plus prop-passing are the *correct* amount of state management for an app this size. A global store would add ceremony and indirection to solve a problem you don't have. The day a piece of state is needed by many deeply-nested components that can't easily receive props, reach for React Context (you already use it well for language) before reaching for Redux.
- **CSS-in-JS runtime libraries (styled-components, emotion).** They add a runtime cost and bundle weight to do what your design tokens already do statically. Your approach is *better* for a content-heavy site where first-load performance matters.
- **A framework switch (Next.js, Remix, etc.).** Tempting because they give you routing and SSR "for free," but they'd also impose a server/edge runtime and a much heavier deployment story, and they'd throw away a clean, working static-build setup. The day you genuinely need SSR for SEO on public marketing/lesson pages, *then* evaluate it — and even then, adding `react-router` to your current Vite app is the lighter first step.
- **Switching languages for the lesson runtime.** Pyodide (Python-in-WASM) is right for a course teaching Python/ML. Don't be tempted to reimplement exercises in JS to avoid the WASM payload — the payload is the point, it's lazy-loaded, and authentic Python is the product's value.

---

## 5. Prioritized action list

If I were handing you the next sprint, in order:

1. **Lazy-load the Uzbek bundle** (HIGH). One change, measurable first-load win for your core audience. Reuse the dynamic-`import()` pattern you already use for Three.js. (~half a day)
2. **Bump Node 18 → 20/22** in `netlify.toml` and both workflows (MEDIUM). Trivial, removes an EOL toolchain. (~15 min)
3. **Merge the `vitest@4` Dependabot PR**, run the suite, confirm green (LOW but clears the one audit finding). (~30 min)
4. **Rename `const URL` → `SUPABASE_URL`** (LOW). Trivial, removes a latent footgun. (~2 min)
5. **Fix the three stale doc comments** (POLISH). (~10 min)
6. **Triage the remaining Dependabot PRs** (React 19, Vite 8, plugin-react 6) deliberately, with smoke tests on the majors. (~half a day, do it before they pile higher)
7. **Plan the router migration** (MEDIUM, larger). Not this sprint necessarily, but it's the gating item for "big platform," so put it on the roadmap with eyes open rather than discovering the ceiling later.
8. **Begin an incremental TypeScript migration** starting with `src/data/` shapes (strategic, ongoing). The earlier you start, the less there is to convert.

Nothing here is an emergency. You've built something solid. The work above is the difference between a strong project and a platform — and the fact that the list is this short, with this little on it, is the real verdict on the quality of what you've built.

---

*Reviewed against the repository state at clone time. Build, 234 tests, secret scan, and `npm audit` all run locally on Node 22. Happy to do a focused deep-dive on any single section — the i18n resolver, the Pyodide grading flow, or a router migration plan — whenever you want to go a level deeper.*
