<template>
  <div class="signup">
    <div class="overlap-group-wrapper">
      <div class="logo-section">
        <img class="pinkpuffylogo" alt="Pinkpuffylogo" src="/logo/first02+logo.png" />
      </div>

      <div class="overlap-group">
        <form @submit.prevent="goToProfileSelection" class="signup-form">
          <div class="overlap">
            <div class="form-group">
              <div class="text-wrapper-3">username :</div>
              <input type="text" class="rectangle-3" v-model.trim="formData.username" required />
              <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
            </div>

            <div class="form-group">
              <div class="text-wrapper-4">nickname :</div>
              <input type="text" class="rectangle-4" v-model.trim="formData.nickName" required maxlength="10" />
              <span v-if="errors.nick_name" class="error-text">{{ errors.nick_name }}</span>
            </div>

            <div class="form-group">
              <div class="text-wrapper-5">email :</div>
              <input type="email" class="rectangle-5" v-model.trim="formData.email" required />
              <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
            </div>
          </div>

          <div class="form-group">
            <div class="text-wrapper-2">password :</div>
            <input type="password" class="rectangle-2" v-model.trim="formData.password1" required />
            <span v-if="errors.password1" class="error-text">{{ errors.password1 }}</span>
          </div>

          <div class="form-group">
            <div class="text-wrapper-6">password confirmation :</div>
            <input type="password" class="rectangle-6" v-model.trim="formData.password2" required />
            <span v-if="errors.password2" class="error-text">{{ errors.password2 }}</span>
          </div>

          <div class="form-group">
            <div class="div">security question :</div>
            <select class="ellipse-wrapper" v-model="formData.security_question" required>
              <option value="" disabled selected>보안 질문을 선택해주세요</option>
              <option v-for="question in securityQuestions" :key="question.code" :value="question.code">
                {{ question.text }}
              </option>
            </select>
            <span v-if="errors.security_question" class="error-text">{{ errors.security_question }}</span>
          </div>

          <div class="form-group">
            <div class="text-wrapper">security answer :</div>
            <input type="text" class="rectangle" v-model.trim="formData.security_answer" required />
            <span v-if="errors.security_answer" class="error-text">{{ errors.security_answer }}</span>
          </div>

          <div class="div-wrapper">
            <button type="submit" class="text-wrapper-7">NEXT</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useSignupStore } from '@/stores/signup';

const router = useRouter();
const signupStore = useSignupStore();

const securityQuestions = [
  { code: "Q1", text: "가장 좋아하는 영화 장르는?" },
  { code: "Q2", text: "가장 싫어하는 영화 등장인물은?" },
  { code: "Q3", text: "영화 속 장소 중 가장 가보고 싶은 곳은?" },
  { code: "Q4", text: "영화에 출연하게 된다면 어떤 이름을 가지고 싶나요?" },
  { code: "Q5", text: "3반 디자인팀장 이름은?" },
  { code: "Q6", text: "3반 DJ 이름은?" },
];

const formData = reactive({
  username: '',
  email: '',
  nickName: '',
  password1: '',
  password2: '',
  security_question: '',
  security_answer: '',
});

const errors = reactive({});

const validateForm = () => {
  const errors = {};
  let isValid = true;

  if (!formData.username) {
    errors.username = '사용자명을 입력해주세요.';
    isValid = false;
  }

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '올바른 이메일 주소를 입력해주세요.';
    isValid = false;
  }

  if (formData.password1 !== formData.password2) {
    errors.password2 = '비밀번호가 일치하지 않습니다.';
    isValid = false;
  }

  return { isValid, errors };
};

const goToProfileSelection = () => {
  const { isValid, errors: validationErrors } = validateForm();
  
  if (!isValid) {
    Object.assign(errors, validationErrors);
    return;
  }

  signupStore.setBasicInfo(formData);
  router.push('/signup/profile');
};
</script>

<style scoped>
.signup {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding-bottom: 120px;
}

.signup .overlap-group-wrapper {
  background-color: #ffffff;
  height: 720px;
  width: 1200px;
  position: relative;
}

.signup .overlap-group-wrapper .logo-section {
  position: absolute;
  height: auto;
  top: -20px;
  left: -20px;
}

