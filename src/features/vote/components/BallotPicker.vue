<script setup>
// 후보 리스트 = 순위 선택 + 실시간 득표를 한 카드에 통합.
// - 탭하면 1·2·3 순위 배지가 붙고, 다시 탭하면 해제된다. (최대 3, 중복 불가)
// - 같은 카드에 실시간 득표 막대 + 점수를 함께 보여준다(점수 내림차순 정렬, 최고점 강조).
//   => 선택 리스트와 결과 리스트를 따로 두지 않고 하나로 합친 형태.
// 레이아웃은 기본 리스팅 카드(PlaceListItem)를 모방: 썸네일 박스 + 굵은 이름 + 메타 줄.
// 선택 상태(candidateId 배열, 1등→2등→3등 순)를 v-model 로 노출한다.
// 없는 필드(주소·카테고리·썸네일)는 graceful 처리.
import { computed } from 'vue'

/** @typedef {import('../types/vote.js').Candidate} Candidate */
/** @typedef {import('../types/vote.js').TallyEntry} TallyEntry */

const props = defineProps({
  /** @type {() => Candidate[]} */
  candidates: { type: Array, default: () => [] },
  /** @type {() => TallyEntry[]} 실시간 집계(candidateId → score). 없으면 0점 처리 */
  tally: { type: Array, default: () => [] },
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

/** candidateId → score */
const scoreById = computed(() => {
  const m = new Map()
  for (const t of props.tally) m.set(t.candidateId, t.score)
  return m
})

// 후보를 점수와 합쳐 점수 내림차순(동점은 candidateId 순)으로. 0점 후보도 포함.
// 탭은 로컬 선택만 바꾸고 집계는 바꾸지 않으므로, 선택 도중 행이 튀지 않는다
// (집계는 다른 사람 투표/내 제출 후 STOMP 로만 갱신).
const rows = computed(() =>
  props.candidates
    .map((c) => ({ ...c, score: scoreById.value.get(c.candidateId) ?? 0 }))
    .sort((a, b) => b.score - a.score || a.candidateId - b.candidateId),
)

const maxScore = computed(() => Math.max(1, ...rows.value.map((r) => r.score)))
function pct(score) {
  return `${Math.round((score / maxScore.value) * 100)}%`
}

// 최고점(0 초과)인 행만 강조. 동점 최고면 모두 강조.
const topScore = computed(() => rows.value[0]?.score ?? 0)
function isLeader(r) {
  return r.score > 0 && r.score === topScore.value
}

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
    <li v-for="r in rows" :key="r.candidateId">
      <button
        class="bp__row"
        :class="{ 'bp__row--on': rankOf(r.candidateId) >= 0 }"
        type="button"
        role="option"
        :aria-selected="rankOf(r.candidateId) >= 0"
        :disabled="disabled || (full && rankOf(r.candidateId) < 0)"
        @click="toggle(r.candidateId)"
      >
        <!-- 상단: 썸네일 + 이름/메타 + 순위 배지 (기본 리스팅 카드 모방) -->
        <div class="bp__main">
          <div class="bp__thumb">
            <v-img
              v-if="r.thumbnailUrl"
              :src="r.thumbnailUrl"
              :alt="r.placeName"
              :aspect-ratio="1"
              cover
            />
            <div v-else class="bp__thumb-ph">
              <v-icon icon="mdi-storefront-outline" size="22" />
            </div>
          </div>

          <div class="bp__info">
            <h3 class="bp__name">{{ r.placeName }}</h3>
            <div v-if="r.category || shortAddress(r.address)" class="bp__meta">
              <span v-if="r.category" class="bp__cat">{{ r.category }}</span>
              <span v-if="shortAddress(r.address)" class="bp__addr">
                {{ shortAddress(r.address) }}
              </span>
            </div>
          </div>

          <!-- 순위 배지 (선택 시 숫자, 미선택 시 + 아이콘) -->
          <span
            class="bp__badge"
            :class="rankOf(r.candidateId) >= 0 ? 'bp__badge--on' : 'bp__badge--off'"
            aria-hidden="true"
          >
            <template v-if="rankOf(r.candidateId) >= 0">{{ rankOf(r.candidateId) + 1 }}</template>
            <v-icon v-else icon="mdi-plus" size="16" />
          </span>
        </div>

        <!-- 하단: 실시간 득표 막대 + 점수 (선택/결과를 한 카드에 통합) -->
        <div class="bp__tally" :aria-label="`${r.placeName} 현재 ${r.score}점`">
          <span class="bp__track">
            <span
              class="bp__fill"
              :class="{ 'bp__fill--lead': isLeader(r) }"
              :style="{ width: pct(r.score) }"
            />
          </span>
          <span class="bp__score" :class="{ 'bp__score--lead': isLeader(r) }">{{ r.score }}</span>
        </div>
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
  /* 후보가 많아도 한 화면 안에서 스크롤로 본다 (대략 카드 4개 높이) */
  max-height: 480px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.bp__row {
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.bp__main {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
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

/* 실시간 득표 막대 — 카드 하단, 썸네일과 정렬되도록 들여쓰기 */
.bp__tally {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 76px; /* 썸네일(64) + gap(12) */
}
.bp__track {
  flex: 1 1 auto;
  height: 8px;
  border-radius: 9999px;
  background: rgba(33, 26, 23, 0.07);
  overflow: hidden;
}
.bp__fill {
  display: block;
  height: 100%;
  border-radius: 9999px;
  background: rgba(176, 35, 74, 0.35);
  transition: width 280ms ease-out;
}
.bp__fill--lead {
  background: var(--brand);
}
.bp__score {
  flex: 0 0 auto;
  min-width: 18px;
  text-align: right;
  font-size: 13px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: rgba(33, 26, 23, 0.5);
}
.bp__score--lead {
  color: var(--brand);
}

@media (prefers-reduced-motion: reduce) {
  .bp__row,
  .bp__fill {
    transition: none;
  }
}
</style>
