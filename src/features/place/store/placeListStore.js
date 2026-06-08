// 식당 리스트 전역 상태 (Pinia). 위치 기반(내 주변) + 지역별(구/군) 두 모드 지원.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as placeApi from '../api/placeApi'
import { BUSAN_CENTER, getCurrentPosition, haversineMeters } from '@/shared/utils/geo'

export const ALL_DISTRICT = '전체'
const PAGE_SIZE = 10

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
  const loadingMore = ref(false)
  const error = ref(null)
  const page = ref(0)
  const hasMore = ref(false)

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

  function appendUnique(nextPlaces) {
    const seen = new Set(places.value.map((p) => p.id))
    places.value.push(...nextPlaces.filter((p) => !seen.has(p.id)))
  }

  async function load() {
    loading.value = true
    error.value = null
    page.value = 0
    hasMore.value = false
    try {
      const result = await placeApi.fetchPlacePage({
        areaCode: currentAreaCode(),
        page: 0,
        size: PAGE_SIZE,
      })
      places.value = result.items
      page.value = result.page
      hasMore.value = result.hasMore
    } catch {
      error.value = '주변 식당을 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (loading.value || loadingMore.value || error.value || !hasMore.value) return
    loadingMore.value = true
    try {
      const result = await placeApi.fetchPlacePage({
        areaCode: currentAreaCode(),
        page: page.value + 1,
        size: PAGE_SIZE,
      })
      appendUnique(result.items)
      page.value = result.page
      hasMore.value = result.hasMore
    } catch {
      hasMore.value = false
    } finally {
      loadingMore.value = false
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
    loadingMore,
    error,
    page,
    hasMore,
    location,
    locating,
    usingFallback,
    mode,
    district,
    visiblePlaces,
    locate,
    load,
    loadMore,
    init,
    setMode,
    setDistrict,
  }
})