.signup .overlap-group-wrapper .logo-section .pinkpuffylogo {
  width: 691px;
  height: 234px;
  object-fit: cover;
}

.signup .overlap-group-wrapper .overlap-group {
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  left: 459px;
  position: relative;
  top: 236px;
  width: 692px;
  height: 480px;
  padding-top: 20px;
}

.signup .overlap-group-wrapper .overlap-group .form-group {
  position: relative;
  margin-bottom: 20px;
}

.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper,
.signup .overlap-group-wrapper .overlap-group .form-group .div,
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-2,
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-3,
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-4,
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-5,
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-6 {
  color: #5b5b5b;
  font-family: "Inter-Light", Helvetica;
  font-size: 15px;
  font-weight: 300;
  letter-spacing: -0.28px;
  line-height: 22.5px;
  position: absolute;
  height: 32px;
}

/* 각 text-wrapper의 위치 지정 */
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper { left: 31px; top: 254px; }
.signup .overlap-group-wrapper .overlap-group .form-group .div { left: 31px; top: 173px; }
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-2 { left: 31px; top: 92px; }
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-3 { left: 31px; top: 11px; }
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-4 { left: 249px; top: 11px; }
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-5 { left: 465px; top: 11px; }
.signup .overlap-group-wrapper .overlap-group .form-group .text-wrapper-6 { left: 351px; top: 92px; }

.signup .overlap-group-wrapper .overlap-group .form-group .rectangle,
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-2,
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-3,
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-4,
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-5,
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-6,
.signup .overlap-group-wrapper .overlap-group .form-group .ellipse-wrapper {
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 37px;
  position: absolute;
  border: none;
  padding: 0 15px;
  color: #8b8b8b;
}

/* 각 입력 필드의 위치 지정 */
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle { left: 31px; top: 288px; width: 629px; }
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-2 { left: 31px; top: 126px; width: 309px; }
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-3 { left: 31px; top: 45px; width: 191px; }
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-4 { left: 249px; top: 45px; width: 191px; }
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-5 { left: 465px; top: 45px; width: 191px; }
.signup .overlap-group-wrapper .overlap-group .form-group .rectangle-6 { left: 351px; top: 126px; width: 309px; }
.signup .overlap-group-wrapper .overlap-group .form-group .ellipse-wrapper { left: 31px; top: 207px; width: 629px; }

.signup .overlap-group-wrapper .overlap-group .div-wrapper {
  background-color: #4a474d;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 50px;
  left: 409px;
  position: absolute;
  top: 390px;
  width: 247px;
}

.signup .overlap-group-wrapper .overlap-group .div-wrapper .text-wrapper-7 {
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: 16px;
  font-weight: 400;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.signup .overlap-group-wrapper .overlap-group .form-group .error-text {
  color: #ff0000;
  font-size: 12px;
  position: absolute;
  bottom: -18px;
  left: 31px;
}

/* Select 요소 스타일링 */
.signup .overlap-group-wrapper .overlap-group .form-group select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.signup .overlap-group-wrapper .overlap-group .form-group select::-ms-expand {
  display: none;
}

.signup .overlap-group-wrapper .overlap-group .form-group .ellipse {
  background-color: #d9d9d9;
  border-radius: 3.5px;
  height: 7px;
  position: absolute;
  right: 15px;
  top: 15px;
  width: 7px;
}

/* 포커스 및 호버 상태 */
.signup .overlap-group-wrapper .overlap-group .form-group input:focus,
.signup .overlap-group-wrapper .overlap-group .form-group select:focus {
  outline: none;
  box-shadow: 0px 6px 8px #0000006b;
}

.signup .overlap-group-wrapper .overlap-group .div-wrapper:hover {
  background-color: #e4c8e0;
}

.signup .overlap-group-wrapper .overlap-group .div-wrapper:hover .text-wrapper-7 {
  color: #4a474d;
}

.signup .overlap-group-wrapper .overlap-group .signup-form {
  width: 100%; /* 부모 크기에 맞춤 */
}

.signup .overlap-group-wrapper .overlap-group .signup-form .overlap {
  width: 100%; /* 부모 크기에 맞춤 */
  max-width: 692px; /* 최대 너비 제한 */
  height: fit-content;
}
</style>