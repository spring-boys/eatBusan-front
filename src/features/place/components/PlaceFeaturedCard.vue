<script setup>
// 가장 인기 있는 #1 식당을 크게 띄우는 편집형 히어로 카드.
import { formatDistance } from '@/shared/utils/geo'

const props = defineProps({
  /** @type {import('../types/place.js').PlaceResponse} */
  place: { type: Object, required: true },
  /** 카드 좌상단 태그 텍스트. null이면 숨김 */
  tagText: { type: String, default: null },
})
</script>

<template>
  <router-link :to="`/places/${place.id}`" class="feat">
    <div class="feat__media">
      <v-img v-if="place.thumbnailUrl" :src="place.thumbnailUrl" :alt="place.name" :aspect-ratio="3 / 2" cover />
      <div v-else class="feat__ph"><v-icon icon="mdi-storefront-outline" size="48" /></div>
    </div>
    <div class="feat__scrim"></div>

    <span v-if="tagText" class="feat__tag">
      {{ tagText }}
    </span>

    <div class="feat__body">
      <span class="feat__cat">{{ place.category }}</span>
      <h2 class="feat__name">{{ place.name }}</h2>
      <div class="feat__meta">
        <v-icon icon="mdi-star" size="16" color="#E8A53D" aria-hidden="true" />
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
    0 22px 40px -20px rgba(176, 35, 74, 0.45);
  transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
}
.feat:hover {
  transform: translateY(-2px);
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
  background: #B0234A;
  color: #fff;
  font-size: 12.5px;
  font-weight: 800;
  letter-spacing: -0.01em;
  padding: 7px 12px;
  border-radius: 9999px;
  box-shadow: 0 6px 14px -4px rgba(176, 35, 74, 0.6);
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
  font-size: clamp(22px, 6vw, 30px);
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
  .feat { transition: none; }
  .feat:hover { transform: none; }
}
</style>
