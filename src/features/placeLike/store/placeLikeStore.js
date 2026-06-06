// 식당 좋아요 전역 상태 (Pinia). 비동기 호출은 loading/error 를 함께 관리한다.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as placeLikeApi from '../api/placeLikeApi'

const PAGE_SIZE = 10

export const usePlaceLikeStore = defineStore('placeLike', () => {
  /** @type {import('vue').Ref<import('../types/placeLike.js').PlaceLikeDetail[]>} */
  const myLikes = ref([])
  const loading = ref(false)
  const error = ref(null)
  const hasMore = ref(true)

  /** 내 좋아요 목록 첫 페이지 로드 (교체) */
  async function loadMyLikes() {
    loading.value = true
    error.value = null
    try {
      const list = await placeLikeApi.fetchMyLikedPlaces({ size: PAGE_SIZE })
      myLikes.value = list
      hasMore.value = list.length === PAGE_SIZE
    } catch {
      error.value = '좋아요한 맛집을 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  /** 다음 페이지 추가 로드 (마지막 placeLikeId 커서) */
  async function loadMore() {
    if (!hasMore.value || loading.value || myLikes.value.length === 0) return
    loading.value = true
    try {
      const lastId = myLikes.value[myLikes.value.length - 1].placeLikeId
      const list = await placeLikeApi.fetchMyLikedPlaces({ lastId, size: PAGE_SIZE })
      myLikes.value.push(...list)
      hasMore.value = list.length === PAGE_SIZE
    } catch {
      error.value = '더 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  /** 식당 좋아요 */
  async function like(placeId) {
    await placeLikeApi.likePlace(placeId)
  }

  /** 식당 좋아요 취소 (목록에서도 제거) */
  async function unlike(placeId) {
    await placeLikeApi.unlikePlace(placeId)
    myLikes.value = myLikes.value.filter((p) => p.placeId !== placeId)
  }

  return { myLikes, loading, error, hasMore, loadMyLikes, loadMore, like, unlike }
})
