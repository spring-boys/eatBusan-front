// 투표방 전역 상태 (Pinia). 비동기 호출은 loading/error 상태를 함께 관리한다.
// 쓰기는 전부 REST(voteApi), 실시간 갱신은 STOMP(voteSocket) 수신 전용.
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as voteApi from '../api/voteApi'
import { connectVoteRoom, disconnect as disconnectSocket } from '../api/voteSocket'

/** @typedef {import('../types/vote.js').Candidate} Candidate */
/** @typedef {import('../types/vote.js').Participant} Participant */
/** @typedef {import('../types/vote.js').TallyEntry} TallyEntry */
/** @typedef {import('../types/vote.js').RealtimeMessage} RealtimeMessage */

export const useVoteRoomStore = defineStore('voteRoom', () => {
  /**
   * @type {import('vue').Ref<{roomPublicId: string, title: string, host: ?number, amHost: boolean, status: ("OPEN"|"CLOSED"), winnerCandidateId: ?number, inviteCode: string} | null>}
   */
  const room = ref(null)
  /** @type {import('vue').Ref<Candidate[]>} */
  const candidates = ref([])
  /** @type {import('vue').Ref<Participant[]>} */
  const participants = ref([])
  /** @type {import('vue').Ref<number[]>} 내 투표 (candidateId 순서대로) */
  const myBallot = ref([])
  /** @type {import('vue').Ref<TallyEntry[]>} candidateId → score */
  const tally = ref([])
  const version = ref(0)
  /** @type {import('vue').Ref<number>} ballot 제출한 distinct 멤버 수 */
  const votedCount = ref(0)
  const loading = ref(false)
  const error = ref(null)
  const connected = ref(false)
  const notFound = ref(false) // 단발성 삭제(404) 단발 플래그

  // ── getters ──
  /** 점수 내림차순 정렬된 집계 */
  const rankedTally = computed(() =>
    [...tally.value].sort((a, b) => b.score - a.score),
  )
  // 호스트 여부는 백엔드가 인증 주체 기준으로 판정한 amHost 를 그대로 쓴다.
  const isHost = computed(() => !!room.value && room.value.amHost === true)
  const hasVoted = computed(() => myBallot.value.length > 0)
  /** 참가자 수 (votedCount 의 분모) */
  const participantCount = computed(() => participants.value.length)

  // ── 내부 헬퍼 ──
  /** 상세 응답으로 상태 전체 갱신 */
  function applyDetail(detail) {
    room.value = {
      roomPublicId: detail.roomPublicId,
      title: detail.title,
      host: detail.hostMemberId ?? null,
      amHost: detail.amHost === true,
      status: detail.status,
      winnerCandidateId: detail.winnerCandidateId ?? null,
      inviteCode: detail.inviteCode,
    }
    candidates.value = detail.candidates ?? []
    participants.value = detail.participants ?? []
    myBallot.value = detail.myBallot ?? []
  }

  /** 결과/마감 응답으로 집계·상태 갱신 */
  function applyResult(result) {
    tally.value = result.tally ?? []
    version.value = result.version ?? version.value
    if (result.votedCount != null) votedCount.value = result.votedCount
    if (room.value) {
      room.value.status = result.status ?? room.value.status
      room.value.winnerCandidateId = result.winnerCandidateId ?? room.value.winnerCandidateId
    }
  }

  function handleError(e, fallbackMsg) {
    if (e?.response?.status === 404) {
      notFound.value = true
      error.value = '종료된 투표입니다.'
      return
    }
    error.value = fallbackMsg
  }

  // ── actions ──
  /** 방 생성 (방장). 생성 후 상세까지 로드. */
  async function create(body) {
    loading.value = true
    error.value = null
    notFound.value = false
    try {
      const res = await voteApi.createVoteRoom(body)
      await loadDetail(res.roomPublicId)
      return res.roomPublicId
    } catch (e) {
      handleError(e, '투표방을 만들지 못했습니다.')
      return null
    } finally {
      loading.value = false
    }
  }

  /** 코드로 입장. 입장 응답(상세 형태)으로 상태 채움. */
  async function joinByCode(code) {
    loading.value = true
    error.value = null
    notFound.value = false
    try {
      const detail = await voteApi.joinVoteRoom(code)
      applyDetail(detail)
      return detail.roomPublicId
    } catch (e) {
      if (e?.response?.status === 404) error.value = '유효하지 않은 초대 코드입니다.'
      else error.value = '입장하지 못했습니다.'
      return null
    } finally {
      loading.value = false
    }
  }

  /** 방 상세 로드 */
  async function loadDetail(publicId) {
    loading.value = true
    error.value = null
    notFound.value = false
    try {
      const detail = await voteApi.fetchVoteRoom(publicId)
      applyDetail(detail)
    } catch (e) {
      handleError(e, '투표방을 불러오지 못했습니다.')
    } finally {
      loading.value = false
    }
  }

  /** 결과 스냅샷 로드 (재연결 직후 version 기준 동기화에도 사용) */
  async function loadResult(publicId) {
    try {
      const result = await voteApi.fetchVoteResult(publicId)
      applyResult(result)
    } catch (e) {
      handleError(e, '결과를 불러오지 못했습니다.')
    }
  }

  /** 투표 제출. 응답으로 myBallot/tally 갱신. */
  async function submitBallot(candidateIds) {
    if (!room.value) return
    error.value = null
    try {
      const res = await voteApi.castBallot(room.value.roomPublicId, candidateIds)
      myBallot.value = res.myBallot ?? candidateIds
      if (res.tally) tally.value = res.tally
      if (res.votedCount != null) votedCount.value = res.votedCount
    } catch (e) {
      if (e?.response?.status === 409) error.value = '이미 마감된 투표입니다.'
      else if (e?.response?.status === 400) error.value = '투표 형식이 올바르지 않습니다.'
      else handleError(e, '투표하지 못했습니다.')
      throw e
    }
  }

  /** 마감 (호스트). 응답으로 결과 반영. */
  async function close() {
    if (!room.value) return
    error.value = null
    try {
      const result = await voteApi.closeVoteRoom(room.value.roomPublicId)
      applyResult(result)
    } catch (e) {
      handleError(e, '마감하지 못했습니다.')
      throw e
    }
  }

  /** 실시간 구독 시작. 재연결 시 스냅샷 동기화는 onConnect 후 loadResult 로. */
  function connectRealtime(publicId) {
    connectVoteRoom(publicId, {
      onTally: (msg) => applyRealtime(msg),
      onClosed: (msg) => applyRealtime(msg),
      onError: () => {
        connected.value = false
      },
    })
    connected.value = true
  }

  /** 실시간 구독 해제 */
  function disconnect() {
    disconnectSocket()
    connected.value = false
  }

  /**
   * STOMP 메시지 적용. version dedup + tally 병합 + CLOSED 처리.
   * version 이 보관본보다 낮거나 같으면 무시 (단 version 0/미상은 항상 적용).
   * @param {RealtimeMessage} msg
   */
  function applyRealtime(msg) {
    if (!msg) return
    const incoming = msg.version
    const isUnknownVersion = incoming === undefined || incoming === null || incoming === 0
    // 마감(ROOM_CLOSED)은 단조·종결 상태라 stale close 가 존재할 수 없으므로
    // dedup 으로 절대 폐기하면 안 된다. 터미널 이벤트만 stale 이어도 통과시킨다.
    const isTerminal = msg.type === 'ROOM_CLOSED'
    const isStale = !isUnknownVersion && incoming <= version.value
    if (isStale && !isTerminal) return

    if (Array.isArray(msg.tally)) tally.value = msg.tally
    // votedCount 는 메시지에 실려 있을 때만 반영 (터미널 ROOM_CLOSED 포함).
    if (msg.votedCount != null) votedCount.value = msg.votedCount
    // version 은 앞으로만 전진 (stale 한 터미널이 version 을 되돌리지 않도록).
    if (!isUnknownVersion && incoming > version.value) version.value = incoming

    if (msg.type === 'ROOM_CLOSED' && room.value) {
      room.value.status = 'CLOSED'
      if (msg.winnerCandidateId !== undefined) {
        room.value.winnerCandidateId = msg.winnerCandidateId ?? null
      }
    }
  }

  return {
    // state
    room,
    candidates,
    participants,
    myBallot,
    tally,
    version,
    votedCount,
    loading,
    error,
    connected,
    notFound,
    // getters
    rankedTally,
    isHost,
    hasVoted,
    participantCount,
    // actions
    create,
    joinByCode,
    loadDetail,
    loadResult,
    submitBallot,
    close,
    connectRealtime,
    disconnect,
    applyRealtime,
  }
})
