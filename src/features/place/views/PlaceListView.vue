<script setup>
// 홈 = 위치 기반 식당 리스트 (편집형). #1 히어로 + 가까운 순 순위 리스트.
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlaceListStore, CATEGORIES } from '../store/placeListStore'
import PlaceListItem from '../components/PlaceListItem.vue'
import PlaceFeaturedCard from '../components/PlaceFeaturedCard.vue'
import CategoryChips from '../components/CategoryChips.vue'

const store = usePlaceListStore()
const { visiblePlaces, loading, error, locating, usingFallback, location, category } =
  storeToRefs(store)

const hasLocation = computed(() => !!location.value)
const featured = computed(() => visiblePlaces.value[0] ?? null)
const rest = computed(() => visiblePlaces.value.slice(1))

const locationLabel = computed(() => {
  if (locating.value) return '내 위치 찾는 중…'
  if (!location.value) return '위치 켜고 가까운 곳 보기'
  return usingFallback.value ? '부산 도심 기준' : '내 위치 기준'
})

const categoryModel = computed({
  get: () => category.value,
  set: (v) => store.setCategory(v),
})

onMounted(() => store.init())
</script>

<template>
  <div class="list">
    <header class="hd">
      <h1 class="hd__title">
        지금 부산,<br />
        가까운 <span class="hd__hl">맛집<svg class="hd__underline" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="M3 8.5 C28 3.5 72 11 117 5.5" stroke="#F2541B" stroke-width="4.5" fill="none" stroke-linecap="round" /></svg></span>
      </h1>
      <button class="locpill" type="button" :disabled="locating" @click="store.locate()">
        <v-icon icon="mdi-crosshairs-gps" size="16" />{{ locationLabel }}
      </button>
    </header>

    <CategoryChips v-model="categoryModel" :categories="CATEGORIES" class="hd__chips" />

    <!-- 로딩 스켈레톤 -->
    <div v-if="loading">
      <v-skeleton-loader type="image" class="skel-feat" />
      <div class="list__items">
        <div v-for="n in 4" :key="n" class="skel-row">
          <v-skeleton-loader type="image" class="skel-row__thumb" />
          <v-skeleton-loader type="paragraph" class="skel-row__text" />
        </div>
      </div>
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="state">
      <v-icon icon="mdi-wifi-off" size="40" class="state__icon" />
      <p class="state__text">{{ error }}</p>
      <v-btn color="primary" size="large" rounded="lg" @click="store.load()">다시 시도</v-btn>
    </div>

    <!-- 빈 상태 -->
    <div v-else-if="visiblePlaces.length === 0" class="state">
      <v-icon icon="mdi-silverware-fork-knife" size="40" color="secondary" class="mb-2" />
      <h2 class="state__title">이 카테고리엔 아직 없어요</h2>
      <p class="state__text">다른 카테고리를 골라보세요.</p>
    </div>

    <!-- 목록: #1 히어로 + 순위 리스트 -->
    <template v-else>
      <PlaceFeaturedCard v-if="featured" :place="featured" class="featured" />
      <div class="list__items">
        <PlaceListItem
          v-for="(place, i) in rest"
          :key="place.id"
          :place="place"
          :rank="hasLocation ? i + 2 : null"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.hd {
  padding: 6px 2px 16px;
}
.hd__title {
  margin: 0 0 12px;
  font-size: clamp(28px, 9vw, 38px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.045em;
  color: rgb(var(--v-theme-on-surface));
}
.hd__hl {
  position: relative;
  color: #f2541b;
  white-space: nowrap;
}
.hd__underline {
  position: absolute;
  left: -2px;
  right: -2px;
  bottom: -6px;
  width: calc(100% + 4px);
  height: 11px;
  overflow: visible;
}
.locpill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  background: rgba(242, 84, 27, 0.1);
  color: #d8410d;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  padding: 8px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 160ms ease;
}
.locpill:hover {
  background: rgba(242, 84, 27, 0.16);
}
.locpill:disabled {
  opacity: 0.6;
  cursor: default;
}
.hd__chips {
  margin-bottom: 18px;
}

.featured {
  margin-bottom: 22px;
}
.list__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 스켈레톤 */
.skel-feat {
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 22px;
}
.skel-feat :deep(.v-skeleton-loader__image) {
  height: 220px;
}
.skel-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 18px;
}
.skel-row__thumb {
  flex: 0 0 92px;
}
.skel-row__thumb :deep(.v-skeleton-loader__image) {
  width: 92px;
  height: 92px;
  border-radius: 14px;
}
.skel-row__text {
  flex: 1 1 auto;
  background: transparent;
}

.state {
  text-align: center;
  padding: 56px 16px;
}
.state__icon {
  color: rgba(31, 26, 23, 0.28);
  margin-bottom: 12px;
}
.state__title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 800;
  color: rgb(var(--v-theme-on-surface));
}
.state__text {
  margin: 0 0 18px;
  font-size: 14px;
  color: rgba(31, 26, 23, 0.55);
}
</style>
