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
      path: '/comments',
      name: 'comments',
      // 댓글 기능 템플릿 데모 (레퍼런스 화면)
      component: () => import('@/features/comment/views/CommentListView.vue'),
    },
    // 새 기능 페이지는 features/<f>/views 의 컴포넌트를 여기에 등록한다.
  ],
})

export default router
