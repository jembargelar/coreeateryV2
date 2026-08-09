import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('react-router')) return 'react-vendor'
            if (id.includes('@supabase')) return 'supabase'
          },
      },
    },
  },
  plugins: [react()],
})
