# AI Academy

AI Academy is a browser-based learning platform for students who want to learn
AI and Machine Learning from scratch. It is built as a concept-first course:
students start with friendly explanations and interactive practice, then move
into real Python only when they are ready.

The app currently ships **22 interactive lessons** across curriculum Levels 0,
1, 2, 3, and 5. Levels 0 and 1 are code-free. Code lessons begin in Level 2 and
run directly in the browser with Pyodide, so there is no backend setup for the
learner.

## Current Curriculum

| Level | Title | Status |
|-------|-------|--------|
| L0 | Foundations | What data is and why examples matter |
| L1 | Fundamentals of AI | AI basics and responsible AI |
| L2 | Introduction to Machine Learning | ML concepts plus first Python models |
| L3 | Problem Solving & Search | BFS maze search in Python |
| L4 | Computer Vision | Coming soon |
| L5 | LLMs in Practice - Evaluation & Responsible AI | AI model evaluation practice |

The full curriculum files live in `curriculum/`. The running app uses the lesson
data in `src/data/`.

## Learning Model

Each lesson follows the same beginner-friendly rhythm:

1. **I do** - plain-English concept, everyday example, and worked example.
2. **We do** - guided practice with hints.
3. **You do** - an interactive mastery check with feedback and stars.

This keeps the experience closer to Khan Academy or Coursera than a raw coding
notebook. Students earn their way into code instead of being dropped into it on
day one.

## Features

- Responsive React app with sidebar navigation and mobile drawer.
- Chained lesson unlocks, progress tracking, stars, and streaks.
- Code badges for Python lessons.
- In-browser Python powered by Pyodide.
- Notebook-style activities with starter code, hidden tests, hints, retry, and
  reset.
- Concept activities including sorting, matching, dataset choice, prediction
  sliders, bias spotting, overfitting comparison, neural-network building, and
  AI-evaluation tasks.
- Progress saved locally in `localStorage`; no account or backend required.

## Tech Stack

- React 18 + Vite 5
- JavaScript
- Plain CSS in `src/styles/global.css`
- `lucide-react` icons
- Pyodide loaded lazily from a pinned CDN at runtime
- Vitest + Testing Library

## Running Locally

You need Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually:

```text
http://localhost:5173
```

Useful commands:

```bash
npm test
npm run build
npm run preview
npm run security
```

## Deploying Online

The app builds to **static files** in `dist/`, so it hosts on Vercel, Netlify,
GitHub Pages, Cloudflare Pages, S3, or any static host. There is no backend to
provision.

Universal build settings (any host):

```text
Build command:     npm run build
Publish directory: dist
Node version:      18+ (set NODE_VERSION=18 if the host needs it)
```

**Two things worth knowing up front:**

- **No `base` change needed, anywhere.** `vite.config.js` sets `base: './'`
  (relative asset URLs), so the same build works at a domain root (Vercel,
  Netlify) *and* under a sub-path (`https://user.github.io/<repo>/`, GitHub
  Pages) without edits.
- **No SPA-routing/404 config needed.** The app is a single page with no
  client-side router — there are no deep-link routes to rewrite, so you do
  **not** need a `_redirects` / catch-all / `404.html` rule.
- **Runtime needs the CDN.** Pyodide and Python packages download in the
  learner's browser from the pinned jsDelivr CDN the first time a Level 2+ code
  lesson opens. The hosted site itself is static, but learners need normal
  internet access for those code lessons (concept lessons work regardless).

### Vercel (zero-config)

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New → Project → Import** the repo.
3. Vercel auto-detects Vite. Confirm: Build `npm run build`, Output `dist`.
4. **Deploy.** Every push to the default branch redeploys.

CLI alternative: `npm i -g vercel && vercel` (then `vercel --prod`).

### Netlify

A `netlify.toml` is included (build = `npm run build`, publish = `dist`), so:

1. Push the repo to your Git host.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
   The settings come from `netlify.toml` — just confirm and deploy.

CLI / drag-and-drop alternatives: `npx netlify-cli deploy --prod`, or build
locally and drag the `dist/` folder onto the Netlify dashboard.

### GitHub Pages

A workflow is included at `.github/workflows/deploy-pages.yml` that builds on
every push to `main` and publishes `dist/` to Pages. One-time setup:

1. Push the repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main` (or re-run the workflow). The site publishes at
   `https://<user>.github.io/<repo>/`. Because `base` is relative, no further
   config is required.

Manual alternative (no Actions): `npm run build`, then publish `dist/` with
`npx gh-pages -d dist`.

## Security

Before deploying, run:

```bash
npm run security
npm test
npm run build
```

Security tooling included in this repo:

- `npm run security:audit` checks dependency advisories.
- `npm run security:secrets` scans the repo for high-confidence secrets.
- `.github/workflows/security.yml` runs security checks, tests, and build on
  pushes and pull requests to `main`.
- `.github/dependabot.yml` asks GitHub to open weekly dependency update PRs.
- `vercel.json` and `netlify.toml` set security headers for static hosting.
- `SECURITY.md` documents data storage, Pyodide limitations, and reporting.

## Project Structure

