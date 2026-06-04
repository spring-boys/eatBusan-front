// 후기(Post) 도메인 타입 (JSDoc). 형태의 기준은 docs/API_CONTRACT.md (Post 섹션).
// ⚠️ 백엔드 PostResponseDto 확정 전 프론트 제안 초안. DTO 확정 시 계약 문서와 함께 동기화.

/**
 * @typedef {Object} PostResponse
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string|null} thumbnailUrl   대표 이미지 URL (없으면 null)
 * @property {string} authorNickname
 * @property {string|null} authorProfileUrl
 * @property {number} viewCount
 * @property {number} commentCount
 * @property {number} likeCount
 * @property {boolean} [liked]            현재 사용자의 좋아요 여부 (비로그인/목록선 생략 가능)
 * @property {string} createdAt           ISO 8601
 */

/**
 * @typedef {Object} PostLikeResponse
 * @property {boolean} liked
 * @property {number} likeCount
 */

export {}
