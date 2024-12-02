<template>
  <div class="user-container">
    <div v-if="userStore.userInfo?.nick_name" class="background-title">
      {{ userStore.userInfo.nick_name }}
    </div>

    <div class="profile-image-container">
      <img 
        v-if="userStore.userInfo?.profile_image"
        :src="getProfileImageUrl(userStore.userInfo.profile_image)"
        alt="profile image"
        class="profile-image"
      />
    </div>

    <div class="box">
      <div class="group">
        <div class="overlap-group">
          <form @submit.prevent="verifyUser">
            <!-- 비밀번호 -->
            <div class="text-wrapper-2">password :</div>
            <input 
              class="rectangle-3" 
              type="password" 
              v-model="formData.password"
              placeholder="비밀번호를 입력하세요"
            />

            <!-- 비밀번호 확인 -->
            <div class="text-wrapper-4">password confirmation :</div>
            <input 
              class="rectangle-4" 
              type="password" 
              v-model="formData.passwordConfirm"
              placeholder="비밀번호를 다시 입력하세요"
            />

            <!-- 보안 질문 -->
            <div class="div">security question :</div>
            <select 
              class="rectangle-2" 
              v-model="formData.securityQuestion"
            >
              <option value="" disabled>보안 질문을 선택하세요</option>
              <option v-for="(question, key) in SECURITY_QUESTIONS" 
                      :key="key" 
                      :value="key">
                {{ question }}
              </option>
            </select>

            <!-- 보안 답변 -->
            <div class="text-wrapper">security answer :</div>
            <input 
              class="rectangle" 
              type="text" 
              v-model="formData.securityAnswer"
              placeholder="보안 질문에 대한 답변을 입력하세요"
            />

            <!-- Submit Button -->
            <div class="overlap" @click="verifyUser">
              <div class="text-wrapper-6">NEXT</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import axios from 'axios'
import profile1 from '@/assets/profileImg/profile1.png'
import profile2 from '@/assets/profileImg/profile2.png'
import profile3 from '@/assets/profileImg/profile3.png'
import profile4 from '@/assets/profileImg/profile4.png'
import profile5 from '@/assets/profileImg/profile5.png'

const userStore = useUserStore()
const router = useRouter()

const getProfileImageUrl = (profileImage) => {
  const profileImages = {
    'profile1': profile1,
    'profile2': profile2,
    'profile3': profile3,
    'profile4': profile4,
    'profile5': profile5
  }
  return profileImages[profileImage]
}

const SECURITY_QUESTIONS = {
  'Q1': '가장 좋아하는 영화 장르는?',
  'Q2': '가장 싫어하는 영화 등장인물은?',
  'Q3': '영화 속 장소 중 가장 가보고 싶은 곳은?',
  'Q4': '영화에 출연하게 된다면 어떤 이름을 가지고 싶나요?',
  'Q5': '3반 디자인팀장 이름은?',
  'Q6': '3반 DJ 이름은?',
}

const formData = ref({
  password: '',
  passwordConfirm: '',
  securityQuestion: '',
  securityAnswer: ''
})

// 로딩 상태 감시
const isLoading = computed(() => userStore.isLoading)

onMounted(async () => {
  console.log('=== UserAuthen Mounted ===')
  
  try {
    await userStore.fetchUserInfo()
    
    if (userStore.error) {
      alert('사용자 정보를 불러오는데 실패했습니다.')
      return
    }

    // 보안 질문 초기값 설정
    if (userStore.userInfo?.security_question) {
      formData.value.securityQuestion = userStore.userInfo.security_question
    }

  } catch (error) {
    console.error('Failed to fetch user info:', error)
  }
})

const verifyUser = async () => {
  const BASE_URL = 'http://localhost:8000/accounts/'
  
  // 비밀번호 확인
  if (formData.value.password !== formData.value.passwordConfirm) {
    alert('비밀번호가 서로 일치하지 않습니다.')
    return
  }

  // 사용자 정보가 존재하는지 확인
  if (!userStore.userInfo) {
    alert('사용자 정보를 찾을 수 없습니다.')
    return
  }

  try {
    // 보안 질문과 답변 확인
    const isQuestionCorrect = formData.value.securityQuestion === userStore.userInfo.security_question
    const isAnswerCorrect = formData.value.securityAnswer === userStore.userInfo.security_answer

    if (!isQuestionCorrect || !isAnswerCorrect) {
      alert('보안 질문 또는 답변이 일치하지 않습니다.')
      return
    }

    // 비밀번호 검증 API 호출
    const response = await axios.post(`${BASE_URL}user/check-password/`, {
      password: formData.value.password
    }, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    })

    if (response.data.is_valid) {
      router.push('/user/update')
    } else {
      alert('비밀번호가 일치하지 않습니다.')
    }

  } catch (error) {
    console.error('Verification failed:', error)
    if (error.response?.status === 401) {
      alert('비밀번호가 일치하지 않습니다.')
    } else {
      alert('인증 과정에서 오류가 발생했습니다.')
    }
  }
}

