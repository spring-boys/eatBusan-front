<script setup>
// 초대 코드를 크게 보여주고 복사/공유. navigator.clipboard 복사 + 피드백.
// 색: 코드는 가넷, 복사 완료 배지는 허니/성공.
import { ref } from 'vue'

const props = defineProps({
  inviteCode: { type: String, required: true },
})

const copied = ref(false)
let resetTimer = null

async function copy() {
  const text = props.inviteCode
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      // clipboard API 미지원(비 HTTPS 등) 폴백
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => (copied.value = false), 1800)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <div class="ic">
    <p class="ic__label">초대 코드</p>
    <p class="ic__code">{{ inviteCode }}</p>
    <p class="ic__hint">이 코드를 친구에게 보내 같이 투표하세요.</p>
    <v-btn
      class="ic__copy"
      color="primary"
      size="large"
      rounded="lg"
      block
      :prepend-icon="copied ? 'mdi-check' : 'mdi-content-copy'"
      @click="copy"
    >
      {{ copied ? '복사됐어요' : '코드 복사' }}
    </v-btn>
  </div>
</template>

<style scoped>
.ic {
  border: 1px solid rgba(176, 35, 74, 0.18);
  background: var(--brand-tint);
  border-radius: 22px;
  padding: 24px 20px 20px;
  text-align: center;
}
.ic__label {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--brand-deep);
}
.ic__code {
  margin: 0;
  font-size: clamp(34px, 11vw, 46px);
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.1;
  color: var(--brand);
  font-variant-numeric: tabular-nums;
}
.ic__hint {
  margin: 10px 0 18px;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(33, 26, 23, 0.55);
}
.ic__copy {
  letter-spacing: -0.01em;
}
</style>
