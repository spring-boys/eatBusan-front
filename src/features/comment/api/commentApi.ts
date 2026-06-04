// 댓글 API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지).
import { apiClient } from '@/shared/api/client'
import type { PageParams } from '@/shared/types/api'
import type { CommentRequest, CommentResponse } from '../types/comment'

const base = (postId: number) => `/posts/${postId}/comments`

/** 댓글 목록 (오프셋 페이지네이션) */
export function fetchComments(postId: number, params: PageParams) {
  return apiClient.get<CommentResponse[]>(base(postId), { params })
}

/** 댓글 작성 */
export function createComment(postId: number, body: CommentRequest) {
  return apiClient.post(base(postId), body)
}

/** 댓글 수정 */
export function updateComment(postId: number, commentId: number, body: CommentRequest) {
  return apiClient.patch(`${base(postId)}/${commentId}`, body)
}

/** 댓글 삭제 (서버에서 소프트 삭제 처리) */
export function deleteComment(postId: number, commentId: number) {
  return apiClient.delete(`${base(postId)}/${commentId}`)
}
