<script setup>
// 식당 리스트 한 줄 (편집형). 가까운 순 순위 번호 + 강한 이름 타이포. 탭하면 상세로 이동.
import { computed } from 'vue'
import { formatDistance } from '@/shared/utils/geo'

const props = defineProps({
  /** @type {import('../types/place.js').PlaceResponse} */
  place: { type: Object, required: true },
  /** 순위 번호. null이면 숨김 */
  rank: { type: Number, default: null },
  /** 거리 표시 여부 (내 주변 모드에서만 true) */
  showDistance: { type: Boolean, default: true },
})

const hasRating = computed(() => Number.isFinite(props.place.rating))
const metricIcon = computed(() => (hasRating.value ? 'mdi-star' : 'mdi-heart'))
const metricColor = computed(() => (hasRating.value ? 'warning' : 'secondary'))
const metricText = computed(() =>
  hasRating.value ? props.place.rating.toFixed(1) : `좋아요 ${props.place.likeCount ?? 0}`,
)
const reviewText = computed(() => `후기 ${props.place.reviewCount ?? props.place.postCnt ?? 0}`)
const shortAddress = computed(() => props.place.address.replace(/^부산 [^\s]+ /, ''))
</script>

<template>
  <router-link :to="`/places/${place.id}`" class="place">
    <span
      v-if="rank != null"
      class="place__rank"
      :class="{ 'place__rank--top': rank <= 3 }"
      aria-hidden="true"
    >
      {{ rank }}
    </span>

    <div class="place__thumb">
      <v-img
        v-if="place.thumbnailUrl"
        :src="place.thumbnailUrl"
        :alt="place.name"
        :aspect-ratio="1"
        cover
      />
      <div v-else class="place__thumb-ph"><v-icon icon="mdi-storefront-outline" size="24" /></div>
    </div>

    <div class="place__info">
      <h3 class="place__name">{{ place.name }}</h3>
      <div class="place__rating">
        <v-icon :icon="metricIcon" size="15" :color="metricColor" aria-hidden="true" />
        <span class="place__score">{{ metricText }}</span>
        <span class="place__rev">{{ reviewText }}</span>
        <span class="place__cat">· {{ place.category }}</span>
      </div>
      <div class="place__meta">
        <span v-if="showDistance && place.distanceM != null" class="place__dist">
          <v-icon icon="mdi-map-marker" size="13" aria-hidden="true" />{{
            formatDistance(place.distanceM)
          }}
        </span>
        <span v-if="place.district" class="place__district">{{ place.district }}</span>
        <span class="place__addr">{{ shortAddress }}</span>
      </div>
    </div>

    <v-icon icon="mdi-chevron-right" size="22" class="place__chevron" aria-hidden="true" />
  </router-link>
</template>

<style scoped>
.place {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(31, 26, 23, 0.05);
  text-decoration: none;
  color: inherit;
  transition:
    box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.place:hover {
  box-shadow: 0 12px 26px -16px rgba(31, 26, 23, 0.3);
  transform: translateY(-2px);
}
.place:active {
  transform: scale(0.99);
}

.place__rank {
  flex: 0 0 auto;
  width: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.04em;
  color: rgba(31, 26, 23, 0.28);
}
.place__rank--top {
  color: #b0234a;
}

.place__thumb {
  flex: 0 0 76px;
  width: 76px;
  height: 76px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(31, 26, 23, 0.04);
}
.place__thumb-ph {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(31, 26, 23, 0.28);
}
.place__info {
  flex: 1 1 auto;
  min-width: 0;
}
.place__name {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.place__rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 13px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}
.place__score {
  flex: none;
  font-weight: 800;
  color: rgb(var(--v-theme-on-surface));
}
.place__rev {
  flex: none;
  color: rgba(31, 26, 23, 0.5);
}
.place__cat {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(31, 26, 23, 0.5);
}
.place__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 13px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}
.place__dist {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  flex: none;
  font-weight: 800;
  color: #b0234a;
}
.place__district {
  flex: none;
  font-size: 12px;
  font-weight: 700;
  color: #b0234a;
  background: rgba(176, 35, 74, 0.1);
  padding: 2px 7px;
  border-radius: 9999px;
}
.place__addr {
  flex: 1 1 auto;
  min-width: 0;
  color: rgba(31, 26, 23, 0.42);
  overflow: hidden;
  text-overflow: ellipsis;
}
.place__chevron {
  flex: none;
  color: rgba(31, 26, 23, 0.22);
}

@media (prefers-reduced-motion: reduce) {
  .place {
    transition: none;
  }
  .place:hover,
  .place:active {
    transform: none;
  }
}
</style>
