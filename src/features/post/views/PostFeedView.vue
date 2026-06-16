<script setup>
// 후기 피드 (홈 = 피드). 사진 중심 세로 단일 컬럼, 무한 스크롤.
// 패턴: store에서 상태/액션을 가져오고 로딩/에러/빈/추가로딩 상태를 모두 처리한다.
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostFeedStore } from '../store/postFeedStore'
import { useInfiniteScroll } from '@/shared/composables/useInfiniteScroll'
import PostCard from '../components/PostCard.vue'
import PostCardSkeleton from '../components/PostCardSkeleton.vue'
import CommentSheet from '@/features/comment/components/CommentSheet.vue'

const router = useRouter()
const store = usePostFeedStore()
const { posts, loading, loadingMore, error, hasMore } = storeToRefs(store)

const { setSentinel } = useInfiniteScroll(() => store.loadMore())

const commentOpen = ref(false)
const commentPostId = ref(null)
function openComments(id) {
  commentPostId.value = id
  commentOpen.value = true
}
function goDetail(id) {
  router.push({ name: 'post-detail', params: { id }, query: { from: 'feed' } })
}
function onCommentAdded(id) {
  const target = posts.value.find((p) => p.id === id)
  if (target) target.commentCount += 1
}

onMounted(() => {
  if (posts.value.length === 0) store.loadFirst()
})
</script>

<template>
  <div class="feed">
    <header class="feed__head">
      <h1 class="feed__title">
        다녀온 사람들의<br />
        진짜
        <span class="feed__hl"
          >후기<svg
            class="feed__ul"
            viewBox="0 0 120 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M3 8.5 C28 3.5 72 11 117 5.5"
              stroke="#B0234A"
              stroke-width="4.5"
              fill="none"
              stroke-linecap="round"
            /></svg
        ></span>
      </h1>
      <p class="feed__sub">부산 곳곳, 사진 한 컷으로 만나는 맛집</p>
    </header>

    <!-- 최초 로딩: 스켈레톤 -->
    <div v-if="loading" class="feed__list">
      <PostCardSkeleton v-for="n in 4" :key="n" />
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="feed__state">
      <v-icon icon="mdi-wifi-off" size="40" class="feed__state-icon" />
      <p class="feed__state-text">{{ error }}</p>
      <v-btn color="primary" size="large" rounded="lg" @click="store.loadFirst()">다시 시도</v-btn>
    </div>

    <!-- 빈 상태: 다음 행동을 가르친다 -->
    <div v-else-if="posts.length === 0" class="feed__state">
      <v-icon icon="mdi-silverware-fork-knife" size="40" color="secondary" class="mb-2" />
      <h2 class="feed__state-title">아직 후기가 없어요</h2>
      <p class="feed__state-text">부산에서 맛본 첫 한 끼를 사진과 함께 남겨보세요.</p>
    </div>

    <!-- 목록 + 무한 스크롤 -->
    <template v-else>
      <div class="feed__list">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @open="goDetail"
          @like="store.toggleLike"
          @comment="openComments"
        />
      </div>

      <div :ref="setSentinel">
        <div v-if="loadingMore" class="feed__more">
          <v-progress-circular indeterminate color="primary" size="26" width="3" />
        </div>
        <p v-else-if="!hasMore" class="feed__end">마지막 후기예요</p>
      </div>
    </template>

    <CommentSheet v-model="commentOpen" :post-id="commentPostId" @added="onCommentAdded" />
  </div>
</template>

<style scoped>
.feed {
  display: flex;
  flex-direction: column;
}
.feed__head {
  padding: 6px 2px 18px;
}
.feed__title {
  margin: 0 0 10px;
  font-size: clamp(28px, 9vw, 38px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.045em;
  color: rgb(var(--v-theme-on-surface));
}
.feed__hl {
  position: relative;
  color: #b0234a;
  white-space: nowrap;
}
.feed__ul {
  position: absolute;
  left: -2px;
  right: -2px;
  bottom: -6px;
  width: calc(100% + 4px);
  height: 11px;
  overflow: visible;
}
.feed__sub {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(31, 26, 23, 0.5);
}
.feed__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feed__state {
  text-align: center;
  padding: 56px 16px;
}
.feed__state-icon {
  color: rgba(var(--v-theme-on-surface), 0.3);
  margin-bottom: 12px;
}
.feed__state-title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}
.feed__state-text {
  margin: 0 0 18px;
  font-size: 14px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.feed__more {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
.feed__end {
  text-align: center;
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.4);
  padding: 24px 0;
}
</style>
