// 식당 좋아요 API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지). 모두 인증 필요.
import { apiClient } from '@/shared/api/client'

/** @typedef {import('../types/placeLike.js').PlaceLikeDetail} PlaceLikeDetail */

/**
 * 식당 좋아요 (인증 필요)
 * @param {number} placeId
 * @returns {Promise<void>}
 */
export async function likePlace(placeId) {
  await apiClient.post(`/places/${placeId}/likes`)
}

/**
 * 식당 좋아요 취소 (인증 필요)
 * @param {number} placeId
 * @returns {Promise<void>}
 */
export async function unlikePlace(placeId) {
  await apiClient.delete(`/places/${placeId}/likes`)
}

/**
 * 내가 좋아요한 식당 목록 (커서 페이지네이션, lastId 이후 size개)
 * @param {{ lastId?: number, size?: number }} [params]
 * @returns {Promise<PlaceLikeDetail[]>}
 */
export async function fetchMyLikedPlaces({ lastId, size = 10 } = {}) {
  const { data } = await apiClient.get('/places/likes/my', { params: { lastId, size } })
  return data
}
