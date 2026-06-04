// 식당(Place) 도메인 타입 (JSDoc). 형태의 기준은 docs/API_CONTRACT.md (Place 섹션).
// ⚠️ 백엔드 Place DTO/카카오 연동 확정 전 프론트 제안 초안.

/**
 * @typedef {Object} PlaceResponse
 * @property {number} id
 * @property {string} name
 * @property {string} category        예: 한식, 카페·디저트, 회·해산물
 * @property {string|null} thumbnailUrl
 * @property {string[]} [photos]       상세용 사진들
 * @property {number} rating          0~5
 * @property {number} reviewCount
 * @property {number} likeCount
 * @property {string} address
 * @property {string} [priceRange]    예: "1~2만원대"
 * @property {number} lat
 * @property {number} lng
 * @property {number} [distanceM]     클라이언트에서 현재 위치 기준 계산해 채움
 */

export {}
