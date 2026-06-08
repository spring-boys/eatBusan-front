// 식당 리스트 전역 상태 (Pinia). 위치 기반(내 주변) + 지역별(구/군) 두 모드 지원.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as placeApi from '../api/placeApi'
import { BUSAN_CENTER, getCurrentPosition, haversineMeters } from '@/shared/utils/geo'

export const ALL_DISTRICT = '전체'

export const DISTRICTS = [
  '전체',
  '중구',
  '서구',
  '동구',
  '영도구',
  '부산진구',
  '동래구',
  '남구',
  '북구',
  '해운대구',
  '사하구',
  '금정구',
  '강서구',
  '연제구',
  '수영구',
  '사상구',
  '기장군',
]

export const usePlaceListStore = defineStore('placeList', () => {
  /** @type {import('vue').Ref<import('../types/place.js').PlaceResponse[]>} */
  const places = ref([])
  const loading = ref(false)
  const error = ref(null)

  /** @type {import('vue').Ref<{ lat: number, lng: number } | null>} */
  const location = ref(null)
  const locating = ref(false)
  const usingFallback = ref(false)

  /** @type {import('vue').Ref<'nearby'|'district'>} */
  const mode = ref('district')
  const district = ref(ALL_DISTRICT)

  async function locate() {
    locating.value = true
    try {
      location.value = await getCurrentPosition()
      usingFallback.value = false
    } catch {
      location.value = BUSAN_CENTER
      usingFallback.value = true
    } finally {
      locating.value = false
    }
  }

  function currentAreaCode() {
    if (mode.value !== 'district' || district.value === ALL_DISTRICT) return null
    return placeApi.getAreaCodeByDistrict(district.value)
  }

  async function load() {
    loading.value = true
    error.value = null
    try {
      places.value = await placeApi.fetchPlaces({ areaCode: currentAreaCode() })
    } catch {
      error.value = '주변 식당을 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  async function init() {
    if (places.value.length > 0) return
    await load()
  }

  async function setMode(next) {
    if (mode.value === next) return
    mode.value = next
    await load()
  }

  async function setDistrict(next) {
    if (district.value === next) return
    district.value = next
    if (mode.value === 'district') await load()
  }

  const visiblePlaces = computed(() => {
    const loc = location.value
    let list = places.value.map((p) => ({
      ...p,
      distanceM:
        loc && Number.isFinite(p.lat) && Number.isFinite(p.lng)
          ? haversineMeters(loc.lat, loc.lng, p.lat, p.lng)
          : undefined,
    }))

    if (mode.value === 'nearby') {
      if (loc) {
        list = [...list].sort((a, b) => {
          const aDistance = Number.isFinite(a.distanceM) ? a.distanceM : Number.POSITIVE_INFINITY
          const bDistance = Number.isFinite(b.distanceM) ? b.distanceM : Number.POSITIVE_INFINITY
          return aDistance - bDistance
        })
      }
    } else {
      if (district.value !== ALL_DISTRICT) list = list.filter((p) => p.district === district.value)
    }

    return list
  })

  return {
    places,
    loading,
    error,
    location,
    locating,
    usingFallback,
    mode,
    district,
    visiblePlaces,
    locate,
    load,
    init,
    setMode,
    setDistrict,
  }
})
