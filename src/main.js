import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { vuetify } from './app/vuetify'
import { useAuthStore } from '@/features/auth/store/authStore'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(vuetify)

// 세션 복구(refresh 쿠키 → access token)를 마운트보다 먼저 끝낸다.
// 늦으면 첫 화면의 조회가 무토큰으로 나가 liked 등 사용자 종속 필드가 빈 값으로 온다 (레이스).
useAuthStore(pinia)
  .restoreSession()
  .finally(() => app.mount('#app'))
