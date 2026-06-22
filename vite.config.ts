import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Vuetify 컴포넌트 자동 import + 트리셰이킹
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // 개발 시 CORS 회피: /api 요청을 Spring(8081)으로 프록시
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      // 투표방 STOMP WebSocket → Spring(8081) 프록시
      '/ws-stomp': {
        target: 'ws://localhost:8081',
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
