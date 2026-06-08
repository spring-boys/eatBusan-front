// ⚠️ 개발 전용 시드 데이터. VITE_USE_MOCK=true 일 때만 동적 import 된다 (프로덕션 번들 제외).
// 백엔드가 안 떠 있어도 피드 동작·디자인을 확인하기 위한 용도.
// 이미지는 안정적으로 로드되는 개발용 플레이스홀더(Lorem Picsum / pravatar)다 — 실제 음식 사진 아님.

/** @typedef {import('../types/post.js').PostResponse} PostResponse */
/** @typedef {import('../types/post.js').PostLikeResponse} PostLikeResponse */

const photo = (seed) => `https://picsum.photos/seed/${seed}/800/600`
const avatar = (seed) => `https://i.pravatar.cc/120?u=${seed}`
const minutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString()

/** @type {PostResponse[]} */
const SEED = [
  {
    id: 1,
    title: '해운대 골목 돼지국밥, 아침부터 줄 서는 이유',
    content:
      '국물이 진한데 안 느끼해요. 수육도 두툼하고 부추 듬뿍 넣어서 먹으니 해장 끝. 오픈런 추천합니다.',
    thumbnailUrl: photo('gukbap'),
    authorNickname: '부산토박이',
    authorProfileUrl: avatar('busan1'),
    viewCount: 1203,
    commentCount: 18,
    likeCount: 142,
    liked: false,
    createdAt: minutesAgo(35),
  },
  {
    id: 2,
    title: '광안리 노을 보면서 먹은 밀면',
    content: '면이 쫀득하고 육수가 살얼음이라 더위가 싹 가셨어요. 비빔도 매콤달콤 밸런스 좋았습니다.',
    thumbnailUrl: photo('milmyeon'),
    authorNickname: '먹킷리스트',
    authorProfileUrl: avatar('list2'),
    viewCount: 842,
    commentCount: 9,
    likeCount: 97,
    liked: true,
    createdAt: minutesAgo(120),
  },
  {
    id: 3,
    title: '서면 골목 곱창집, 불맛 미쳤다',
    content: '직접 구워주시는데 야들야들. 마늘이랑 같이 먹으면 소주가 절로… 막창도 잡내 하나 없어요.',
    thumbnailUrl: photo('gopchang'),
    authorNickname: '서면주민',
    authorProfileUrl: null,
    viewCount: 2310,
    commentCount: 41,
    likeCount: 305,
    liked: false,
    createdAt: minutesAgo(260),
  },
  {
    id: 4,
    title: '전포 카페거리 숨은 티라미수',
    content: '커피 향이 진하고 시트가 촉촉해요. 사진보다 실물이 더 예쁩니다. 웨이팅은 각오.',
    thumbnailUrl: photo('tiramisu'),
    authorNickname: '디저트헌터',
    authorProfileUrl: avatar('dessert4'),
    viewCount: 560,
    commentCount: 6,
    likeCount: 73,
    liked: false,
    createdAt: minutesAgo(410),
  },
  {
    id: 5,
    title: '자갈치 시장 회 한 접시',
    content: '바로 떠주셔서 탱탱함이 다릅니다. 초장도 직접 만드신 거라 감칠맛 있고요. 가격도 착해요.',
    thumbnailUrl: photo('hoe'),
    authorNickname: '바다사랑',
    authorProfileUrl: avatar('sea5'),
    viewCount: 1788,
    commentCount: 22,
    likeCount: 211,
    liked: false,
    createdAt: minutesAgo(700),
  },
  {
    id: 6,
    title: '남포동 비빔당면, 분식인데 줄 서요',
    content: '당면이 탱글하고 양념이 새콤달콤. 어묵이랑 같이 먹는 게 국룰. 혼밥하기도 편했어요.',
    thumbnailUrl: null,
    authorNickname: '분식러버',
    authorProfileUrl: avatar('snack6'),
    viewCount: 433,
    commentCount: 4,
    likeCount: 51,
    liked: false,
    createdAt: minutesAgo(1010),
  },
  {
    id: 7,
    title: '기장 멸치쌈밥 정식',
    content: '멸치가 통통하고 비린내 1도 없어요. 쌈에 싸 먹으니 밥 두 공기 순삭. 밑반찬도 정갈합니다.',
    thumbnailUrl: photo('myeolchi'),
    authorNickname: '기장사람',
    authorProfileUrl: avatar('gijang7'),
    viewCount: 920,
    commentCount: 11,
    likeCount: 118,
    liked: true,
    createdAt: minutesAgo(1500),
  },
  {
    id: 8,
    title: '영도 흰여울 뷰 맛집 브런치',
    content: '바다 보면서 먹는 에그베네딕트. 분위기값 한다는데 맛도 받쳐줘서 만족. 주차는 힘들어요.',
    thumbnailUrl: photo('brunch'),
    authorNickname: '영도댁',
    authorProfileUrl: avatar('yeongdo8'),
    viewCount: 1340,
    commentCount: 15,
    likeCount: 187,
    liked: false,
    createdAt: minutesAgo(2300),
  },
  {
    id: 9,
    title: '온천장 노포 막창, 30년 내공',
    content: '연탄불에 구워서 불향 가득. 사장님이 직접 손질하셔서 신선합니다. 된장찌개 서비스 굿.',
    thumbnailUrl: photo('makchang'),
    authorNickname: '노포탐험',
    authorProfileUrl: null,
    viewCount: 670,
    commentCount: 8,
    likeCount: 88,
    liked: false,
    createdAt: minutesAgo(3100),
  },
  {
    id: 10,
    title: '대연동 떡볶이, 매운맛 단계 선택 가능',
    content: '2단계도 꽤 매워요. 치즈 추가하면 밸런스 딱. 튀김이랑 세트로 먹는 거 추천합니다.',
    thumbnailUrl: photo('tteokbokki'),
    authorNickname: '맵부심',
    authorProfileUrl: avatar('spicy10'),
    viewCount: 510,
    commentCount: 7,
    likeCount: 64,
    liked: false,
    createdAt: minutesAgo(4000),
  },
  {
    id: 11,
    title: '송정 해변 앞 회센터 물회',
    content: '얼음 동동 물회에 면 사리 추가. 더운 날 최고예요. 양 많아서 둘이 하나면 충분.',
    thumbnailUrl: photo('mulhoe'),
    authorNickname: '서핑후밥',
    authorProfileUrl: avatar('surf11'),
    viewCount: 1455,
    commentCount: 19,
    likeCount: 176,
    liked: false,
    createdAt: minutesAgo(5200),
  },
  {
    id: 12,
    title: '범일동 노상 닭발, 소주각',
    content: '뼈없는 닭발이라 먹기 편하고 불맛 제대로. 콜팝이랑 같이 시키면 매운 거 중화됩니다.',
    thumbnailUrl: null,
    authorNickname: '야식대장',
    authorProfileUrl: avatar('night12'),
    viewCount: 388,
    commentCount: 3,
    likeCount: 42,
    liked: false,
    createdAt: minutesAgo(6600),
  },
  {
    id: 13,
    title: '센텀 카페, 빵이 진짜 맛있는 베이커리',
    content: '소금빵이랑 크루아상 겉바속촉. 커피도 산미 적당해서 좋았어요. 오전에 가야 빵 종류 많아요.',
    thumbnailUrl: photo('bakery'),
    authorNickname: '빵순이',
    authorProfileUrl: avatar('bread13'),
    viewCount: 1102,
    commentCount: 13,
    likeCount: 159,
    liked: true,
    createdAt: minutesAgo(8000),
  },
  {
    id: 14,
    title: '동래 할매 파전, 비 오는 날엔 여기',
    content: '해물 듬뿍에 바삭함이 살아있어요. 동동주랑 먹으면 끝. 노포 특유의 분위기도 정겹습니다.',
    thumbnailUrl: photo('pajeon'),
    authorNickname: '동래사는중',
    authorProfileUrl: avatar('dongnae14'),
    viewCount: 1980,
    commentCount: 27,
    likeCount: 243,
    liked: false,
    createdAt: minutesAgo(10000),
  },
]

