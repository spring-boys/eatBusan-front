import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth/store/authStore'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      // 홈 = 위치 기반 식당 리스트
      component: () => import('@/features/place/views/PlaceListView.vue'),
    },
    {
      path: '/places/:id',
      name: 'place-detail',
      // 식당 상세 + 후기
      component: () => import('@/features/place/views/PlaceDetailView.vue'),
    },
    {
      path: '/feed',
      name: 'feed',
      // 전체 후기 둘러보기 (사진 피드)
      component: () => import('@/features/post/views/PostFeedView.vue'),
    },
    {
      path: '/posts/:id',
      name: 'post-detail',
      // 후기 상세 (단건 조회 + 댓글 시트 + 좋아요 + 본인 글 수정·삭제)
      component: () => import('@/features/post/views/PostDetailView.vue'),
    },
    {
      path: '/posts/:id/edit',
      name: 'post-edit',
      // 후기 수정 (전체화면, title·content만 편집 가능 — 백엔드 PATCH 스펙)
      meta: { chrome: false },
      component: () => import('@/features/post/views/EditPostView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      // 로그인 (전체화면 — 상단바/하단탭 숨김)
      meta: { chrome: false },
      component: () => import('@/features/auth/views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      // 회원가입 (전체화면 — 상단바/하단탭 숨김)
      meta: { chrome: false },
      component: () => import('@/features/auth/views/SignupView.vue'),
    },
    {
      path: '/my',
      name: 'my',
      // 마이페이지 (목업)
      component: () => import('@/features/user/views/MyPageView.vue'),
    },
    {
      path: '/my/posts',
      name: 'my-posts',
      // 내가 다녀온 맛집 (목업)
      component: () => import('@/features/post/views/MyPostsView.vue'),
    },
    {
      path: '/my/likes',
      name: 'my-likes',
      // 좋아요한 맛집 (목업)
      component: () => import('@/features/placeLike/views/MyLikedPlacesView.vue'),
    },
    {
      path: '/my/liked-reviews',
      name: 'my-liked-reviews',
      // 좋아요한 리뷰 (전체 목록 한 번에 조회)
      component: () => import('@/features/post/views/MyLikedReviewsView.vue'),
    },
    {
      path: '/my/comments',
      name: 'my-comments',
      // 내가 작성한 댓글 (전체 목록 한 번에 조회)
      component: () => import('@/features/comment/views/MyCommentsView.vue'),
    },
    {
      path: '/write',
      name: 'write',
      // 후기 쓰기 (목업, 전체화면)
      meta: { chrome: false },
      component: () => import('@/features/post/views/WritePostView.vue'),
    },
    {
      path: '/comments',
      name: 'comments',
      // 댓글 기능 템플릿 데모 (레퍼런스 화면)
      component: () => import('@/features/comment/views/CommentListView.vue'),
    },
    {
      path: '/vote',
      name: 'vote-home',
      // 투표 랜딩 (하단탭 진입점 — 방 만들기 + 코드 입장)
      component: () => import('@/features/vote/views/VoteHomeView.vue'),
    },
    {
      path: '/vote/new',
      name: 'vote-new',
      // 투표방 만들기 (현재 위치 기반 → 초대 코드 발급)
      component: () => import('@/features/vote/views/VoteRoomCreateView.vue'),
    },
    {
      path: '/vote/join',
      name: 'vote-join',
      // 코드로 투표방 입장
      component: () => import('@/features/vote/views/VoteRoomJoinView.vue'),
    },
    {
      path: '/vote/:roomPublicId',
      name: 'vote-room',
      // 투표방 메인 (실시간 투표 + 결과). 뷰가 route.params.roomPublicId 를 읽는다
      props: true,
      component: () => import('@/features/vote/views/VoteRoomView.vue'),
    },
    // 새 기능 페이지는 features/<f>/views 의 컴포넌트를 여기에 등록한다.
  ],
})

// 투표(/vote*)는 로그인 회원만. 미인증이면 refresh 쿠키로 세션 복구를 시도하고,
// 그래도 안 되면 로그인 화면으로 보낸다(로그인 후 원래 경로로 복귀하도록 redirect 쿼리 전달).
router.beforeEach(async (to) => {
  const needsAuth = to.path === '/vote' || to.path.startsWith('/vote/')
  if (!needsAuth) return true

  const auth = useAuthStore()
  if (auth.isAuthenticated) return true

  const restored = await auth.restoreSession()
  if (restored) return true

  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
