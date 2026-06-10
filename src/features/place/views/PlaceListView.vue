<script setup>
// 홈 = 내 주변(거리순) / 지역별(구·군 인기순) 두 모드 지원.
import { computed, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlaceListStore } from '../store/placeListStore'
import { formatDistance } from '@/shared/utils/geo'
import { useInfiniteScroll } from '@/shared/composables/useInfiniteScroll'
import PlaceListItem from '../components/PlaceListItem.vue'
import PlaceFeaturedCard from '../components/PlaceFeaturedCard.vue'
import DistrictSheet from '../components/DistrictSheet.vue'

const store = usePlaceListStore()
const {
  visiblePlaces,
  loading,
  loadingMore,
  error,
  locating,
  usingFallback,
  location,
  mode,
  district,
} = storeToRefs(store)
const { setSentinel } = useInfiniteScroll(() => store.loadMore())

const districtSheet = ref(false)

const featured = computed(() => visiblePlaces.value[0] ?? null)
const rest = computed(() => visiblePlaces.value.slice(1))

// --- 헤드라인 ---
const headline = computed(() => {
  if (mode.value === 'nearby') return '가까운 맛집'
  if (district.value === '전체') return '부산 지역별 맛집'
  return `${district.value} 맛집`
})

// --- 위치 pill 레이블 ---
const locationLabel = computed(() => {
  if (locating.value) return '내 위치 찾는 중…'
  if (!location.value) return '위치 켜고 가까운 곳 보기'
  return usingFallback.value ? '부산 중심가 기준' : '내 위치 기준'
})

// --- 피처드 카드 태그 ---
const featuredTag = computed(() => {
  if (!featured.value) return null
  if (mode.value === 'nearby') {
    const d = featured.value.distanceM
    return d != null ? `가장 가까워요 · ${formatDistance(d)}` : '가장 가까워요'
  }
  return null
})

// --- 빈 상태 ---
const emptyState = computed(() => {
  if (mode.value === 'district' && district.value !== '전체') {
    return {
      title: `${district.value}에 아직 등록된 가게가 없어요`,
      text: '다른 지역을 선택해보세요.',
      showDistrictBtn: true,
    }
  }
  return {
    title: '이 조건에 맞는 가게가 없어요',
    text: '잠시 후 다시 확인해보세요.',
    showDistrictBtn: false,
  }
})

function switchMode(next) {
  store.setMode(next)
}

onMounted(() => store.init())
</script>

