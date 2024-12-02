<template>
  <div class="user-container">
    <div v-if="userStore.userInfo?.nick_name" class="background-title">
      {{ userStore.userInfo.nick_name }}
    </div>

    <div class="box">
      <div class="group">
        <div class="overlap-group">
          <div v-if="formErrors.fetch" class="error-message">
            {{ formErrors.fetch }}
          </div>
          
          <form @submit.prevent="verifyUser">
            <!-- Nickname -->
            <div class="form-group">
              <div class="text-wrapper-3">nickname :</div>
              <input
                class="rectangle-4"
                type="text"
                v-model="formData.nickname"
                :disabled="isSubmitting"
              />
              <div v-if="formErrors.nickname" class="error-message">
                {{ formErrors.nickname }}
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <div class="text-wrapper-5">email :</div>
              <input 
                class="rectangle-6" 
                type="email" 
                v-model="formData.email"
                :disabled="isSubmitting"
              />
              <div v-if="formErrors.email" class="error-message">
                {{ formErrors.email }}
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <div class="text-wrapper-2">password :</div>
              <input
                class="rectangle-3"
                type="password"
                v-model="formData.password1"
                :disabled="isSubmitting"
              />
              <div v-if="formErrors.password1" class="error-message">
                {{ formErrors.password1 }}
              </div>
            </div>

            <!-- Password Confirmation -->
            <div class="form-group">
              <div class="text-wrapper-4">password confirmation :</div>
              <input
                class="rectangle-5"
                type="password"
                v-model="formData.password2"
                :disabled="isSubmitting"
              />
              <div v-if="formErrors.password2" class="error-message">
                {{ formErrors.password2 }}
              </div>
            </div>

            <!-- Security Question -->
            <div class="form-group">
              <div class="div">security question :</div>
              <select 
                class="rectangle-2" 
                v-model="formData.securityQuestion"
                :disabled="isSubmitting"
              >
                <option value="" disabled>보안 질문을 선택하세요</option>
                <option
                  v-for="(question, key) in SECURITY_QUESTIONS"
                  :key="key"
                  :value="key"
                >
                  {{ question }}
                </option>
              </select>
              <div v-if="formErrors.securityQuestion" class="error-message">
                {{ formErrors.securityQuestion }}
              </div>
            </div>

            <!-- Security Answer -->
            <div class="form-group">
              <div class="text-wrapper">security answer :</div>
              <input
                class="rectangle"
                type="text"
                v-model="formData.securityAnswer"
                :disabled="isSubmitting"
              />
              <div v-if="formErrors.securityAnswer" class="error-message">
                {{ formErrors.securityAnswer }}
              </div>
            </div>

            <!-- Submit and Delete buttons -->
            <div class="overlap-container">
              <router-link to="/user/delete/" class="delete-link">탈퇴하기</router-link>
              <button 
                type="submit" 
                class="overlap" 
                :disabled="isSubmitting"
              >
                <div class="text-wrapper-6">
                  {{ isSubmitting ? '처리중...' : 'SUBMIT' }}
                </div>
              </button>
            </div>

            <!-- General submit error -->
            <div v-if="formErrors.submit" class="error-message submit-error">
              {{ formErrors.submit }}
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
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

// 보안 질문 목록
const SECURITY_QUESTIONS = {
  Q1: '가장 좋아하는 영화 장르는?',
  Q2: '가장 싫어하는 영화 등장인물은?',
  Q3: '영화 속 장소 중 가장 가보고 싶은 곳은?',
  Q4: '영화에 출연하게 된다면 어떤 이름을 가지고 싶나요?',
  Q5: '3반 디자인팀장 이름은?',
  Q6: '3반 DJ 이름은?',
};

// 폼 데이터
const formData = ref({
  nickname: '',
  email: '',
  password1: '',
  password2: '',
  securityQuestion: '',
  securityAnswer: '',
});

// 로딩 및 에러 상태
const isSubmitting = ref(false);
const formErrors = ref({});

