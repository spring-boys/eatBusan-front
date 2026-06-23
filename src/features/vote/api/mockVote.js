// ⚠️ 개발 전용 투표방 시드. VITE_USE_MOCK=true 또는 백엔드 미연결 시에만 동적 import 된다.
// 근처 맛집 후보 5개를 시드하고, 투표 점수 집계(5/3/1)를 메모리로 시뮬레이션한다.
/** @typedef {import('../types/vote.js').VoteRoomDetail} VoteRoomDetail */
/** @typedef {import('../types/vote.js').VoteRoomResult} VoteRoomResult */
/** @typedef {import('../types/vote.js').TallyEntry} TallyEntry */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const PLACE_NAMES = [
  '돼지국밥 본가',
  '광안리 회센터',
  '서면 곱창골목',
  '해운대 밀면집',
  '남포동 비빔당면',
  '온천장 떡볶이',
  '전포 카페거리 베이커리',
]

// 순위 → 점수 (1등 5, 2등 3, 3등 1)
const RANK_SCORE = [5, 3, 1]

/**
 * @typedef {Object} MockRoom
 * @property {string} roomPublicId
 * @property {string} title
 * @property {number} hostMemberId
 * @property {("OPEN"|"CLOSED")} status
 * @property {?number} winnerCandidateId
 * @property {string} inviteCode
 * @property {import('../types/vote.js').Candidate[]} candidates
 * @property {import('../types/vote.js').Participant[]} participants
 * @property {Map<number, number[]>} ballots  memberId → candidateId 순서대로
 * @property {number} version
 */

/** @type {Map<string, MockRoom>} */
const rooms = new Map()
/** @type {Map<string, string>} */
const codeIndex = new Map() // inviteCode → roomPublicId

let roomSeq = 7000
let candidateSeq = 50000
const MY_MEMBER_ID = 1

const randomCode = () =>
  Array.from({ length: 6 }, () => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 31)]).join('')

/** @param {string} title */
function seedRoom(title) {
  const roomPublicId = `VR_mock${(roomSeq += 1)}`
  const inviteCode = randomCode()
  const candidates = PLACE_NAMES.slice(0, 5).map((placeName, i) => ({
    candidateId: (candidateSeq += 1),
    placeId: 1000 + i,
    placeName,
  }))
  /** @type {MockRoom} */
  const room = {
    roomPublicId,
    title: title || '오늘 점심 뭐 먹지?',
    hostMemberId: MY_MEMBER_ID,
    status: 'OPEN',
    winnerCandidateId: null,
    inviteCode,
    candidates,
    participants: [{ memberId: MY_MEMBER_ID, status: 'JOINED' }],
    ballots: new Map(),
    version: 0,
  }
  rooms.set(roomPublicId, room)
  codeIndex.set(inviteCode, roomPublicId)
  return room
}

/**
 * 모든 ballot 을 합산해 candidateId → score 집계
 * @param {MockRoom} room
 * @returns {TallyEntry[]}
 */
function computeTally(room) {
  /** @type {Map<number, number>} */
  const scores = new Map()
  for (const candidate of room.candidates) scores.set(candidate.candidateId, 0)
  for (const ballot of room.ballots.values()) {
    ballot.forEach((candidateId, rank) => {
      const add = RANK_SCORE[rank] ?? 0
      scores.set(candidateId, (scores.get(candidateId) ?? 0) + add)
    })
  }
  return [...scores.entries()].map(([candidateId, score]) => ({ candidateId, score }))
}

/**
 * ballot 제출한 distinct 멤버 수 (한 사람이 1~3행이어도 1명)
 * @param {MockRoom} room
 * @returns {number}
 */
function computeVotedCount(room) {
  return room.ballots.size
}

/** @param {MockRoom} room */
function computeWinner(room) {
  const tally = computeTally(room)
  let best = null
  for (const entry of tally) {
    if (!best || entry.score > best.score) best = entry
  }
  return best && best.score > 0 ? best.candidateId : null
}

/**
 * @param {MockRoom} room
 * @returns {VoteRoomDetail}
 */
function toDetail(room) {
  return {
    roomPublicId: room.roomPublicId,
    title: room.title,
    hostMemberId: room.hostMemberId,
    status: room.status,
    winnerCandidateId: room.winnerCandidateId,
    inviteCode: room.inviteCode,
    amHost: room.hostMemberId === MY_MEMBER_ID,
    myBallot: [...(room.ballots.get(MY_MEMBER_ID) ?? [])],
    candidates: room.candidates.map((c) => ({ ...c })),
    participants: room.participants.map((p) => ({ ...p })),
  }
}

