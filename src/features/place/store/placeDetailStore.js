// 식당 상세 + 후기 전역 상태 (Pinia).
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as placeApi from '../api/placeApi'

export const usePlaceDetailStore = defineStore('placeDetail', () => {
  /** @type {import('vue').Ref<import('../types/place.js').PlaceResponse | null>} */
  const place = ref(null)
  /** @type {import('vue').Ref<import('@/features/post/types/post.js').PostResponse[]>} */
  const reviews = ref([])
  const loading = ref(false)
  const error = ref(null)

  /** 식당 + 후기 로드 */
  async function load(id) {
    loading.value = true
    error.value = null
    place.value = null
    reviews.value = []
    try {
      const [placeData, reviewData] = await Promise.all([
        placeApi.fetchPlace(id),
        placeApi.fetchPlaceReviews(id),
      ])
      place.value = placeData
      reviews.value = reviewData
    } catch {
      error.value = '식당 정보를 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  /**
   * 후기 좋아요 토글 (낙관적 업데이트).
   * 후기 = Post 이므로, 실제 백엔드 연동 시 postApi.toggleLike(reviewId)로 확정 호출을 붙인다.
   */
  function toggleReviewLike(reviewId) {
    const review = reviews.value.find((r) => r.id === reviewId)
    if (!review) return
    const liked = !(review.liked ?? false)
    review.liked = liked
    review.likeCount += liked ? 1 : -1
  }

  return { place, reviews, loading, error, load, toggleReviewLike }
})
