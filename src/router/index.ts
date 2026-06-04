import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // 데모: 댓글 템플릿 화면을 홈으로 연결 (실제 라우트는 기능 추가 시 교체)
      component: () => import('@/features/comment/views/CommentListView.vue'),
    },
    // 새 기능 페이지는 features/<f>/views 의 컴포넌트를 여기에 등록한다.
  ],
})

export default router
