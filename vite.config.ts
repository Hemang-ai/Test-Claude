import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites under /<repo>/. The deploy workflow sets
// VITE_BASE to that path; local dev and custom domains use '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
})
