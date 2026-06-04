// 식당 리스트 전역 상태 (Pinia). 현재 위치 기반 거리 정렬 + 카테고리 필터.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as placeApi from '../api/placeApi'
import { BUSAN_CENTER, getCurrentPosition, haversineMeters } from '@/shared/utils/geo'

export const ALL_CATEGORY = '전체'
export const CATEGORIES = ['전체', '한식', '카페·디저트', '회·해산물', '고기·구이', '분식']

export const usePlaceListStore = defineStore('placeList', () => {
  /** @type {import('vue').Ref<import('../types/place.js').PlaceResponse[]>} */
  const places = ref([])
  const loading = ref(false)
  const error = ref(null)

  /** @type {import('vue').Ref<{ lat: number, lng: number } | null>} */
  const location = ref(null)
  const locating = ref(false)
  const usingFallback = ref(false) // 위치 권한 거부 → 부산 도심 기준

  const category = ref(ALL_CATEGORY)

  /** 현재 위치 조회 (실패 시 부산 도심으로 폴백) */
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

  /** 식당 목록 로드 */
  async function load() {
    loading.value = true
    error.value = null
    try {
      places.value = await placeApi.fetchPlaces()
    } catch {
      error.value = '주변 식당을 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  /** 최초 진입: 위치 → 목록 */
  async function init() {
    if (places.value.length > 0) return
    await locate()
    await load()
  }

  function setCategory(next) {
    category.value = next
  }

  /** 거리 계산 + 카테고리 필터 + 가까운 순 정렬 */
  const visiblePlaces = computed(() => {
    const loc = location.value
    let list = places.value.map((p) => ({
      ...p,
      distanceM: loc ? haversineMeters(loc.lat, loc.lng, p.lat, p.lng) : undefined,
    }))
    if (category.value !== ALL_CATEGORY) {
      list = list.filter((p) => p.category === category.value)
    }
    if (loc) {
      list = [...list].sort((a, b) => (a.distanceM ?? 0) - (b.distanceM ?? 0))
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
    category,
    visiblePlaces,
    locate,
    load,
    init,
    setCategory,
  }
})
