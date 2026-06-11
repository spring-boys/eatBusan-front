// 후기 엔티티 단일 저장소 (Pinia). 같은 후기를 피드·상세·가게상세가 각자 복사해 들고 있으면
// 좋아요/댓글 수가 화면마다 어긋난다 — 모든 화면이 여기 있는 한 객체를 공유하게 한다.
// 목록 스토어들은 id 배열만 보유하고, 객체는 get(id) 로 꺼내 쓴다.
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import * as postApi from '../api/postApi'

export const usePostEntityStore = defineStore('postEntity', () => {
  /** @type {Record<number, import('../types/post.js').PostResponse>} id → 후기 (화면 간 공유되는 단일 사본) */
  const byId = reactive({})

  /**
   * 서버 응답을 병합 저장. 기존 객체가 있으면 참조를 유지한 채 필드만 덮어쓴다
   * (가게 상세의 축소 응답이 피드의 풍부한 필드를 지우지 않도록 — 없는 키는 건드리지 않음).
   * @param {import('../types/post.js').PostResponse} post
   */
  function upsert(post) {
    const cur = byId[post.id]
    if (cur) Object.assign(cur, post)
    else byId[post.id] = { ...post }
    return byId[post.id]
  }

  /**
   * @param {import('../types/post.js').PostResponse[]} posts
   * @returns {number[]} 저장된 id 목록 (목록 스토어가 보유)
   */
  function upsertAll(posts) {
    return posts.map((p) => upsert(p).id)
  }

  /** @param {number} id */
  function get(id) {
    return byId[id] ?? null
  }

  /** @param {number} id @param {Partial<import('../types/post.js').PostResponse>} partial */
  function patch(id, partial) {
    const cur = byId[id]
    if (cur) Object.assign(cur, partial)
  }

  /** 삭제된 후기 제거 — id 를 참조하던 모든 목록에서 자동으로 사라진다. @param {number} id */
  function remove(id) {
    delete byId[id]
  }

  /**
   * 좋아요 토글 — 어느 화면에서 눌러도 단일 사본을 고치므로 전 화면 동시 반영.
   * 낙관적 업데이트 후 서버 확정값으로 교체, 실패 시 롤백.
   * @param {number} id
   */
  async function toggleLike(id) {
    const post = byId[id]
    if (!post) return

    const prevLiked = post.liked ?? false
    const prevCount = post.likeCount
    post.liked = !prevLiked
    post.likeCount = prevCount + (prevLiked ? -1 : 1)

    try {
      const res = await postApi.toggleLike(id)
      post.liked = res.liked
      post.likeCount = res.likeCount
    } catch {
      // 인증 만료/네트워크 실패 등 → 원래 상태로 되돌린다.
      post.liked = prevLiked
      post.likeCount = prevCount
    }
  }

  return { byId, upsert, upsertAll, get, patch, remove, toggleLike }
})
