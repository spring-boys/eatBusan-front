// 댓글 전역 상태 (Pinia). 비동기 호출은 반드시 loading/error 상태를 함께 관리한다.
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as commentApi from '../api/commentApi'
import type { CommentResponse } from '../types/comment'

const PAGE_SIZE = 10

export const useCommentStore = defineStore('comment', () => {
  const comments = ref<CommentResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)

  /** 특정 게시글의 댓글 목록 로드 (해당 페이지로 교체) */
  async function loadComments(postId: number, targetPage = 1) {
    loading.value = true
    error.value = null
    try {
      const { data } = await commentApi.fetchComments(postId, {
        page: targetPage,
        size: PAGE_SIZE,
      })
      comments.value = data
      page.value = targetPage
    } catch (e) {
      error.value = '댓글을 불러오지 못했습니다.'
    } finally {
      loading.value = false
    }
  }

  /** 댓글 작성 후 첫 페이지부터 다시 로드 */
  async function addComment(postId: number, content: string) {
    await commentApi.createComment(postId, { content })
    await loadComments(postId, 1)
  }

  /** 댓글 삭제 후 현재 페이지 다시 로드 */
  async function removeComment(postId: number, commentId: number) {
    await commentApi.deleteComment(postId, commentId)
    await loadComments(postId, page.value)
  }

  return { comments, loading, error, page, loadComments, addComment, removeComment }
})
