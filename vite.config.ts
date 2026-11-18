import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Relative base keeps the build working at /learning-experience-portfolio/ on GitHub Pages and locally.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
