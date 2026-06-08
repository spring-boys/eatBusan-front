<script setup>
// 로그인 페이지. 전체화면, 크롬 없음(router meta.chrome=false).
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import BrandMark from '@/shared/components/BrandMark.vue'
import { useAuthStore } from '@/features/auth/store/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { loading, error: authError } = storeToRefs(authStore)

const email = ref('')
const password = ref('')
const showPw = ref(false)
const formError = ref('')
const error = computed(() => formError.value || authError.value || '')

function getRedirectPath() {
  return typeof route.query.redirect === 'string' ? route.query.redirect : '/'
}

async function submit() {
  if (loading.value) return

  authStore.clearError()
  formError.value = ''

  if (!email.value || !password.value) {
    formError.value = '이메일과 비밀번호를 입력해주세요.'
    return
  }

  const ok = await authStore.login({
    email: email.value.trim(),
    password: password.value,
  })
  if (ok) router.replace(getRedirectPath())
}

const comingSoon = (label) => {
  authStore.clearError()
  formError.value = `${label} 로그인은 준비 중이에요.`
}
</script>

<template>
  <div class="login">
    <div class="login__inner">
      <button class="login__back" type="button" aria-label="뒤로" @click="router.back()">
        <v-icon icon="mdi-chevron-left" size="26" />
      </button>

      <div class="login__head">
        <BrandMark class="login__brand" />
        <h1 class="login__title">로그인</h1>
        <p class="login__sub">부산 맛집을 저장하고, 내 후기를 남겨보세요.</p>
      </div>

      <form class="login__form" @submit.prevent="submit">
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
          label="비밀번호"
          autocomplete="current-password"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPw ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
          hide-details="auto"
          @click:append-inner="showPw = !showPw"
        />

        <p v-if="error" class="login__error" role="alert">
          <v-icon icon="mdi-alert-circle-outline" size="16" />{{ error }}
        </p>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          rounded="lg"
          block
          :loading="loading"
          class="login__submit"
        >
          로그인
        </v-btn>
      </form>

      <div class="login__or"><span>또는</span></div>

      <div class="login__social">
        <button class="social social--kakao" type="button" @click="comingSoon('카카오')">
          <v-icon icon="mdi-chat" size="19" />카카오로 시작하기
        </button>
        <button class="social social--naver" type="button" @click="comingSoon('네이버')">
          <span class="social__n" aria-hidden="true">N</span>네이버로 시작하기
        </button>
      </div>

      <p class="login__signup">
        아직 계정이 없나요?
        <button type="button" @click="router.push('/signup')">회원가입</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login {
  min-height: 100%;
  display: flex;
  justify-content: center;
  background: rgb(var(--v-theme-background));
}
.login__inner {
  width: 100%;
  max-width: 360px;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 14px 24px calc(24px + env(safe-area-inset-bottom));
}

.login__back {
  align-self: flex-start;
  border: 0;
  background: none;
  cursor: pointer;
  padding: 4px;
  margin: 0 0 4px -8px;
  color: rgba(33, 26, 23, 0.7);
}

.login__head {
  margin-top: 28px;
  margin-bottom: 28px;
}
.login__brand {
  height: 28px;
  margin-bottom: 20px;
}
.login__title {
  margin: 0 0 6px;
  font-size: 27px;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: rgb(var(--v-theme-on-surface));
}
.login__sub {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.5;
  color: rgba(33, 26, 23, 0.55);
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.login__error {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 2px 0 0;
  font-size: 13px;
  font-weight: 600;
  color: rgb(var(--v-theme-error));
}
.login__submit {
  margin-top: 6px;
  font-weight: 800;
}

.login__or {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0 16px;
  color: rgba(33, 26, 23, 0.4);
  font-size: 12.5px;
  font-weight: 600;
}
.login__or::before,
.login__or::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(33, 26, 23, 0.1);
}

.login__social {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 50px;
  border: 0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.02em;
  transition: filter 160ms ease;
}
.social:hover {
  filter: brightness(0.97);
}
.social--kakao {
  background: #fee500;
  color: #191600;
}
.social--naver {
  background: #03c75a;
  color: #ffffff;
}
.social__n {
  font-weight: 900;
  font-size: 17px;
}

.login__signup {
  margin: auto 0 0;
  padding-top: 28px;
  text-align: center;
  font-size: 13.5px;
  color: rgba(33, 26, 23, 0.55);
}
.login__signup button {
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
  font-weight: 800;
  color: var(--brand);
  padding: 0 2px;
}

@media (prefers-reduced-motion: reduce) {
  .social {
    transition: none;
  }
}
</style>
