// Vuetify 설정 — 테마/디자인 토큰은 docs/DESIGN.md 기준.
// 색상은 여기 정의된 토큰을 컴포넌트에서 color="primary" 처럼 이름으로만 사용한다.
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

// 가넷 + 허니 라이트 테마. 와인/자두 가넷이 행동·식욕, 허니 골드가 포인트, 로즈가 좋아요.
// 주황(탠저린)은 의도적으로 뺐다 — '테이블링' 등 주황 식당앱과 아이덴티티를 분리한다.
const eatBusanTheme = {
  dark: false,
  colors: {
    background: '#FAF6F2', // 따뜻한 아이보리 (크림 아님, 가넷으로 미세 틴트)
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    primary: '#B0234A', // 메인 행동 (가넷 — 와인·자두·고추장 톤)
    'primary-darken-1': '#8E1B3A',
    secondary: '#FF3D6A', // 좋아요/하트 (로즈 — 가넷 primary와 구분)
    'secondary-darken-1': '#E62F58',
    success: '#15B86B',
    warning: '#E8A53D', // 허니 골드 (별점·포인트)
    error: '#DC2626',
    info: '#2C8C8C', // 정보/지도·위치용 쿨 액센트 (소량)
    'on-background': '#211A17',
    'on-surface': '#211A17',
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
