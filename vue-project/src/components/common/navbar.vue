<template>
  <div class="nav-container">
    <div class="nav-left">
      <span @click="goToMovieView" class="nav-button">HOME</span>
    </div>

    <div class="nav-center">
      <form @submit.prevent="goToMovieList(keyword)" >
        <input type="text" v-model="keyword" placeholder="어떤 영화를 찾고 계신가요?">
        <button type="submit">검색</button>
      </form>
    </div>

    <div class="nav-right">
      <span v-show="!isLogIn" @click="goToSignUp" class="nav-button">SIGN UP</span>
      <span v-show="!isLogIn" @click="goToLogin"  class="nav-button">LOG IN</span>
      <span v-show="isLogIn" @click="goToAccount" class="nav-button">MY</span>
      <span v-show="isLogIn" @click="handleLogout"  class="nav-button">LOG OUT</span>
    </div>
  </div>
</template>

<script setup>
import { useLoginStore } from '@/stores/login';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore()
const router = useRouter()
const keyword = ref('')


// 로그인된 사용자인지 확인
const isLogIn = computed(() => loginStore.isLogin)

const goToMovieList = function(selectedWord) {
  if (!selectedWord) {
    alert('검색어를 입력하세요!')
    return
  }
  router.push({name:'MovieList', params:{keyword: selectedWord}})
}


const goToMovieView = function() {
  router.push({name: 'MovieView'})
}

const goToAccount = function() {
  router.push({name: 'UserDetailView'})
}

const goToSignUp = function() {
  router.push({name: 'SignupBasic'})
}

const goToLogin = function() {
  router.push({name: 'LoginView'})
}

const handleLogout = function() {
  loginStore.logOut()
}

</script>

<style scoped>
.nav-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2px;
  padding: 20px;
  height: 80px;
  align-items: center;
  position: fixed; 
  top: 0; 
  left: 0; 
  right: 0; 
  /* background-color: white;  */
  z-index: 1000; 
  max-width: 1380px; 
  margin: 0 auto; 
}

.nav-left {

}
.nav-right {
  display: flex;
  gap: 8px
}

.nav-center {
  width: 500px;
  height: 61.5px;
  border-radius: 30px;
  border: 1px solid black;
  background-color: #F5F5F5;
  padding: 8px 16px;
  font-size: 36px;
  display: flex;
  align-items: center;
}

.nav-center > * {  
  width: 100%;
  height: 100%;
  padding: 8px 36px;
  border-radius: 30px;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-center > *:hover {
  background-attachment: rgb(255, 238, 247);
  transform: scale(1.2);
}

.nav-center input {
  border: none;
  outline: none;
  font-size: 16px;
  width: 300px;
  background: transparent;
}

.nav-center button {
  border: 1px solid black;
  border-radius: 30px;
  background-color: white;
  cursor: pointer;
  padding: 4px 12px;  /* padding 값 축소 */
  font-size: 16px;
  min-width: 60px;    /* width: fit-content 대신 min-width 사용 */
  height: 32px;       /* 높이 명시적 지정 */
  display: flex;      /* flexbox 사용 */
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-center button:hover {
  background-color: rgb(255, 238, 247);
  transform: scale(1.1);
}

.nav-button {
  border: 1px solid black;
  padding: 8px 36px;
  border-radius: 30px;
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  background-color: white;
}

.nav-button:hover {
  background-color: rgb(255, 238, 247);
  transform: scale(1.2);
}
</style>