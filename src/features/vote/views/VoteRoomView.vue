<script setup>
// 투표방 메인. mount: loadDetail + loadResult + connectRealtime / unmount: disconnect.
//  OPEN  : 후보 + BallotPicker + 제출 + 실시간 TallyBars (+ 호스트면 마감)
//  CLOSED: WinnerBanner + 최종 TallyBars
//  404   : "종료된 투표" 안내 + 홈 이동
// 본인 myBallot 이 있으면 BallotPicker 에 복원해 보여준다.
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVoteRoomStore } from '../store/voteRoomStore'
import BallotPicker from '../components/BallotPicker.vue'
import TallyBars from '../components/TallyBars.vue'
import WinnerBanner from '../components/WinnerBanner.vue'

const route = useRoute()
const router = useRouter()
const store = useVoteRoomStore()
const {
  room,
  candidates,
  tally,
  myBallot,
  loading,
  error,
  notFound,
  isHost,
  hasVoted,
  votedCount,
  participantCount,
} = storeToRefs(store)

const publicId = computed(() => String(route.params.roomPublicId))

// BallotPicker 의 로컬 선택 — myBallot 으로 초기화/복원한다
const picked = ref([])
const submitting = ref(false)
const closing = ref(false)
const submitted = ref(false)
// 재투표(편집) 모드: '다시 투표하기' 를 누르면 선택을 비우고 내 완료 상태를 즉시 해제한다.
const editing = ref(false)

// 내가 '투표 완료' 로 보이는지 (편집 중이면 미완료로 취급)
const myVoteDone = computed(() => hasVoted.value && !editing.value)
// 편집 중이면 내 한 표를 빼고 표시 (재투표 시작 즉시 완료 인원 -1)
const displayVotedCount = computed(() =>
  editing.value ? Math.max(0, votedCount.value - 1) : votedCount.value,
)
// 참여 현황 진행률 (표시용 완료 인원 / 참가자)
const votedPct = computed(() =>
  participantCount.value ? Math.round((displayVotedCount.value / participantCount.value) * 100) : 0,
)

const isOpen = computed(() => room.value?.status === 'OPEN')
const isClosed = computed(() => room.value?.status === 'CLOSED')

const winnerName = computed(() => {
  const id = room.value?.winnerCandidateId
  if (id == null) return null
  return candidates.value.find((c) => c.candidateId === id)?.placeName ?? null
})

// 서버의 myBallot 이 갱신되면 로컬 선택을 그에 맞춘다(재진입·복원)
watch(
  myBallot,
  (val) => {
    picked.value = [...(val ?? [])]
  },
  { immediate: true },
)

async function load() {
  await store.loadDetail(publicId.value)
  if (notFound.value) return
  await store.loadResult(publicId.value)
  store.connectRealtime(publicId.value)
}

async function submit() {
  if (!picked.value.length || submitting.value) return
  submitting.value = true
  try {
    await store.submitBallot([...picked.value])
    submitted.value = true
    editing.value = false
  } catch {
    // store.error 에 메시지가 채워진다 — 화면에서 노출
  } finally {
    submitting.value = false
  }
}

// 메인 버튼: 완료 상태면 재투표 시작(선택 해제 + 완료 즉시 해제), 아니면 제출
function startReedit() {
  editing.value = true
  picked.value = []
}
function onPrimary() {
  if (myVoteDone.value) {
    startReedit()
    return
  }
  submit()
}

async function close() {
  if (closing.value) return
  closing.value = true
  try {
    await store.close()
  } catch {
    // store.error 노출
  } finally {
    closing.value = false
  }
}

onMounted(load)
onBeforeUnmount(() => store.disconnect())
</script>

