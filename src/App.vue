<script setup>
// 루트 레이아웃 — iPhone 비율(393×852, 19.5:9) 디바이스 셸.
// 셸 내부에서만 스크롤(.viewport). 상단바(로고·위치·로그인) + 하단탭(홈·둘러보기·마이페이지).
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandMark from '@/shared/components/BrandMark.vue'

const router = useRouter()
const route = useRoute()

// 로그인 등 크롬 없는 전체화면 라우트는 meta.chrome === false
const showChrome = computed(() => route.meta.chrome !== false)

const scrolled = ref(false)
const onScroll = (e) => {
  scrolled.value = e.target.scrollTop > 4
}

const go = (path) => router.push(path)

const isActive = (path) => {
  if (path === '/') return route.path === '/' || route.path.startsWith('/places')
  return route.path.startsWith(path)
}
</script>

<template>
  <v-app>
    <div id="app-shell" class="device" :class="{ 'device--bare': !showChrome }">
      <header v-if="showChrome" class="appbar" :class="{ 'appbar--scrolled': scrolled }">
        <button class="brand" type="button" @click="go('/')" aria-label="eatBusan 홈으로">
          <BrandMark class="brand__mark" />
        </button>

        <button class="appbar__login" type="button" @click="go('/login')">
          <v-icon icon="mdi-account-circle-outline" size="18" />로그인
        </button>
      </header>

      <main class="viewport" :class="{ 'viewport--bare': !showChrome }" @scroll="onScroll">
        <router-view />
      </main>

      <nav v-if="showChrome" class="bottomnav" aria-label="주요 메뉴">
        <button
          class="tab"
          type="button"
          :class="{ 'tab--on': isActive('/') }"
          :aria-current="isActive('/') ? 'page' : undefined"
          @click="go('/')"
        >
          <v-icon :icon="isActive('/') ? 'mdi-home-variant' : 'mdi-home-variant-outline'" size="24" />
          <span class="tab__label">홈</span>
        </button>

        <button
          class="tab"
          type="button"
          :class="{ 'tab--on': isActive('/feed') }"
          :aria-current="isActive('/feed') ? 'page' : undefined"
          @click="go('/feed')"
        >
          <v-icon :icon="isActive('/feed') ? 'mdi-compass' : 'mdi-compass-outline'" size="24" />
          <span class="tab__label">둘러보기</span>
        </button>

        <button
          class="tab"
          type="button"
          :class="{ 'tab--on': isActive('/my') }"
          :aria-current="isActive('/my') ? 'page' : undefined"
          @click="go('/my')"
        >
          <v-icon :icon="isActive('/my') ? 'mdi-account-circle' : 'mdi-account-circle-outline'" size="24" />
          <span class="tab__label">마이페이지</span>
        </button>
      </nav>
    </div>
  </v-app>
</template>

<style scoped>
/* iPhone 비율 디바이스 셸. 모바일=전체화면, 데스크탑=폰 모양 프레임 */
.device {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100dvh;
  margin-inline: auto;
  background: rgb(var(--v-theme-background));
  overflow: hidden;
}

/* 데스크탑: 페이지 높이를 꽉 채우되 폭은 iPhone 가로세로비(9:19.5)로 derive */
@media (min-width: 600px) {
  .device {
    height: 100dvh;
    aspect-ratio: 9 / 19.5; /* iPhone 비율 */
    width: auto;
    min-width: 400px; /* 실제 아이폰 폭 이하로 좁아지지 않게 (낮은 화면에서 레이아웃 깨짐 방지) */
    max-width: 100%;
    box-shadow:
      0 0 0 1px rgba(33, 26, 23, 0.06),
      0 0 60px -20px rgba(33, 26, 23, 0.25);
  }
}

/* 상단바 */
.appbar {
  flex: 0 0 auto;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 16px;
  background: rgb(var(--v-theme-background));
  border-bottom: 1px solid transparent;
  transition:
    box-shadow 220ms ease,
    border-color 220ms ease;
  z-index: 10;
}
.appbar--scrolled {
  box-shadow: 0 4px 16px -10px rgba(33, 26, 23, 0.25);
  border-bottom-color: rgba(33, 26, 23, 0.07);
}
.brand {
  display: inline-flex;
  align-items: center;
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
}
.brand__mark {
  height: 24px;
}
.brand:active .brand__mark {
  transform: scale(0.96);
  transition: transform 120ms ease;
}
.appbar__login {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.02em;
  padding: 7px 12px 7px 10px;
  border-radius: 9999px;
  color: var(--brand-deep);
  background: var(--brand-tint);
  transition: background 160ms ease;
}
.appbar__login:hover {
  background: var(--brand-tint-strong);
}

/* 셸 내부 스크롤 영역 */
.viewport {
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 14px 20px calc(20px + env(safe-area-inset-bottom));
}
.viewport--bare {
  padding: 0;
}

/* 하단탭 */
.bottomnav {
  flex: 0 0 auto;
  height: calc(60px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgba(33, 26, 23, 0.07);
  z-index: 10;
}
.tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 0;
  background: none;
  cursor: pointer;
  color: rgba(var(--v-theme-on-surface), 0.42);
  transition: color 180ms ease;
}
.tab__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.tab--on {
  color: rgb(var(--v-theme-primary));
}
.tab--on .v-icon {
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .appbar,
  .tab,
  .appbar__login {
    transition: none;
  }
}
</style>
