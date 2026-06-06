<script setup>
// 부산 16개 구/군 선택 바텀시트.
import { DISTRICTS } from '../store/placeListStore'

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  selected: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue', 'select'])

function pick(d) {
  emit('select', d)
  emit('update:modelValue', false)
}
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
        <h2 class="sheet__title">지역 선택</h2>
        <button class="sheet__close" type="button" aria-label="닫기" @click="emit('update:modelValue', false)">
          <v-icon icon="mdi-close" size="20" />
        </button>
      </div>

      <div class="districts" role="listbox" aria-label="부산 구/군">
        <button
          v-for="d in DISTRICTS"
          :key="d"
          type="button"
          role="option"
          :aria-selected="d === selected"
          class="dist-btn"
          :class="{ 'dist-btn--all': d === '전체', 'dist-btn--on': d === selected }"
          @click="pick(d)"
        >
          {{ d }}
        </button>
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
  padding: 12px 20px calc(28px + env(safe-area-inset-bottom));
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
  margin-bottom: 18px;
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
  transition: background 160ms ease;
}
.sheet__close:hover {
  background: rgba(31, 26, 23, 0.1);
}

.districts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.dist-btn {
  padding: 13px 4px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-align: center;
  border: 1.5px solid rgba(31, 26, 23, 0.08);
  background: #ffffff;
  border-radius: 14px;
  cursor: pointer;
  color: rgba(31, 26, 23, 0.7);
  transition:
    background 160ms ease,
    color 160ms ease,
    border-color 160ms ease,
    transform 120ms ease;
}
.dist-btn--all {
  grid-column: 1 / -1;
  padding: 12px 4px;
  font-size: 14px;
}
.dist-btn:active {
  transform: scale(0.96);
}
.dist-btn--on {
  background: #B0234A;
  color: #ffffff;
  border-color: #B0234A;
  box-shadow: 0 6px 16px -6px rgba(176, 35, 74, 0.5);
}

@media (prefers-reduced-motion: reduce) {
  .dist-btn { transition: none; }
  .dist-btn:active { transform: none; }
}
</style>
