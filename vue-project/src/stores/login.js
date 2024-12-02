// src/stores/login.js
import { defineStore } from 'pinia'
import api from '@/api/axios'  // 위에서 만든 api 파일 import
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export const useLoginStore = defineStore('login', () => {
    const token = ref(null)
    const isLogin = computed(() => {
        return token.value !== null
    })
    const router = useRouter()
    const authStore = useAuthStore()
    
    const signUp = function (payload) {
        return api.post('/accounts/auth/register/', {
            username: payload.username,
            email: payload.email,
            nick_name: payload.nick_name,
            password1: payload.password1,
            password2: payload.password2,
            security_question: payload.security_question,
            security_answer: payload.security_answer,
            profile_image: payload.profile_image || ''
        })
        .then(response => {
            return logIn({ 
                username: payload.username, 
                password: payload.password1 
            })
        })
        .catch(error => {
            console.error('회원가입 실패:', error.response?.data || error.message);
            throw error; 
        });
    }

    const logIn = function (payload) {
        return api.post('/accounts/auth/login/', {
            username: payload.username,
            password: payload.password
        })
        .then(response => {
            token.value = response.data.key
            authStore.setToken(response.data.key)
            localStorage.setItem('token', response.data.key)
            console.log('로그인 성공')
            router.push({ name: 'MovieView' })
            console.log(response.data)
        })
        .catch(error => {
            console.error('로그인 실패:', error.response?.data || error.message);
            throw error;
        });
    }

    const logOut = function () {
        // API 호출하여 서버측 로그아웃 처리
        return api.post('/accounts/auth/logout/')
            .then(() => {
                // 성공적으로 로그아웃되면
                token.value = null
                authStore.clearToken()
                localStorage.removeItem('token') // localStorage도 직접 제거
                router.push({name: 'LoginView'})
                console.log('로그아웃 성공')
            })
            .catch(error => {
                console.error('로그아웃 실패:', error)
                // 실패하더라도 프론트엔드 상태는 초기화
                token.value = null
                authStore.clearToken()
                localStorage.removeItem('token')
                router.push({name: 'LoginView'})
            })
    }

    return { token, isLogin, signUp, logIn, logOut }
}, { persist: true })