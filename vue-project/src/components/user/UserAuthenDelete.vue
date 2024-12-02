<template>
  <div class="user-container">
    <div v-if="userStore.userInfo?.nick_name" class="background-title">
      {{ userStore.userInfo.nick_name }}
    </div>

    <div class="box">
      <div class="group">
        <div class="overlap-group">
          <form @submit.prevent="verifyUser">
            <!-- Confirmation Checkbox -->
            <div class="confirmation-container">
              <input 
                type="checkbox" 
                id="deleteConfirm" 
                v-model="formData.confirmDelete"
                class="confirmation-checkbox"
              />
              <label for="deleteConfirm" class="confirmation-label">
                정말 탈퇴하시겠습니까?
              </label>
            </div>

            <!-- Security Question -->
            <div class="div">security question :</div>
            <select class="rectangle-2" v-model="formData.securityQuestion">
              <option value="" disabled>보안 질문을 선택하세요</option>
              <option
                v-for="(question, key) in SECURITY_QUESTIONS"
                :key="key"
                :value="key"
              >
                {{ question }}
              </option>
            </select>

            <!-- Security Answer -->
            <div class="text-wrapper">security answer :</div>
            <input
              class="rectangle"
              type="text"
              v-model="formData.securityAnswer"
              placeholder="보안 질문에 대한 답변을 입력하세요"
            />

            <!-- Submit Buttons -->
            <div class="overlap-container">
              <router-link to="/user" class="delete-link">취소하기</router-link>
              <button 
                type="submit" 
                class="overlap" 
                :disabled="!formData.confirmDelete"
              >
                <div class="text-wrapper-6">탈퇴하기</div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

const SECURITY_QUESTIONS = {
  Q1: '가장 좋아하는 영화 장르는?',
  Q2: '가장 싫어하는 영화 등장인물은?',
  Q3: '영화 속 장소 중 가장 가보고 싶은 곳은?',
  Q4: '영화에 출연하게 된다면 어떤 이름을 가지고 싶나요?',
  Q5: '3반 디자인팀장 이름은?',
  Q6: '3반 DJ 이름은?',
};

const formData = ref({
  confirmDelete: false,
  securityQuestion: '',
  securityAnswer: '',
});

onMounted(async () => {
  try {
    if (!userStore.userInfo) {
      await userStore.fetchUserInfo();
    }
    formData.value.securityQuestion = userStore.userInfo?.security_question || '';
  } catch (error) {
    console.error('Failed to fetch user info:', error);
  }
});

const verifyUser = async () => {
  if (!formData.value.confirmDelete) {
    alert('탈퇴 확인을 체크해주세요.');
    return;
  }

  if (!formData.value.securityQuestion || !formData.value.securityAnswer) {
    alert('보안 질문과 답변을 모두 입력해주세요.');
    return;
  }

  try {
    const deleteSuccess = await userStore.deleteUser({
      security_question: formData.value.securityQuestion,
      security_answer: formData.value.securityAnswer
    });

    if (deleteSuccess) {
      // 로컬스토리지 정리
      localStorage.clear()
      // 로그아웃실행
      // 이거 실행하면 authStore logout 함수가 userStore.$reset() 호출시도해서 에러남
      // await authStore.logout();
      // 페이지 이동 후 새로고침으로 모든 상태 초기화
      await router.push('/user/204/').then(()=>{
        window.location.reload()
      }, 100);
    }
  } catch (error) {
    alert(error.message || '회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
  }
};
</script>

<style scoped>
.confirmation-container {
  position: absolute;
  top: 80px;
  left: 31px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.confirmation-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-right: 4px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0px 2px 3px #00000040;
}

.confirmation-checkbox:checked {
  background-color: #e4c8e0;
  border-color: #e4c8e0;
  position: relative;
}

.confirmation-checkbox:checked::after {
  content: '✓';
  font-size: 16px;
  color: #4a474d;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.confirmation-label {
  color: #5b5b5b;
  font-family: "Inter-Light", Helvetica;
  font-size: 16px;
  font-weight: 300;
  letter-spacing: -0.28px;
}

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
  top: 260px;
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
  top: 160px;
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
  top: 293px;
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
  top: 193px;
  width: 629px;
  padding: 0 20px;
}

.overlap-container {
  position: absolute;
  top: 374px;
  left: 31px;
  width: 629px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.box .overlap {
  background-color: #4a474d;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 50px;
  width: 247px;
  cursor: pointer;
  transition: background-color 0.2s;
  border: none;
}

.box .overlap:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.box .overlap:not(:disabled):hover {
  background-color: #e4c8e0;
}

.box .text-wrapper-6 {
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: 16px;
  font-weight: 400;
  line-height: 50px;
  text-align: center;
  width: 100%;
}

.box .overlap:not(:disabled):hover .text-wrapper-6 {
  color: #4a474d;
}

.delete-link {
  color: #999;
  font-family: "Inter-Light", Helvetica;
  font-size: 14px;
  font-weight: 300;
  text-decoration: none;
}

.delete-link:hover {
  color: #666;
  text-decoration: underline;
}

.box input::placeholder {
  color: #999;
  font-family: "Inter-Light", Helvetica;
  font-size: 14px;
}

.box input:focus {
  outline: none;
  box-shadow: 0px 6px 12px #00000060;
}

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
}
</style>