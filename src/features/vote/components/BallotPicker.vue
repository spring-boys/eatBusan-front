<script setup>
// 후보 중 1·2·3등을 순서대로 고른다. 탭하면 다음 순위 배지가 붙고, 다시 탭하면 해제된다.
// 최대 3, 중복 불가. 선택 상태(candidateId 배열, 1등→2등→3등 순)를 v-model 로 노출한다.
// 레이아웃은 기본 리스팅 카드(PlaceListItem)를 모방: 썸네일 박스 + 굵은 이름 + 메타 줄.
// 단, 상세이동(router-link)이 아니라 ballot 선택(탭→순위 배지) 동작을 유지한다.
// 후보는 최대 20개까지 스크롤로 본다. 없는 필드(주소·카테고리·썸네일)는 graceful 처리.
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

/** 부산 시·군 접두 제거 (PlaceListItem 모방). 주소 없으면 빈 문자열. */
function shortAddress(address) {
  if (!address) return ''
  return address.replace(/^부산 [^\s]+ /, '')
}

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
        <!-- 썸네일 박스 (없으면 플레이스홀더) -->
        <div class="bp__thumb">
          <v-img
            v-if="c.thumbnailUrl"
            :src="c.thumbnailUrl"
            :alt="c.placeName"
            :aspect-ratio="1"
            cover
          />
          <div v-else class="bp__thumb-ph">
            <v-icon icon="mdi-storefront-outline" size="22" />
          </div>
        </div>

        <!-- 이름 + 메타 -->
        <div class="bp__info">
          <h3 class="bp__name">{{ c.placeName }}</h3>
          <div v-if="c.category || shortAddress(c.address)" class="bp__meta">
            <span v-if="c.category" class="bp__cat">{{ c.category }}</span>
            <span v-if="shortAddress(c.address)" class="bp__addr">
              {{ shortAddress(c.address) }}
            </span>
          </div>
        </div>

        <!-- 순위 배지 (선택 시 숫자, 미선택 시 + 아이콘) -->
        <span
          class="bp__badge"
          :class="rankOf(c.candidateId) >= 0 ? 'bp__badge--on' : 'bp__badge--off'"
          aria-hidden="true"
        >
          <template v-if="rankOf(c.candidateId) >= 0">{{ rankOf(c.candidateId) + 1 }}</template>
          <v-icon v-else icon="mdi-plus" size="16" />
        </span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.bp {
  list-style: none;
  margin: 0;
  padding: 2px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* 최대 20개가 스크롤로 보이게 (대략 카드 5개 높이) */
  max-height: 460px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.bp__row {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(33, 26, 23, 0.1);
  background: #ffffff;
  border-radius: 18px;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 1px 2px rgba(31, 26, 23, 0.05);
  transition:
    border-color 180ms ease,
    background 180ms ease,
    box-shadow 180ms ease;
}
.bp__row:hover:not(:disabled) {
  border-color: rgba(176, 35, 74, 0.4);
  box-shadow: 0 8px 20px -14px rgba(31, 26, 23, 0.3);
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

.bp__thumb {
  flex: 0 0 64px;
  width: 64px;
  height: 64px;
  border-radius: 14px;
  overflow: hidden;
  background: rgba(31, 26, 23, 0.04);
}
.bp__thumb-ph {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(31, 26, 23, 0.28);
}

.bp__info {
  flex: 1 1 auto;
  min-width: 0;
}
.bp__name {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bp__row--on .bp__name {
  color: var(--brand-deep);
}
.bp__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  font-size: 13px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
}
.bp__cat {
  flex: none;
  font-size: 12px;
  font-weight: 700;
  color: #b0234a;
  background: rgba(176, 35, 74, 0.1);
  padding: 2px 7px;
  border-radius: 9999px;
}
.bp__addr {
  flex: 1 1 auto;
  min-width: 0;
  color: rgba(31, 26, 23, 0.42);
  overflow: hidden;
  text-overflow: ellipsis;
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

@media (prefers-reduced-motion: reduce) {
  .bp__row {
    transition: none;
  }
}
</style>
