// 식당 상세 + 후기 전역 상태 (Pinia).
// 후기(=Post) 객체는 postEntityStore 단일 사본을 공유 — 여기서의 좋아요가 피드·후기상세에도 즉시 반영된다.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as placeApi from '../api/placeApi'
import { usePostEntityStore } from '@/features/post/store/postEntityStore'

export const usePlaceDetailStore = defineStore('placeDetail', () => {
  const postEntity = usePostEntityStore()

  /** @type {import('vue').Ref<import('../types/place.js').PlaceResponse | null>} */
  const place = ref(null)
  /** @type {import('vue').Ref<number[]>} 후기 노출 순서 (객체는 entity store 공유) */
  const reviewIds = ref([])
  const loading = ref(false)
  const error = ref(null)

  /** @type {import('vue').ComputedRef<import('@/features/post/types/post.js').PostResponse[]>} */
  const reviews = computed(() => reviewIds.value.map((id) => postEntity.get(id)).filter(Boolean))

  /** 식당 + 후기 로드 */
  async function load(id) {
    loading.value = true
    error.value = null
    place.value = null
    reviewIds.value = []
    try {
      const [placeData, reviewData] = await Promise.all([
        placeApi.fetchPlace(id),
        placeApi.fetchPlaceReviews(id),
      ])
      place.value = placeData
      reviewIds.value = postEntity.upsertAll(reviewData)
    } catch {
      error.value = '식당 정보를 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  /** 후기 좋아요 토글 — entity store 단일 구현으로 위임 (실 API 호출 + 낙관적 업데이트) */
  function toggleReviewLike(reviewId) {
    return postEntity.toggleLike(reviewId)
  }

  return { place, reviews, loading, error, load, toggleReviewLike }
})
