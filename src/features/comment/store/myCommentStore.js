// 내가 작성한 댓글 전역 상태 (Pinia). 페이지네이션 없이 전체 목록을 한 번에 로드한다.
// 비동기 호출은 반드시 loading/error 상태를 함께 다룬다.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as commentApi from '../api/commentApi'

export const useMyCommentStore = defineStore('myComment', () => {
  /** @type {import('vue').Ref<import('../types/comment.js').MyCommentResponse[]>} */
  const myComments = ref([])
  const loading = ref(false)
  const error = ref(null)

  /** 내가 작성한 댓글 목록 로드 (교체). 페이지네이션 없음. */
  async function loadMyComments() {
    loading.value = true
    error.value = null
    try {
      myComments.value = await commentApi.fetchMyComments()
    } catch {
      error.value = '작성한 댓글을 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  return {
    myComments,
    loading,
    error,
    loadMyComments,
  }
})
