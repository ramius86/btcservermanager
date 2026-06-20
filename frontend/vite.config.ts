import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: __dirname,
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-react',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
              priority: 100,
            },
            {
              name: 'vendor-ui',
              test: /[\\/]node_modules[\\/](lucide-react|@radix-ui|@hello-pangea|clsx|tailwind-merge)[\\/]/,
              priority: 90,
            },
            {
              name: 'vendor-utils',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
            }
          ]
        }
      }
    }
  }
})
