import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    proxy: {
      // Cubre /api/v2/... (y cualquier /api/* si lo necesitas)
      '/api': {
        target: 'https://pokeapi.co',
        changeOrigin: true,
        // sin rewrite: /api/v2/... -> https://pokeapi.co/api/v2/...
      },
      // Obtener un pokemon por id

    },
  }
})
