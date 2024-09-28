import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      components: "/src/components",
      directives: "/src/directives",
      models: "/src/models",
      assets: "/src/assets",
      scss: "/src/scss",
      pages: "/src/pages",
      socket: "/src/socket"
    }
  }
})
