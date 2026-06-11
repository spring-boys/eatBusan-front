// 후기 상세 전역 상태 (Pinia). 단건 로드·수정·삭제를 관리한다.
// 후기 객체는 postEntityStore 단일 사본을 공유 — 상세에서의 좋아요/댓글 변경이 피드·가게상세에 즉시 반영된다.
// 비동기 호출은 반드시 loading/error 상태를 함께 다룬다.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as postApi from '../api/postApi'
import { usePostEntityStore } from './postEntityStore'
import { useAuthStore } from '@/features/auth/store/authStore'

export const usePostDetailStore = defineStore('postDetail', () => {
  const entity = usePostEntityStore()

  /** @type {import('vue').Ref<number|null>} 현재 보고 있는 후기 id */
  const currentId = ref(null)
  const loading = ref(false)
  const error = ref(null)

  /** @type {import('vue').ComputedRef<import('../types/post.js').PostResponse|null>} */
  const post = computed(() => (currentId.value != null ? entity.get(currentId.value) : null))

  /** 후기 단건 로드 */
  async function loadPost(id) {
    loading.value = true
    error.value = null
    currentId.value = null
    try {
      const data = await postApi.fetchPost(Number(id))
      entity.upsert(data)
      currentId.value = data.id
    } catch {
      error.value = '후기를 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  /** 좋아요 토글 — entity store 단일 구현으로 위임 */
  function toggleLike() {
    if (currentId.value == null) return
    return entity.toggleLike(currentId.value)
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
      entity.upsert(updated)
      return true
    } catch {
      error.value = '수정에 실패했어요. 잠시 후 다시 시도해주세요.'
      return false
    } finally {
      loading.value = false
    }
  }

  /**
   * 후기 삭제 (소프트 삭제 — 서버 204). 성공 시 entity 에서 제거 → 피드 등 모든 목록에서 사라진다.
   * ⚠️ 백엔드는 소유권 검증이 없다 — 여기선 UX 가드만(뷰에서 authorEmail 비교).
   * @returns {Promise<boolean>} 성공 여부
   */
  async function remove() {
    if (currentId.value == null) return false
    loading.value = true
    error.value = null
    try {
      await postApi.deletePost(currentId.value)
      entity.remove(currentId.value)
      currentId.value = null
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