<template>
  <div class="list">
    <!-- 헤더 -->
    <header class="hd">
      <h1 class="hd__title">
        지금 부산,<br />
        <span class="hd__hl">
          {{ headline }}
          <svg
            class="hd__underline"
            viewBox="0 0 140 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M3 8.5 C35 3.5 90 11 137 5.5"
              stroke="#B0234A"
              stroke-width="4.5"
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </span>
      </h1>

      <!-- 세그먼트 컨트롤 -->
      <div class="segment" role="tablist" aria-label="탐색 모드">
        <button
          role="tab"
          :aria-selected="mode === 'district'"
          class="seg-btn"
          :class="{ 'seg-btn--on': mode === 'district' }"
          type="button"
          @click="switchMode('district')"
        >
          <v-icon icon="mdi-map-outline" size="15" class="seg-btn__icon" />지역별
        </button>
        <button
          role="tab"
          :aria-selected="mode === 'nearby'"
          class="seg-btn"
          :class="{ 'seg-btn--on': mode === 'nearby' }"
          type="button"
          @click="switchMode('nearby')"
        >
          <v-icon icon="mdi-crosshairs-gps" size="15" class="seg-btn__icon" />내 주변
        </button>
      </div>

      <!-- 내 주변: 위치 pill -->
      <button
        v-if="mode === 'nearby'"
        class="locpill"
        type="button"
        :disabled="locating"
        @click="store.locate()"
      >
        <v-icon icon="mdi-crosshairs-gps" size="15" />{{ locationLabel }}
      </button>

      <!-- 지역별: 구/군 선택 -->
      <button v-else class="distpill" type="button" @click="districtSheet = true">
        <v-icon icon="mdi-map-marker-outline" size="15" />
        {{ district === '전체' ? '지역 선택' : district }}
        <v-icon icon="mdi-chevron-down" size="16" />
      </button>
    </header>

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
      <v-icon icon="mdi-storefront-outline" size="44" class="state__icon" />
      <h2 class="state__title">{{ emptyState.title }}</h2>
      <p class="state__text">{{ emptyState.text }}</p>
      <div class="state__actions">
        <v-btn
          v-if="emptyState.showDistrictBtn"
          color="primary"
          variant="tonal"
          rounded="lg"
          size="small"
          prepend-icon="mdi-map-marker-outline"
          @click="districtSheet = true"
        >
          지역 바꾸기
        </v-btn>
      </div>
    </div>

    <!-- 목록 -->
    <template v-else>
      <PlaceFeaturedCard
        v-if="featured"
        :place="featured"
        :tag-text="featuredTag"
        class="featured"
      />
      <div class="list__items">
        <PlaceListItem
          v-for="(place, i) in rest"
          :key="place.id"
          :place="place"
          :rank="i + 2"
          :show-distance="mode === 'nearby'"
        />
      </div>
      <div :ref="setSentinel" class="list__sentinel">
        <v-progress-circular v-if="loadingMore" indeterminate color="primary" size="26" width="3" />
      </div>
    </template>

    <!-- 지역 선택 시트 -->
    <DistrictSheet v-model="districtSheet" :selected="district" @select="store.setDistrict" />
  </div>
</template>

<style scoped>
.hd {
  padding: 6px 2px 16px;
}
.hd__title {
  margin: 0 0 14px;
  font-size: clamp(26px, 8vw, 36px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.045em;
  color: rgb(var(--v-theme-on-surface));
}
.hd__hl {
  position: relative;
  color: #b0234a;
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

/* 세그먼트 컨트롤 */
.segment {
  display: flex;
  gap: 0;
  background: rgba(31, 26, 23, 0.06);
  border-radius: 14px;
  padding: 3px;
  margin-bottom: 12px;
}
.seg-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  border: 0;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  color: rgba(31, 26, 23, 0.45);
  transition:
    background 220ms ease,
    color 220ms ease,
    box-shadow 220ms ease;
}
.seg-btn__icon {
  opacity: 0.7;
}
.seg-btn--on {
  background: #ffffff;
  color: rgb(var(--v-theme-on-surface));
  box-shadow: 0 2px 8px rgba(31, 26, 23, 0.1);
}
.seg-btn--on .seg-btn__icon {
  opacity: 1;
  color: #b0234a;
}

/* 위치 pill / 지역 pill */
.locpill,
.distpill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 0;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.01em;
  padding: 8px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 160ms ease;
}
.locpill {
  background: var(--brand-tint);
  color: #8e1b3a;
}
.locpill:hover {
  background: var(--brand-tint-strong);
}
.locpill:disabled {
  opacity: 0.6;
  cursor: default;
}

.distpill {
  background: var(--brand-tint);
  color: #8e1b3a;
}
.distpill:hover {
  background: var(--brand-tint-strong);
}

.featured {
  margin-bottom: 22px;
}
.list__items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.list__sentinel {
  min-height: 1px;
  display: flex;
  justify-content: center;
  padding: 18px 0 2px;
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
  color: rgba(31, 26, 23, 0.22);
  margin-bottom: 14px;
}
.state__title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.state__text {
  margin: 0 0 20px;
  font-size: 14px;
  color: rgba(31, 26, 23, 0.5);
  line-height: 1.5;
}
.state__actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (prefers-reduced-motion: reduce) {
  .seg-btn {
    transition: none;
  }
}
</style>
