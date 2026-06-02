import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite config: React plugin + absolute base.
// base MUST be '/' (not './') now that we use client-side routing: on a deep
// link like /learn/:lessonId the browser resolves relative asset URLs against
// /learn/, so './assets/x.js' would 404 (served index.html → wrong MIME) and
// the app would never mount. Absolute '/assets/...' resolves correctly at any
// route depth. The SPA host rewrites (vercel.json / netlify.toml) return
// index.html only for non-asset paths.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
