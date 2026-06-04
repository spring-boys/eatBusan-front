// 공통 시간 포맷 유틸. ISO 문자열을 한국어 상대 시간으로 변환한다.

/**
 * "2시간 전", "3일 전" 같은 상대 시간 문자열. 파싱 실패 시 빈 문자열.
 * @param {string} iso
 * @returns {string}
 */
export function formatRelativeTime(iso) {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''

  const diffSec = Math.floor((Date.now() - then) / 1000)
  if (diffSec < 60) return '방금 전'

  const min = Math.floor(diffSec / 60)
  if (min < 60) return `${min}분 전`

  const hour = Math.floor(min / 60)
  if (hour < 24) return `${hour}시간 전`

  const day = Math.floor(hour / 24)
  if (day < 7) return `${day}일 전`

  const week = Math.floor(day / 7)
  if (week < 5) return `${week}주 전`

  const month = Math.floor(day / 30)
  if (month < 12) return `${month}개월 전`

  return `${Math.floor(day / 365)}년 전`
}
