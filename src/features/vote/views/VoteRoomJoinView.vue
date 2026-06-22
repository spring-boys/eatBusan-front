<script setup>
// 코드로 투표방 입장 — 코드 입력 → store.joinByCode → 성공 시 /vote/{roomPublicId} 이동.
// 유효하지 않은 코드(404, INVALID_INVITE_CODE)는 안내 문구로 처리(store.error).
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useVoteRoomStore } from '../store/voteRoomStore'

const router = useRouter()
const store = useVoteRoomStore()
const { loading, error } = storeToRefs(store)

const code = ref('')

onMounted(() => {
  store.error = null
})

// 코드는 대문자 영숫자 — 입력 즉시 정규화
function onInput(val) {
  code.value = (val || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 8)
}

async function join() {
  const c = code.value.trim()
  if (!c || loading.value) return
  const publicId = await store.joinByCode(c)
  if (publicId) router.push(`/vote/${publicId}`)
}
</script>

<template>
  <div class="vj">
    <header class="vj__hd">
      <h1 class="vj__title">코드로 입장</h1>
      <p class="vj__sub">친구가 보낸 초대 코드를 입력하세요.</p>
    </header>

    <v-text-field
      :model-value="code"
      class="vj__input"
      placeholder="초대 코드"
      variant="solo-filled"
      flat
      rounded="lg"
      hide-details
      autocapitalize="characters"
      autocomplete="off"
      @update:model-value="onInput"
      @keyup.enter="join"
    />

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      density="comfortable"
      rounded="lg"
      class="vj__alert"
      :text="error"
    />

    <v-btn
      color="primary"
      size="large"
      rounded="lg"
      block
      class="vj__submit"
      :loading="loading"
      :disabled="!code.trim()"
      @click="join"
    >
      입장하기
    </v-btn>

    <p class="vj__create">
      방을 만들고 싶나요?
      <router-link to="/vote/new" class="vj__create-link">투표방 만들기</router-link>
    </p>
  </div>
</template>

<style scoped>
.vj {
  padding: 8px 2px 24px;
}
.vj__hd {
  margin-bottom: 22px;
}
.vj__title {
  margin: 0 0 8px;
  font-size: clamp(26px, 8vw, 32px);
  font-weight: 800;
  letter-spacing: -0.045em;
  color: rgb(var(--v-theme-on-surface));
}
.vj__sub {
  margin: 0;
  font-size: 14px;
  color: rgba(33, 26, 23, 0.55);
}
.vj__input {
  margin-bottom: 14px;
}
.vj__input :deep(input) {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.vj__alert {
  margin-bottom: 14px;
}
.vj__create {
  margin: 18px 0 0;
  text-align: center;
  font-size: 13.5px;
  color: rgba(33, 26, 23, 0.55);
}
.vj__create-link {
  font-weight: 800;
  color: var(--brand);
  text-decoration: none;
}
</style>
