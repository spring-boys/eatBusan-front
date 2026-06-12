// ⚠️ 개발 전용 시드 데이터. VITE_USE_MOCK=true 일 때만 동적 import 된다 (프로덕션 번들 제외).
// 백엔드/카카오 연동 전 위치 기반 식당 리스트 → 상세 → 후기 흐름을 확인하기 위한 용도.
// 식당 이미지는 기본 썸네일을 쓰고, 후기 이미지만 안정적 로드용 플레이스홀더를 쓴다.
import defaultPlaceThumb from '@/assets/place-thumb-default.svg'

/** @typedef {import('../types/place.js').PlaceResponse} PlaceResponse */
/** @typedef {import('@/features/post/types/post.js').PostResponse} PostResponse */

const photo = (seed) => `https://picsum.photos/seed/${seed}/800/600`
const avatar = (seed) => `https://i.pravatar.cc/120?u=${seed}`
const minutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString()

const AREA_CODE_BY_DISTRICT = {
  중구: '26110',
  서구: '26140',
  동구: '26170',
  영도구: '26200',
  부산진구: '26230',
  동래구: '26260',
  남구: '26290',
  북구: '26320',
  해운대구: '26350',
  사하구: '26380',
  금정구: '26410',
  강서구: '26440',
  연제구: '26470',
  수영구: '26500',
  사상구: '26530',
  기장군: '26710',
}

const DISTRICT_BY_AREA_CODE = Object.fromEntries(
  Object.entries(AREA_CODE_BY_DISTRICT).map(([district, code]) => [code, district]),
)

/** @type {PlaceResponse[]} */
const PLACES = [
  {
    id: 1,
    name: '해운대 골목 돼지국밥',
    category: '한식',
    district: '해운대구',
    thumbnailUrl: photo('gukbap'),
    rating: 4.6,
    reviewCount: 182,
    likeCount: 142,
    address: '부산 해운대구 구남로 12',
    priceRange: '1만원 이하',
    lat: 35.1587,
    lng: 129.1601,
  },
  {
    id: 2,
    name: '광안리 살얼음 밀면',
    category: '한식',
    district: '수영구',
    thumbnailUrl: photo('milmyeon'),
    rating: 4.4,
    reviewCount: 95,
    likeCount: 97,
    address: '부산 수영구 광안해변로 197',
    priceRange: '1만원 이하',
    lat: 35.1532,
    lng: 129.1188,
  },
  {
    id: 3,
    name: '서면 불막창 곱창',
    category: '고기·구이',
    district: '부산진구',
    thumbnailUrl: photo('gopchang'),
    rating: 4.7,
    reviewCount: 311,
    likeCount: 305,
    address: '부산 부산진구 서면로68번길 23',
    priceRange: '2~3만원대',
    lat: 35.1576,
    lng: 129.0593,
  },
  {
    id: 4,
    name: '전포 카페거리 티라미수',
    category: '카페·디저트',
    district: '부산진구',
    thumbnailUrl: photo('tiramisu'),
    rating: 4.5,
    reviewCount: 76,
    likeCount: 73,
    address: '부산 부산진구 전포대로209번길 16',
    priceRange: '1~2만원대',
    lat: 35.1561,
    lng: 129.0648,
  },
  {
    id: 5,
    name: '자갈치 활어회 센터',
    category: '회·해산물',
    district: '중구',
    thumbnailUrl: photo('hoe'),
    rating: 4.3,
    reviewCount: 210,
    likeCount: 211,
    address: '부산 중구 자갈치해안로 52',
    priceRange: '3만원대 이상',
    lat: 35.0966,
    lng: 129.0306,
  },
  {
    id: 6,
    name: '남포동 비빔당면',
    category: '분식',
    district: '중구',
    thumbnailUrl: photo('dangmyeon'),
    rating: 4.2,
    reviewCount: 54,
    likeCount: 51,
    address: '부산 중구 비프광장로 31',
    priceRange: '1만원 이하',
    lat: 35.0978,
    lng: 129.0264,
  },
  {
    id: 7,
    name: '기장 멸치쌈밥 정식',
    category: '한식',
    district: '기장군',
    thumbnailUrl: photo('myeolchi'),
    rating: 4.6,
    reviewCount: 121,
    likeCount: 118,
    address: '부산 기장군 기장읍 기장해안로 1',
    priceRange: '1~2만원대',
    lat: 35.2445,
    lng: 129.2223,
  },
  {
    id: 8,
    name: '흰여울 오션뷰 브런치',
    category: '카페·디저트',
    district: '영도구',
    thumbnailUrl: photo('brunch'),
    rating: 4.5,
    reviewCount: 188,
    likeCount: 187,
    address: '부산 영도구 흰여울길 17',
    priceRange: '1~2만원대',
    lat: 35.0788,
    lng: 129.0455,
  },
  {
    id: 9,
    name: '온천장 30년 노포 막창',
    category: '고기·구이',
    district: '동래구',
    thumbnailUrl: photo('makchang'),
    rating: 4.4,
    reviewCount: 88,
    likeCount: 88,
    address: '부산 동래구 온천천로 365',
    priceRange: '2~3만원대',
    lat: 35.2189,
    lng: 129.0846,
  },
  {
    id: 10,
    name: '대연동 매운떡볶이',
    category: '분식',
    district: '남구',
    thumbnailUrl: photo('tteokbokki'),
    rating: 4.1,
    reviewCount: 63,
    likeCount: 64,
    address: '부산 남구 유엔평화로 16',
    priceRange: '1만원 이하',
    lat: 35.1318,
    lng: 129.0921,
  },
  {
    id: 11,
    name: '송정 해변 물회',
    category: '회·해산물',
    district: '해운대구',
    thumbnailUrl: photo('mulhoe'),
    rating: 4.5,
    reviewCount: 176,
    likeCount: 176,
    address: '부산 해운대구 송정해변로 62',
    priceRange: '1~2만원대',
    lat: 35.1785,
    lng: 129.1996,
  },
  {
    id: 12,
    name: '동래 할매 해물파전',
    category: '한식',
    district: '동래구',
    thumbnailUrl: photo('pajeon'),
    rating: 4.7,
    reviewCount: 240,
    likeCount: 243,
    address: '부산 동래구 명륜로94번길 9-1',
    priceRange: '1~2만원대',
    lat: 35.2056,
    lng: 129.0843,
  },
]

