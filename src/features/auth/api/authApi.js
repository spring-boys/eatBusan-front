// 인증 API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지).
// access token은 로그인 응답 Authorization 헤더로 오고, refresh token은 쿠키로 관리된다(client.js).
import { apiClient, extractBearer, setAccessToken, clearAccessToken } from '@/shared/api/client'

/** @typedef {import('../types/auth.js').JoinRequest} JoinRequest */
/** @typedef {import('../types/auth.js').LoginRequest} LoginRequest */
/** @typedef {import('../types/auth.js').MemberInfoResponse} MemberInfoResponse */

/**
 * 회원가입. 성공 시 201(본문 없음).
 * @param {JoinRequest} body
 * @returns {Promise<void>}
 */
export async function join(body) {
  await apiClient.post('/members/join', body)
}

/**
 * 로그인. 응답 Authorization 헤더의 access token을 저장하고 반환한다.
 * @param {LoginRequest} body
 * @returns {Promise<string>} access token
 */
export async function login(body) {
  const res = await apiClient.post('/members/login', body)
  const token = extractBearer(res.headers)
  if (!token) throw new Error('로그인 응답에 토큰이 없습니다.')
  setAccessToken(token)
  return token
}

/**
 * 내 정보 조회. 응답은 현재 email만 내려온다.
 * @returns {Promise<MemberInfoResponse>}
 */
export async function fetchMyInfo() {
  const { data } = await apiClient.get('/members/me')
  return data
}

/**
 * 로그아웃. 서버 refresh 무효화 + 런타임 토큰 삭제.
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await apiClient.post('/members/logout')
  } finally {
    clearAccessToken()
  }
}

/**
 * access token 수동 재발급(쿠키 기반). 보통은 client.js의 401 인터셉터가 자동 처리한다.
 * @returns {Promise<string>}
 */
export async function refresh() {
  const res = await apiClient.post('/members/refresh')
  const token = extractBearer(res.headers)
  if (token) setAccessToken(token)
  return token
}
