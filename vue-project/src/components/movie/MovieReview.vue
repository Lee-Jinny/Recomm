<template>
  <div class="review-container">
     <!-- 영화제목 -->
    <div class="background-title">
      {{ movieStore.movieDetail.original_title }}
    </div>
    <!-- 휴대폰을 손에 쥐고 있는 -->
    <div class="phone-container">
      <img src="/hand+phone.png" alt="phone frame" class="phone-frame"/>

      <div class="chat-wrapper">
        <!-- 채팅 인터페이스 -->
        <div class="chat-container">
          <div class="chat-messages" ref="messageContainer">
            <div v-for="comment in comments" :key="comment.id" :class="['message', isMyMessage(comment) ? 'my-message' : 'other-message']">
              <div v-if="!isMyMessage(comment)" class="user-profile">
                <img :src="getProfileImageUrl(comment.profile_image)" alt="user profile" class="user-profile-img"/>
                <span class="name">{{ comment.nick_name }}</span>
              </div>
              <div v-else class="user-profile-mine">
                <span class="name">{{ comment.nick_name }}</span>
                <img :src="getProfileImageUrl(comment.profile_image)" alt="user profile" class="user-profile-img"/>
              </div>
              
              <div>
                <div class="bubble-container">
                  <div class="message-bubble">
                    {{ comment.content }}
                  </div>
                </div>
                <div class="time-wrapper">
                  <span class="message-time">{{ formatTime(comment.created_at) }}</span>
                </div>

              </div>
            </div>
          </div>
          <!-- 채팅 작성하는 곳 -->
          <div class="chat-input">
            <textarea v-model="newMessage" @keyup.enter.exact="sendMessage" placeholder="의견을 남겨주세요" class="message-input"></textarea>
            <button @click="sendMessage" class="send-button">전송</button>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useMovieStore } from '@/stores/movie';
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import profile1 from '@/assets/profileImg/profile1.png';
import profile2 from '@/assets/profileImg/profile2.png';
import profile3 from '@/assets/profileImg/profile3.png';
import profile4 from '@/assets/profileImg/profile4.png';
import profile5 from '@/assets/profileImg/profile5.png';

const route = useRoute()
const movieStore = useMovieStore()
const authStore = useAuthStore()

const comments = ref([])
const newMessage = ref('')
const messageContainer = ref(null)

const currentUserId = ref(null)



// 현재 사용자 정보
const fetchCurrentUser = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8000/accounts/user/', 
      {
        headers: {
          'Authorization' : `Token ${authStore.token}`
        }
      }
    )
    console.log('Current user data:', response.data)
    currentUserId.value = response.data.username
  } catch (err) {
    console.error('Failed to fetch current user:', err)
  }
}

// 댓글 작성자 확인하는 거
const isMyMessage = (comment) => {
  console.log(currentUserId.value)
  return currentUserId.value && comment && comment.username === currentUserId.value
}

// 일단 있던 댓글들 다 가져와
const fetchComments = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8000/api/v1/comments/${route.params.movieid}/`,
      {
        headers: {
          'Authorization' : `Token ${authStore.token}`
        }
      }
    )
    comments.value = response.data
    scrollToBottom()
  } catch (err) {
    console.error('댓글 불러오기 실패:', err)
  }
}

// 새로 작성된 메시지 전송
const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  try {
    const response = await axios.post(
      `http://localhost:8000/api/v1/comments/${route.params.movieid}/`,
      {content: newMessage.value},
      {headers: {
        'Authorization': `Token ${authStore.token}`,
        'Content-Type' : 'application/json',
      }}
    )
    console.log('댓글 생성 응답:', response.data)  // 응답 데이터를 확인하자
    comments.value.push(response.data)
    newMessage.value = ''
    scrollToBottom()
  } catch (err) {
    console.error('메시지 전송 실패:', err)
  }
}

// 시간 포맷팅
const formatTime = (dateString) => {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 스크롤을 항상 최신 메시지로 두기
const scrollToBottom = () => {
  setTimeout(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  }, 100)
}

// 마운트될 때 댓글 부르기
onMounted(async ()=>{
  await fetchCurrentUser()
  await fetchComments()
})

// 새 메시지 추가될때마다 스크롤
watch(comments, ()=>{
  scrollToBottom()
})

// 프로필이미지 url 주소로 바꾸자
const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return 

  const profileImages = {
    'profile1' : profile1,
    'profile2' : profile2,
    'profile3' : profile3,
    'profile4' : profile4,
    'profile5' : profile5,
  }

  // console.log(profileImages[profileImage])
  return profileImages[profileImage] || '/default-profile.png'
}
</script>

