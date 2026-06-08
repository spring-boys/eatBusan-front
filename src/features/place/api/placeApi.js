// 식당(Place) API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지).
// VITE_USE_MOCK=true 면 백엔드 대신 개발용 시드로 동작한다 (mock은 동적 import → 프로덕션 번들 제외).
import { apiClient } from '@/shared/api/client'
import { USE_MOCK, shouldUseMockFallback } from '@/shared/api/mockFallback'
import defaultPlaceThumb from '@/assets/place-thumb-default.svg'

/** @typedef {import('../types/place.js').PlaceResponse} PlaceResponse */
/** @typedef {import('../types/place.js').PlaceListResponseDto} PlaceListResponseDto */
/** @typedef {import('@/features/post/types/post.js').PostResponse} PostResponse */

export const AREA_CODE_BY_DISTRICT = Object.freeze({
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
})

const DISTRICT_BY_AREA_CODE = Object.freeze(
  Object.fromEntries(
    Object.entries(AREA_CODE_BY_DISTRICT).map(([district, code]) => [code, district]),
  ),
)

/**
 * @param {string} district
 * @returns {string|null}
 */
export function getAreaCodeByDistrict(district) {
  return AREA_CODE_BY_DISTRICT[district] ?? null
}

/**
 * @param {string|number|null|undefined} value
 * @returns {number}
 */
function toCount(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * @param {Record<string, unknown>} dto
 * @returns {PostResponse}
 */
function normalizeReview(dto) {
  const id = Number(dto.id ?? dto.postId)
  if (!Number.isFinite(id)) throw new Error('invalid review id')
  const email = String(dto.email ?? '')

  return {
    id,
    title: String(dto.title ?? ''),
    content: String(dto.content ?? ''),
    thumbnailUrl: dto.thumbnailUrl ? String(dto.thumbnailUrl) : null,
    authorNickname: String(dto.authorNickname ?? (email ? email.split('@')[0] : '익명')),
    authorProfileUrl: dto.authorProfileUrl ? String(dto.authorProfileUrl) : null,
    viewCount: toCount(dto.viewCount),
    commentCount: toCount(dto.commentCount),
    likeCount: toCount(dto.likeCount),
    liked: Boolean(dto.liked ?? false),
    createdAt: String(dto.createdAt ?? new Date().toISOString()),
  }
}

/**
 * 백엔드 PlaceResponseListDto / PlaceResponseDto를 화면 모델로 정규화한다.
 * @param {PlaceListResponseDto | Record<string, unknown>} dto
 * @returns {PlaceResponse}
 */
function normalizePlace(dto) {
  const areaCode = String(dto.area_cde ?? dto.areaCode ?? dto.code ?? '')
  const district = DISTRICT_BY_AREA_CODE[areaCode] ?? ''
  const lat = Number(dto.lat)
  const lng = Number(dto.lng)
  const rating = Number(dto.rating)
  const postCnt = toCount(dto.postCnt ?? dto.reviewCount)
  const likeCnt = toCount(dto.likeCnt ?? dto.likeCount)
  const thumbnailUrl = dto.thumbnailUrl || dto.imageUrl || defaultPlaceThumb

  return {
    id: Number(dto.id),
    name: String(dto.name ?? ''),
    category: String(dto.category ?? (district ? `${district} 맛집` : '부산 맛집')),
    thumbnailUrl,
    photos: Array.isArray(dto.photos) && dto.photos.length > 0 ? dto.photos : [thumbnailUrl],
    rating: Number.isFinite(rating) ? rating : null,
    reviewCount: postCnt,
    postCnt,
    likeCount: likeCnt,
    address: String(dto.address ?? ''),
    priceRange: dto.priceRange ? String(dto.priceRange) : '',
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    distanceM: undefined,
    district,
    areaCode,
  }
}

/**
 * @param {unknown} data
 * @returns {Array<Record<string, unknown>>}
 */
function unwrapPlaceList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  return []
}

/**
 * Spring Page 또는 배열 응답을 화면 목록 + 페이지 메타로 정규화한다.
 * @param {unknown} data
 * @param {{ page: number, size: number, paged: boolean }} options
 * @returns {{ items: PlaceResponse[], page: number, hasMore: boolean }}
 */
function normalizePlacePage(data, { page, size, paged }) {
  const rawItems = unwrapPlaceList(data)
  const items = rawItems.map(normalizePlace)
  if (!paged) return { items, page, hasMore: false }

  const responsePage = Number(data?.number)
  const normalizedPage = Number.isFinite(responsePage) ? responsePage : page
  const totalPages = Number(data?.totalPages)
  const isLast = data?.last
  const hasMore =
    isLast === false ||
    (Number.isFinite(totalPages) && normalizedPage + 1 < totalPages) ||
    (typeof isLast !== 'boolean' && !Number.isFinite(totalPages) && rawItems.length === size)

  return { items, page: normalizedPage, hasMore }
}

/**
 * @param {unknown} data
 * @returns {Array<Record<string, unknown>>}
 */
function unwrapReviewList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  throw new Error('invalid review list response')
}

/**
 * 식당 목록 페이지. areaCode가 있으면 지역별 Page, 없으면 전체 랜덤 목록을 조회한다.
 * @param {{ areaCode?: string|null, page?: number, size?: number }} [options]
 * @returns {Promise<{ items: PlaceResponse[], page: number, hasMore: boolean }>}
 */
export async function fetchPlacePage(options = {}) {
  const { areaCode = null, page = 0, size = 10 } = options
  const paged = !!areaCode
  const fetchMock = async () => {
    const { mockFetchPlaces } = await import('./mockPlaces')
    const items = await mockFetchPlaces({ areaCode, page, size })
    return {
      items,
      page,
      hasMore: paged && items.length === size,
    }
  }
  if (USE_MOCK) return fetchMock()

  try {
    const endpoint = areaCode ? `/places/area/${areaCode}` : '/places'
    const config = areaCode ? { params: { page, size } } : undefined
    const { data } = await apiClient.get(endpoint, config)
    return normalizePlacePage(data, { page, size, paged })
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 식당 목록. 기존 호출부 호환용 배열 반환 함수.
 * @param {{ areaCode?: string|null, page?: number, size?: number }} [options]
 * @returns {Promise<PlaceResponse[]>}
 */
export async function fetchPlaces(options = {}) {
  const { items } = await fetchPlacePage(options)
  return items
}

/**
 * 식당 단건
 * @param {number} id
 * @returns {Promise<PlaceResponse>}
 */
export async function fetchPlace(id) {
  const fetchMock = async () => {
    const { mockFetchPlace } = await import('./mockPlaces')
    return mockFetchPlace(id)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.get(`/places/${id}`)
    return normalizePlace(data)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 식당 후기 목록
 * @param {number} id
 * @returns {Promise<PostResponse[]>}
 */
export async function fetchPlaceReviews(id) {
  const fetchMock = async () => {
    const { mockFetchPlaceReviews } = await import('./mockPlaces')
    return mockFetchPlaceReviews(id)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.get(`/places/${id}/posts`)
    return unwrapReviewList(data).map(normalizeReview)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}
