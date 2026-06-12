// 위치 기반 거리 계산 + 현재 위치 조회 유틸.

/**
 * 두 좌표 사이 거리(미터). Haversine.
 * @returns {number}
 */
export function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

/**
 * 거리(미터)를 "320m" / "1.2km" 로 포맷.
 * @param {number} m
 * @returns {string}
 */
export function formatDistance(m) {
  if (m < 1000) return `${Math.round(m / 10) * 10}m`
  return `${(m / 1000).toFixed(1)}km`
}

/**
 * 현재 위치를 Promise로 조회.
 * @param {number} [timeout]
 * @returns {Promise<{ lat: number, lng: number }>}
 */
export function getCurrentPosition(timeout = 8000) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('geolocation unsupported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout, maximumAge: 60_000 },
    )
  })
}
