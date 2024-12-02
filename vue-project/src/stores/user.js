import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  // 상태 (State)
  const userInfo = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const token = ref(localStorage.getItem('token'))
  
  // Base URL 설정
  const BASE_URL = 'http://localhost:8000/accounts/'
  
  // auth store 가져오기
  const authStore = useAuthStore()

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    isLoading.value = true
    error.value = null
  
    try {
      const response = await axios.get(`${BASE_URL}user/`, {
        headers: {
          Authorization: `Token ${token.value}`
        }
      })
      userInfo.value = response.data
      return response.data
    } catch (err) {
      console.error('Error fetching user info:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 사용자 정보 업데이트
  const updateUserInfo = async (userData) => {
    isLoading.value = true
    error.value = null

    try {
      // 서버 형식에 맞게 데이터 변환
      const serverData = {
        nick_name: userData.nick_name,
        email: userData.email,
        security_question: userData.security_question,
        security_answer: userData.security_answer
      }

      // 비밀번호가 제공된 경우에만 포함
      if (userData.password1) {
        serverData.password1 = userData.password1
        serverData.password2 = userData.password2
      }

      const response = await axios.put(`${BASE_URL}user/update/`, serverData, {
        headers: {
          Authorization: `Token ${token.value}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data) {
        userInfo.value = response.data
        return response.data
      }
    } catch (err) {
      console.error('Error updating user info:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      
      if (err.response?.data) {
        error.value = err.response.data
        throw {
          message: err.response.data.message || '사용자 정보 업데이트 실패',
          details: err.response.data
        }
      } else {
        error.value = { message: err.message }
        throw err
      }
    } finally {
      isLoading.value = false
    }
  }

   // 계정 삭제 (보안 확인 포함)
   const deleteUser= async (securityData) => {
    isLoading.value = true
    error.value = null

    try {
      // 먼저 보안 질문과 답변이 일치하는지 확인
      if (userInfo.value.security_question !== securityData.security_question ||
          userInfo.value.security_answer !== securityData.security_answer) {
        throw new Error('보안 질문 또는 답변이 일치하지 않습니다.')
      }

      // 계정 삭제 요청
      await axios.delete(`${BASE_URL}user/delete/`, {
        headers: {
          Authorization: `Token ${token.value}`
        }
      })
      
      // 상태 초기화
      userInfo.value = null
      // 토큰 제거
      authStore.clearToken()
      
      return true
    } catch (err) {
      console.error('Error deleting user account:', err)
      error.value = err.message || '계정 삭제에 실패했습니다.'
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  // 로그아웃
  const logout = () => {
    userInfo.value = null
    authStore.clearToken()
  }


  // 비밀번호 확인
  const checkPassword = async (password) => {
    try {
      const response = await axios.post(
        `${BASE_URL}user/check-password/`,
        { password },
        {
          headers: {
            Authorization: `Token ${token.value}`
          }
        }
      )
      return response.data.is_valid
    } catch (err) {
      return false
    }
  }

  return { 
    // State
    userInfo, 
    isLoading,
    error,
    
    // Actions
    fetchUserInfo,
    updateUserInfo,
    deleteUser,
    checkPassword
  }
})