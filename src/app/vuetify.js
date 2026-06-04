// Vuetify 설정 — 테마/디자인 토큰은 docs/DESIGN.md 기준.
// 색상은 여기 정의된 토큰을 컴포넌트에서 color="primary" 처럼 이름으로만 사용한다.
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

// 따뜻한 식욕 톤(탠저린/퍼시먼) 라이트 테마. 주황이 행동·식욕, 로즈가 좋아요.
// 파랑(바다)은 의도적으로 뺐다 — 음식 앞에서 식욕을 살리고, "해안=파랑" 반사를 피한다.
const eatBusanTheme = {
  dark: false,
  colors: {
    background: '#FBF8F5', // 웜 화이트 (크림 아님, 브랜드 주황으로 미세 틴트)
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    primary: '#F2541B', // 메인 행동 (감·노을·어묵국물 주황)
    'primary-darken-1': '#DA4711',
    secondary: '#FF4D6D', // 좋아요/하트 (로즈레드 — 주황 primary와 구분)
    'secondary-darken-1': '#E83A59',
    success: '#15B86B',
    warning: '#FFB300',
    error: '#DC2626',
    info: '#1FA9A0', // 정보/지도·위치용 쿨 액센트 (소량)
    'on-background': '#1F1A17',
    'on-surface': '#1F1A17',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
  },
  variables: {
    'border-color': '#1F1A17',
    'border-opacity': 0.08,
    'high-emphasis-opacity': 0.92,
    'medium-emphasis-opacity': 0.62,
    'disabled-opacity': 0.38,
  },
}

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'eatBusanTheme',
    themes: { eatBusanTheme },
  },
  defaults: {
    VBtn: { rounded: 'lg', flat: true },
    VTextField: { variant: 'solo-filled', flat: true, rounded: 'lg' },
    VCard: { flat: true },
  },
  icons: {
    defaultSet: 'mdi',
  },
})
