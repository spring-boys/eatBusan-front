<script setup>
// 마감 시 승자 발표. placeName 을 허니/가넷으로 강조한다.
// 무승부(승자 미정)면 안내 문구로 대체한다.
const props = defineProps({
  /** 승자 후보의 가게명. null 이면 무승부 */
  placeName: { type: String, default: null },
})
</script>

<template>
  <div class="wb">
    <div class="wb__icon" aria-hidden="true">
      <v-icon icon="mdi-trophy" size="32" color="warning" />
    </div>
    <template v-if="placeName">
      <p class="wb__eyebrow">오늘의 선택</p>
      <p class="wb__name">{{ placeName }}</p>
      <p class="wb__sub">투표가 마감됐어요. 여기로 가볼까요?</p>
    </template>
    <template v-else>
      <p class="wb__eyebrow">투표 마감</p>
      <p class="wb__name wb__name--tie">우열을 가리지 못했어요</p>
      <p class="wb__sub">동점이라 한 곳을 정하지 못했어요.</p>
    </template>
  </div>
</template>

<style scoped>
.wb {
  border-radius: 22px;
  padding: 26px 20px 22px;
  text-align: center;
  background: var(--brand);
  color: rgb(var(--v-theme-on-primary));
}
.wb__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.16);
  margin-bottom: 12px;
}
.wb__eyebrow {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--honey);
}
.wb__name {
  margin: 0;
  font-size: clamp(24px, 8vw, 30px);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.18;
}
.wb__name--tie {
  font-size: clamp(20px, 6.5vw, 24px);
}
.wb__sub {
  margin: 10px 0 0;
  font-size: 13.5px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.82);
}
</style>
