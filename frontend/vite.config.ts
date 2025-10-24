import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Code splitting optimizado
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react']
        }
      }
    },
    
    // Target modern browsers
    target: 'es2020',
    
    // Chunk size warning
    chunkSizeWarningLimit: 1000,
    
    // Minify con esbuild (más rápido que terser)
    minify: 'esbuild',
    
    // No sourcemaps en production (más rápido)
    sourcemap: false
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion']
  },
  
  server: {
    port: 5173,
    strictPort: false
  }
})
