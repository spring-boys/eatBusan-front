<script setup>
// 후기 상세 화면. /posts/:id 라우트.
// 로딩 / 에러+다시시도 / 본문(이미지갤러리·좋아요·댓글시트) 3상태를 처리한다.
// 본인 글이면 케밥 메뉴로 수정·삭제를 노출한다 (UX 가드 — 백엔드는 소유권 미검증).
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostDetailStore } from '../store/postDetailStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { formatRelativeTime } from '@/shared/utils/time'
import CommentSheet from '@/features/comment/components/CommentSheet.vue'

const route = useRoute()
const router = useRouter()
const store = usePostDetailStore()
const auth = useAuthStore()
const { post, loading, error } = storeToRefs(store)

const commentOpen = ref(false)
const deleteDialog = ref(false)
const deleting = ref(false)
const deleteError = ref(null)

/** 본인 글 여부 (UX 가드) */
const isMine = computed(() => {
  if (!post.value || !auth.memberEmail) return false
  return post.value.authorEmail === auth.memberEmail
})

onMounted(() => {
  store.loadPost(route.params.id)
})

function onCommentAdded() {
  if (post.value) post.value.commentCount += 1
}

// 들어온 출처로 복귀. query.from(feed/place)을 우선 사용한다.
// 수정→저장(router.replace) 후엔 router.back()이 같은 후기로 되돌아가 빈 화면이 되므로,
// 출처를 명시적으로 따라간다. 출처가 없으면 history.back, 그것도 없으면 홈.
function goOrigin() {
  const from = route.query.from
  if (from === 'place' && route.query.placeId) {
    router.replace({ name: 'place-detail', params: { id: route.query.placeId } })
  } else if (from === 'feed') {
    router.replace({ name: 'feed' })
  } else if (window.history.state?.back) {
    router.back()
  } else {
    router.replace({ name: 'home' })
  }
}

// 수정 화면으로 진입할 때 출처(query)를 그대로 전달해, 저장 후 복귀 맥락을 유지한다.
function goEdit() {
  router.push({ name: 'post-edit', params: { id: post.value.id }, query: route.query })
}

async function confirmDelete() {
  deleting.value = true
  deleteError.value = null
  const ok = await store.remove()
  deleting.value = false
  if (ok) {
    deleteDialog.value = false
    goOrigin()
  } else {
    deleteError.value = store.error
  }
}
</script>

<template>
  <div class="detail">
    <!-- 상단 헤더 -->
    <header class="sub-hd">
      <button class="sub-hd__back" type="button" aria-label="뒤로" @click="goOrigin">
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      <h1 class="sub-hd__title">후기</h1>

      <!-- 본인 글 전용: 수정·삭제 케밥 메뉴 -->
      <v-menu v-if="isMine" location="bottom end">
        <template #activator="{ props: menuProps }">
          <v-btn
            icon="mdi-dots-vertical"
            variant="text"
            size="small"
            aria-label="더보기"
            v-bind="menuProps"
          />
        </template>
        <v-list density="compact" min-width="120">
          <v-list-item
            prepend-icon="mdi-pencil-outline"
            title="수정"
            @click="goEdit"
          />
          <v-list-item
            prepend-icon="mdi-delete-outline"
            title="삭제"
            class="text-error"
            @click="deleteDialog = true"
          />
        </v-list>
      </v-menu>
      <div v-else style="width: 36px" />
    </header>

    <!-- 로딩 -->
    <div v-if="loading" class="detail__skeleton">
      <v-skeleton-loader type="image" class="mb-3" rounded="xl" />
      <v-skeleton-loader type="article" />
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="detail__state">
      <v-icon icon="mdi-wifi-off" size="40" class="detail__state-icon" />
      <p class="detail__state-text">{{ error }}</p>
      <v-btn color="primary" size="large" rounded="lg" @click="store.loadPost(route.params.id)">
        다시 시도
      </v-btn>
    </div>

    <!-- 본문 -->
    <template v-else-if="post">
      <!-- 이미지 갤러리 (없으면 생략) -->
      <div v-if="post.images && post.images.length > 0" class="detail__gallery">
        <v-carousel
          v-if="post.images.length > 1"
          hide-delimiter-background
          delimiter-icon="mdi-circle"
          :show-arrows="post.images.length > 1 ? 'hover' : false"
          height="280"
        >
          <v-carousel-item
            v-for="img in post.images"
            :key="img.sortOrder"
            :src="img.imageUrl"
            cover
          />
        </v-carousel>
        <v-img
          v-else
          :src="post.images[0].imageUrl"
          :alt="post.title"
          :aspect-ratio="4 / 3"
          cover
          class="detail__single-img"
        />
      </div>

      <!-- 본문 카드 -->
      <div class="detail__body">
        <!-- 작성자 -->
        <div class="detail__author">
          <v-avatar size="36" color="grey-lighten-3">
            <v-img v-if="post.authorProfileUrl" :src="post.authorProfileUrl" />
            <span v-else class="detail__initial">{{ post.authorNickname.charAt(0) }}</span>
          </v-avatar>
          <div>
            <p class="detail__nick">{{ post.authorNickname }}</p>
            <p class="detail__time">{{ formatRelativeTime(post.createdAt) }}</p>
          </div>
        </div>

        <!-- 제목 -->
        <h2 class="detail__title">{{ post.title }}</h2>

        <!-- 본문 전체 (피드 카드는 2줄 클램프 → 상세는 전체) -->
        <p class="detail__content">{{ post.content }}</p>

        <!-- 통계 -->
        <div class="detail__stats">
          <span class="detail__stat">
            <v-icon icon="mdi-eye-outline" size="15" aria-hidden="true" />
            {{ post.viewCount }}
          </span>
          <span class="detail__stat">
            <v-icon icon="mdi-comment-outline" size="15" aria-hidden="true" />
            {{ post.commentCount }}
          </span>
        </div>

        <!-- 액션 바 -->
        <div class="detail__actions">
          <button
            type="button"
            class="like"
            :class="{ 'like--on': post.liked }"
            :aria-pressed="post.liked ?? false"
            :aria-label="post.liked ? '좋아요 취소' : '좋아요'"
            @click="store.toggleLike()"
          >
            <v-icon
              class="like__icon"
              :icon="post.liked ? 'mdi-heart' : 'mdi-heart-outline'"
              size="22"
            />
            <span class="like__count">{{ post.likeCount }}</span>
          </button>

          <button
            type="button"
            class="action-btn"
            aria-label="댓글 보기"
            @click="commentOpen = true"
          >
            <v-icon icon="mdi-comment-outline" size="20" aria-hidden="true" />
            <span>댓글 {{ post.commentCount > 0 ? post.commentCount : '' }}</span>
          </button>
        </div>
      </div>
    </template>

    <!-- 댓글 시트 -->
    <CommentSheet v-model="commentOpen" :post-id="post?.id ?? null" @added="onCommentAdded" />

    <!-- 삭제 확인 다이얼로그 -->
    <v-dialog v-model="deleteDialog" max-width="320">
      <v-card rounded="xl">
        <v-card-title class="text-h6 font-weight-bold pt-5 px-5">후기 삭제</v-card-title>
        <v-card-text class="px-5">
          이 후기를 삭제할까요? 삭제하면 되돌릴 수 없어요.
          <p v-if="deleteError" class="text-error mt-2 text-body-2">{{ deleteError }}</p>
        </v-card-text>
        <v-card-actions class="px-4 pb-4 gap-2">
          <v-btn
            variant="tonal"
            rounded="lg"
            color="grey"
            :disabled="deleting"
            @click="deleteDialog = false"
          >
            취소
          </v-btn>
          <v-btn
            variant="flat"
            rounded="lg"
            color="error"
            :loading="deleting"
            @click="confirmDelete"
          >
            삭제
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.sub-hd {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0 12px;
}
.sub-hd__back {
  border: 0;
  background: none;
  cursor: pointer;
  padding: 4px;
  margin-left: -8px;
  color: rgba(33, 26, 23, 0.75);
}
.sub-hd__title {
  flex: 1 1 auto;
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: rgb(var(--v-theme-on-surface));
}

