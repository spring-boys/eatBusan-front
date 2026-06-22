// 투표방 API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지).
// VITE_USE_MOCK=true 면 백엔드 대신 개발용 시드로 동작한다 (mock은 동적 import → 프로덕션 번들 제외).
import { apiClient } from '@/shared/api/client'
import { USE_MOCK, shouldUseMockFallback } from '@/shared/api/mockFallback'

/** @typedef {import('../types/vote.js').VoteRoomCreateRequest} VoteRoomCreateRequest */
/** @typedef {import('../types/vote.js').VoteRoomCreateResponse} VoteRoomCreateResponse */
/** @typedef {import('../types/vote.js').VoteRoomDetail} VoteRoomDetail */
/** @typedef {import('../types/vote.js').VoteRoomResult} VoteRoomResult */
/** @typedef {import('../types/vote.js').VoteResponse} VoteResponse */

const base = '/vote-rooms'

/**
 * 방 생성 — POST /api/vote-rooms
 * @param {VoteRoomCreateRequest} body  {title, lat, lng, radius}
 * @returns {Promise<VoteRoomCreateResponse>}
 */
export async function createVoteRoom(body) {
  const fetchMock = async () => {
    const { mockCreateVoteRoom } = await import('./mockVote')
    return mockCreateVoteRoom(body)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.post(base, body)
    return data
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 코드로 입장 — POST /api/vote-rooms/join
 * @param {string} code
 * @returns {Promise<VoteRoomDetail>}
 */
export async function joinVoteRoom(code) {
  const fetchMock = async () => {
    const { mockJoinVoteRoom } = await import('./mockVote')
    return mockJoinVoteRoom(code)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.post(`${base}/join`, { code })
    return data
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 방 상세 — GET /api/vote-rooms/{publicId}
 * @param {string} publicId
 * @returns {Promise<VoteRoomDetail>}
 */
export async function fetchVoteRoom(publicId) {
  const fetchMock = async () => {
    const { mockFetchVoteRoom } = await import('./mockVote')
    return mockFetchVoteRoom(publicId)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.get(`${base}/${publicId}`)
    return data
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 결과 조회 — GET /api/vote-rooms/{publicId}/result
 * @param {string} publicId
 * @returns {Promise<VoteRoomResult>}
 */
export async function fetchVoteResult(publicId) {
  const fetchMock = async () => {
    const { mockFetchVoteResult } = await import('./mockVote')
    return mockFetchVoteResult(publicId)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.get(`${base}/${publicId}/result`)
    return data
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 투표 — POST /api/vote-rooms/{publicId}/votes
 * @param {string} publicId
 * @param {number[]} candidateIds  [1등, 2등, 3등] candidateId
 * @returns {Promise<VoteResponse>}
 */
export async function castBallot(publicId, candidateIds) {
  const fetchMock = async () => {
    const { mockCastBallot } = await import('./mockVote')
    return mockCastBallot(publicId, candidateIds)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.post(`${base}/${publicId}/votes`, { candidateIds })
    return data
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 마감 (호스트) — POST /api/vote-rooms/{publicId}/close
 * @param {string} publicId
 * @returns {Promise<VoteRoomResult>}
 */
export async function closeVoteRoom(publicId) {
  const fetchMock = async () => {
    const { mockCloseVoteRoom } = await import('./mockVote')
    return mockCloseVoteRoom(publicId)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.post(`${base}/${publicId}/close`)
    return data
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}
