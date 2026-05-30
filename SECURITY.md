# Security Policy

## Reporting a Security Issue

Please do not open a public issue for a security problem. Report it privately to
the project owner with:

- a short description of the issue
- steps to reproduce it
- affected URL, browser, or commit if known
- any screenshots or logs that help explain the risk

If this project is hosted in a public GitHub repository, use GitHub's private
vulnerability reporting when it is enabled. Otherwise, contact the repository
owner directly.

## Data Stored By The App

AI Academy is a static client-side app. It does not currently use a backend,
database, login system, payment system, analytics SDK, or server-side student
records.

The app stores learner progress in browser `localStorage` under:

```text
ai-academy:progress.v1
```

That progress data is not sensitive and should not contain names, emails,
passwords, API keys, private student records, or payment information.

## In-Browser Python

Code lessons run Python in the learner's browser with Pyodide. This keeps the
server side simple: learner code is not sent to this app's backend because there
is no backend.

Current limitations:

- Pyodide and Python packages are loaded from a pinned CDN at runtime.
- Python currently runs in the page context. Timeout guards catch stalled
  promises, but a future Web Worker is needed for hard cancellation of
  CPU-bound infinite loops.
- Do not store sensitive data in the same browser origin as learner-executed
  code.

Planned hardening:

- move Pyodide execution into a Web Worker
- add a visible cancel/restart runtime control
- consider a separate origin or iframe for code-running lessons if the platform
  later stores accounts, grades, or private student data

## Security Checks

Run the local checks before deploying:

```bash
npm run security
npm test
npm run build
```

The security command runs:

- `npm audit --audit-level=moderate`
- `node scripts/security-scan.mjs`

GitHub Actions also runs these checks on pushes and pull requests to `main`.

## Deployment Headers

Vercel and Netlify configs include conservative static-site headers:

- Content Security Policy for self-hosted assets, Google Fonts, and the pinned
  Pyodide CDN
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- restricted `Permissions-Policy`
- `X-Frame-Options: SAMEORIGIN`
- `Strict-Transport-Security` (HSTS) — Vercel adds this automatically; it is set
  explicitly in `netlify.toml` so Netlify deploys match.

**Why the CSP allows `eval`:** the policy is otherwise a tight allow-list
(`default-src 'self'`, `object-src 'none'`, `base-uri 'self'`,
`frame-ancestors 'self'`). It deliberately permits `'wasm-unsafe-eval'` **and**
`'unsafe-eval'` in `script-src`, and the `https://cdn.jsdelivr.net` origin in
`script-src`/`connect-src`, because **Pyodide/WebAssembly cannot run without
them**. This is the accepted, documented cost of running real Python in the
browser. If a future version drops Pyodide, remove those allowances (and the
jsDelivr origins) to tighten the CSP.

These headers apply on the **next deploy** after the config is published; an
existing deploy made before the config was added will not have them until it is
redeployed.

GitHub Pages does not support custom response headers from this repository. If
you need those headers on GitHub Pages, place a CDN such as Cloudflare in front
of it.
