<script setup>
// 투표 랜딩 — 하단탭 "투표"의 목적지. 방 만들기(/vote/new) + 코드로 입장(/vote/join) 두 액션을 한 화면으로.
// 홈(PlaceListView)의 .vote-cta 진입 카드를 전용 화면으로 정돈해 재사용한다.
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="vh">
    <header class="vh__hd">
      <p class="vh__kicker">여럿이 정할 땐</p>
      <h1 class="vh__title">맛집 투표</h1>
      <p class="vh__sub">방을 만들어 친구를 부르거나, 받은 코드로 바로 입장하세요.</p>
    </header>

    <section class="vh__actions" aria-label="투표 시작">
      <v-btn
        color="primary"
        size="large"
        rounded="lg"
        block
        class="vh__start"
        prepend-icon="mdi-vote-outline"
        @click="router.push('/vote/new')"
      >
        투표방 만들기
      </v-btn>

      <button class="vh__join" type="button" @click="router.push('/vote/join')">
        <v-icon icon="mdi-ticket-confirmation-outline" size="18" />
        코드로 입장
      </button>
    </section>
  </div>
</template>

<style scoped>
.vh {
  padding: 8px 2px 24px;
}
.vh__hd {
  margin-bottom: 24px;
}
.vh__kicker {
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--brand-deep);
}
.vh__title {
  margin: 0 0 10px;
  font-size: clamp(26px, 8vw, 32px);
  font-weight: 800;
  letter-spacing: -0.045em;
  color: rgb(var(--v-theme-on-surface));
}
.vh__sub {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: rgba(33, 26, 23, 0.55);
}
.vh__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.vh__join {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  border: 0;
  border-radius: 12px;
  background: var(--brand-tint);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--brand-deep);
  cursor: pointer;
  transition: background 160ms ease;
}
.vh__join:hover {
  background: var(--brand-tint-strong);
}

@media (prefers-reduced-motion: reduce) {
  .vh__join {
    transition: none;
  }
}
</style>
