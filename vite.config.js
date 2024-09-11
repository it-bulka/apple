import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  build: {
    rollupOptions: {
      input: '/src/main.jsx', // Ensure this matches your main entry point
    },
  },
  assetsInclude: ['**/*.glb'],
})