</script>

<style scoped>
.background-title {
  position: absolute;
  top: 30%;
  left: 35%;
  transform: translate(-50%, -50%);
  font-size: 500px;
  font-weight: 550;
  color: black;
  white-space: pre-wrap;
  text-align: center;
  width: 100%;
  line-height: 1;
  /* text-transform: uppercase; */
  pointer-events: none;
  z-index: 0;
}

.profile-image-container {
  position: fixed;
  left: 15%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.profile-image {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-container {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  background-color: white;
}

.box {
  height: 461px;
  width: 692px;
  margin: 50px;
}

.box .group {
  height: 461px;
  position: relative;
  width: 706px;
}

.box .overlap-group {
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 461px;
  position: relative;
  width: 692px;
}

.box .text-wrapper {
  color: #5b5b5b;
  font-family: "Inter-Light";
  font-size: 15px;
  font-weight: 300;
  height: 32px;
  left: 31px;
  letter-spacing: -0.28px;
  line-height: 22.5px;
  position: absolute;
  top: 277px;
  width: 226px;
}

.box .div {
  color: #5b5b5b;
  font-family: "Inter-Light", Helvetica;
  font-size: 15px;
  font-weight: 300;
  height: 32px;
  left: 31px;
  letter-spacing: -0.28px;
  line-height: 22.5px;
  position: absolute;
  top: 196px;
  width: 226px;
}

.box .text-wrapper-2 {
  color: #5b5b5b;
  font-family: "Inter-Light", Helvetica;
  font-size: 15px;
  font-weight: 300;
  height: 32px;
  left: 31px;
  letter-spacing: -0.28px;
  line-height: 22.5px;
  position: absolute;
  top: 34px;
  width: 226px;
}

.box .text-wrapper-4 {
  color: #5b5b5b;
  font-family: "Inter-Light", Helvetica;
  font-size: 15px;
  font-weight: 300;
  height: 32px;
  left: 31px;
  letter-spacing: -0.28px;
  line-height: 22.5px;
  position: absolute;
  top: 115px;
  width: 226px;
}

.box .rectangle {
  border: none;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 37px;
  left: 31px;
  position: absolute;
  top: 310px;
  width: 629px;
  padding: 0 20px;
}

.box .rectangle-2 {
  border: none;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 37px;
  left: 31px;
  position: absolute;
  top: 229px;
  width: 629px;
  padding: 0 20px;
}

.box .rectangle-3 {
  border: none;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 37px;
  left: 31px;
  position: absolute;
  top: 67px;
  width: 629px;
  padding: 0 20px;
}

.box .rectangle-4 {
  border: none;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 37px;
  left: 31px;
  position: absolute;
  top: 148px;
  width: 629px;
  padding: 0 20px;
}

.box .overlap {
  background-color: #4a474d;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 50px;
  left: 409px;
  position: absolute;
  top: 374px;
  width: 247px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.box .overlap:hover {
  background-color: #E4C8E0;
}

.box .text-wrapper-6 {
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: 16px;
  font-weight: 400;
  height: 33px;
  left: 74px;
  letter-spacing: -0.30px;
  line-height: 24px;
  position: absolute;
  text-align: center;
  top: 14px;
  width: 100px;
}

.box .overlap:hover .text-wrapper-6 {
  color: #4A474D;
}

/* 입력 필드 placeholder 스타일 */
.box input::placeholder {
  color: #999;
  font-family: "Inter-Light", Helvetica;
  font-size: 14px;
}

/* 입력 필드 포커스 효과 */
.box input:focus {
  outline: none;
  box-shadow: 0px 6px 12px #00000060;
}

/* 선택 요소(select) 스타일링 */
.box select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}


.rectangle-2:focus {
  outline: none;
  box-shadow: 0px 6px 8px #0000006b;  /* 그림자를 좀 더 진하게 */
}
</style>