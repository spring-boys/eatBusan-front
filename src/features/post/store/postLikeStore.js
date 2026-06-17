// 내가 좋아요한 후기 전역 상태 (Pinia). 페이지네이션 없이 전체 목록을 한 번에 로드한다.
// 비동기 호출은 반드시 loading/error 상태를 함께 다룬다.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as postApi from '../api/postApi'

export const usePostLikeStore = defineStore('postLike', () => {
  /** @type {import('vue').Ref<import('../api/postApi.js').MyLikedReview[]>} */
  const myLikedReviews = ref([])
  const loading = ref(false)
  const error = ref(null)

  /** 내가 좋아요한 후기 목록 로드 (교체). 페이지네이션 없음. */
  async function loadMyLikedReviews() {
    loading.value = true
    error.value = null
    try {
      myLikedReviews.value = await postApi.fetchMyLikedPosts()
    } catch {
      error.value = '좋아요한 리뷰를 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  return {
    myLikedReviews,
    loading,
    error,
    loadMyLikedReviews,
  }
})
