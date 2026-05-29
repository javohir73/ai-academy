import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal Vite config: React plugin + relative base so the built app
// also works when opened from a sub-folder or static host.
export default defineConfig({
  base: './',
  plugins: [react()],
})
