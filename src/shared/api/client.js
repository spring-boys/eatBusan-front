// 공통 axios 인스턴스. 모든 API 호출은 이 client를 거친다 (직접 axios 호출 금지).
// - baseURL '/api' : 개발 시 Vite proxy가 http://localhost:8081 로 전달
// - 요청 인터셉터 : access token 자동 주입
// - 응답 인터셉터 : 공통 에러 처리 지점
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10_000,
})

// 토큰 저장 위치는 auth 기능 구현 시 확정 (현재는 localStorage 가정)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: 공통 에러 처리(401 → 로그인 이동, 토스트 등)는 팀 정책에 맞춰 확장
    return Promise.reject(error)
  },
)
