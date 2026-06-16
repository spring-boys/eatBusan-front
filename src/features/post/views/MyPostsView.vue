<script setup>
// 내가 쓴 후기 — 로그인 사용자가 작성한 후기 목록.
// 백엔드에 사용자별 목록 API가 없어 전체(GET /api/posts)를 받아 내 email로 필터한다.
// 카드 썸네일은 후기의 대표 이미지(thumbnailUrl = images[0])를 쓴다 (가게 이미지 아님).
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPosts } from '../api/postApi'
import { useAuthStore } from '@/features/auth/store/authStore'
import { USE_MOCK } from '@/shared/api/mockFallback'
import defaultPlaceThumb from '@/assets/place-thumb-default.svg'

const router = useRouter()
const auth = useAuthStore()

const posts = ref([])
const loading = ref(true)
const error = ref(null)

/** ISO/날짜 문자열에서 YYYY-MM-DD만 (목업·실데이터 공통) */
function formatDate(value) {
  return typeof value === 'string' ? value.slice(0, 10) : ''
}

async function load() {
  loading.value = true
  error.value = null
  try {
    // 미로그인이면 세션 복구를 한 번 시도 (email 로 내 후기를 거른다)
    if (!USE_MOCK && !auth.memberEmail) await auth.restoreSession()
    // 전체 후기 중 내가 쓴 것만. (사용자별 목록 엔드포인트 추가되면 그 API로 교체)
    const all = await fetchPosts(1, 100)
    const myEmail = auth.memberEmail
    posts.value = USE_MOCK || !myEmail ? all : all.filter((p) => p.authorEmail === myEmail)
  } catch {
    error.value = '후기를 불러오지 못했어요. 잠시 후 다시 시도해주세요.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="myposts">
    <header class="sub-hd">
      <button class="sub-hd__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="24" />
      </button>
      <h1 class="sub-hd__title">내가 다녀온 맛집</h1>
    </header>

    <div v-if="loading" class="state">
      <v-progress-circular indeterminate color="primary" size="28" width="3" />
    </div>

    <div v-else-if="error" class="state">
      <v-icon icon="mdi-wifi-off" size="40" class="state__ic" />
      <p class="state__t">{{ error }}</p>
      <v-btn color="primary" variant="tonal" rounded="lg" size="small" @click="load">
        다시 시도
      </v-btn>
    </div>

    <div v-else-if="posts.length === 0" class="state">
      <v-icon icon="mdi-map-marker-check-outline" size="40" class="state__ic" />
      <p class="state__t">아직 다녀온 맛집 기록이 없어요</p>
      <v-btn color="primary" variant="tonal" rounded="lg" size="small" @click="router.push('/write')">
        맛집 기록하기
      </v-btn>
    </div>

    <div v-else class="list">
      <router-link v-for="p in posts" :key="p.id" :to="`/posts/${p.id}`" class="card">
        <div class="card__thumb">
          <v-img :src="p.thumbnailUrl || defaultPlaceThumb" :alt="p.title" :aspect-ratio="1" cover />
        </div>
        <div class="card__info">
          <h3 class="card__title">{{ p.title }}</h3>
          <div class="card__meta">
            <span>{{ formatDate(p.createdAt) }}</span>
          </div>
          <div class="card__stats">
            <span><v-icon icon="mdi-heart" size="14" />{{ p.likeCount }}</span>
            <span><v-icon icon="mdi-comment-outline" size="14" />{{ p.commentCount }}</span>
          </div>
        </div>
        <v-icon icon="mdi-chevron-right" size="22" class="card__chevron" aria-hidden="true" />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.sub-hd {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0 16px;
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
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: rgb(var(--v-theme-on-surface));
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 홈(PlaceListItem)과 동일한 가로형 카드 레이아웃 */
.card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgb(var(--v-theme-surface));
  border-radius: 18px;
  box-shadow: var(--depth-1);
  text-decoration: none;
  color: inherit;
}
.card__thumb {
  flex: 0 0 76px;
  width: 76px;
  height: 76px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(31, 26, 23, 0.04);
}
.card__info {
  flex: 1 1 auto;
  min-width: 0;
}
.card__title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.card__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  font-size: 13px;
  color: rgba(33, 26, 23, 0.5);
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}
.card__stats {
  display: flex;
  gap: 14px;
  margin-top: 6px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(33, 26, 23, 0.55);
}
.card__stats span {
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.card__stats .v-icon {
  color: var(--rose);
}
.card__chevron {
  flex: none;
  color: rgba(31, 26, 23, 0.22);
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 56px 16px;
}
.state__ic {
  color: rgba(33, 26, 23, 0.22);
  margin-bottom: 12px;
}
.state__t {
  margin: 0 0 18px;
  font-size: 15px;
  font-weight: 700;
  color: rgba(33, 26, 23, 0.6);
}
</style>
