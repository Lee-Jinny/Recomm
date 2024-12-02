<template>
  <div class="profile">
    <div class="overlap-group-wrapper">

      <div class="logo-section">
        <img class="pinkpuffylogo" alt="Pinkpuffylogo" src="/logo/first02+logo.png" />
      </div>

      <div class="overlap-group">
        <div class="signup-profile-image">
          <div class="text-wrapper">프로필 이미지를 선택하세요.</div>
      
          <div class="profile-grid">
            <div
              v-for="(image, index) in profileImages"
              :key="index"
              class="profile-item"
              :class="{ selected: selectedImageIndex === index }"
              @click="selectImage(index)"
            >
              <div class="image-wrapper">
                <img :src="image.url" :alt="image.alt" class="profile-image" />
              </div>
            </div>
          </div>
      
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
      
          <div class="step-navigation">
            <button class="back-button" @click="goBack">
              <span class="arrow">←</span>
              이전으로
            </button>
            <button
              class="complete-button"
              :disabled="!selectedImageIndex"
              @click="completeSignup"
            >
              가입 완료  
            <span class="arrow">→</span>
            </button>
          </div>
        </div>

        </div>

    </div>
  </div>

</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "@/stores/login";
import { useSignupStore } from "@/stores/signup";

// 이미지 import
import profile1 from '@/assets/profileImg/profile1.png';
import profile2 from '@/assets/profileImg/profile2.png';
import profile3 from '@/assets/profileImg/profile3.png';
import profile4 from '@/assets/profileImg/profile4.png';
import profile5 from '@/assets/profileImg/profile5.png';

const router = useRouter();
const loginStore = useLoginStore();
const signupStore = useSignupStore();

const profileImages = [
  { url: profile1, alt: "Profile 1", value: "profile1" },
  { url: profile2, alt: "Profile 2", value: "profile2" },
  { url: profile3, alt: "Profile 3", value: "profile3" },
  { url: profile4, alt: "Profile 4", value: "profile4" },
  { url: profile5, alt: "Profile 5", value: "profile5" },
];

const selectedImageIndex = ref(null);
const error = ref("");

const selectImage = (index) => {
  selectedImageIndex.value = index;
  error.value = "";
};

const goBack = () => {
  router.push("/signup");
};

const completeSignup = () => {
  if (selectedImageIndex.value === null) {
    error.value = "프로필 이미지를 선택해주세요.";
    return;
  }

  const basicInfo = signupStore.getBasicInfo();
  
  // 기본 정보 확인
  if (!basicInfo) {
    error.value = "기본 정보가 없습니다. 처음부터 다시 시작해주세요.";
    router.push("/signup");
    return;
  }

  const selectedImage = profileImages[selectedImageIndex.value];

  const payload = {
    username: basicInfo.username,
    email: basicInfo.email,
    nick_name: basicInfo.nickName,
    password1: basicInfo.password1,
    password2: basicInfo.password2,
    security_question: basicInfo.security_question,
    security_answer: basicInfo.security_answer,
    profile_image: selectedImage.value,
  };

  loginStore
    .signUp(payload)
    .then(() => {
      signupStore.clearBasicInfo();
      router.push("/login");
    })
    .catch((err) => {
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          // 특정 필드 에러 처리
          if (errorData.email) {
            error.value = '이미 사용중인 이메일입니다.';
          } else if (errorData.username) {
            error.value = '이미 사용중인 사용자명입니다.';
          } else {
            error.value = Object.values(errorData)[0]?.[0] || '회원가입 중 오류가 발생했습니다.';
          }
        } else {
          error.value = errorData;
        }
      } else {
        error.value = "회원가입 중 오류가 발생했습니다.";
      }
      console.error("Signup error:", err);
    });
};
</script>

<style scoped>
.profile {
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 120px;
}

.overlap-group-wrapper {
  background-color: #ffffff;
  width: 1200px;
  height: 720px;
  position: relative;
}

.logo-section {
  position: absolute;
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
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.25);
  width: 1000px;
  height: 340px;
  position: relative;
  top: 293px;
  left: 200px;
}

.text-wrapper {
  color: #5b5b5b;
  font-family: 'Inter-Light', Helvetica;
  font-size: 20px;
  font-weight: 300;
  line-height: 22.5px;
  position: absolute;
  top: 22px;
  left: 35%;
}

.profile-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin: 2rem 0;
  padding: 20px;
  flex-wrap: wrap;
  top: 40px;
  left: 35px;
  position: absolute;
}

.profile-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.image-wrapper {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.profile-item.selected .image-wrapper {
  border-color: #e4c8e0;
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(76, 175, 80, 0.3);
}

.signup-profile-image {
  position: relative;
  height: 100%;
  width: 100%;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.error-message {
  color: #dc3545;
  text-align: center;
  margin: 1rem 0;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: #f8d7da;
}

.step-navigation {
  display: flex;
  position: absolute;
  bottom: 80px;
  left: 0;
  right: 0;
}

/* 왼쪽 버튼 */
.back-button {
  position: absolute;
  left: 60px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 140px;
  justify-content: center;
  background-color: #6c757d;
  color: white;
}

/* 오른쪽 버튼 */
.complete-button {
  position: absolute;
  right: 60px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  min-width: 140px;
  justify-content: center;
  background-color: #e4c8e0;
  color: #4A474D;
}



.back-button:hover {
  background-color: #e4c8e0;
  color:#4A474D; ;
  transform: translateX(-4px);
}


.complete-button:hover:not(:disabled) {
  background-color: #d2b3ce;  /* 약간 더 진한 색상 */
  transform: translateX(4px);
}

.complete-button:disabled {
  background-color: #cccccc;
  color: white;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .image-wrapper {
    width: 120px;
    height: 120px;
  }
  
  
  .profile-grid {
    gap: 1rem;
  }
}
</style>