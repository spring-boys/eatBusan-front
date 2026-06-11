// 후기 작성 전역 상태 (Pinia). 비동기 호출은 loading/error 를 함께 관리한다.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as postApi from '../api/postApi'
import { useAuthStore } from '@/features/auth/store/authStore'

export const usePostWriteStore = defineStore('postWrite', () => {
  const submitting = ref(false)
  const error = ref(null)

  function clearError() {
    error.value = null
  }

  /**
   * 후기 등록. 작성자는 로그인 이메일로 식별한다 (백엔드가 email 로 회원 조회).
   * @param {{ placeId: number, title: string, content: string }} payload
   * @param {File[]} [files]  첨부 사진
   * @returns {Promise<import('../types/post.js').PostResponse|null>} 실패 시 null
   */
  async function submit(payload, files = []) {
    const auth = useAuthStore()
    submitting.value = true
    error.value = null
    try {
      return await postApi.createPost(
        {
          userId: null,
          placeId: payload.placeId,
          email: auth.memberEmail,
          title: payload.title,
          content: payload.content,
        },
        files,
      )
    } catch (e) {
      const status = e?.response?.status
      const code = e?.response?.data?.code
      if (status === 401) error.value = '로그인이 만료됐어요. 다시 로그인해주세요.'
      else if (code === 'PLACE_NOT_FOUND')
        error.value = '선택한 가게를 찾을 수 없어요. 다시 선택해주세요.'
      else error.value = '후기 등록에 실패했어요. 잠시 후 다시 시도해주세요.'
      return null
    } finally {
      submitting.value = false
    }
  }

  return { submitting, error, clearError, submit }
})
