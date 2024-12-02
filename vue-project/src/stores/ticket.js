import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useTicketStore = defineStore('ticket', () => {
 const authStore = useAuthStore()
 const tickets = ref([])
 const isLoading = ref(false)
 const sent_tickets_count = ref(0)

 // 모든 티켓 목록을 가져오는 함수
 const fetchTickets = async () => {
   isLoading.value = true
   try {
     const response = await fetch('http://127.0.0.1:8000/api/v1/tickets/', {
       headers: {
         'Authorization': `Token ${authStore.token}`
       }
     })

     if (!response.ok) {
       throw new Error('티켓 목록 조회에 실패했습니다.')
     }

     const data = await response.json()
     tickets.value = data
   } catch (error) {
     console.error('티켓 목록 조회 중 오류:', error)
     tickets.value = []
   } finally {
     isLoading.value = false
   }
 }

 // 보낸 티켓 수를 가져오는 함수
 const fetchSentTicketsCount = async () => {
   try {
     const response = await fetch('http://127.0.0.1:8000/api/v1/tickets/count/', {
       headers: {
         'Authorization': `Token ${authStore.token}`
       }
     })

     if (!response.ok) {
       throw new Error('티켓 수 조회에 실패했습니다.')
     }

     const data = await response.json()
     sent_tickets_count.value = data.count
   } catch (error) {
     console.error('티켓 수 조회 중 오류:', error)
     sent_tickets_count.value = 0
   }
 }

 const createTicket = async (ticketData) => {
   isLoading.value = true
   try {
     const dateTime = new Date(`${ticketData.date}T${ticketData.time.split(' ')[0]}`)
     
     const formData = {
       movie: ticketData.movieId,
       content: ticketData.message,
       invite_venue: ticketData.address,
       invite_date: dateTime.toISOString(),
       inviter: ticketData.inviter,
       invitee: ticketData.invitee
     }

     const response = await fetch('http://127.0.0.1:8000/api/v1/tickets/', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Token ${authStore.token}`
       },
       body: JSON.stringify(formData)
     })

     if (!response.ok) {
       throw new Error('티켓 생성에 실패했습니다.')
     }

     const data = await response.json()
     tickets.value.unshift(data)
     
     // 티켓 생성 성공 시 티켓 목록과 카운트 업데이트
     await Promise.all([
       fetchTickets(),
       fetchSentTicketsCount()
     ])
     
     return data
   } catch (error) {
     console.error('티켓 생성 중 오류:', error)
     throw error
   } finally {
     isLoading.value = false
   }
 }

 const deleteTicket = async (ticketId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/tickets/${ticketId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${authStore.token}`
      }
    });

    if (!response.ok) {
      throw new Error('티켓 삭제에 실패했습니다.');
    }

    // 삭제 성공 시 목록과 카운트 업데이트
    await Promise.all([
      fetchTickets(),
      fetchSentTicketsCount()
    ]);

  } catch (error) {
    console.error('티켓 삭제 중 오류:', error);
    throw error;
  }
};


 return {
   tickets,
   isLoading,
   sent_tickets_count,
   createTicket,
   fetchTickets,   
   fetchSentTicketsCount,
   deleteTicket
 }
})