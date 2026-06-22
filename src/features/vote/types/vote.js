// 투표방 도메인 타입 (JSDoc). 형태의 기준은 투표방 통합 계약(실제 백엔드 코드 확정).
// status 값: "OPEN" | "CLOSED". myBallot 은 미투표 시 빈 배열. tally score 는 점수합(숫자).

/**
 * 방 후보 (자동 시드된 근처 맛집)
 * @typedef {Object} Candidate
 * @property {number} candidateId
 * @property {number} placeId
 * @property {string} placeName
 * @property {string} [address]  리스팅 카드 메타. BE 가 CandidateResponse 에 추가하면 표시 (없으면 graceful)
 * @property {string} [category]  카테고리 칩 (옵션)
 * @property {string} [thumbnailUrl]  썸네일 URL (옵션)
 */

/**
 * 방 참가자
 * @typedef {Object} Participant
 * @property {number} memberId
 * @property {string} status
 */

/**
 * 방 생성 요청 — POST /api/vote-rooms
 * @typedef {Object} VoteRoomCreateRequest
 * @property {string} title
 * @property {number} lat
 * @property {number} lng
 * @property {number} radius
 */

/**
 * 방 생성 응답 — POST /api/vote-rooms (201)
 * @typedef {Object} VoteRoomCreateResponse
 * @property {string} roomPublicId
 * @property {string} inviteCode
 * @property {Candidate[]} candidates
 * @property {Participant[]} participants
 */

/**
 * 방 상세 — GET /api/vote-rooms/{publicId} (200) / join 응답도 동일 형태
 * @typedef {Object} VoteRoomDetail
 * @property {string} roomPublicId
 * @property {string} title
 * @property {number} hostMemberId
 * @property {("OPEN"|"CLOSED")} status
 * @property {?number} winnerCandidateId
 * @property {string} inviteCode
 * @property {boolean} amHost  요청 주체가 이 방의 호스트인지 (백엔드 판정)
 * @property {number[]} myBallot  선택한 candidateId 를 순서(1·2·3등)대로. 미투표 시 빈 배열
 * @property {Candidate[]} candidates
 * @property {Participant[]} participants
 */

/**
 * 집계 한 항목
 * @typedef {Object} TallyEntry
 * @property {number} candidateId
 * @property {number} score  점수합(숫자)
 */

/**
 * 투표 요청 — POST /api/vote-rooms/{publicId}/votes
 * @typedef {Object} VoteRequest
 * @property {number[]} candidateIds  [1등, 2등, 3등] candidateId. 최대 3, 중복 불가
 */

/**
 * 투표 응답 — POST /api/vote-rooms/{publicId}/votes (200)
 * @typedef {Object} VoteResponse
 * @property {number[]} myBallot  선택한 candidateId 를 순서대로
 * @property {TallyEntry[]} tally
 * @property {number} votedCount  ballot 제출한 distinct 멤버 수
 */

/**
 * 결과/마감 응답 — GET /api/vote-rooms/{publicId}/result, POST .../close (200)
 * @typedef {Object} VoteRoomResult
 * @property {("OPEN"|"CLOSED")} status
 * @property {?number} winnerCandidateId
 * @property {number} version
 * @property {TallyEntry[]} tally
 * @property {number} votedCount  ballot 제출한 distinct 멤버 수
 */

/**
 * STOMP 실시간 수신 메시지 (/topic/vote-rooms/{publicId}).
 * 클라이언트 SEND 금지 — 수신 전용.
 * @typedef {Object} RealtimeMessage
 * @property {("TALLY_UPDATED"|"ROOM_CLOSED")} type
 * @property {number} version
 * @property {TallyEntry[]} tally
 * @property {number} [votedCount]  ballot 제출한 distinct 멤버 수
 * @property {number} [winnerCandidateId]  ROOM_CLOSED 일 때만
 */

export {}
