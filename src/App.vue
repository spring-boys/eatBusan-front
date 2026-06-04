<script setup>
// 루트 레이아웃. 상단 브랜드 바 + 하단 탭 내비게이션 (모바일 우선).
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandMark from '@/shared/components/BrandMark.vue'

const router = useRouter()
const route = useRoute()

const scrolled = ref(false)
const onScroll = () => {
  scrolled.value = window.scrollY > 4
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

// 식당 상세(/places/:id)에서도 '홈' 탭을 활성으로 본다.
const activeTab = computed(() => (route.path.startsWith('/places') ? '/' : route.path))

const writeSnackbar = ref(false)
const openWrite = () => {
  writeSnackbar.value = true
}
</script>

<template>
  <v-app>
    <v-app-bar
      :elevation="0"
      color="transparent"
      height="58"
      class="appbar"
      :class="{ 'appbar--scrolled': scrolled }"
    >
      <div class="appbar__inner">
        <button class="brand" type="button" @click="router.push('/')" aria-label="eatbusan 홈으로">
          <BrandMark class="brand__logo" />
          <span class="brand__text">eatbusan</span>
        </button>
        <div class="appbar__loc">
          <v-icon icon="mdi-map-marker" size="15" color="primary" aria-hidden="true" />
          <span>부산</span>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <div class="page">
        <router-view />
      </div>
    </v-main>

    <v-bottom-navigation
      :model-value="activeTab"
      :elevation="0"
      color="primary"
      height="64"
      grow
      bg-color="transparent"
      class="bottomnav"
    >
      <v-btn value="/" @click="router.push('/')">
        <v-icon icon="mdi-home-variant" />
        <span class="bottomnav__label">홈</span>
      </v-btn>

      <v-btn class="bottomnav__write" @click="openWrite">
        <div class="bottomnav__fab"><v-icon icon="mdi-pencil" size="22" /></div>
        <span class="bottomnav__label">글쓰기</span>
      </v-btn>

      <v-btn value="/feed" @click="router.push('/feed')">
        <v-icon icon="mdi-image-multiple-outline" />
        <span class="bottomnav__label">둘러보기</span>
      </v-btn>
    </v-bottom-navigation>

    <v-snackbar
      v-model="writeSnackbar"
      :timeout="2400"
      location="top"
      rounded="pill"
      class="toast"
    >
      <v-icon icon="mdi-pencil" size="18" class="mr-2" />
      글쓰기는 곧 만나요. 조금만 기다려주세요!
    </v-snackbar>
  </v-app>
</template>

<style scoped>
.appbar {
  background: var(--glass-bg) !important;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  transition:
    background 220ms ease,
    box-shadow 220ms ease;
}
.appbar--scrolled {
  background: var(--glass-bg-strong) !important;
  box-shadow: 0 4px 20px -8px rgba(16, 24, 40, 0.12) !important;
  border-bottom-color: rgba(16, 24, 40, 0.06);
}
.appbar__inner {
  width: 100%;
  max-width: 640px;
  margin-inline: auto;
  padding-inline: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  background: none;
  padding: 0;
  cursor: pointer;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.045em;
  color: rgb(var(--v-theme-on-surface));
}
.brand__logo {
  display: block;
  width: 30px;
  height: 30px;
  border-radius: 9px;
}
.brand:active .brand__logo {
  transform: scale(0.92);
  transition: transform 120ms ease;
}
.appbar__loc {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.page {
  max-width: 640px;
  margin-inline: auto;
  padding: 16px 20px calc(20px + env(safe-area-inset-bottom));
}

.bottomnav {
  background: var(--glass-bg-strong) !important;
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-top: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 -6px 24px -12px rgba(16, 24, 40, 0.18);
  padding-bottom: env(safe-area-inset-bottom);
}
.bottomnav__label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-top: 2px;
}
/* 선택된 탭: 탱저린 강조 */
.bottomnav :deep(.v-btn--selected) {
  color: rgb(var(--v-theme-primary));
}
.bottomnav :deep(.v-btn--selected .v-icon) {
  transform: translateY(-1px) scale(1.08);
}
/* 가운데 글쓰기: 원형 강조 버튼 */
.bottomnav__write :deep(.v-btn__content) {
  flex-direction: column;
}
.bottomnav__fab {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #ff8a2b, #f2541b);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1px;
  box-shadow: 0 4px 12px -2px rgba(var(--v-theme-primary), 0.45);
}

.toast :deep(.v-snackbar__wrapper) {
  background: rgb(var(--v-theme-surface));
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 8px 24px -6px rgba(var(--v-theme-on-surface), 0.18);
  font-weight: 600;
}
</style>
