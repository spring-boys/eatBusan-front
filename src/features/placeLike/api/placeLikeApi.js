// 식당 좋아요 API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지). 모두 인증 필요.
import { apiClient } from '@/shared/api/client'
import { USE_MOCK, shouldUseMockFallback } from '@/shared/api/mockFallback'

/** @typedef {import('../types/placeLike.js').PlaceLikeDetail} PlaceLikeDetail */

/**
 * @param {string|number|null|undefined} value
 * @returns {number}
 */
function toCount(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * @param {Record<string, unknown>} dto
 * @returns {PlaceLikeDetail}
 */
function normalizePlaceLike(dto) {
  const placeLikeId = Number(dto.placeLikeId ?? dto.id)
  const placeId = Number(dto.placeId)
  if (!Number.isFinite(placeLikeId) || !Number.isFinite(placeId)) {
    throw new Error('invalid place like response')
  }

  return {
    placeLikeId,
    placeId,
    code: String(dto.code ?? ''),
    name: String(dto.name ?? ''),
    address: String(dto.address ?? ''),
    areaCode: String(dto.areaCode ?? dto.area_cde ?? ''),
    phone: String(dto.phone ?? ''),
    url: String(dto.url ?? ''),
    likeCnt: toCount(dto.likeCnt ?? dto.likeCount),
  }
}

/**
 * @param {unknown} data
 * @returns {PlaceLikeDetail[]}
 */
function unwrapPlaceLikes(data) {
  const list = Array.isArray(data) ? data : data?.items
  if (!Array.isArray(list)) throw new Error('invalid place like list response')
  return list.map(normalizePlaceLike)
}

/**
 * 식당 좋아요 (인증 필요)
 * @param {number} placeId
 * @returns {Promise<void>}
 */
export async function likePlace(placeId) {
  const fetchMock = async () => {
    const { mockLikePlace } = await import('./mockPlaceLikes')
    return mockLikePlace(placeId)
  }
  if (USE_MOCK) return fetchMock()

  try {
    await apiClient.post(`/places/${placeId}/likes`)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 식당 좋아요 취소 (인증 필요)
 * @param {number} placeId
 * @returns {Promise<void>}
 */
export async function unlikePlace(placeId) {
  const fetchMock = async () => {
    const { mockUnlikePlace } = await import('./mockPlaceLikes')
    return mockUnlikePlace(placeId)
  }
  if (USE_MOCK) return fetchMock()

  try {
    await apiClient.delete(`/places/${placeId}/likes`)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 내가 좋아요한 식당 목록 (커서 페이지네이션, lastId 이후 size개)
 * @param {{ lastId?: number, size?: number }} [params]
 * @returns {Promise<PlaceLikeDetail[]>}
 */
export async function fetchMyLikedPlaces({ lastId, size = 10 } = {}) {
  const fetchMock = async () => {
    const { mockFetchMyLikedPlaces } = await import('./mockPlaceLikes')
    return mockFetchMyLikedPlaces({ lastId, size })
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.get('/places/likes/my', { params: { lastId, size } })
    return unwrapPlaceLikes(data)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}
