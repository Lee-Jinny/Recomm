<template>
  <div class="box">
    <div class="group">
      <div class="overlap">
        <div class="username" v-if="userStore.userInfo">
          {{ userStore.userInfo.nick_name }}
        </div>

        <div class="iphone-container">
          <div class="iphone"></div>
        </div>

        <div class="ticket-display-container">
          <img
            v-if="ticketStore.tickets.length > 0"
            class="sent-ticket"
            alt="Ticket"
            :src="ticketStore.tickets[currentTicketIndex].ticket_image_url"
          />
          <div v-else class="no-ticket-message">
            저장된 티켓이 없습니다
          </div>
        </div>

        <div class="delete-button-container">
          <div
            v-if="ticketStore.tickets.length > 0"
            class="delete-text"
            @click="handleDelete(ticketStore.tickets[currentTicketIndex].id)"
          >
            ✕
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useTicketStore } from '@/stores/ticket';
import { useAuthStore } from '@/stores/auth';

const userStore = useUserStore();
const ticketStore = useTicketStore();
const authStore = useAuthStore();
const isDeleting = ref(false);
const currentTicketIndex = ref(0);

const handleScroll = () => {
  if (!ticketStore.tickets.length) return;
  currentTicketIndex.value = (currentTicketIndex.value + 1) % ticketStore.tickets.length;
};

const handleDelete = async (ticketId) => {
  if (!confirm('정말 이 티켓을 삭제하시겠습니까?')) return;
  isDeleting.value = true;
  try {
    await ticketStore.deleteTicket(ticketId);
    if (currentTicketIndex.value >= ticketStore.tickets.length - 1) {
      currentTicketIndex.value = Math.max(0, ticketStore.tickets.length - 1);
    }
  } catch (error) {
    console.error('티켓 삭제 실패:', error);
    alert('티켓 삭제에 실패했습니다.');
  } finally {
    isDeleting.value = false;
  }
};

onMounted(async () => {
  try {
    if (authStore.token) {
      await userStore.fetchUserInfo();
      await ticketStore.fetchTickets();
    }
    window.addEventListener('wheel', handleScroll);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
});

onUnmounted(() => {
  window.removeEventListener('wheel', handleScroll);
});
</script>

<style>
.box {
  height: 465px;
  width: 1438px;
  margin-top: 500px;
}

.group {
  height: 465px;
  left: 0;
  position: fixed;
  top: 0;
  width: 1440px;
}

.overlap {
  height: 465px;
  position: relative;
  width: 1438px;
}

.username {
  color: #000000;
  font-family: 'Inter-Light', Helvetica;
  font-size: 400px;
  font-weight: 300;
  height: 465px;
  left: 80px;
  letter-spacing: -9px;
  line-height: 240px;
  position: absolute;
  top: 250px;
  width: 1438px;
}

.iphone-container {
  height: 600px;
  left: 1000px;
  position: absolute;
  top: 180px;
  width: 300px;
  z-index: 10;
}

.iphone {
  background-image: url('/iPhone.png');
  background-position: center;
  background-size: cover;
  height: 800px;
  width: 400px;
  position: absolute;
  left: 50%;
  top: 70%;
  transform: translate(-50%, -50%) rotate(-90deg);
  transform-origin: center;
  border-radius: 20px;
}

.ticket-display-container {
  height: 600px;
  left: 775px;
  position: absolute;
  top: 430px;
  width:750px;
  height: 350PX;
  border-radius: 11%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background-color: #eaeaea; /* 배경색 추가 */
}

.sent-ticket {
  max-width: 250%;
  max-height: 100%;
  border-radius: 8%;
  object-fit: contain;
  transition: opacity 0.3s ease;
}

.no-ticket-message {
  color: #4A474D;
  font-size: 18px;
  text-align: center;
  padding: 10px 20px; /* 패딩 추가로 배경이 텍스트를 둘러싸도록 */
  border-radius: 8px; /* 모서리 둥글게 */
}

.delete-button-container {
  position: absolute;
  left: 1200px;
  width: 300px;
  top: 440px;
  z-index: 10;
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  padding-right: 20px; /* 오른쪽 여백 추가 */
}

.delete-text {
  color: #666;
  font-size: 24px; 
  cursor: pointer;
  transition: color 0.2s ease;
  transform: scale(1.2);
}

.delete-text:hover {
  color: #ff4444;
}
</style>