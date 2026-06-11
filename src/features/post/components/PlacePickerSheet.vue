<script setup>
// 후기 쓸 가게 선택 바텀시트. 구/군을 고르면 해당 구역의 가게 목록(백엔드 페이지)을 보여준다.
import { ref, watch } from 'vue'
import { fetchPlacePage, getAreaCodeByDistrict } from '@/features/place/api/placeApi'
import { DISTRICTS, ALL_DISTRICT } from '@/features/place/store/placeListStore'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
})
const emit = defineEmits(['update:modelValue', 'select'])

// '전체'는 구역코드가 없어 선택 목록에서 제외
const districts = DISTRICTS.filter((d) => d !== ALL_DISTRICT)

const district = ref('해운대구')
const places = ref([])
const page = ref(0)
const hasMore = ref(false)
const loading = ref(false)
const loadingMore = ref(false)
const error = ref(null)

const PAGE_SIZE = 20

async function load() {
  loading.value = true
  error.value = null
  page.value = 0
  try {
    const areaCode = getAreaCodeByDistrict(district.value)
    const data = await fetchPlacePage({ areaCode, page: 0, size: PAGE_SIZE })
    places.value = data.items
    hasMore.value = data.hasMore
  } catch {
    error.value = '가게 목록을 불러오지 못했어요.'
    places.value = []
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const areaCode = getAreaCodeByDistrict(district.value)
    const data = await fetchPlacePage({ areaCode, page: page.value + 1, size: PAGE_SIZE })
    places.value = [...places.value, ...data.items]
    page.value += 1
    hasMore.value = data.hasMore
  } catch {
    error.value = '가게 목록을 더 불러오지 못했어요.'
  } finally {
    loadingMore.value = false
  }
}

function pickDistrict(d) {
  if (district.value === d) return
  district.value = d
  load()
}

function pick(place) {
  emit('select', { placeId: place.id, placeName: place.name })
  emit('update:modelValue', false)
}

// 시트를 열 때 첫 로드 (이미 목록이 있으면 유지)
watch(
  () => props.modelValue,
  (open) => {
    if (open && places.value.length === 0 && !loading.value) load()
  },
)
</script>

<template>
  <v-bottom-sheet
    :model-value="modelValue"
    attach="#app-shell"
    contained
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="sheet">
      <div class="sheet__handle" aria-hidden="true"></div>

      <div class="sheet__header">
        <h2 class="sheet__title">가게 선택</h2>
        <button
          class="sheet__close"
          type="button"
          aria-label="닫기"
          @click="emit('update:modelValue', false)"
        >
          <v-icon icon="mdi-close" size="20" />
        </button>
      </div>

      <div class="dists" role="tablist" aria-label="부산 구/군">
        <button
          v-for="d in districts"
          :key="d"
          type="button"
          role="tab"
          :aria-selected="d === district"
          class="dist-pill"
          :class="{ 'dist-pill--on': d === district }"
          @click="pickDistrict(d)"
        >
          {{ d }}
        </button>
      </div>

      <div class="list">
        <!-- 로딩 -->
        <template v-if="loading">
          <v-skeleton-loader v-for="i in 4" :key="i" type="list-item-two-line" />
        </template>

        <!-- 에러 -->
        <div v-else-if="error && places.length === 0" class="state">
          <v-icon icon="mdi-wifi-off" size="32" class="state__icon" />
          <p class="state__text">{{ error }}</p>
          <v-btn color="primary" size="small" rounded="lg" @click="load">다시 시도</v-btn>
        </div>

        <!-- 빈 상태 -->
        <div v-else-if="places.length === 0" class="state">
          <v-icon icon="mdi-storefront-outline" size="32" class="state__icon" />
          <p class="state__text">{{ district }}에 등록된 가게가 아직 없어요.</p>
          <p class="state__sub">다른 구/군을 선택해보세요.</p>
        </div>

        <!-- 정상 -->
        <template v-else>
          <button v-for="p in places" :key="p.id" type="button" class="row" @click="pick(p)">
            <span class="row__icon"><v-icon icon="mdi-silverware-fork-knife" size="18" /></span>
            <span class="row__body">
              <span class="row__name">{{ p.name }}</span>
              <span class="row__addr">{{ p.address }}</span>
            </span>
            <v-icon icon="mdi-chevron-right" size="18" class="row__ch" />
          </button>

          <v-btn
            v-if="hasMore"
            variant="tonal"
            color="primary"
            rounded="lg"
            block
            class="more"
            :loading="loadingMore"
            @click="loadMore"
          >
            더 보기
          </v-btn>
        </template>
      </div>
    </div>
  </v-bottom-sheet>
</template>

<style scoped>
.sheet {
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: saturate(180%) blur(24px);
  -webkit-backdrop-filter: saturate(180%) blur(24px);
  border-radius: 24px 24px 0 0;
  padding: 12px 20px calc(20px + env(safe-area-inset-bottom));
}
.sheet__handle {
  width: 40px;
  height: 4px;
  border-radius: 9999px;
  background: rgba(31, 26, 23, 0.14);
  margin: 0 auto 16px;
}
.sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.sheet__title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.sheet__close {
  border: 0;
  background: rgba(31, 26, 23, 0.06);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: rgba(31, 26, 23, 0.55);
}

.dists {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 4px;
  scrollbar-width: none;
}
.dists::-webkit-scrollbar {
  display: none;
}
.dist-pill {
  flex: 0 0 auto;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 700;
  border: 1.5px solid rgba(31, 26, 23, 0.08);
  background: rgb(var(--v-theme-surface));
  border-radius: 9999px;
  cursor: pointer;
  color: rgba(31, 26, 23, 0.7);
  transition:
    background 160ms ease,
    color 160ms ease,
    border-color 160ms ease;
}
.dist-pill--on {
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-color: rgb(var(--v-theme-primary));
}

.list {
  height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 56px;
  padding: 8px 4px;
  border: 0;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
}
.row:active {
  background: rgba(31, 26, 23, 0.04);
}
.row__icon {
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-tint);
  color: rgb(var(--v-theme-primary));
}
.row__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.row__name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row__addr {
  font-size: 12.5px;
  color: rgba(31, 26, 23, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.row__ch {
  color: rgba(31, 26, 23, 0.3);
}
.more {
  margin-top: 8px;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  text-align: center;
}
.state__icon {
  color: rgba(31, 26, 23, 0.3);
}
.state__text {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(31, 26, 23, 0.65);
}
.state__sub {
  margin: 0;
  font-size: 13px;
  color: rgba(31, 26, 23, 0.45);
}

@media (prefers-reduced-motion: reduce) {
  .dist-pill {
    transition: none;
  }
}
</style>
