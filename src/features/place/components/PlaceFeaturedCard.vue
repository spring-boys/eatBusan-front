<script setup>
// 가장 가까운 #1 식당을 크게 띄우는 편집형 히어로 카드. 균일한 리스트를 깨는 포컬 포인트.
import { formatDistance } from '@/shared/utils/geo'

defineProps({
  /** @type {import('../types/place.js').PlaceResponse} */
  place: { type: Object, required: true },
})
</script>

<template>
  <router-link :to="`/places/${place.id}`" class="feat">
    <div class="feat__media">
      <v-img v-if="place.thumbnailUrl" :src="place.thumbnailUrl" :alt="place.name" :aspect-ratio="3 / 2" cover />
      <div v-else class="feat__ph"><v-icon icon="mdi-storefront-outline" size="48" /></div>
    </div>
    <div class="feat__scrim"></div>

    <span v-if="place.distanceM != null" class="feat__tag">
      <v-icon icon="mdi-near-me" size="14" aria-hidden="true" />가장 가까워요 · {{ formatDistance(place.distanceM) }}
    </span>

    <div class="feat__body">
      <span class="feat__cat">{{ place.category }}</span>
      <h2 class="feat__name">{{ place.name }}</h2>
      <div class="feat__meta">
        <v-icon icon="mdi-star" size="16" color="#FFC83D" aria-hidden="true" />
        <strong>{{ place.rating.toFixed(1) }}</strong>
        <span class="feat__rev">후기 {{ place.reviewCount }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.feat {
  position: relative;
  display: block;
  border-radius: 24px;
  overflow: hidden;
  text-decoration: none;
  color: #fff;
  box-shadow:
    0 2px 6px rgba(31, 26, 23, 0.06),
    0 22px 40px -20px rgba(242, 84, 27, 0.45);
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}
.feat:active {
  transform: scale(0.985);
}
.feat__media,
.feat__ph {
  display: block;
}
.feat__ph {
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 3 / 2;
  background: rgba(31, 26, 23, 0.06);
  color: rgba(31, 26, 23, 0.3);
}
.feat__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(20, 12, 8, 0) 38%, rgba(20, 12, 8, 0.78) 100%);
}
.feat__tag {
  position: absolute;
  top: 14px;
  left: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f2541b;
  color: #fff;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: -0.01em;
  padding: 7px 12px;
  border-radius: 9999px;
  box-shadow: 0 6px 14px -4px rgba(242, 84, 27, 0.6);
}
.feat__body {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 18px 20px 20px;
}
.feat__cat {
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.82);
}
.feat__name {
  margin: 2px 0 6px;
  font-size: clamp(24px, 7vw, 30px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.035em;
  text-wrap: balance;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
}
.feat__meta {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}
.feat__meta strong {
  font-weight: 800;
}
.feat__rev {
  color: rgba(255, 255, 255, 0.78);
  margin-left: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .feat {
    transition: none;
  }
}
</style>
