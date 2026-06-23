// 투표방 STOMP 실시간 래퍼. 백엔드 raw STOMP (SockJS 아님) — 수신 전용, 클라이언트 SEND 금지.
// 동일출처 brokerURL 로 연결하고, vite proxy(/ws-stomp → ws://localhost:8081)가 백엔드로 넘긴다.
import { Client } from '@stomp/stompjs'
import { getAccessToken } from '@/shared/api/client'

/** @typedef {import('../types/vote.js').RealtimeMessage} RealtimeMessage */

/** @type {Client | null} */
let client = null

/**
 * 방 토픽 구독을 시작한다. SEND 는 하지 않는다 (쓰기는 전부 REST).
 * @param {string} publicId  roomPublicId
 * @param {Object} handlers
 * @param {(msg: RealtimeMessage) => void} [handlers.onTally]   TALLY_UPDATED 수신
 * @param {(msg: RealtimeMessage) => void} [handlers.onClosed]  ROOM_CLOSED 수신
 * @param {(msg: RealtimeMessage) => void} [handlers.onParticipants]  PARTICIPANTS_UPDATED 수신(총원 갱신)
 * @param {(error: unknown) => void} [handlers.onError]
 */
export function connectVoteRoom(publicId, { onTally, onClosed, onParticipants, onError } = {}) {
  // 기존 연결이 있으면 먼저 정리 (중복 구독 방지)
  disconnect()

  const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
  const brokerURL = `${protocol}://${location.host}/ws-stomp`

  client = new Client({
    brokerURL,
    // CONNECT 헤더에 Bearer 토큰 (메모리 토큰 접근자)
    connectHeaders: { Authorization: `Bearer ${getAccessToken() ?? ''}` },
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      client?.subscribe(`/topic/vote-rooms/${publicId}`, (frame) => {
        let msg
        try {
          msg = JSON.parse(frame.body)
        } catch (e) {
          onError?.(e)
          return
        }
        if (msg?.type === 'TALLY_UPDATED') onTally?.(msg)
        else if (msg?.type === 'ROOM_CLOSED') onClosed?.(msg)
        else if (msg?.type === 'PARTICIPANTS_UPDATED') onParticipants?.(msg)
      })
    },
    onStompError: (frame) => {
      onError?.(frame)
    },
    onWebSocketError: (event) => {
      onError?.(event)
    },
  })

  client.activate()
  return client
}

/** 구독/연결 해제. 재연결도 중단된다. */
export function disconnect() {
  if (client) {
    client.deactivate()
    client = null
  }
}
