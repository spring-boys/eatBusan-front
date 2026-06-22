<script setup>
// 마이페이지. 로그인 상태에 따라 사용자 정보를 표시한다.
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/store/authStore'

const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, memberEmail, displayName } = storeToRefs(authStore)

const go = (path) => router.push(path)
const handlePrimary = async () => {
  if (!isAuthenticated.value) {
    go('/login')
    return
  }
  await authStore.logout()
}

const menu = [
  { icon: 'mdi-vote-outline', label: '맛집 투표 시작', to: '/vote/new' },
  { icon: 'mdi-heart-outline', label: '좋아요한 맛집', to: '/my/likes' },
  { icon: 'mdi-map-marker-check-outline', label: '내가 다녀온 맛집', to: '/my/posts' },
  { icon: 'mdi-thumb-up-outline', label: '좋아요한 리뷰', to: '/my/liked-reviews' },
  { icon: 'mdi-comment-text-outline', label: '작성한 댓글', to: '/my/comments' },
]
</script>

<template>
  <div class="my">
    <header class="my__hd">
      <h1 class="my__title">마이페이지</h1>
    </header>

    <section class="my__card">
      <div class="my__avatar" aria-hidden="true">
        <v-icon
          :icon="isAuthenticated ? 'mdi-account-circle-outline' : 'mdi-emoticon-happy-outline'"
          size="34"
        />
      </div>
      <h2 class="my__h2">
        {{ isAuthenticated ? `${displayName}님` : '로그인하고 내 맛집을 모아보세요' }}
      </h2>
      <p v-if="isAuthenticated" class="my__sub">
        {{ memberEmail }}<br />
        부산 맛집 기록을 이어가보세요.
      </p>
      <p v-else class="my__sub">
        다녀온 가게에 후기를 남기고,<br />
        좋아요한 곳을 한곳에서 다시 꺼내볼 수 있어요.
      </p>
      <v-btn color="primary" size="large" rounded="lg" block @click="handlePrimary">
        {{ isAuthenticated ? '로그아웃' : '로그인' }}
      </v-btn>
    </section>

    <ul class="my__menu">
      <li v-for="m in menu" :key="m.label">
        <button class="row" type="button" :disabled="!m.to" @click="m.to && go(m.to)">
          <v-icon :icon="m.icon" size="20" class="row__ic" />
          <span class="row__t">{{ m.label }}</span>
          <v-icon icon="mdi-chevron-right" size="20" class="row__ch" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.my__hd {
  padding: 6px 2px 18px;
}
.my__title {
  margin: 0;
  font-size: clamp(26px, 8vw, 34px);
  font-weight: 800;
  letter-spacing: -0.045em;
  color: rgb(var(--v-theme-on-surface));
}

.my__card {
  text-align: center;
  background: rgb(var(--v-theme-surface));
  border-radius: 22px;
  padding: 28px 22px 24px;
  box-shadow: var(--depth-1);
  margin-bottom: 22px;
}
.my__avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-tint);
  color: var(--brand);
}
.my__h2 {
  margin: 0 0 8px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.my__sub {
  margin: 0 0 20px;
  font-size: 14px;
  line-height: 1.55;
  color: rgba(33, 26, 23, 0.55);
}

.my__menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  border: 0;
  border-radius: 16px;
  box-shadow: var(--depth-1);
  cursor: pointer;
  color: rgba(33, 26, 23, 0.82);
  text-align: left;
}
.row:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
.row__ic {
  color: var(--brand);
}
.row__t {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.row__ch {
  color: rgba(33, 26, 23, 0.25);
}
</style>
