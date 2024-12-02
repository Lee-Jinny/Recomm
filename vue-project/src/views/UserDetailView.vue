<template>
  <div class="user-container">
    <!-- v-if로 데이터 로딩 상태 체크 -->
    <div v-if="userStore.isLoading">Loading...</div>

    <template v-else>
      <div v-if="userStore.userInfo?.nick_name" class="background-title">
        {{ userStore.userInfo.nick_name }}
      </div>
      <div v-else>닉네임 정보가 없습니다.</div>

      <div class="phone-container">
        <img src="/hand+phone.png" alt="phone frame" class="phone-frame" />
        <div class="profile-container">
          <div class="profile-content">
            <div class="profile-img">
              <!-- v-if로 이미지 존재 여부 체크 -->
              <img
                v-if="userStore.userInfo?.profile_image"
                :src="getProfileImageUrl(userStore.userInfo.profile_image)"
                alt="profile image"
                class="profile-image"
              />
            </div>

            <!-- 프로필 정보 섹션 -->
            <div v-if="userStore.userInfo" class="profile-info">
              <h2 class="nickname">{{ userStore.userInfo.username }}</h2>
              <div class="info-item">
                <p class="info-text">
                  좋아요한 영화 (<span
                    class="count-number"
                    @click="router.push('/user/saved')"
                  >
                    {{ cartStore.liked_count }} </span
                  >)
                </p>
                <p class="info-text">
                  보낸 티켓 (<span
                    class="count-number"
                    @click="router.push('/user/tickets')"
                  >
                    {{ ticketStore.sent_tickets_count }} </span
                  >)
                </p>
              </div>
              <button class="edit-button" @click="editProfile">
                프로필 수정
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useAuthStore } from "@/stores/auth";
import { useCartStore } from "@/stores/cart";
import { useTicketStore } from "@/stores/ticket";
import { useRouter } from "vue-router";

// 이미지 import
import profile1 from "@/assets/profileImg/profile1.png";
import profile2 from "@/assets/profileImg/profile2.png";
import profile3 from "@/assets/profileImg/profile3.png";
import profile4 from "@/assets/profileImg/profile4.png";
import profile5 from "@/assets/profileImg/profile5.png";

const userStore = useUserStore();
const authStore = useAuthStore();
const cartStore = useCartStore();
const ticketStore = useTicketStore();
const router = useRouter();

// 프로필 이미지 URL 매핑 함수
const getProfileImageUrl = (profileImage) => {
  const profileImages = {
    profile1: profile1,
    profile2: profile2,
    profile3: profile3,
    profile4: profile4,
    profile5: profile5,
  };
  return profileImages[profileImage];
};

const editProfile = () => {
  console.log("프로필 수정 버튼 클릭");
  router.push("/user/authen");
};

// 데이터 로드 함수
const loadUserData = async () => {
  try {
    if (authStore.token) {
      await userStore.fetchUserInfo();
      await cartStore.fetchLikedMovies();
      await ticketStore.fetchSentTicketsCount();
      console.log("User Info after fetch:", userStore.userInfo);
      console.log("Liked movies count:", cartStore.liked_count);
      console.log("Sent tickets count:", ticketStore.sent_tickets_count);
    }
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }
};

watch(
  () => authStore.token,
  async (newToken) => {
    if (newToken) {
      await loadUserData();
    }
  },
  { immediate: true } // 컴포넌트 마운트 시 즉시 실행
);

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  console.log("=== UserDetailView Mounted ===");
  console.log("Is Authenticated:", authStore.isAuthenticated);
  console.log("Current Token:", authStore.token);

  if (authStore.token) {
    await loadUserData();
  }
});
</script>

<style scoped>
.user-container {
  position: fixed; /* fixed에서 relative로 변경 */
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center; /* center에서 flex-start로 변경 */
  align-items: flex-end;
  overflow: hidden;
  /* background-color: #f5f5f5; */
  /* padding: 2rem;   */
  top: 0;
  left: 0;
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
  z-index: 1;
}

.phone-container {
  position: fixed;
  width: 590px;
  height: 1000px;
  z-index: 2;
  left: 50%;
  bottom: 0;
  transform: translate(-50%); /* 정확한 중앙 정렬 */
  margin-bottom: 2rem; /* 하단 여백 추가 */
}

.phone-frame {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 1200px;
  height: 100%;
  object-fit: contain;
  z-index: 3;
  pointer-events: none;
}

.profile-container {
  position: absolute;
  top: -25px; /* 휴대폰 상단 베젤 크기에 맞게 조정 */
  left: 55px; /* 휴대폰 좌측 베젤 크기에 맞게 조정 */
  right: 80px; /* 휴대폰 우측 베젤 크기에 맞게 조정 */
  bottom: 60px; /* 휴대폰 하단 베젤 크기에 맞게 조정 */
  background-color: #f5f5f5;
  border-radius: 50px;
  overflow: hidden;
  z-index: 2;
  display: flex;
  flex-direction: column;
  transform: scale(0.7);
  transform-origin: bottom center;
  padding: 100px 20px 20px 20px;
}

.profile-img {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center; /* 가운데 정렬 */
  width: 100%;
  margin-top: 40px; /* 프로필 이미지와의 간격 */
  text-align: center;
}

.nickname {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.info-item {
  margin: 25px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.info-text {
  font-size: 24px;
  margin: 20px 0;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.edit-button {
  margin-top: 40px;
  padding: 15px 30px;
  background-color: #4a474d;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-button:hover {
  background-color: #e4c8e0;
  color: #4a474d;
}

.count-number {
  transition: color 0.3s ease;
  cursor: pointer;
}

.count-number:hover {
  color: #e4c8e0;
}

.info-item p {
  font-size: 24px;
  margin: 20px 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.rectangle:focus,
.rectangle-2:focus,
.rectangle-3:focus,
.rectangle-4:focus:focus {
  outline: none;
  box-shadow: 0px 6px 8px #0000006b;  /* 그림자를 좀 더 진하게 */
}
</style>
