<script setup>
// 카테고리 필터 칩 (가로 스크롤). v-model 로 선택값 양방향 바인딩.
defineProps({
  categories: { type: Array, required: true },
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="chips" role="tablist" aria-label="카테고리">
    <button
      v-for="c in categories"
      :key="c"
      type="button"
      role="tab"
      :aria-selected="c === modelValue"
      class="chip"
      :class="{ 'chip--on': c === modelValue }"
      @click="emit('update:modelValue', c)"
    >
      {{ c }}
    </button>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0 4px;
  margin: 0 -20px;
  padding-inline: 20px;
  scrollbar-width: none;
}
.chips::-webkit-scrollbar {
  display: none;
}
.chip {
  flex: none;
  border: 1px solid rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: saturate(160%) blur(10px);
  -webkit-backdrop-filter: saturate(160%) blur(10px);
  color: rgba(var(--v-theme-on-surface), 0.66);
  font-size: 14px;
  font-weight: 600;
  padding: 9px 16px;
  border-radius: 9999px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  transition:
    background 180ms ease,
    color 180ms ease,
    box-shadow 180ms ease,
    transform 180ms ease;
}
.chip:active {
  transform: scale(0.96);
}
.chip--on {
  background: linear-gradient(135deg, #ff8a2b 0%, #f2541b 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 8px 18px -8px rgba(242, 84, 27, 0.55);
}
</style>
