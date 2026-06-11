// 후기 상세 전역 상태 (Pinia). 단건 로드·좋아요 낙관적 업데이트·수정·삭제를 관리한다.
// 비동기 호출은 반드시 loading/error 상태를 함께 다룬다.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as postApi from '../api/postApi'
import { useAuthStore } from '@/features/auth/store/authStore'

export const usePostDetailStore = defineStore('postDetail', () => {
  /** @type {import('vue').Ref<import('../types/post.js').PostResponse|null>} */
  const post = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /** 후기 단건 로드 */
  async function loadPost(id) {
    loading.value = true
    error.value = null
    post.value = null
    try {
      post.value = await postApi.fetchPost(Number(id))
    } catch {
      error.value = '후기를 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  /** 좋아요 토글 — 낙관적 업데이트, 실패 시 롤백 */
  async function toggleLike() {
    if (!post.value) return
    const prevLiked = post.value.liked ?? false
    const prevCount = post.value.likeCount
    post.value.liked = !prevLiked
    post.value.likeCount = prevCount + (prevLiked ? -1 : 1)
    try {
      const res = await postApi.toggleLike(post.value.id)
      post.value.liked = res.liked
      post.value.likeCount = res.likeCount
    } catch {
      // 인증 만료·네트워크 실패 등 → 원래 상태로 되돌린다.
      post.value.liked = prevLiked
      post.value.likeCount = prevCount
    }
  }

  /**
   * 후기 수정 (title·content만 반영 — 백엔드 PATCH 스펙)
   * ⚠️ 백엔드는 소유권 검증이 없다 — 여기선 UX 가드만(뷰에서 authorEmail 비교).
   * @param {{ title: string, content: string }} payload
   * @returns {Promise<boolean>} 성공 여부
   */
  async function update(payload) {
    if (!post.value) return false
    const auth = useAuthStore()
    loading.value = true
    error.value = null
    try {
      const updated = await postApi.updatePost(post.value.id, {
        userId: null,
        placeId: post.value.placeId ?? 0,
        email: auth.memberEmail,
        title: payload.title,
        content: payload.content,
      })
      post.value = updated
      return true
    } catch {
      error.value = '수정에 실패했어요. 잠시 후 다시 시도해주세요.'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 후기 삭제 (소프트 삭제 — 서버 204)
   * ⚠️ 백엔드는 소유권 검증이 없다 — 여기선 UX 가드만(뷰에서 authorEmail 비교).
   * @returns {Promise<boolean>} 성공 여부
   */
  async function remove() {
    if (!post.value) return false
    loading.value = true
    error.value = null
    try {
      await postApi.deletePost(post.value.id)
      post.value = null
      return true
    } catch {
      error.value = '삭제에 실패했어요. 잠시 후 다시 시도해주세요.'
      return false
    } finally {
      loading.value = false
    }
  }

  return { post, loading, error, loadPost, toggleLike, update, remove }
})