```text
src/
  App.jsx                         layout shell and view state
  data/
    foundations.js                Level 0 lesson data
    levels.js                     Levels 1-3 lesson data
    intermediate.js               Level 5 evaluator lesson data
    tracks.js                     track composition and flat lesson order
  hooks/
    useProgress.js                localStorage progress and unlock rules
  utils/
    pyodideService.js             singleton Pyodide runtime owner
  components/
    LevelView.jsx                 I-do / We-do / You-do lesson renderer
    ActivityShell.jsx             shared grading, feedback, stars, retry
    Overview.jsx                  course home and track cards
    Sidebar.jsx                   course navigation
    activities/
      NotebookGame.jsx            runnable Python code-cell activity
      index.js                    activity type registry
```

## In-Browser Python

`src/utils/pyodideService.js` owns the Pyodide runtime:

- lazy-loads the pinned Pyodide CDN script
- memoizes boot so Python starts once per session
- resets the namespace between notebook activities
- captures stdout and stderr
- loads requested Python packages
- runs hidden assertion tests in the same namespace
- applies timeouts around boot, package loading, code execution promises, and
  tests so network stalls fail with friendly retry paths

Notebook activities use the same activity contract as the rest of the app:

```jsx
function Activity({ data, onResult }) {
  onResult({ correct: true })
}
```

This lets code lessons plug into the existing feedback, stars, and progression
system.

## Adding A Lesson

1. Add the lesson object to the right data file:
   - `src/data/foundations.js` for Level 0
   - `src/data/levels.js` for Levels 1-3
   - `src/data/intermediate.js` for Level 5
2. Add the lesson id to the appropriate track in `src/data/tracks.js`.
3. Add an icon mapping in `src/components/levelIcons.js`.
4. Use an existing activity type from `src/components/activities/index.js`, or
   create and register a new one.

Code lessons should use:

```js
{
  kind: 'code',
  activity: {
    type: 'notebook',
    data: {
      packages: ['scikit-learn'],
      starter: '...',
      tests: '...',
      hints: ['...']
    }
  }
}
```

## Progress Storage

Progress (completed lessons, stars, streak, onboarded state) is **always** saved
locally in the browser under:

```text
ai-academy:progress.v1
```

To reset local progress in the browser console:

```js
localStorage.removeItem('ai-academy:progress.v1')
```

If Supabase is configured (see below), a signed-in user's progress **also** syncs
to the cloud. localStorage stays the source of truth on each device, so the app
works fully offline and for anonymous users regardless.

## Accounts & Cloud Sync (Supabase)

Accounts are **optional**. With no Supabase env vars set, the app runs in
**local-only mode** — anonymous, browser-saved progress, no sign-in UI, no
network calls. Add the env vars to enable email/password accounts and
cross-device cloud sync. (Anonymous learners are gently invited to create an
account only after completing 3 lessons.)

**Architecture:** all Supabase access lives behind `src/utils/cloudProgressService.js`
(the only file that imports the SDK). `src/utils/mergeProgress.js` is the pure,
unit-tested merge used on sign-in so neither local nor cloud progress is ever
lost (union of completed lessons, higher star score per lesson, carefully merged
streak). `useProgress(user)` stays backward compatible — called with no user it
behaves exactly as the original local-only hook.

### 1. Create a Supabase project

Sign up at [supabase.com](https://supabase.com) (free tier is enough) and create
a project.

### 2. Apply the database schema

Supabase Dashboard → **SQL Editor** → paste [`supabase/schema.sql`](supabase/schema.sql)
→ **Run**. This creates a `progress` table with **Row Level Security** enabled and
owner-only policies (`auth.uid() = user_id`), so each user can read/write only
their own row and progress is never publicly readable.

### 3. (Optional) Email settings

Auth → Providers → Email is on by default. For the smoothest first run you can
disable "Confirm email" while testing; for production, leave confirmation on.
Password reset works out of the box (the app calls `resetPasswordForEmail` and
redirects back to the site origin).

### 4. Configure environment variables

Copy `.env.example` to `.env` and fill in the two **public** values from
Supabase Dashboard → **Project Settings → API**:

```bash
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
```

> **Security:** only the **anon / public** key goes in the app. RLS protects the
> data. **Never** put the `service_role` (secret) key in frontend env or commit
> any real key — `.env*` is gitignored, and `npm run security:secrets` scans for
> leaked keys.

### 5. Add the same vars on Vercel

Vercel Dashboard → your project → **Settings → Environment Variables** → add
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Production, Preview, and
Development as you like) → **redeploy**. (Netlify: Site settings → Environment
variables — same two keys.)

> **Content-Security-Policy note:** the CSP in `vercel.json` and `netlify.toml`
> already allows `https://*.supabase.co` and `wss://*.supabase.co` in
> `connect-src`, so auth and sync work once the env vars are set — no header
> changes needed.

## Roadmap

- Add more Level 3 neural-network lessons.
- Add Level 4 Computer Vision.
- Add richer projects and portfolio artifacts.
- Move Pyodide execution into a Web Worker before heavy public use, so long or
  infinite CPU-bound Python code can be interrupted without blocking the main UI
  thread.
- Add real lesson videos or short animations to replace placeholders.

## Current Verification

The expected local quality gate is:

```bash
npm test
npm run build
```

Both should pass before shipping changes.
