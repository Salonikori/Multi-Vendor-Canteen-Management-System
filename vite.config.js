import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Multi-Vendor-Canteen-Management-System/',

  plugins: [react()],

  server: {
    port: 5173,
    open: true,
  },
})