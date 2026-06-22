<script setup>
// 투표방 만들기 — 현재 위치(geolocation, 실패 시 부산 기본좌표)로 방 생성.
// 성공 → 발급된 초대 코드(InviteCodeCard) 노출 + "투표방 입장"으로 /vote/{roomPublicId} 이동.
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVoteRoomStore } from '../store/voteRoomStore'
import { getCurrentPosition } from '@/shared/utils/geo'
import InviteCodeCard from '../components/InviteCodeCard.vue'

// 부산 시청 인근 기본 좌표 (위치 거부/실패 시)
const BUSAN_FALLBACK = { lat: 35.1796, lng: 129.0756 }
const DEFAULT_RADIUS = 1000 // m
const RADIUS_OPTIONS = [500, 1000, 2000, 3000]

const router = useRouter()
const store = useVoteRoomStore()
const { loading, error, room } = storeToRefs(store)

const title = ref('점심 어디서 먹지?')
const radius = ref(DEFAULT_RADIUS)
const locating = ref(false)
const usedFallback = ref(false)
/** 생성 완료된 방 publicId (코드 카드 표시 트리거) */
const createdId = ref(null)

onMounted(() => {
  store.error = null
})

async function resolvePosition() {
  locating.value = true
  usedFallback.value = false
  try {
    return await getCurrentPosition()
  } catch {
    usedFallback.value = true
    return BUSAN_FALLBACK
  } finally {
    locating.value = false
  }
}

async function create() {
  if (!title.value.trim() || loading.value) return
  const { lat, lng } = await resolvePosition()
  const publicId = await store.create({
    title: title.value.trim(),
    lat,
    lng,
    radius: radius.value,
  })
  if (publicId) createdId.value = publicId
}

function enterRoom() {
  if (createdId.value) router.push(`/vote/${createdId.value}`)
}
</script>

<template>
  <div class="vc">
    <header class="vc__hd">
      <h1 class="vc__title">
        같이 정하는<br />
        <span class="vc__hl">점심 투표</span>
      </h1>
      <p class="vc__sub">내 주변 맛집을 후보로 띄우고, 친구들과 1·2·3순위를 골라요.</p>
    </header>

    <!-- 생성 완료: 초대 코드 + 입장 -->
    <template v-if="createdId && room">
      <InviteCodeCard :invite-code="room.inviteCode" class="vc__card" />
      <v-btn
        color="primary"
        size="large"
        rounded="lg"
        block
        class="vc__enter"
        append-icon="mdi-arrow-right"
        @click="enterRoom"
      >
        투표방 입장
      </v-btn>
    </template>

    <!-- 생성 폼 -->
    <template v-else>
      <div class="vc__field">
        <label class="vc__label" for="vc-title">투표 제목</label>
        <v-text-field
          id="vc-title"
          v-model="title"
          placeholder="예) 점심 어디서 먹지?"
          variant="solo-filled"
          flat
          rounded="lg"
          hide-details
          maxlength="40"
          counter="40"
        />
      </div>

      <div class="vc__field">
        <span class="vc__label">후보를 찾을 반경</span>
        <div class="vc__radius" role="radiogroup" aria-label="검색 반경">
          <button
            v-for="r in RADIUS_OPTIONS"
            :key="r"
            class="vc__rbtn"
            :class="{ 'vc__rbtn--on': radius === r }"
            type="button"
            role="radio"
            :aria-checked="radius === r"
            @click="radius = r"
          >
            {{ r < 1000 ? `${r}m` : `${r / 1000}km` }}
          </button>
        </div>
        <p class="vc__loc">
          <v-icon icon="mdi-crosshairs-gps" size="14" />
          내 위치 기준으로 근처 맛집 5곳이 자동으로 후보가 돼요.
        </p>
      </div>

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="comfortable"
        rounded="lg"
        class="vc__alert"
        :text="error"
      />

      <v-btn
        color="primary"
        size="large"
        rounded="lg"
        block
        class="vc__submit"
        :loading="locating || loading"
        :disabled="!title.trim()"
        @click="create"
      >
        {{ locating ? '내 위치 확인 중…' : '투표방 만들기' }}
      </v-btn>

      <p class="vc__join">
        코드를 받았나요?
        <router-link to="/vote/join" class="vc__join-link">코드로 입장</router-link>
      </p>
    </template>
  </div>
</template>

<style scoped>
.vc {
  padding: 8px 2px 24px;
}
.vc__hd {
  margin-bottom: 24px;
}
.vc__title {
  margin: 0 0 10px;
  font-size: clamp(28px, 9vw, 36px);
  font-weight: 800;
  line-height: 1.14;
  letter-spacing: -0.045em;
  color: rgb(var(--v-theme-on-surface));
}
.vc__hl {
  color: var(--brand);
}
.vc__sub {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: rgba(33, 26, 23, 0.55);
}

.vc__field {
  margin-bottom: 20px;
}
.vc__label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: rgba(33, 26, 23, 0.7);
}

.vc__radius {
  display: flex;
  gap: 8px;
}
.vc__rbtn {
  flex: 1;
  min-height: 44px;
  border: 1px solid rgba(33, 26, 23, 0.12);
  background: rgb(var(--v-theme-surface));
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: rgba(33, 26, 23, 0.6);
  cursor: pointer;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    color 160ms ease;
}
.vc__rbtn--on {
  border-color: var(--brand);
  background: var(--brand-tint);
  color: var(--brand-deep);
}
.vc__loc {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 12px 0 0;
  font-size: 12.5px;
  color: rgba(33, 26, 23, 0.5);
}

.vc__alert {
  margin-bottom: 14px;
}
.vc__submit {
  margin-top: 4px;
}
.vc__join {
  margin: 18px 0 0;
  text-align: center;
  font-size: 13.5px;
  color: rgba(33, 26, 23, 0.55);
}
.vc__join-link {
  font-weight: 800;
  color: var(--brand);
  text-decoration: none;
}

.vc__card {
  margin-bottom: 16px;
}

@media (prefers-reduced-motion: reduce) {
  .vc__rbtn {
    transition: none;
  }
}
</style>
