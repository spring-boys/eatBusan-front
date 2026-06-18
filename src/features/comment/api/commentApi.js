// 댓글 API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지).
// VITE_USE_MOCK=true 면 백엔드 대신 개발용 시드로 동작한다 (mock은 동적 import → 프로덕션 번들 제외).
import { apiClient } from '@/shared/api/client'
import { USE_MOCK, shouldUseMockFallback } from '@/shared/api/mockFallback'

/** @typedef {import('@/shared/types/api.js').PageParams} PageParams */
/** @typedef {import('../types/comment.js').CommentRequest} CommentRequest */
/** @typedef {import('../types/comment.js').MyCommentResponse} MyCommentResponse */

const base = (postId) => `/posts/${postId}/comments`

/**
 * @param {Record<string, unknown>} dto
 * @returns {import('../types/comment.js').CommentResponse}
 */
function normalizeComment(dto) {
  const id = Number(dto.id ?? dto.commentId)
  if (!Number.isFinite(id)) throw new Error('invalid comment id')
  return {
    id,
    content: String(dto.content ?? ''),
    createdAt: String(dto.createdAt ?? new Date().toISOString()),
    authorNickname: dto.authorNickname ? String(dto.authorNickname) : undefined,
  }
}

/**
 * @param {unknown} data
 * @returns {import('../types/comment.js').CommentResponse[]}
 */
function unwrapComments(data) {
  const list = Array.isArray(data) ? data : data?.items
  if (!Array.isArray(list)) throw new Error('invalid comment response')
  return list.map(normalizeComment)
}

/**
 * @param {Record<string, unknown>} dto
 * @returns {MyCommentResponse}
 */
function normalizeMyComment(dto) {
  const id = Number(dto.id ?? dto.commentId)
  const postId = Number(dto.postId)
  if (!Number.isFinite(id) || !Number.isFinite(postId)) {
    throw new Error('invalid my-comment id')
  }
  return {
    id,
    postId,
    postTitle: String(dto.postTitle ?? ''),
    content: String(dto.content ?? ''),
    createdAt: String(dto.createdAt ?? new Date().toISOString()),
  }
}

/**
 * 댓글 목록 (오프셋 페이지네이션). 응답은 axios 형태({ data })로 통일.
 * @param {number} postId
 * @param {PageParams} params
 */
export async function fetchComments(postId, params) {
  const fetchMock = async () => {
    const { mockFetchComments } = await import('./mockComments')
    return { data: await mockFetchComments(postId, params) }
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.get(base(postId), {
      params: { cursor: params?.cursor, size: params?.size },
    })
    return { data: unwrapComments(data) }
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 댓글 작성
 * @param {number} postId
 * @param {CommentRequest} body
 */
export async function createComment(postId, body) {
  const fetchMock = async () => {
    const { mockCreateComment } = await import('./mockComments')
    await mockCreateComment(postId, body)
    return { data: null }
  }
  if (USE_MOCK) return fetchMock()

  try {
    return await apiClient.post(base(postId), body)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 댓글 수정
 * @param {number} postId
 * @param {number} commentId
 * @param {CommentRequest} body
 */
export async function updateComment(postId, commentId, body) {
  const fetchMock = async () => {
    const { mockUpdateComment } = await import('./mockComments')
    await mockUpdateComment(postId, commentId, body)
    return { data: null }
  }
  if (USE_MOCK) return fetchMock()

  try {
    return await apiClient.patch(`${base(postId)}/${commentId}`, body)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 댓글 삭제 (서버에서 소프트 삭제 처리)
 * @param {number} postId
 * @param {number} commentId
 */
export async function deleteComment(postId, commentId) {
  const fetchMock = async () => {
    const { mockDeleteComment } = await import('./mockComments')
    await mockDeleteComment(postId, commentId)
    return { data: null }
  }
  if (USE_MOCK) return fetchMock()

  try {
    return await apiClient.delete(`${base(postId)}/${commentId}`)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 내가 작성한 댓글 목록 (인증 필요). 페이지네이션 없이 전체를 한 번에 반환한다.
 * 응답은 MyCommentDto 배열(id·postId·postTitle·content·createdAt).
 * @returns {Promise<MyCommentResponse[]>}
 */
export async function fetchMyComments() {
  const { data } = await apiClient.get('/posts/comments/my')
  const list = Array.isArray(data) ? data : data?.items
  if (!Array.isArray(list)) throw new Error('invalid my-comment response')
  return list.map(normalizeMyComment)
}
