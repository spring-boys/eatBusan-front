// 후기(Post) API 호출 함수. 컴포넌트/스토어는 이 함수들만 사용한다 (axios 직접 호출 금지).
// VITE_USE_MOCK=true 면 백엔드 대신 개발용 시드로 동작한다 (mock은 동적 import → 프로덕션 번들 제외).
import { apiClient } from '@/shared/api/client'
import { USE_MOCK, shouldUseMockFallback } from '@/shared/api/mockFallback'

/** @typedef {import('../types/post.js').PostResponse} PostResponse */
/** @typedef {import('../types/post.js').PostLikeResponse} PostLikeResponse */
/** @typedef {import('../types/post.js').PostRequest} PostRequest */

/**
 * @param {string|number|null|undefined} value
 * @returns {number}
 */
function toCount(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * @param {unknown} data
 * @returns {Array<Record<string, unknown>>}
 */
function unwrapPostList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.items)) return data.items
  throw new Error('invalid post list response')
}

/**
 * 백엔드 PostResponseDto를 화면 모델로 정규화한다.
 * @param {Record<string, unknown>} dto
 * @returns {PostResponse}
 */
function normalizePost(dto) {
  const id = Number(dto.id ?? dto.postId)
  if (!Number.isFinite(id)) throw new Error('invalid post id')
  const email = String(dto.email ?? '')
  // 백엔드 images(PostImageDto[], sortOrder 오름차순) — 첫 장을 대표 이미지로, 전체는 갤러리용으로 보존
  const rawImages = Array.isArray(dto.images) ? dto.images : []
  const images = rawImages.map((img) => ({
    imageUrl: String(img.imageUrl ?? ''),
    sortOrder: Number(img.sortOrder ?? 0),
  }))
  const thumbnailUrl = dto.thumbnailUrl ?? rawImages[0]?.imageUrl ?? null

  return {
    id,
    placeId: Number(dto.placeId ?? 0),
    title: String(dto.title ?? ''),
    content: String(dto.content ?? ''),
    thumbnailUrl: thumbnailUrl ? String(thumbnailUrl) : null,
    images,
    authorEmail: email,
    authorNickname: String(dto.authorNickname ?? (email ? email.split('@')[0] : '익명')),
    authorProfileUrl: dto.authorProfileUrl ? String(dto.authorProfileUrl) : null,
    viewCount: toCount(dto.viewCount),
    commentCount: toCount(dto.commentCount),
    likeCount: toCount(dto.likeCount),
    liked: Boolean(dto.liked ?? false),
    createdAt: String(dto.createdAt ?? new Date().toISOString()),
  }
}

/**
 * 후기 목록 (오프셋 페이지네이션, page 1부터)
 * @param {number} page
 * @param {number} size
 * @returns {Promise<PostResponse[]>}
 */
export async function fetchPosts(page, size) {
  const fetchMock = async () => {
    const { mockFetchPosts } = await import('./mockPosts')
    return mockFetchPosts(page, size)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.get('/posts')
    // 백엔드는 오래된 순(id 오름차순)으로 반환 — 피드는 최신 글이 위로 와야 한다
    const list = unwrapPostList(data)
      .map(normalizePost)
      .sort((a, b) => b.id - a.id)
    if (import.meta.env.DEV && list.length === 0) return fetchMock()
    const start = Math.max(page - 1, 0) * size
    return list.slice(start, start + size)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 좋아요 토글 (인증 필요)
 * @param {number} postId
 * @returns {Promise<PostLikeResponse>}
 */
export async function toggleLike(postId) {
  const fetchMock = async () => {
    const { mockToggleLike } = await import('./mockPosts')
    return mockToggleLike(postId)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.post(`/posts/${postId}/likes`)
    return {
      liked: Boolean(data?.liked),
      likeCount: toCount(data?.likeCount),
    }
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 후기 단건 조회
 * @param {number} postId
 * @returns {Promise<PostResponse>}
 */
export async function fetchPost(postId) {
  const fetchMock = async () => {
    const { mockFetchPost } = await import('./mockPosts')
    return mockFetchPost(postId)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.get(`/posts/${postId}`)
    return normalizePost(data)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 후기 작성 (인증 필요). 사진이 있으면 multipart(post JSON part + files)로 한 번에 업로드한다.
 * @param {PostRequest} body
 * @param {File[]} [files]  첨부 사진 (없으면 JSON 요청)
 * @returns {Promise<PostResponse>}
 */
export async function createPost(body, files = []) {
  const fetchMock = async () => {
    const { mockCreatePost } = await import('./mockPosts')
    return mockCreatePost(body)
  }
  if (USE_MOCK) return fetchMock()

  try {
    if (files.length === 0) {
      const { data } = await apiClient.post('/posts', body)
      return normalizePost(data)
    }
    const form = new FormData()
    form.append('post', new Blob([JSON.stringify(body)], { type: 'application/json' }))
    files.forEach((file) => form.append('files', file))
    const { data } = await apiClient.post('/posts', form)
    return normalizePost(data)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 후기 수정 (인증 필요)
 * @param {number} postId
 * @param {PostRequest} body
 * @returns {Promise<PostResponse>}
 */
export async function updatePost(postId, body) {
  const fetchMock = async () => {
    const { mockUpdatePost } = await import('./mockPosts')
    return mockUpdatePost(postId, body)
  }
  if (USE_MOCK) return fetchMock()

  try {
    const { data } = await apiClient.patch(`/posts/${postId}`, body)
    return normalizePost(data)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 후기 삭제 (인증 필요)
 * @param {number} postId
 * @returns {Promise<void>}
 */
export async function deletePost(postId) {
  const fetchMock = async () => {
    const { mockDeletePost } = await import('./mockPosts')
    return mockDeletePost(postId)
  }
  if (USE_MOCK) return fetchMock()

  try {
    await apiClient.delete(`/posts/${postId}`)
  } catch (error) {
    if (shouldUseMockFallback(error)) return fetchMock()
    throw error
  }
}

/**
 * 내가 작성한 후기 목록 (인증 필요). 페이지네이션 없이 전체를 최신순으로 반환한다.
 * 백엔드 GET /api/posts/my → PostResponseDto[] (피드와 동일 형태)라 normalizePost 재사용.
 * @returns {Promise<PostResponse[]>}
 */
export async function fetchMyPosts() {
  const { data } = await apiClient.get('/posts/my')
  return unwrapPostList(data)
    .map(normalizePost)
    .sort((a, b) => b.id - a.id)
}
