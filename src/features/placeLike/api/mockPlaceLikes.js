// ⚠️ 개발 전용 식당 좋아요 시드. 실제 API 미연결 시 화면 확인용 fallback.

/** @typedef {import('../types/placeLike.js').PlaceLikeDetail} PlaceLikeDetail */

/** @type {PlaceLikeDetail[]} */
const store = [
  {
    placeLikeId: 3,
    placeId: 11,
    code: 'mock-11',
    name: '해운대 암소갈비집',
    address: '부산 해운대구 중동',
    areaCode: '26350',
    phone: '',
    url: '',
    likeCnt: 320,
  },
  {
    placeLikeId: 2,
    placeId: 7,
    code: 'mock-7',
    name: '광안리 민락수변 회센터',
    address: '부산 수영구 민락동',
    areaCode: '26500',
    phone: '',
    url: '',
    likeCnt: 154,
  },
  {
    placeLikeId: 1,
    placeId: 4,
    code: 'mock-4',
    name: '전포 카페 노을',
    address: '부산 부산진구 전포동',
    areaCode: '26230',
    phone: '',
    url: '',
    likeCnt: 98,
  },
]

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @param {{ lastId?: number, size?: number }} [params]
 * @returns {Promise<PlaceLikeDetail[]>}
 */
export async function mockFetchMyLikedPlaces({ lastId, size = 10 } = {}) {
  await delay(320)
  const source = lastId ? store.filter((p) => p.placeLikeId < lastId) : store
  return source.slice(0, size).map((p) => ({ ...p }))
}

/**
 * @param {number} placeId
 */
export async function mockLikePlace(placeId) {
  await delay(180)
  if (store.some((p) => p.placeId === Number(placeId))) return
  const nextId = Math.max(...store.map((p) => p.placeLikeId), 0) + 1
  store.unshift({
    placeLikeId: nextId,
    placeId: Number(placeId),
    code: `mock-${placeId}`,
    name: `맛집 ${placeId}`,
    address: '부산',
    areaCode: '',
    phone: '',
    url: '',
    likeCnt: 1,
  })
}

/**
 * @param {number} placeId
 */
export async function mockUnlikePlace(placeId) {
  await delay(180)
  const idx = store.findIndex((p) => p.placeId === Number(placeId))
  if (idx >= 0) store.splice(idx, 1)
}
