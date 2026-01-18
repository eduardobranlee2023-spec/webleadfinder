import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Este archivo es el "traductor" que Vercel necesita para entender tu código de React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    // Esto asegura que los archivos finales se guarden en una carpeta que Vercel entiende
    outDir: 'dist',
  }
})