<script setup>
// 회원가입 페이지 — 목업(UI only). 전체화면, 크롬 없음(router meta.chrome=false).
// TODO(AI 연동): submit 을 features/auth/store/authStore.js 의 join({email,password}) 으로 연결.
//   성공 시 자동 login 후 '/' 또는 '/login' 으로 이동.
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BrandMark from '@/shared/components/BrandMark.vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const confirm = ref('')
const showPw = ref(false)
const loading = ref(false)
const error = ref('')

function validate() {
  if (!email.value || !password.value || !confirm.value) return '모든 항목을 입력해주세요.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) return '올바른 이메일 형식이 아니에요.'
  if (password.value.length < 8) return '비밀번호는 8자 이상이어야 해요.'
  if (password.value !== confirm.value) return '비밀번호가 일치하지 않아요.'
  return ''
}

// 목업 동작: 실제 가입은 하지 않고 입력만 검증한다.
function submit() {
  error.value = ''
  const msg = validate()
  if (msg) {
    error.value = msg
    return
  }
  error.value = '목업 화면이에요. 실제 회원가입 연동은 authStore에 연결 예정입니다.'
}
</script>

<template>
  <div class="signup">
    <div class="signup__inner">
      <button class="signup__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="26" />
      </button>

      <div class="signup__head">
        <BrandMark class="signup__brand" />
        <h1 class="signup__title">회원가입</h1>
        <p class="signup__sub">이메일로 가입하고 부산 맛집을 기록해보세요.</p>
      </div>

      <form class="signup__form" @submit.prevent="submit">
        <v-text-field
          v-model="email"
          type="email"
          label="이메일"
          autocomplete="email"
          prepend-inner-icon="mdi-email-outline"
          hide-details="auto"
        />
        <v-text-field
          v-model="password"
          :type="showPw ? 'text' : 'password'"
          label="비밀번호 (8자 이상)"
          autocomplete="new-password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPw ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          hide-details="auto"
          @click:append-inner="showPw = !showPw"
        />
        <v-text-field
          v-model="confirm"
          :type="showPw ? 'text' : 'password'"
          label="비밀번호 확인"
          autocomplete="new-password"
          prepend-inner-icon="mdi-lock-check-outline"
          hide-details="auto"
        />

        <p v-if="error" class="signup__error" role="alert">
          <v-icon icon="mdi-alert-circle-outline" size="16" />{{ error }}
        </p>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          rounded="lg"
          block
          :loading="loading"
          class="signup__submit"
        >
          가입하고 시작하기
        </v-btn>
      </form>

      <p class="signup__login">
        이미 계정이 있나요?
        <button type="button" @click="router.replace('/login')">로그인</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.signup {
  min-height: 100%;
  display: flex;
  justify-content: center;
  background: rgb(var(--v-theme-background));
}
.signup__inner {
  width: 100%;
  max-width: 360px;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 14px 24px calc(24px + env(safe-area-inset-bottom));
}
.signup__back {
  align-self: flex-start;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 4px;
  margin: 0 0 4px -8px;
  color: rgba(33, 26, 23, 0.7);
}
.signup__head {
  margin-top: 24px;
  margin-bottom: 26px;
}
.signup__brand {
  height: 28px;
  margin-bottom: 20px;
}
.signup__title {
  margin: 0 0 6px;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: rgb(var(--v-theme-on-surface));
}
.signup__sub {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.5;
  color: rgba(33, 26, 23, 0.55);
}
.signup__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.signup__error {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 2px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--v-theme-error));
}
.signup__submit {
  margin-top: 6px;
  font-weight: 800;
}
.signup__login {
  margin: auto 0 0;
  padding-top: 28px;
  text-align: center;
  font-size: 13.5px;
  color: rgba(33, 26, 23, 0.55);
}
.signup__login button {
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  color: var(--brand);
  padding: 0 2px;
}
</style>
