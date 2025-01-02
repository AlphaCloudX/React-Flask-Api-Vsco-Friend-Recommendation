import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 1000, // or any other port that is open and accessible
    host: 'localhost', // to allow external access
  },
})
