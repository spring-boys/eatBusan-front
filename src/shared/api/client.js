// 공통 axios 인스턴스. 모든 API 호출은 이 client를 거친다 (직접 axios 호출 금지).
// 인증 방식(백엔드 기준):
//  - access token: 로그인 응답 `Authorization` 헤더(Bearer)로 내려옴 → localStorage 저장 후 요청 헤더에 주입
//  - refresh token: HttpOnly 쿠키(EBRefreshToken) → withCredentials 로 자동 전송, /members/refresh 로 재발급
import axios from 'axios'

const ACCESS_TOKEN_KEY = 'accessToken'

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const setAccessToken = (token) => {
  if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token)
  else localStorage.removeItem(ACCESS_TOKEN_KEY)
}
export const clearAccessToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY)

/** 응답 `Authorization: Bearer xxx` 헤더에서 토큰만 추출 */
export const extractBearer = (headers) => {
  const raw = headers?.authorization || headers?.Authorization
  if (!raw) return null
  return raw.startsWith('Bearer ') ? raw.slice(7) : raw
}

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  withCredentials: true, // refresh 쿠키(EBRefreshToken) 전송용
})

// 요청: access token 주입 (Bearer)
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- 401 → refresh 단일 비행(single-flight) 처리 ---
let refreshing = null

/** 리프레시 쿠키로 새 access token 발급. apiClient를 쓰지 않아 인터셉터 재귀를 피한다. */
async function refreshAccessToken() {
  const res = await axios.post('/api/members/refresh', null, { withCredentials: true })
  const token = extractBearer(res.headers)
  if (!token) throw new Error('no access token in refresh response')
  setAccessToken(token)
  return token
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const isRefreshCall = original?.url?.includes('/members/refresh')

    // 401이고 아직 재시도 안 한 일반 요청이면 refresh 후 1회 재시도
    if (status === 401 && original && !original._retried && !isRefreshCall) {
      original._retried = true
      try {
        refreshing = refreshing ?? refreshAccessToken()
        const token = await refreshing
        refreshing = null
        original.headers.Authorization = `Bearer ${token}`
        return apiClient(original)
      } catch (refreshErr) {
        refreshing = null
        clearAccessToken()
        return Promise.reject(refreshErr)
      }
    }

    return Promise.reject(error)
  },
)
