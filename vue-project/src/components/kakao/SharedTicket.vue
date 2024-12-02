<template>
  <div class="shared-ticket-container">
    <div v-if="loading" class="loading">
      <span>Loading...</span>
    </div>

    <div v-else-if="ticket" class="ticket-content">
      <!-- 티켓 이미지입니다아-! -->
      <!-- 
        ticket 객체가 로드되기 전에 movie.title에 접근하려고 하면 에러가 난다! 
        옵셔널 체이닝으로 해결해 보자.
       -->
      <img 
        :src="ticket.ticket_image" 
        :alt="ticket.movie?.title || '티켓 이미지'" 
        class="ticket-image"
      >

      <!-- 액션 추가! -->
      <div class="action-buttons">
        <!-- 티켓 이미지 저장하기 -->
        <button @click="downloadTicket" class="action-button">
          Save Ticket
        </button>
        <!-- 캘린더에 추가하기 -->
        <button @click="addToCalendar" class="action-button">
          Add Calendar
        </button>
      </div>
    </div>

    <div v-else class="error">
      <p>티켓을 찾을 수 없습니다.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const ticket = ref(null)
const loading = ref(true)

// 티켓 정보 가져오기
const fetchTicket = async () => {
  try {
    // django로 요청 전달
    const response = await axios.get(`http://localhost:8000/api/v1/tickets/${route.params.id}/`)
    console.log('API Response: ', response) // 전체 응답 확인
    ticket.value = response.data
    console.log('Fetched ticket data: ', ticket.value) // 티켓 데이터 확인용 로그
  } catch (error) {
    console.error('티켓 로딩 실패:', error)
    if (error.response) {
      console.log('Error responser: ', error.response.data) // 에러 응답 확인
    }
  } finally {
    loading.value = false
  }
}



// 티켓 이미지 다운로드
const downloadTicket = async () => {
  try {
    if (!ticket.value?.ticket_image) {
      throw new Error('티켓 이미지를 찾을 수 없습니다.')
    }

    // 티켓 이미지 url로부터 데이터 가져오기
    const response = await fetch(ticket.value.ticket_image)
    // 응답을 Blob(binary Large Object) 형태로 변환
    const blob = await response.blob()
    // Blob으로부터 임시 URL 생성
    const url = window.URL.createObjectURL(blob)
    // 가상의 a 태그 생성
    const a = document.createElement('a')
    // 다운로드 속성 설정
    a.href = url
    a.download = `${ticket.value.inviter}가 보낸 ${ticket.value.movie?.title || '영화'} 티켓.png`
    document.body.appendChild(a)
    // 클릭 이벤트로 다운로드 동작
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  } catch (error) {
    console.error('티켓 다운로드 실패:', error)
  }
}

// 구글 캘린더에 추가
const addToCalendar = () => {
  try {
    // 날짜 문자열 파싱 전에 로그로 확인
    console.log('Raw invite_date:', ticket.value.invite_date);

    // 날짜 문자열에서 timezone 부분 제거하고 파싱
    const dateStr = ticket.value.invite_date.split('+')[0];
    const eventDate = new Date(dateStr);
    
    // 날짜 유효성 검사
    if (isNaN(eventDate.getTime())) {
      console.error('Invalid date:', eventDate);
      alert('유효하지 않은 날짜입니다.');
      return;
    }

    // runtime이 없을 경우 기본값 2시간(120분) 설정
    const movieDuration = (ticket.value.movie?.runtime || 120) * 60 * 1000;
    const endDate = new Date(eventDate.getTime() + movieDuration);

    // 날짜를 YYYYMMDDTHHMMSS 형식으로 변환
    const formatDateForCalendar = (date) => {
      return date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0') + 'T' +
        String(date.getHours()).padStart(2, '0') +
        String(date.getMinutes()).padStart(2, '0') +
        String(date.getSeconds()).padStart(2, '0');
    };

    const startStr = formatDateForCalendar(eventDate);
    const endStr = formatDateForCalendar(endDate);

    // URL 인코딩 전 데이터 유효성 검사
    const movieTitle = ticket.value.movie_title || '영화';
    const inviter = ticket.value.inviter || '초대자';
    const venue = ticket.value.invite_venue || '장소 미정';
    const runtime = ticket.value.movie?.runtime || 120;

    const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(`"${movieTitle}" 보기`)}` +
      `&details=${encodeURIComponent(
        `${inviter}님의 영화 초대\n` +
        `🎬 러닝타임: ${runtime}분\n` +
        `📍 장소: ${venue}`
      )}` +
      `&location=${encodeURIComponent(venue)}` +
      `&dates=${startStr}/${endStr}`;

    window.open(calendarUrl, '_blank');
  } catch (error) {
    console.error('캘린더 추가 중 오류 발생:', error);
    alert('캘린더 추가 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

onMounted(()=>{
  fetchTicket()
})

</script>

<style scoped>
.shared-ticket-container {
  margin-top: 7rem;
  max-width: 1100px;
  /* margin: 2rem auto; */
  padding: 0 1rem;
}

.ticket-image {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  display: block;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  transform: scale(1.3);
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.action-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: #E4C8E0;
  color: #4A474D;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #E4C8E0;
}

.loading, .error {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>