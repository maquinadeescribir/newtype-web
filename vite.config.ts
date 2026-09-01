import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // relative base so assets resolve under GitHub Pages subpath (user.github.io/repo/)
  base: './',
})
