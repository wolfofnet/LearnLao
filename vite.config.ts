import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const isCapacitor = process.env.CAPACITOR === 'true'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: isCapacitor ? '/' : '/lao-learner/',
})
