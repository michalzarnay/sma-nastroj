import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Ignore Vercel serverless functions – Vite cannot bundle them
    watch: {
      ignored: ['**/api/**'],
    },
  },
  optimizeDeps: {
    exclude: ['api'],
  },
})
