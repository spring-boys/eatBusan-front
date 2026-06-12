// 식당 상세 + 후기 전역 상태 (Pinia).
// 후기(=Post) 객체는 postEntityStore 단일 사본을 공유 — 여기서의 좋아요가 피드·후기상세에도 즉시 반영된다.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as placeApi from '../api/placeApi'
import * as placeLikeApi from '@/features/placeLike/api/placeLikeApi'
import { usePlaceListStore } from './placeListStore'
import { usePlaceLikeStore } from '@/features/placeLike/store/placeLikeStore'
import { usePostEntityStore } from '@/features/post/store/postEntityStore'

export const usePlaceDetailStore = defineStore('placeDetail', () => {
  const postEntity = usePostEntityStore()
  const placeList = usePlaceListStore()
  const placeLike = usePlaceLikeStore()

  /** @type {import('vue').Ref<import('../types/place.js').PlaceResponse | null>} */
  const place = ref(null)
  /** @type {import('vue').Ref<number[]>} 후기 노출 순서 (객체는 entity store 공유) */
  const reviewIds = ref([])
  const loading = ref(false)
  const liking = ref(false)
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
      placeList.patchPlace({
        id: placeData.id,
        likeCount: placeData.likeCount,
        myLike: placeData.myLike,
        phone: placeData.phone,
        url: placeData.url,
      })
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

  /** 식당 좋아요 토글 — 낙관적 업데이트 후 실패 시 롤백 */
  async function togglePlaceLike() {
    if (!place.value || liking.value) return

    const prevLiked = place.value.myLike ?? false
    const prevCount = Number.isFinite(place.value.likeCount) ? place.value.likeCount : 0
    const nextLiked = !prevLiked

    liking.value = true
    place.value.myLike = nextLiked
    place.value.likeCount = Math.max(0, prevCount + (nextLiked ? 1 : -1))
    placeList.patchPlace({
      id: place.value.id,
      myLike: place.value.myLike,
      likeCount: place.value.likeCount,
    })

    try {
      if (nextLiked) await placeLikeApi.likePlace(place.value.id)
      else await placeLikeApi.unlikePlace(place.value.id)
      placeLike.markStale()
    } catch (err) {
      place.value.myLike = prevLiked
      place.value.likeCount = prevCount
      placeList.patchPlace({
        id: place.value.id,
        myLike: prevLiked,
        likeCount: prevCount,
      })
      throw err
    } finally {
      liking.value = false
    }
  }

  return { place, reviews, loading, liking, error, load, toggleReviewLike, togglePlaceLike }
})
