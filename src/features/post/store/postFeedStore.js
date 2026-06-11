// 후기 피드 전역 상태 (Pinia). 무한 스크롤을 관리한다.
// 후기 객체 자체는 postEntityStore 단일 사본을 공유 — 여기는 노출 순서(id 배열)만 가진다.
// 비동기 호출은 반드시 loading/error 상태를 함께 다룬다.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as postApi from '../api/postApi'
import { usePostEntityStore } from './postEntityStore'

const PAGE_SIZE = 8

export const usePostFeedStore = defineStore('postFeed', () => {
  const entity = usePostEntityStore()

  /** @type {import('vue').Ref<number[]>} 피드 노출 순서 (객체는 entity store 공유) */
  const ids = ref([])
  const loading = ref(false) // 최초 로드
  const loadingMore = ref(false) // 다음 페이지 로드
  const error = ref(null)
  const page = ref(0)
  const hasMore = ref(true)

  /** @type {import('vue').ComputedRef<import('../types/post.js').PostResponse[]>} */
  const posts = computed(() => ids.value.map((id) => entity.get(id)).filter(Boolean))

  /** 첫 페이지 로드 (목록 교체). 재시도에도 사용. */
  async function loadFirst() {
    loading.value = true
    error.value = null
    ids.value = []
    page.value = 0
    hasMore.value = true
    try {
      const data = await postApi.fetchPosts(1, PAGE_SIZE)
      ids.value = entity.upsertAll(data)
      page.value = 1
      hasMore.value = data.length === PAGE_SIZE
    } catch {
      error.value = '후기를 불러오지 못했어요.'
    } finally {
      loading.value = false
    }
  }

  /** 다음 페이지 로드 (목록에 이어 붙임). 무한 스크롤에서 호출. */
  async function loadMore() {
    if (loadingMore.value || loading.value || !hasMore.value || error.value) return
    loadingMore.value = true
    try {
      const next = page.value + 1
      const data = await postApi.fetchPosts(next, PAGE_SIZE)
      const seen = new Set(ids.value)
      ids.value.push(...entity.upsertAll(data).filter((id) => !seen.has(id)))
      page.value = next
      hasMore.value = data.length === PAGE_SIZE
    } catch {
      // 추가 로드 실패는 전체 화면 에러로 만들지 않는다.
      hasMore.value = false
    } finally {
      loadingMore.value = false
    }
  }

  /** 좋아요 토글 — entity store 단일 구현으로 위임 (전 화면 동시 반영) */
  function toggleLike(postId) {
    return entity.toggleLike(postId)
  }

  return { posts, loading, loadingMore, error, hasMore, loadFirst, loadMore, toggleLike }
})
