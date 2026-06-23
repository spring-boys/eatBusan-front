// 실제 백엔드 호출을 우선하고, 미구현/미연결 API만 개발용 mock으로 대체하기 위한 공통 헬퍼.

// mock 은 "개발 환경 전용"이다. 프로덕션 빌드에서는 절대 켜지지 않게 import.meta.env.DEV 로 가드한다.
// (배포 환경에서 백엔드 장애가 가짜 데이터로 가려지면 디버깅 불가 + 사용자에게 거짓 성공을 보여주기 때문)
const IS_DEV = import.meta.env.DEV

export const USE_MOCK = IS_DEV && import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 인증 실패는 실제 상태이므로 mock으로 숨기지 않는다.
 * 프로덕션에서는 어떤 에러든 mock 폴백을 하지 않는다 (실제 에러를 그대로 노출).
 * @param {unknown} error
 * @returns {boolean}
 */
export function shouldUseMockFallback(error) {
  if (!IS_DEV) return false // 프로덕션: 폴백 금지
  const status = error?.response?.status
  if (status === 401 || status === 403) return false
  if (!error?.response) return true
  return [404, 405, 501, 502, 503, 504].includes(status)
}

/**
 * @template T
 * @param {() => Promise<T>} request
 * @param {() => Promise<T>} fallback
 * @returns {Promise<T>}
 */
export async function withMockFallback(request, fallback) {
  if (USE_MOCK) return fallback()
  try {
    return await request()
  } catch (error) {
    if (shouldUseMockFallback(error)) return fallback()
    throw error
  }
}