// 좋아요 상태를 유지하기 위한 가변 복사본
const store = SEED.map((p) => ({ ...p }))
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 시드 목록 페이지네이션 (page 1부터).
 * @param {number} page
 * @param {number} size
 * @returns {Promise<PostResponse[]>}
 */
export async function mockFetchPosts(page, size) {
  await delay(600)
  const start = (page - 1) * size
  return store.slice(start, start + size).map((p) => ({ ...p }))
}

/**
 * 시드 단건.
 * @param {number} postId
 * @returns {Promise<PostResponse>}
 */
export async function mockFetchPost(postId) {
  await delay(260)
  const found = store.find((p) => p.id === Number(postId))
  if (!found) throw new Error('post not found')
  return { ...found }
}

/**
 * 시드 후기 생성.
 * @param {import('../types/post.js').PostRequest} body
 * @returns {Promise<PostResponse>}
 */
export async function mockCreatePost(body) {
  await delay(320)
  const nextId = Math.max(...store.map((p) => p.id), 0) + 1
  const created = {
    id: nextId,
    title: body.title,
    content: body.content,
    thumbnailUrl: null,
    authorNickname: body.email?.split('@')[0] || '나',
    authorProfileUrl: null,
    viewCount: 0,
    commentCount: 0,
    likeCount: 0,
    liked: false,
    createdAt: new Date().toISOString(),
  }
  store.unshift(created)
  return { ...created }
}

/**
 * 시드 후기 수정.
 * @param {number} postId
 * @param {import('../types/post.js').PostRequest} body
 * @returns {Promise<PostResponse>}
 */
export async function mockUpdatePost(postId, body) {
  await delay(260)
  const target = store.find((p) => p.id === Number(postId))
  if (!target) throw new Error('post not found')
  target.title = body.title
  target.content = body.content
  return { ...target }
}

/**
 * 시드 후기 삭제.
 * @param {number} postId
 * @returns {Promise<void>}
 */
export async function mockDeletePost(postId) {
  await delay(220)
  const idx = store.findIndex((p) => p.id === Number(postId))
  if (idx >= 0) store.splice(idx, 1)
}

/**
 * 시드 좋아요 토글.
 * @param {number} postId
 * @returns {Promise<PostLikeResponse>}
 */
export async function mockToggleLike(postId) {
  await delay(220)
  const target = store.find((p) => p.id === postId)
  if (!target) return { liked: false, likeCount: 0 }
  target.liked = !target.liked
  target.likeCount += target.liked ? 1 : -1
  return { liked: target.liked, likeCount: target.likeCount }
}
