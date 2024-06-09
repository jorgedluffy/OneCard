import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [react(), viteStaticCopy({
    targets: [
      {
        src: 'src/assets/cards/*',
        dest: 'assets/cards'
      }
    ]
  })],
  server: {
    proxy: {
      '/socket.io': {
        target: process.env.NODE_ENV === 'production' ? 'http://back:3000' : 'http://localhost:3000',
        ws: true
      }
    }
  },
  preview: {
    host: true,
    port: 80
  }
})
