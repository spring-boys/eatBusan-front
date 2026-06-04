// 식당(Place) API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지).
// VITE_USE_MOCK=true 면 백엔드 대신 개발용 시드로 동작한다 (mock은 동적 import → 프로덕션 번들 제외).
import { apiClient } from '@/shared/api/client'

/** @typedef {import('../types/place.js').PlaceResponse} PlaceResponse */
/** @typedef {import('@/features/post/types/post.js').PostResponse} PostResponse */

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 주변 식당 목록. (거리 정렬은 클라이언트에서 현재 위치 기준으로 수행)
 * @returns {Promise<PlaceResponse[]>}
 */
export async function fetchPlaces() {
  if (USE_MOCK) {
    const { mockFetchPlaces } = await import('./mockPlaces')
    return mockFetchPlaces()
  }
  const { data } = await apiClient.get('/places')
  return data
}

/**
 * 식당 단건
 * @param {number} id
 * @returns {Promise<PlaceResponse>}
 */
export async function fetchPlace(id) {
  if (USE_MOCK) {
    const { mockFetchPlace } = await import('./mockPlaces')
    return mockFetchPlace(id)
  }
  const { data } = await apiClient.get(`/places/${id}`)
  return data
}

/**
 * 식당 후기 목록
 * @param {number} id
 * @returns {Promise<PostResponse[]>}
 */
export async function fetchPlaceReviews(id) {
  if (USE_MOCK) {
    const { mockFetchPlaceReviews } = await import('./mockPlaces')
    return mockFetchPlaceReviews(id)
  }
  const { data } = await apiClient.get(`/places/${id}/posts`)
  return data
}
