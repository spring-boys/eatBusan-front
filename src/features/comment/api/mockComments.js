// ⚠️ 개발 전용 댓글 시드. VITE_USE_MOCK=true 일 때만 동적 import 된다 (프로덕션 번들 제외).
/** @typedef {import('../types/comment.js').CommentResponse} CommentResponse */

const minutesAgo = (m) => new Date(Date.now() - m * 60_000).toISOString()

const POOL = [
  '여기 진짜 맛있어요! 추천 감사합니다 😋',
  '저도 다녀왔는데 웨이팅 있었어요. 그래도 만족!',
  '주차는 어디에 하셨나요?',
  '사진보다 실물이 더 좋네요 ㅎㅎ',
  '재방문 의사 100%입니다.',
  '가성비 최고. 친구들이랑 또 가려고요.',
  '저녁에 가면 사람 많더라구요. 점심 추천!',
  '덕분에 좋은 곳 알아갑니다 🙏',
]
const NICKS = ['해운대러버', '서면맛집헌터', '부산댁', '주말미식가', '동네탐험가', '먹보']

/** @type {Map<number, CommentResponse[]>} */
const store = new Map()
let seq = 900000

/** @param {number} postId */
function ensure(postId) {
  if (!store.has(postId)) {
    const n = 2 + (postId % 4)
    const arr = []
    for (let i = 0; i < n; i += 1) {
      arr.push({
        id: postId * 1000 + i,
        content: POOL[(postId + i) % POOL.length],
        authorNickname: NICKS[(postId + i) % NICKS.length],
        createdAt: minutesAgo(25 * (i + 1) + (postId % 13)),
      })
    }
    store.set(postId, arr)
  }
  return store.get(postId)
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @param {number} postId
 * @param {{ page: number, size: number }} params
 * @returns {Promise<CommentResponse[]>}
 */
export async function mockFetchComments(postId, { page, size }) {
  await delay(380)
  const all = ensure(postId)
  const start = (page - 1) * size
  return all.slice(start, start + size).map((c) => ({ ...c }))
}

/**
 * @param {number} postId
 * @param {{ content: string }} body
 */
export async function mockCreateComment(postId, { content }) {
  await delay(220)
  const all = ensure(postId)
  all.unshift({
    id: (seq += 1),
    content,
    authorNickname: '나',
    createdAt: new Date().toISOString(),
  })
}

/**
 * @param {number} postId
 * @param {number} commentId
 */
export async function mockDeleteComment(postId, commentId) {
  await delay(180)
  const all = ensure(postId)
  const idx = all.findIndex((c) => c.id === commentId)
  if (idx >= 0) all.splice(idx, 1)
}
