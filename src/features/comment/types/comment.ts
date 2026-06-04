// 댓글 도메인 타입. 형태의 기준은 docs/API_CONTRACT.md (Comment 섹션).

/** 댓글 조회 응답 (백엔드 PostCommentDto 대응) */
export interface CommentResponse {
  id: number
  content: string
  createdAt: string // ISO 8601
  // 작성자(닉네임 등) 필요 시 백엔드 DTO에 추가 후 여기/계약 문서 동기화
}

/** 댓글 작성/수정 요청 */
export interface CommentRequest {
  content: string
}