<style scoped>
.review-container {
    position: fixed;   
    min-height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;  
    align-items: flex-end;
    overflow: hidden;
    /* background-color: #f5f5f5; */
    /* padding: 2rem;  왼쪽 여백을 늘려 전체적으로 왼쪽으로 이동 */
    top: 0;
    left: 0;
  }


  .background-title {
  position: absolute;
  top: 50%;
  left: 55%;
  transform: translate(-50%, -50%);
  font-family: 'Helvetica Neue', Arial, inter; /* 더 얇은 폰트 적용 */
  font-size: 420px;
  font-weight: 200; /* 900에서 200으로 변경하여 더 얇게 */
  font-stretch: expanded; /* 글자 너비를 확장 */
  letter-spacing: -0.02em; /* 자간 조정 */
  color: black;
  white-space: pre-wrap;
  text-align: left;
  width: 100%;
  line-height: 0.9; /* 줄간격 살짝 조정 */
  /* text-transform: uppercase; */
  pointer-events: none;
  z-index: 1;
  margin-left: -5%;
}

.phone-container {
    position: fixed;    
    width: 600px;
    height: 980px;
    z-index: 2;
    left: 50% ;
    bottom: 0;
    transform: translate(-50%);  /* 정확한 중앙 정렬 */
    margin-bottom: 2rem;   /* 하단 여백 추가 */
}

.phone-frame {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 1200px;
  height: 100%;
  object-fit: contain;
  z-index: 3;
  pointer-events: none;
}

.chat-container {
  position: absolute;
  top: -100px; /* 휴대폰 상단 베젤 크기에 맞게 조정 */
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
  padding-left: 20px;
  padding-right: 20px;
}

/* 기존 채팅 관련 스타일 */
.chat-header {
  padding: 0.8rem;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.movie-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.movie-thumbnail {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.movie-info h2 {
  font-size: 1.6rem;
  margin: 0;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
}

.message {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-width: 70%;
}

.my-message {
  align-self: flex-end;
}

.other-message {
  align-self: flex-start;
}

.user-profile {
  display: flex;
  align-items: center;
  /* gap: 0.8rem; */
  gap: 0.4rem;
}

.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-profile-mine {
  align-self: flex-end;
  display: flex;
  align-items: center;
  /* gap: 0.8rem; */
  gap: 0.4rem;  
}

.user-profile-mine img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-size: 1.3rem;
  color: #666;
}

.message-bubble {
  padding: 1rem 1.3rem;
  border-radius: 1.6rem;
  /* position: relative; */
  font-size: 1.45rem;
  display: inline-block;
}

.bubble-container {
  display: flex;
  align-items: flex-end;  /* 하단 정렬 */ 
}

.my-message .message-bubble {
  background-color: #E4C8E0;
  border-top-right-radius: 0;
}

.other-message .message-bubble {
  background-color: white;
  border-top-left-radius: 0;
}

.time-wrapper {
  margin-top: 0.2rem;
  display: flex;
}

.my-message .time-wrapper {
  justify-content: flex-end;
  padding-right: 0.4rem;
}

.other-message .time-wrapper {
  justify-content: flex-start; 
  padding-left: 0.4rem;       
}

.message-time {
  font-size: 1.15rem;
  color: #666;
  position: inline-block;
  margin-left: 0.8rem;
  vertical-align: bottom;
}

.chat-input {
  padding: 2rem;
  background-color: white;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 0.8rem;
  align-items: flex-end;
  /* chat-container 마진 상쇄 */
  margin-left: -20px;
  margin-right: -20px;
  margin-bottom: 60px;
}

.message-input {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 1.6rem;
  padding: 1.3rem 1.3rem;
  resize: none;
  max-height: 120px;
  line-height: 1;
  font-size: 1.45rem;
  margin-top: -10px;
}

.send-button {
  padding: 0.6rem 1rem;
  background-color: #fee500;
  border: none;
  border-radius: 1.2rem;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #ffd900;
}

/* 스크롤바 스타일링 */
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-track {
  background-color: transparent;
}

/* 긴 제목 처리를 위한 미디어 쿼리 */
@media (max-width: 1200px) {
  .background-title {
    font-size: 200px;
  }
}

@media (max-width: 768px) {
  .background-title {
    font-size: 150px;
  }
}
</style>