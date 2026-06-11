// 후기(Post) 도메인 타입 (JSDoc). 형태의 기준은 docs/API_CONTRACT.md (Post 섹션).
// ⚠️ 백엔드 PostResponseDto 확정 전 프론트 제안 초안. DTO 확정 시 계약 문서와 함께 동기화.

/**
 * @typedef {Object} PostResponse
 * @property {number} id
 * @property {string} title
 * @property {string} content
 * @property {string|null} thumbnailUrl   대표 이미지 URL (없으면 null)
 * @property {number} placeId            연결된 가게 ID — 수정 요청 시 그대로 전달
 * @property {Array<{imageUrl:string,sortOrder:number}>} images  전체 이미지 목록 (sortOrder 오름차순) — 상세 갤러리용
 * @property {string} authorEmail        작성자 이메일 — 수정/삭제 소유자 판별용
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

/**
 * 후기 작성/수정 요청 (백엔드 PostRequireDto)
 * 서버는 email 로 작성자를 식별한다 — userId 는 사용되지 않으므로 null 허용.
 * @typedef {Object} PostRequest
 * @property {number|null} userId
 * @property {number} placeId
 * @property {string} email
 * @property {string} title
 * @property {string} content
 */

/**
 * 후기 이미지 (백엔드 PostImageDto — PostResponseDto.images 항목)
 * @typedef {Object} PostImage
 * @property {number} id
 * @property {number} postId
 * @property {string} imageUrl
 * @property {string} imageKey
 * @property {number} sortOrder
 */

/**
 * 후기 작성/단건 응답 (백엔드 PostResponseDto — 실제 서버 형태)
 * @typedef {Object} PostApiResponse
 * @property {number} postId
 * @property {number} userId
 * @property {number} placeId
 * @property {string} email
 * @property {string} title
 * @property {string} content
 * @property {number} viewCount
 * @property {number} likeCount
 * @property {number} commentCount
 * @property {string} createdAt           ISO 8601
 * @property {string} updatedAt           ISO 8601
 * @property {PostImage[]} images         sortOrder 오름차순
 */

export {}
