// 후기(Post) API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지).
// VITE_USE_MOCK=true 면 백엔드 대신 개발용 시드로 동작한다 (mock은 동적 import → 프로덕션 번들 제외).
import { apiClient } from '@/shared/api/client'

/** @typedef {import('../types/post.js').PostResponse} PostResponse */
/** @typedef {import('../types/post.js').PostLikeResponse} PostLikeResponse */

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

/**
 * 후기 목록 (오프셋 페이지네이션, page 1부터)
 * @param {number} page
 * @param {number} size
 * @returns {Promise<PostResponse[]>}
 */
export async function fetchPosts(page, size) {
  if (USE_MOCK) {
    const { mockFetchPosts } = await import('./mockPosts')
    return mockFetchPosts(page, size)
  }
  const { data } = await apiClient.get('/posts', { params: { page, size } })
  return data
}

/**
 * 좋아요 토글 (인증 필요)
 * @param {number} postId
 * @returns {Promise<PostLikeResponse>}
 */
export async function toggleLike(postId) {
  if (USE_MOCK) {
    const { mockToggleLike } = await import('./mockPosts')
    return mockToggleLike(postId)
  }
  const { data } = await apiClient.post(`/posts/${postId}/likes`)
  return data
}
