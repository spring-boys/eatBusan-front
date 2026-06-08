// 인증(Member/Auth) 도메인 타입 (JSDoc). 형태 기준: docs/API_CONTRACT.md (Auth / Member).

/**
 * 회원가입 요청 (백엔드 MemberRequestDto)
 * @typedef {Object} JoinRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * 로그인 요청 (백엔드 LoginRequestDto, email 형식 검증)
 * @typedef {Object} LoginRequest
 * @property {string} email
 * @property {string} password
 */

/**
 * 내 정보 응답 (백엔드 MemberInfoDto)
 * @typedef {Object} MemberInfoResponse
 * @property {string} email
 */

export {}
