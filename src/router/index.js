import { createRouter, createWebHistory } from 'vue-router'

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
    // 새 기능 페이지는 features/<f>/views 의 컴포넌트를 여기에 등록한다.
  ],
})

export default router
