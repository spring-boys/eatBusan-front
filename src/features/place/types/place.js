// 식당(Place) 도메인 타입 (JSDoc). 백엔드 목록 DTO는 api/placeApi.js에서 화면 모델로 정규화한다.

/**
 * @typedef {Object} PlaceListResponseDto
 * @property {number} id
 * @property {string} address
 * @property {string} area_cde
 * @property {string} name
 * @property {number} postCnt
 * @property {number} likeCnt
 */

/**
 * 현재 위치 기반 장소 검색 요청 (백엔드 PlaceRequestDto 대응).
 * 위치 정보가 없으면 프론트는 요청 body 자체를 null로 보낸다.
 * @typedef {Object} PlaceSearchRequest
 * @property {number} x          경도
 * @property {number} y          위도
 * @property {number} radius     검색 반경(m)
 */

/**
 * @typedef {Object} PlaceResponse
 * @property {number} id
 * @property {string} name
 * @property {string} category        예: 해운대구 맛집, 부산 맛집
 * @property {string} thumbnailUrl
 * @property {string[]} [photos]       상세용 사진들
 * @property {number|null} rating     백엔드 목록 DTO에는 없으므로 null 가능
 * @property {number} reviewCount
 * @property {number} [postCnt]
 * @property {number} likeCount
 * @property {boolean} myLike
 * @property {string} address
 * @property {string} phone
 * @property {string} url
 * @property {string} [priceRange]    예: "1~2만원대"
 * @property {number|null} lat
 * @property {number|null} lng
 * @property {number} [distanceM]     클라이언트에서 현재 위치 기준 계산해 채움
 * @property {string} [district]      부산 구/군 단위. 예: "해운대구", "기장군"
 * @property {string} [areaCode]
 */

export {}