const NICKS = [
  '부산토박이',
  '먹킷리스트',
  '서면주민',
  '바다사랑',
  '디저트헌터',
  '야식대장',
  '주말미식가',
  '동네한바퀴',
]
const REVIEW_POOL = [
  '재료가 신선하고 양도 푸짐해요. 또 올 것 같아요.',
  '웨이팅 있었지만 먹어보니 납득. 사장님도 친절하세요.',
  '가격 대비 만족도 최고. 친구들이랑 또 왔어요.',
  '사진보다 실물이 더 좋아요. 분위기도 깔끔합니다.',
  '현지인 맛집 인정. 관광지 가격 아니라 더 좋네요.',
  '혼밥하기도 편하고 회전 빨라요. 점심에 추천.',
  '간이 적당하고 깔끔한 맛. 속이 편했습니다.',
  '주차가 조금 불편하지만 맛이 다 용서됩니다.',
]

/**
 * 식당별 후기를 결정론적으로 생성.
 * @param {number} placeId
 * @returns {PostResponse[]}
 */
function buildReviews(placeId) {
  const place = PLACES.find((p) => p.id === placeId)
  const count = place ? Math.min(6, 2 + (placeId % 4)) : 0
  const reviews = []
  for (let i = 0; i < count; i += 1) {
    const k = (placeId * 7 + i * 3) % REVIEW_POOL.length
    const withPhoto = (placeId + i) % 3 !== 0
    reviews.push({
      id: placeId * 100 + i,
      title: place ? place.name : '후기',
      content: REVIEW_POOL[k],
      thumbnailUrl: withPhoto ? photo(`${placeId}-rv-${i}`) : null,
      authorNickname: NICKS[(placeId + i) % NICKS.length],
      authorProfileUrl: avatar(`u${placeId}-${i}`),
      viewCount: 100 + ((placeId * 13 + i * 29) % 900),
      commentCount: (placeId + i) % 12,
      likeCount: 5 + ((placeId * 11 + i * 7) % 90),
      liked: (placeId + i) % 5 === 0,
      createdAt: minutesAgo(40 * (i + 1) + placeId * 17),
    })
  }
  return reviews
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function distanceScore(place, location) {
  if (!location || !Number.isFinite(location.lat) || !Number.isFinite(location.lng)) return 0
  const dLat = place.lat - location.lat
  const dLng = place.lng - location.lng
  return dLat * dLat + dLng * dLng
}

function toMockPlace(p) {
  return {
    ...p,
    areaCode: AREA_CODE_BY_DISTRICT[p.district],
    thumbnailUrl: defaultPlaceThumb,
    photos: [defaultPlaceThumb],
    phone: p.phone ?? '051-123-4567',
    url: p.url ?? `https://place.map.kakao.com/${p.id}`,
    myLike: Boolean(p.myLike ?? false),
  }
}

/**
 * 주변 식당 목록 (거리 정렬은 클라이언트에서 현재 위치 기준으로 처리).
 * @param {{ areaCode?: string|null, page?: number, size?: number }} [options]
 * @returns {Promise<PlaceResponse[]>}
 */
export async function mockFetchPlaces(options = {}) {
  await delay(550)
  const district = DISTRICT_BY_AREA_CODE[options.areaCode ?? '']
  const source = district ? PLACES.filter((p) => p.district === district) : PLACES
  const page = Number.isFinite(options.page) ? options.page : 0
  const size = Number.isFinite(options.size) ? options.size : source.length
  const start = district ? page * size : 0
  const end = district ? start + size : source.length
  return source.slice(start, end).map(toMockPlace)
}

/**
 * 현재 위치 기반 식당 검색.
 * @param {{ lat: number, lng: number }|null} location
 * @returns {Promise<PlaceResponse[]>}
 */
export async function mockSearchPlaces(location) {
  await delay(550)
  return [...PLACES]
    .sort((a, b) => distanceScore(a, location) - distanceScore(b, location))
    .map(toMockPlace)
}

/**
 * 식당 단건.
 * @param {number} id
 * @returns {Promise<PlaceResponse>}
 */
export async function mockFetchPlace(id) {
  await delay(400)
  const found = PLACES.find((p) => p.id === id)
  if (!found) throw new Error('place not found')
  return {
    ...toMockPlace(found),
  }
}

/**
 * 식당 후기 목록.
 * @param {number} id
 * @returns {Promise<PostResponse[]>}
 */
export async function mockFetchPlaceReviews(id) {
  await delay(450)
  return buildReviews(id)
}
