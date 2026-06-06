// 인증 전역 상태 (Pinia). 비동기 호출은 loading/error 를 함께 관리한다.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authApi from '../api/authApi'
import { getAccessToken, clearAccessToken } from '@/shared/api/client'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(getAccessToken())
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value)

  /** 회원가입 */
  async function join(payload) {
    loading.value = true
    error.value = null
    try {
      await authApi.join(payload)
      return true
    } catch (e) {
      error.value = e?.response?.status === 409 ? '이미 가입된 이메일이에요.' : '회원가입에 실패했어요.'
      return false
    } finally {
      loading.value = false
    }
  }

  /** 로그인 */
  async function login(payload) {
    loading.value = true
    error.value = null
    try {
      accessToken.value = await authApi.login(payload)
      return true
    } catch (e) {
      error.value = e?.response?.status === 401 ? '이메일 또는 비밀번호가 올바르지 않아요.' : '로그인에 실패했어요.'
      return false
    } finally {
      loading.value = false
    }
  }

  /** 로그아웃 (실패해도 로컬 토큰은 비운다) */
  async function logout() {
    try {
      await authApi.logout()
    } finally {
      accessToken.value = null
      clearAccessToken()
    }
  }

  return { accessToken, loading, error, isAuthenticated, join, login, logout }
})
