import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // ✅ Forzar alias para components
      '@components': path.resolve(__dirname, './src/components')
    }
  },
  server: {
    port: 5173
  }
})