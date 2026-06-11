<script setup>
// 후기 카드 1건. 사진이 주인공, 카드는 깔끔한 무대 (docs/DESIGN.md).
import { formatRelativeTime } from '@/shared/utils/time'

defineProps({
  /** @type {import('../types/post.js').PostResponse} */
  post: { type: Object, required: true },
})
const emit = defineEmits(['like', 'comment', 'open'])
</script>

<template>
  <!-- 카드 전체 클릭 → 상세 화면. 좋아요·댓글 버튼은 .stop 으로 이벤트 버블을 차단한다. -->
  <article
    class="post-card"
    role="button"
    tabindex="0"
    @click="emit('open', post.id)"
    @keydown.enter="emit('open', post.id)"
  >
    <!-- 대표 사진: 카드 폭을 꽉 채운다. 없으면 텍스트 카드로 우아하게. -->
    <div v-if="post.thumbnailUrl" class="post-card__media">
      <v-img :src="post.thumbnailUrl" :alt="post.title" :aspect-ratio="4 / 3" cover>
        <template #placeholder>
          <div class="post-card__ph">
            <v-progress-circular indeterminate color="primary" size="22" width="2" />
          </div>
        </template>
      </v-img>
    </div>

    <div class="post-card__body">
      <!-- 작성자 -->
      <div class="post-card__author">
        <v-avatar size="34" color="grey-lighten-3">
          <v-img
            v-if="post.authorProfileUrl"
            :src="post.authorProfileUrl"
            :alt="`${post.authorNickname} 프로필`"
          />
          <span v-else class="post-card__initial">{{ post.authorNickname.charAt(0) }}</span>
        </v-avatar>
        <span class="post-card__nick">{{ post.authorNickname }}</span>
        <span class="post-card__time">{{ formatRelativeTime(post.createdAt) }}</span>
      </div>

      <!-- 제목 + 본문 발췌 -->
      <h3 class="post-card__title">{{ post.title }}</h3>
      <p class="post-card__excerpt">{{ post.content }}</p>

      <!-- 액션: 좋아요 / 댓글 -->
      <div class="post-card__actions">
        <button
          type="button"
          class="like"
          :class="{ 'like--on': post.liked }"
          :aria-pressed="post.liked ?? false"
          :aria-label="post.liked ? '좋아요 취소' : '좋아요'"
          @click.stop="emit('like', post.id)"
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
          class="meta meta--btn"
          aria-label="댓글 보기"
          @click.stop="emit('comment', post.id)"
        >
          <v-icon icon="mdi-comment-outline" size="20" aria-hidden="true" />
          <span>{{ post.commentCount }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.post-card {
  background: linear-gradient(180deg, #ffffff 0%, #fffaf6 100%);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--depth-1);
  transition:
    box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.post-card:hover {
  box-shadow: var(--depth-2);
  transform: translateY(-3px);
}
.post-card__media {
  background: rgba(var(--v-theme-on-surface), 0.04);
}
.post-card__ph {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.post-card__body {
  padding: 16px 18px 14px;
}

.post-card__author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.post-card__initial {
  font-size: 14px;
  font-weight: 700;
  color: rgba(var(--v-theme-on-surface), 0.55);
}
.post-card__nick {
  font-size: 14px;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}
.post-card__time {
  font-size: 13px;
  color: rgba(var(--v-theme-on-surface), 0.45);
}

.post-card__title {
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: rgb(var(--v-theme-on-surface));
}
.post-card__excerpt {
  margin: 0 0 12px;
  font-size: 15px;
  line-height: 1.5;
  color: rgba(var(--v-theme-on-surface), 0.62);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card__actions {
  display: flex;
  align-items: center;
  gap: 18px;
}
.meta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.5);
}
.meta--btn {
  border: 0;
  background: none;
  padding: 6px 6px 6px 0;
  min-height: 36px;
  cursor: pointer;
  transition: color 160ms ease;
}
.meta--btn:hover {
  color: rgb(var(--v-theme-primary));
}

/* 좋아요 버튼 + 팝 애니메이션 */
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

@media (prefers-reduced-motion: reduce) {
  .post-card,
  .like__icon {
    transition: none;
  }
  .post-card:hover {
    transform: none;
  }
  .like--on .like__icon {
    animation: none;
  }
}
</style>
