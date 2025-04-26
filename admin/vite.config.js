import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  define: {
    'import.meta.env': {} // Empty object to override the default behavior
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174,
  },
})