.detail__skeleton {
  padding: 4px 0;
}

.detail__state {
  text-align: center;
  padding: 60px 16px;
}
.detail__state-icon {
  color: rgba(var(--v-theme-on-surface), 0.3);
  margin-bottom: 12px;
}
.detail__state-text {
  margin: 0 0 20px;
  font-size: 15px;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

/* 갤러리 */
.detail__gallery {
  margin: 0 -16px 0; /* 앱셸 패딩 상쇄해 edge-to-edge */
  overflow: hidden;
}
.detail__single-img {
  border-radius: 0;
}

/* 본문 */
.detail__body {
  padding: 20px 0 24px;
}

.detail__author {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.detail__initial {
  font-size: 14px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.55);
}
.detail__nick {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
}
.detail__time {
  margin: 0;
  font-size: 12px;
  color: rgba(var(--v-theme-on-surface), 0.4);
}

.detail__title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}

.detail__content {
  margin: 0 0 18px;
  font-size: 15px;
  line-height: 1.65;
  color: rgba(var(--v-theme-on-surface), 0.75);
  white-space: pre-wrap;
  word-break: break-word;
}

.detail__stats {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.detail__stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.4);
}

/* 액션 바 */
.detail__actions {
  display: flex;
  align-items: center;
  gap: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.07);
}

.like {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: none;
  padding: 6px 6px 6px 0;
  min-height: 36px;
  cursor: pointer;
  color: rgba(var(--v-theme-on-surface), 0.5);
  transition: color 160ms ease;
}
.like__count {
  font-size: 14px;
  font-weight: 600;
}
.like:active .like__icon {
  transform: scale(0.86);
}
.like--on {
  color: rgb(var(--v-theme-secondary));
}
.like--on .like__count {
  color: rgb(var(--v-theme-secondary));
}
.like--on .like__icon {
  animation: like-pop 360ms cubic-bezier(0.22, 1, 0.36, 1);
}
.like__icon {
  transition: transform 140ms ease;
}
@keyframes like-pop {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.4);
  }
  65% {
    transform: scale(0.85);
  }
  100% {
    transform: scale(1);
  }
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: none;
  padding: 6px 6px 6px 0;
  min-height: 36px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.5);
  transition: color 160ms ease;
}
.action-btn:hover {
  color: rgb(var(--v-theme-primary));
}

@media (prefers-reduced-motion: reduce) {
  .like__icon {
    transition: none;
  }
  .like--on .like__icon {
    animation: none;
  }
}
</style>
