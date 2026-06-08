// 실제 백엔드 호출을 우선하고, 미구현/미연결 API만 개발용 mock으로 대체하기 위한 공통 헬퍼.

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 인증 실패는 실제 상태이므로 mock으로 숨기지 않는다.
 * @param {unknown} error
 * @returns {boolean}
 */
export function shouldUseMockFallback(error) {
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
