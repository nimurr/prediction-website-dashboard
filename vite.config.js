import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or your framework plugin

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true, // allows access from network
    port: 4173, // your Vite preview port
    allowedHosts: ['admin.contesthunters.com'] // add your domain here
  }
})