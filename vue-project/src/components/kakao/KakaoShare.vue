<template>
  <div>
    <button @click="shareKakao" class="kakao-share-button">
      <img 
        src="https://developers.kakao.com/assets/img/about/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png"
        alt="카카오톡 공유 보내기 버튼" 
      />
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
};

const shareKakao = () => {
  // const ticketURL = `http://localhost:5173/shared-ticket/${props.ticket.id}`
  const dateTime = formatDateTime(props.ticket.invite_date)
  
  window.Kakao.Share.sendCustom({
    templateId: 114487, 
    templateArgs: {
      title: `${props.ticket.invitee}님이 보낸 초대장`,
      inviter: props.ticket.inviter,
      invitee: props.ticket.invitee,
      venue: props.ticket.invite_venue,
      date: dateTime.date,
      time: dateTime.time,
      ticket_url: props.ticket.id,
    }
  })
}

onMounted(() => {
  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
  }
})
</script>

<style scoped>
.kakao-share-button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}
</style>