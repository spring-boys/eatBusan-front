// Vuetify 설정 — 테마/디자인 토큰은 docs/DESIGN_SYSTEM.md 기준.
// 색상은 여기 정의된 토큰을 컴포넌트에서 color="primary" 처럼 이름으로만 사용한다.
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

const eatBusanTheme = {
  dark: false,
  colors: {
    primary: '#0277BD', // 메인 (바다 블루)
    secondary: '#FF7043', // 포인트 (코랄)
    success: '#43A047',
    warning: '#FB8C00',
    error: '#E53935',
    info: '#039BE5',
    background: '#FAFAFA',
    surface: '#FFFFFF',
  },
}

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'eatBusanTheme',
    themes: { eatBusanTheme },
  },
  icons: {
    defaultSet: 'mdi',
  },
})
