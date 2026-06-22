<script setup>
// 후보 중 1·2·3등을 순서대로 고른다. 탭하면 다음 순위 배지가 붙고, 다시 탭하면 해제된다.
// 최대 3, 중복 불가. 선택 상태(candidateId 배열, 1등→2등→3등 순)를 v-model 로 노출한다.
// 색: 선택은 가넷(primary), 순위 배지는 허니(warning).
import { computed } from 'vue'

/** @typedef {import('../types/vote.js').Candidate} Candidate */

const props = defineProps({
  /** @type {() => Candidate[]} */
  candidates: { type: Array, default: () => [] },
  /** v-model: 선택된 candidateId 배열 (1등→2등→3등 순서) */
  modelValue: { type: Array, default: () => [] },
  /** 마감/제출 등으로 더 못 고르게 할 때 */
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const MAX = 3

/** candidateId → 0-based 순위 (없으면 -1) */
function rankOf(id) {
  return props.modelValue.indexOf(id)
}

const full = computed(() => props.modelValue.length >= MAX)

function toggle(id) {
  if (props.disabled) return
  const idx = rankOf(id)
  const next = [...props.modelValue]
  if (idx >= 0) {
    next.splice(idx, 1) // 해제 — 뒤 순위가 자동으로 당겨진다
  } else {
    if (next.length >= MAX) return // 가득 찼으면 무시
    next.push(id)
  }
  emit('update:modelValue', next)
}
</script>

<template>
  <ul class="bp" role="listbox" aria-label="후보 순위 선택">
    <li v-for="c in candidates" :key="c.candidateId">
      <button
        class="bp__row"
        :class="{ 'bp__row--on': rankOf(c.candidateId) >= 0 }"
        type="button"
        role="option"
        :aria-selected="rankOf(c.candidateId) >= 0"
        :disabled="disabled || (full && rankOf(c.candidateId) < 0)"
        @click="toggle(c.candidateId)"
      >
        <span
          class="bp__badge"
          :class="rankOf(c.candidateId) >= 0 ? 'bp__badge--on' : 'bp__badge--off'"
          aria-hidden="true"
        >
          <template v-if="rankOf(c.candidateId) >= 0">{{ rankOf(c.candidateId) + 1 }}</template>
          <v-icon v-else icon="mdi-plus" size="16" />
        </span>
        <span class="bp__name">{{ c.placeName }}</span>
        <span v-if="rankOf(c.candidateId) >= 0" class="bp__rank-label">
          {{ rankOf(c.candidateId) + 1 }}순위
        </span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.bp {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bp__row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 56px;
  padding: 10px 14px;
  border: 1px solid rgba(33, 26, 23, 0.1);
  background: rgb(var(--v-theme-surface));
  border-radius: 16px;
  cursor: pointer;
  text-align: left;
  transition:
    border-color 180ms ease,
    background 180ms ease;
}
.bp__row:hover:not(:disabled) {
  border-color: rgba(176, 35, 74, 0.4);
}
.bp__row--on {
  border-color: var(--brand);
  background: var(--brand-tint);
}
.bp__row:disabled {
  cursor: default;
  opacity: 0.5;
}
.bp__row--on:disabled {
  opacity: 1; /* 선택된 것은 마감 후에도 또렷하게 */
}

.bp__badge {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9999px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.bp__badge--off {
  background: rgba(33, 26, 23, 0.06);
  color: rgba(33, 26, 23, 0.4);
}
.bp__badge--on {
  background: var(--honey);
  color: #211a17; /* 허니 채움 위 잉크 — 대비 확보 */
}

.bp__name {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgb(var(--v-theme-on-surface));
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bp__row--on .bp__name {
  color: var(--brand-deep);
}
.bp__rank-label {
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--brand-deep);
}

@media (prefers-reduced-motion: reduce) {
  .bp__row {
    transition: none;
  }
}
</style>