/** POST /api/vote-rooms */
export async function mockCreateVoteRoom({ title } = {}) {
  await delay(320)
  const room = seedRoom(title)
  return {
    roomPublicId: room.roomPublicId,
    inviteCode: room.inviteCode,
    candidates: room.candidates.map((c) => ({ ...c })),
    participants: room.participants.map((p) => ({ ...p })),
  }
}

/** POST /api/vote-rooms/join */
export async function mockJoinVoteRoom(code) {
  await delay(280)
  const roomPublicId = codeIndex.get(String(code).toUpperCase())
  const room = roomPublicId ? rooms.get(roomPublicId) : null
  if (!room) {
    const err = new Error('INVALID_INVITE_CODE')
    err.response = { status: 404, data: { code: 'INVALID_INVITE_CODE' } }
    throw err
  }
  if (!room.participants.some((p) => p.memberId === MY_MEMBER_ID)) {
    room.participants.push({ memberId: MY_MEMBER_ID, status: 'JOINED' })
  }
  return toDetail(room)
}

/** GET /api/vote-rooms/{publicId} */
export async function mockFetchVoteRoom(publicId) {
  await delay(240)
  const room = rooms.get(publicId)
  if (!room) {
    const err = new Error('NOT_FOUND')
    err.response = { status: 404, data: { code: 'NOT_FOUND' } }
    throw err
  }
  return toDetail(room)
}

/** GET /api/vote-rooms/{publicId}/result */
export async function mockFetchVoteResult(publicId) {
  await delay(200)
  const room = rooms.get(publicId)
  if (!room) {
    const err = new Error('NOT_FOUND')
    err.response = { status: 404, data: { code: 'NOT_FOUND' } }
    throw err
  }
  return {
    status: room.status,
    winnerCandidateId: room.winnerCandidateId,
    version: room.version,
    tally: computeTally(room),
    votedCount: computeVotedCount(room),
  }
}

/** POST /api/vote-rooms/{publicId}/votes */
export async function mockCastBallot(publicId, candidateIds) {
  await delay(260)
  const room = rooms.get(publicId)
  if (!room) {
    const err = new Error('NOT_FOUND')
    err.response = { status: 404, data: { code: 'NOT_FOUND' } }
    throw err
  }
  if (room.status === 'CLOSED') {
    const err = new Error('VOTE_ROOM_CLOSED')
    err.response = { status: 409, data: { code: 'VOTE_ROOM_CLOSED' } }
    throw err
  }
  room.ballots.set(MY_MEMBER_ID, [...candidateIds])
  room.version += 1
  return {
    myBallot: [...candidateIds],
    tally: computeTally(room),
    votedCount: computeVotedCount(room),
  }
}

/** DELETE /api/vote-rooms/{publicId}/votes — 내 ballot 취소(멱등) */
export async function mockCancelBallot(publicId) {
  await delay(220)
  const room = rooms.get(publicId)
  if (!room) {
    const err = new Error('NOT_FOUND')
    err.response = { status: 404, data: { code: 'NOT_FOUND' } }
    throw err
  }
  if (room.status === 'CLOSED') {
    const err = new Error('VOTE_ROOM_CLOSED')
    err.response = { status: 409, data: { code: 'VOTE_ROOM_CLOSED' } }
    throw err
  }
  if (room.ballots.has(MY_MEMBER_ID)) {
    room.ballots.delete(MY_MEMBER_ID)
    room.version += 1
  }
  return {
    myBallot: [],
    tally: computeTally(room),
    votedCount: computeVotedCount(room),
  }
}

/** POST /api/vote-rooms/{publicId}/close */
export async function mockCloseVoteRoom(publicId) {
  await delay(260)
  const room = rooms.get(publicId)
  if (!room) {
    const err = new Error('NOT_FOUND')
    err.response = { status: 404, data: { code: 'NOT_FOUND' } }
    throw err
  }
  room.status = 'CLOSED'
  room.winnerCandidateId = computeWinner(room)
  room.version += 1
  return {
    status: room.status,
    winnerCandidateId: room.winnerCandidateId,
    version: room.version,
    tally: computeTally(room),
    votedCount: computeVotedCount(room),
  }
}
