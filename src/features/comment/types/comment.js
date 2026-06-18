// 댓글 도메인 타입 (JSDoc). 형태의 기준은 docs/API_CONTRACT.md (Comment 섹션).

/**
 * 댓글 조회 응답 (백엔드 PostCommentDto 대응)
 * @typedef {Object} CommentResponse
 * @property {number} id
 * @property {string} content
 * @property {string} createdAt  ISO 8601
 * @property {string} [authorNickname]  작성자 닉네임 (백엔드 DTO 추가 시 채움 — 프론트 제안)
 */

/**
 * 댓글 작성/수정 요청
 * @typedef {Object} CommentRequest
 * @property {string} content
 */

/**
 * 내가 작성한 댓글 (백엔드 MyCommentDto 대응). 댓글이 달린 후기로 이동하기 위해 post 맥락을 포함한다.
 * @typedef {Object} MyCommentResponse
 * @property {number} id
 * @property {number} postId       댓글이 달린 후기 id (상세 이동용)
 * @property {string} postTitle    후기 제목
 * @property {string} content
 * @property {string} createdAt    ISO 8601
 */

export {}
