<script setup>
// 실시간 집계를 점수 막대로. 점수 내림차순, 최고점 강조(가넷). 후보명은 candidates 로 매핑.
// 실시간 갱신 시 막대 width 가 부드럽게 전환된다(reduced-motion 대안 포함).
import { computed } from 'vue'

/** @typedef {import('../types/vote.js').Candidate} Candidate */
/** @typedef {import('../types/vote.js').TallyEntry} TallyEntry */

const props = defineProps({
  /** @type {() => TallyEntry[]} */
  tally: { type: Array, default: () => [] },
  /** @type {() => Candidate[]} */
  candidates: { type: Array, default: () => [] },
  /** 마감 후 승자 candidateId — 있으면 그 행을 승자로 표시 */
  winnerCandidateId: { type: Number, default: null },
})

const nameById = computed(() => {
  const m = new Map()
  for (const c of props.candidates) m.set(c.candidateId, c.placeName)
  return m
})

// 후보 전체를 보여준다(점수 0 포함). 점수 내림차순, 동점은 candidateId 순.
const rows = computed(() => {
  const scoreById = new Map()
  for (const t of props.tally) scoreById.set(t.candidateId, t.score)
  const merged = props.candidates.map((c) => ({
    candidateId: c.candidateId,
    placeName: c.placeName,
    score: scoreById.get(c.candidateId) ?? 0,
  }))
  return merged.sort((a, b) => b.score - a.score || a.candidateId - b.candidateId)
})

const maxScore = computed(() => Math.max(1, ...rows.value.map((r) => r.score)))

function pct(score) {
  return `${Math.round((score / maxScore.value) * 100)}%`
}

// 최고점(0 초과)인 행만 강조. 동점 최고면 모두 강조.
const topScore = computed(() => rows.value[0]?.score ?? 0)
function isLeader(r) {
  return r.score > 0 && r.score === topScore.value
}
</script>

<template>
  <ul class="tb" aria-label="실시간 집계">
    <li v-for="r in rows" :key="r.candidateId" class="tb__row">
      <div class="tb__head">
        <span class="tb__name" :class="{ 'tb__name--lead': isLeader(r) }">
          <v-icon
            v-if="winnerCandidateId === r.candidateId"
            icon="mdi-trophy"
            size="15"
            color="warning"
            class="tb__crown"
          />
          {{ nameById.get(r.candidateId) || r.placeName || '후보' }}
        </span>
        <span class="tb__score" :class="{ 'tb__score--lead': isLeader(r) }">{{ r.score }}</span>
      </div>
      <div class="tb__track">
        <div
          class="tb__fill"
          :class="{ 'tb__fill--lead': isLeader(r) }"
          :style="{ width: pct(r.score) }"
        />
      </div>
    </li>
  </ul>
</template>

<style scoped>
.tb {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.tb__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}
.tb__name {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgba(33, 26, 23, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tb__name--lead {
  color: rgb(var(--v-theme-on-surface));
  font-weight: 800;
}
.tb__crown {
  flex: 0 0 auto;
}
.tb__score {
  flex: 0 0 auto;
  font-size: 14px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: rgba(33, 26, 23, 0.5);
}
.tb__score--lead {
  color: var(--brand);
}
.tb__track {
  height: 10px;
  border-radius: 9999px;
  background: rgba(33, 26, 23, 0.07);
  overflow: hidden;
}
.tb__fill {
  height: 100%;
  border-radius: 9999px;
  background: rgba(176, 35, 74, 0.35);
  transition: width 280ms ease-out;
}
.tb__fill--lead {
  background: var(--brand);
}

@media (prefers-reduced-motion: reduce) {
  .tb__fill {
    transition: none;
  }
}
</style>
