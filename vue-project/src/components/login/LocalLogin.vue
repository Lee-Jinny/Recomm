<template>
  <div class="login">
    <div class="overlap-group-wrapper">
      <div class="logo-section">
        <img class="pinkpuffylogo" alt="Pinkpuffylogo" src="/logo/first02+logo.png" />
      </div>

      <div class="overlap-group">
        <form @submit.prevent="logIn">
          <div class="form-group">
            <div class="div">username :</div>
            <input 
              type="text" 
              class="rectangle-2"
              id="username" 
              v-model.trim="username"
              required
            >
          </div>
    
          <div class="form-group">
            <div class="text-wrapper">password :</div>
            <input 
              type="password" 
              class="rectangle"
              id="password" 
              v-model.trim="password"
              required
            >
          </div>
    
          <div class="overlap">
            <button type="submit" class="text-wrapper-2">로그인</button>
          </div>

          <p class="p">
            <span class="span">아직 회원이 아니시라면? </span>
            <router-link to="/signup" class="text-wrapper-3">회원가입</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/login';

const router = useRouter();
const loginStore = useLoginStore();

const username = ref('');
const password = ref('');

const logIn = function () {
  if (!username.value || !password.value) {
    alert('아이디와 비밀번호를 모두 입력해주세요.');
    return;
  }

  const payload = {
    username: username.value,
    password: password.value,
  };

  loginStore.logIn(payload)
    .then(() => {
      router.push('/movie');
    })
    .catch(error => {
      if (error.response?.data?.non_field_errors) {
        alert(error.response.data.non_field_errors[0]);
      } else {
        alert('로그인에 실패했습니다.');
      }
    });
};
</script>

<style scoped>
.login {
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}

.overlap-group-wrapper {
  background-color: #ffffff;
  height: 720px;
  width: 1200px;
  position: relative;
}

.logo-section {
  position: absolute;
  height: auto;
  top: -20px;
  left: -20px;
}

.pinkpuffylogo {
  width: 691px;
  height: 234px;
  object-fit: cover;
}

.overlap-group {
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 461px;
  left: 620px;
  position: relative;
  top: 214px;
  width: 531px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.text-wrapper,
.div {
  color: #5b5b5b;
  font-family: "Inter-Light", Helvetica;
  font-size: 20px;
  font-weight: 300;
  letter-spacing: -0.38px;
  line-height: 30px;
  position: absolute;
}

.div {
  height: 45px;
  left: 82px;
  top: 52px;
  width: 267px;
}

.text-wrapper {
  height: 44px;
  left: 82px;
  top: 171px;
  width: 267px;
}

.rectangle,
.rectangle-2 {
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 51px;
  position: absolute;
  width: 366px;
  border: none;
  padding: 0 15px;
  font-size: 16px;
}

.rectangle {
  left: 82px;
  top: 218px;
}

.rectangle-2 {
  left: 82px;
  top: 99px;
}

.overlap {
  background-color: #4a474d;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 50px;
  left: 82px;
  position: absolute;
  top: 335px;
  width: 366px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.text-wrapper-2 {
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: 16px;
  font-weight: 400;
  width: 100%;
  height: 100%;
  letter-spacing: -0.30px;
  line-height: 24px;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.p {
  color: #5b5b5b;
  font-family: "Inter-Light", Helvetica;
  font-size: 11px;
  font-weight: 400;
  height: 24px;
  left: 120px;
  letter-spacing: -0.21px;
  line-height: 16.5px;
  position: absolute;
  text-align: center;
  top: 400px;
  width: 292px;
}

.span {
  font-weight: 300;
  letter-spacing: -0.02px;
}

.text-wrapper-3 {
  font-family: "Inter-Bold", Helvetica;
  font-weight: 700;
  letter-spacing: -0.02px;
  text-decoration: none;
  color: #5b5b5b;
}

.text-wrapper-3:hover {
  text-decoration: underline;
}

/* 반응형 디자인 */
@media (max-width: 480px) {
  .overlap-group {
    width: 90%;
    left: 5%;
    height: auto;
    padding: 20px;
  }

  .rectangle,
  .rectangle-2,
  .overlap {
    width: 80%;
    left: 10%;
  }

  .text-wrapper,
  .div {
    font-size: 16px;
  }
}

/* form 작성 클릭시 그림자 진하게 */
.rectangle:focus,
.rectangle-2:focus {
  outline: none;
  box-shadow: 0px 6px 8px #0000006b;  
} 

.overlap:hover {
  background-color: #e4c8e0;
}

.overlap:hover .text-wrapper-2 {
  color: #4A474D;
}
</style>