<template>
  <div class="vr">
    <!-- 로딩 -->
    <div v-if="loading && !room" class="vr__skel">
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="list-item-two-line@4" />
    </div>

    <!-- 단발성 삭제(404) -->
    <div v-else-if="notFound" class="state">
      <v-icon icon="mdi-timer-off-outline" size="44" class="state__icon" />
      <h2 class="state__title">종료된 투표예요</h2>
      <p class="state__text">이 투표방은 마감 후 정리됐어요.</p>
      <v-btn color="primary" size="large" rounded="lg" @click="router.push('/')">홈으로</v-btn>
    </div>

    <!-- 정상 -->
    <template v-else-if="room">
      <header class="vr__hd">
        <span class="vr__status" :class="isClosed ? 'vr__status--closed' : 'vr__status--open'">
          {{ isClosed ? '마감' : '진행 중' }}
        </span>
        <h1 class="vr__title">{{ room.title }}</h1>
      </header>

      <!-- 참여 현황: 독립 카드 섹션 -->
      <section class="vr__part" aria-label="투표 참여 현황">
        <div class="vr__part-top">
          <span class="vr__part-label">투표 현황</span>
          <span class="vr__part-ratio">
            <strong>{{ displayVotedCount }}</strong><span class="vr__part-total">/ {{ participantCount }}명</span>
          </span>
        </div>
        <div
          class="vr__part-bar"
          role="progressbar"
          :aria-valuenow="displayVotedCount"
          :aria-valuemax="participantCount"
          :aria-label="`참가 ${participantCount}명 중 ${displayVotedCount}명 투표 완료`"
        >
          <span class="vr__part-fill" :style="{ width: votedPct + '%' }"></span>
        </div>
        <p class="vr__part-caption">
          참가 {{ participantCount }}명 중 {{ displayVotedCount }}명 완료 · {{ votedPct }}%
        </p>
      </section>

      <!-- CLOSED: 승자 발표 -->
      <template v-if="isClosed">
        <WinnerBanner :place-name="winnerName" class="vr__banner" />
        <section class="vr__sec">
          <h2 class="vr__sec-title">최종 결과</h2>
          <TallyBars
            :tally="tally"
            :candidates="candidates"
            :winner-candidate-id="room.winnerCandidateId"
          />
        </section>
        <v-btn
          variant="tonal"
          color="primary"
          rounded="lg"
          block
          class="vr__home"
          @click="router.push('/')"
        >
          홈으로
        </v-btn>
      </template>

      <!-- OPEN -->
      <template v-else>
        <section class="vr__sec">
          <h2 class="vr__sec-title">
            {{ myVoteDone ? '내가 고른 순위' : '1·2·3순위를 골라요' }}
          </h2>
          <p class="vr__sec-sub">탭하면 순위가 매겨지고, 다시 탭하면 해제돼요. (최대 3개)</p>
          <BallotPicker v-model="picked" :candidates="candidates" />
        </section>

        <v-alert
          v-if="error"
          type="error"
          variant="tonal"
          density="comfortable"
          rounded="lg"
          class="vr__alert"
          :text="error"
        />

        <v-btn
          color="primary"
          size="large"
          rounded="lg"
          block
          class="vr__submit"
          :loading="submitting"
          :disabled="myVoteDone ? false : !picked.length"
          @click="onPrimary"
        >
          {{ myVoteDone ? '다시 투표하기' : '투표 제출' }}
        </v-btn>

        <section class="vr__sec vr__sec--tally">
          <h2 class="vr__sec-title">
            실시간 결과
            <span class="vr__live" aria-hidden="true"></span>
          </h2>
          <TallyBars :tally="tally" :candidates="candidates" />
        </section>

        <v-btn
          v-if="isHost"
          variant="outlined"
          color="primary"
          rounded="lg"
          block
          class="vr__close"
          :loading="closing"
          prepend-icon="mdi-flag-checkered"
          @click="close"
        >
          투표 마감하기
        </v-btn>
      </template>
    </template>

    <!-- 기타 에러(상세 로드 실패 등) -->
    <div v-else-if="error" class="state">
      <v-icon icon="mdi-wifi-off" size="40" class="state__icon" />
      <p class="state__text">{{ error }}</p>
      <v-btn color="primary" size="large" rounded="lg" @click="load">다시 시도</v-btn>
    </div>

    <v-snackbar :model-value="submitted && isOpen" :timeout="1800" location="top" rounded="pill">
      투표가 반영됐어요!
    </v-snackbar>
  </div>
</template>

<style scoped>
.vr {
  padding: 8px 2px 28px;
}
.vr__skel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 8px;
}

.vr__hd {
  margin-bottom: 20px;
}
.vr__status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: -0.01em;
  padding: 4px 10px;
  border-radius: 9999px;
  margin-bottom: 10px;
}
.vr__status--open {
  background: var(--brand-tint);
  color: var(--brand-deep);
}
.vr__status--closed {
  background: rgba(33, 26, 23, 0.08);
  color: rgba(33, 26, 23, 0.6);
}
.vr__title {
  margin: 0;
  font-size: clamp(24px, 7.5vw, 30px);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.045em;
  color: rgb(var(--v-theme-on-surface));
}

.vr__banner {
  margin-bottom: 24px;
}

.vr__sec {
  margin-bottom: 22px;
}
.vr__sec--tally {
  margin-top: 26px;
}
.vr__sec-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.vr__sec-sub {
  margin: 0 0 12px;
  font-size: 13px;
  color: rgba(33, 26, 23, 0.5);
}
.vr__live {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background: var(--brand);
  animation: vr-pulse 1.6s ease-in-out infinite;
}
/* 참여 현황 — 독립 카드 섹션 */
.vr__part {
  margin: 0 0 22px;
  padding: 16px 18px;
  background: #fff;
  border: 1px solid var(--brand-tint);
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(33, 26, 23, 0.05);
}
.vr__part-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}
.vr__part-label {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: rgba(33, 26, 23, 0.6);
}
.vr__part-ratio {
  display: inline-flex;
  align-items: baseline;
  gap: 3px;
}
.vr__part-ratio strong {
  font-size: 26px;
  font-weight: 800;
  line-height: 1;
  color: var(--brand-deep);
}
.vr__part-total {
  font-size: 15px;
  font-weight: 700;
  color: rgba(33, 26, 23, 0.4);
}
.vr__part-bar {
  height: 12px;
  border-radius: 9999px;
  background: var(--brand-tint);
  overflow: hidden;
}
.vr__part-fill {
  display: block;
  height: 100%;
  border-radius: 9999px;
  background: var(--brand);
  transition: width 280ms ease;
}
.vr__part-caption {
  margin: 10px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: rgba(33, 26, 23, 0.5);
}
@media (prefers-reduced-motion: reduce) {
  .vr__part-fill {
    transition: none;
  }
}

.vr__alert {
  margin-bottom: 12px;
}
.vr__submit {
  margin-bottom: 4px;
}
.vr__close {
  margin-top: 18px;
}
.vr__home {
  margin-top: 6px;
}

.state {
  text-align: center;
  padding: 56px 16px;
}
.state__icon {
  color: rgba(33, 26, 23, 0.22);
  margin-bottom: 14px;
}
.state__title {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: rgb(var(--v-theme-on-surface));
}
.state__text {
  margin: 0 0 20px;
  font-size: 14px;
  color: rgba(33, 26, 23, 0.5);
  line-height: 1.5;
}

@keyframes vr-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(0.7);
  }
}
@media (prefers-reduced-motion: reduce) {
  .vr__live {
    animation: none;
  }
}
</style>
