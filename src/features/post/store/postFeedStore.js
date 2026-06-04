// 후기 피드 전역 상태 (Pinia). 무한 스크롤 + 좋아요 낙관적 업데이트를 관리한다.
// 비동기 호출은 반드시 loading/error 상태를 함께 다룬다.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as postApi from '../api/postApi'

const PAGE_SIZE = 8

export const usePostFeedStore = defineStore('postFeed', () => {
  /** @type {import('vue').Ref<import('../types/post.js').PostResponse[]>} */
  const posts = ref([])
  const loading = ref(false) // 최초 로드
  const loadingMore = ref(false) // 다음 페이지 로드
  const error = ref(null)
  const page = ref(0)
  const hasMore = ref(true)

  /** 첫 페이지 로드 (목록 교체). 재시도에도 사용. */
  async function loadFirst() {
    loading.value = true
    error.value = null
    posts.value = []
    page.value = 0
    hasMore.value = true
    try {
      const data = await postApi.fetchPosts(1, PAGE_SIZE)
      posts.value = data
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
      posts.value.push(...data)
      page.value = next
      hasMore.value = data.length === PAGE_SIZE
    } catch {
      // 추가 로드 실패는 전체 화면 에러로 만들지 않는다.
      hasMore.value = false
    } finally {
      loadingMore.value = false
    }
  }

  /** 좋아요 토글 (낙관적 업데이트 → 실패 시 롤백) */
  async function toggleLike(postId) {
    const post = posts.value.find((p) => p.id === postId)
    if (!post) return

    const prevLiked = post.liked ?? false
    const prevCount = post.likeCount
    post.liked = !prevLiked
    post.likeCount = prevCount + (prevLiked ? -1 : 1)

    try {
      const res = await postApi.toggleLike(postId)
      post.liked = res.liked
      post.likeCount = res.likeCount
    } catch {
      // 인증 만료/네트워크 실패 등 → 원래 상태로 되돌린다.
      post.liked = prevLiked
      post.likeCount = prevCount
    }
  }

  return { posts, loading, loadingMore, error, hasMore, loadFirst, loadMore, toggleLike }
})
