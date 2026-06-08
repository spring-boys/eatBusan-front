// 인증 전역 상태 (Pinia). 비동기 호출은 loading/error 를 함께 관리한다.
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as authApi from '../api/authApi'
import { getAccessToken, clearAccessToken } from '@/shared/api/client'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(getAccessToken())
  const memberEmail = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value)
  const displayName = computed(() => memberEmail.value?.split('@')[0] || '회원')

  function setMemberEmail(email) {
    memberEmail.value = typeof email === 'string' && email ? email : null
  }

  function clearError() {
    error.value = null
  }

  async function loadMyInfo() {
    const data = await authApi.fetchMyInfo()
    setMemberEmail(data?.email)
    return data
  }

  /** 회원가입 */
  async function join(payload) {
    loading.value = true
    error.value = null
    try {
      await authApi.join(payload)
      return true
    } catch (e) {
      const code = e?.response?.data?.code
      error.value =
        e?.response?.status === 409 || code === 'MEMBER_DUPLICATE'
          ? '이미 가입된 이메일이에요.'
          : '회원가입에 실패했어요.'
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
      try {
        await loadMyInfo()
      } catch {
        setMemberEmail(payload.email)
      }
      return true
    } catch (e) {
      error.value =
        e?.response?.status === 401
          ? '이메일 또는 비밀번호가 올바르지 않아요.'
          : '로그인에 실패했어요.'
      return false
    } finally {
      loading.value = false
    }
  }

  /** 새로고침 후 refresh 쿠키로 런타임 로그인 상태 복구 */
  async function restoreSession() {
    try {
      if (!accessToken.value) {
        accessToken.value = await authApi.refresh()
      }
      await loadMyInfo()
      return true
    } catch {
      accessToken.value = null
      setMemberEmail(null)
      clearAccessToken()
      return false
    }
  }

  /** 로그아웃 (실패해도 런타임 토큰은 비운다) */
  async function logout() {
    try {
      await authApi.logout()
    } finally {
      accessToken.value = null
      setMemberEmail(null)
      clearAccessToken()
    }
  }

  return {
    accessToken,
    memberEmail,
    displayName,
    loading,
    error,
    isAuthenticated,
    clearError,
    loadMyInfo,
    restoreSession,
    join,
    login,
    logout,
  }
})