// 폼 유효성 검사
const validateForm = () => {
  const errors = {};
  
  if (!formData.value.nickname?.trim()) {
    errors.nickname = '닉네임을 입력해주세요.';
  }
  
  if (!formData.value.email?.trim()) {
    errors.email = '이메일을 입력해주세요.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.';
  }
  
  if (formData.value.password1) {
    if (formData.value.password1.length < 8) {
      errors.password1 = '비밀번호는 8자 이상이어야 합니다.';
    }
    
    if (formData.value.password1 !== formData.value.password2) {
      errors.password2 = '비밀번호가 일치하지 않습니다.';
    }
  }
  
  if (!formData.value.securityQuestion) {
    errors.securityQuestion = '보안 질문을 선택해주세요.';
  }
  
  if (!formData.value.securityAnswer?.trim()) {
    errors.securityAnswer = '보안 질문 답변을 입력해주세요.';
  }
  
  formErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// 데이터 초기화
const initializeFormData = async () => {
  try {
    if (!userStore.userInfo) {
      await userStore.fetchUserInfo();
    }
    
    formData.value = {
      nickname: userStore.userInfo?.nick_name || '',
      email: userStore.userInfo?.email || '',
      password1: '',
      password2: '',
      securityQuestion: userStore.userInfo?.security_question || '',
      securityAnswer: userStore.userInfo?.security_answer || ''
    };
  } catch (error) {
    console.error('사용자 정보를 불러오는데 실패했습니다:', error);
    formErrors.value.fetch = '사용자 정보를 불러오는데 실패했습니다.';
  }
};

// 폼 제출 처리
const verifyUser = async () => {
  try {
    isSubmitting.value = true;
    
    if (!validateForm()) {
      return;
    }
    
    const updateData = {
      nick_name: formData.value.nickname,
      email: formData.value.email,
      security_question: formData.value.securityQuestion,
      security_answer: formData.value.securityAnswer
    };
    
    if (formData.value.password1) {
      updateData.password1 = formData.value.password1;
      updateData.password2 = formData.value.password2;
    }
    
    await userStore.updateUserInfo(updateData);
    
    alert('회원 정보가 성공적으로 수정되었습니다.');
    router.push('/user');
    
  } catch (error) {
    console.error('업데이트 실패:', error);
    
    if (error.response?.data) {
      formErrors.value = {
        ...formErrors.value,
        submit: error.response.data.message || '정보 업데이트에 실패했습니다.'
      };
    } else {
      formErrors.value.submit = '서버와의 통신에 실패했습니다.';
    }
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(initializeFormData);
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
  top: 115px;
  width: 226px;
}

.box .text-wrapper-3 {
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
  left: 351px;
  letter-spacing: -0.28px;
  line-height: 22.5px;
  position: absolute;
  top: 115px;
  width: 226px;
}

.box .text-wrapper-5 {
  color: #5b5b5b;
  font-family: "Inter-Light", Helvetica;
  font-size: 15px;
  font-weight: 300;
  height: 32px;
  left: 351px;
  letter-spacing: -0.28px;
  line-height: 22.5px;
  position: absolute;
  top: 34px;
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
  top: 148px;
  width: 309px;
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
  top: 67px;
  width: 309px;
  padding: 0 20px;
}

.box .rectangle-5 {
  border: none;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 37px;
  left: 351px;
  position: absolute;
  top: 148px;
  width: 309px;
  padding: 0 20px;
}

.box .rectangle-6 {
  border: none;
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 37px;
  left: 351px;
  position: absolute;
  top: 67px;
  width: 309px;
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
  border: none;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 50px;
  width: 247px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.box .overlap:hover {
  background-color: #e4c8e0;
  border: none;
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

.box .overlap:hover .text-wrapper-6 {
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

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 20px;
}

.submit-error {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}

.form-group {
  position: relative;
  margin-bottom: 16px;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.rectangle-2:focus {
  outline: none;
  box-shadow: 0px 6px 8px #0000006b;  /* 그림자를 좀 더 진하게 */
}
</style>