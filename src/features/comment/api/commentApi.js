// 댓글 API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지).
// VITE_USE_MOCK=true 면 백엔드 대신 개발용 시드로 동작한다 (mock은 동적 import → 프로덕션 번들 제외).
import { apiClient } from '@/shared/api/client'

/** @typedef {import('@/shared/types/api.js').PageParams} PageParams */
/** @typedef {import('../types/comment.js').CommentRequest} CommentRequest */

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const base = (postId) => `/posts/${postId}/comments`

/**
 * 댓글 목록 (오프셋 페이지네이션). 응답은 axios 형태({ data })로 통일.
 * @param {number} postId
 * @param {PageParams} params
 */
export async function fetchComments(postId, params) {
  if (USE_MOCK) {
    const { mockFetchComments } = await import('./mockComments')
    return { data: await mockFetchComments(postId, params) }
  }
  return apiClient.get(base(postId), { params })
}

/**
 * 댓글 작성
 * @param {number} postId
 * @param {CommentRequest} body
 */
export async function createComment(postId, body) {
  if (USE_MOCK) {
    const { mockCreateComment } = await import('./mockComments')
    await mockCreateComment(postId, body)
    return { data: null }
  }
  return apiClient.post(base(postId), body)
}

/**
 * 댓글 수정
 * @param {number} postId
 * @param {number} commentId
 * @param {CommentRequest} body
 */
export function updateComment(postId, commentId, body) {
  return apiClient.patch(`${base(postId)}/${commentId}`, body)
}

/**
 * 댓글 삭제 (서버에서 소프트 삭제 처리)
 * @param {number} postId
 * @param {number} commentId
 */
export async function deleteComment(postId, commentId) {
  if (USE_MOCK) {
    const { mockDeleteComment } = await import('./mockComments')
    await mockDeleteComment(postId, commentId)
    return { data: null }
  }
  return apiClient.delete(`${base(postId)}/${commentId}`)
}
