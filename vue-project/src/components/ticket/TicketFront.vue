<template>
  <div class="ticket-wrapper">
    <div class="ticket" ref="fullTicketRef">
      <!-- 포스터 섹션 -->
      <div class="poster-section">
        <div class="poster-container">
          <img
            :src="posterUrl"
            alt="Movie Poster"
            class="movie-poster"
            crossorigin="anonymous"
          />
        </div>
      </div>

      <!-- 정보 섹션 -->
      <div class="info-section">
        <div class="info-container">
          <div class="ticket-details">
            <div class="cinema-name">★ MOVIE INVITATION ★</div>
            <h3 class="movie-title">{{ movieTitle }}</h3>

            <!-- 티켓 정보 입력/표시 영역 -->
            <div v-if="!isFormConfirmed" class="form-section">
              <TicketFrontForm
                @confirmed="handleConfirmed"
                @back="handleBack"
                @save="handleSave"
              />
            </div>
            <div v-else class="preview-section">
              <div class="ticket-info">
                <!-- 상단 섹션 -->
                <div class="preview-header">
                  <div class="movie-info">
                    <div class="serial-number">#{{ Math.random().toString(36).substr(2, 8).toUpperCase() }}</div>
                    <div class="admit">ADMITTED</div>
                  </div>
                </div>

                <!-- 메인 정보 섹션 -->
                <div class="preview-main">
                  <div class="preview-row">
                    <div class="label">TO</div>
                    <div class="value">{{ ticketInfo?.inviter }}</div>
                  </div>

                  <div class="preview-details">
                    <div class="detail-item">
                      <div class="label">DATE</div>
                      <div class="value">{{ ticketInfo?.date }}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">TIME</div>
                      <div class="value">{{ ticketInfo?.time }}</div>
                    </div>
                    <div class="detail-item">
                      <div class="label">LOCATION</div>
                      <div class="value location">{{ ticketInfo?.address }}</div>
                    </div>
                  </div>

                  <div v-if="ticketInfo?.message" class="message-box">
                    <div class="message-content">{{ ticketInfo?.message }}</div>
                  </div>

                  <!-- 하단 섹션 -->
                  <div class="preview-footer">
                    <div class="streaming-section" v-if="providers?.flatrate?.length">
                      <div class="label">WATCH ON</div>
                      <div class="streaming-logos">
                        <TicketFrontLogo
                          v-for="provider in providers.flatrate"
                          :key="provider.provider_id"
                          :provider="provider"
                        />
                      </div>
                    </div>
                    <div class="from-section">
                      <div class="label">FROM</div>
                      <div class="value">{{ ticketInfo?.invited }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="ticket-footer">
              <div class="copyright">ALL RIGHTS RESERVED. (C)RECOMM</div>
              <img :src="logo" alt="Logo" class="ticket-logo" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 버튼 영역 (캡처에서 제외) -->
    <div v-if="isFormConfirmed" class="button-container">
      <button @click="handleBack" class="back-button">EDIT</button>
      <button @click="captureAndSave" class="save-button" :disabled="isSaving">
        {{ isSaving ? "SAVING..." : "SAVE" }}
      </button>
      <KakaoShare
        v-if="!isSaving && ticketStore.tickets.length > 0"
        :ticket="ticketStore.tickets[0]"
      />
    </div>
  </div>
</template>


<script setup>
import { computed, ref } from "vue";
import logo from "@/assets/ticketImg/logo_3d.png";
import TicketFrontForm from "./TicketFrontForm.vue";
import TicketFrontLogo from "./TicketFrontLogo.vue";
import html2canvas from "html2canvas";
import { useTicketStore } from "@/stores/ticket";
import { useAuthStore } from "@/stores/auth";
import { useRoute } from "vue-router";
import KakaoShare from "../kakao/KakaoShare.vue";

const props = defineProps({
  movieTitle: {
    type: String,
    default: "",
  },
  posterPath: {
    type: String,
    default: "",
  },
  providers: {
    type: Object,
    default: () => ({}),
  },
});

const route = useRoute();
const ticketStore = useTicketStore();
const authStore = useAuthStore();

const fullTicketRef = ref(null);
const isFormConfirmed = ref(false);
const isSaving = ref(false);
const ticketInfo = ref(null);

const movieId = computed(() => route.params.movie_id);

const posterUrl = computed(() => {
  return props.posterPath
    ? `https://image.tmdb.org/t/p/w500${props.posterPath}`
    : "/default-poster.jpg";
});

const handleConfirmed = (data) => {
  ticketInfo.value = { ...data };
  isFormConfirmed.value = true;
};

const handleBack = () => {
  isFormConfirmed.value = false;
  ticketInfo.value = null;
};

const handleSave = (data) => {
  ticketInfo.value = { ...data };
  captureAndSave();
};

const captureAndSave = async () => {
  if (isSaving.value || !ticketInfo.value) return;

  try {
    if (!movieId.value) throw new Error("영화 ID가 필요합니다.");
    isSaving.value = true;

    if (!fullTicketRef.value) {
      throw new Error("티켓을 찾을 수 없습니다.");
    }

    // 티켓 이미지 캡처
    const canvas = await html2canvas(fullTicketRef.value, {
      useCORS: true,
      scale: 2,
      logging: false,
      backgroundColor: "#ffffff",
      allowTaint: true,
    });

    const imageBlob = await new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else throw new Error("티켓 이미지를 생성할 수 없습니다.");
      }, "image/png");
    });

    // FormData 생성
    const formData = new FormData();
    formData.append("movie", movieId.value);
    formData.append("content", ticketInfo.value.message || "");
    formData.append("invite_venue", ticketInfo.value.address);
    formData.append(
      "invite_date",
      new Date(
        `${ticketInfo.value.date}T${ticketInfo.value.time}`
      ).toISOString()
    );
    formData.append("inviter", ticketInfo.value.inviter);
    formData.append("invitee", ticketInfo.value.invited);
    formData.append("ticket_image", imageBlob, "ticket.png");

    // 서버에 데이터 전송
    const response = await fetch("http://127.0.0.1:8000/api/v1/tickets/", {
      method: "POST",
      headers: {
        Authorization: `Token ${authStore.token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("티켓 생성에 실패했습니다.");
    }

    const data = await response.json();
    ticketStore.tickets.unshift(data);
    alert("티켓이 성공적으로 저장되었습니다!");
  } catch (error) {
    console.error("티켓 저장 실패:", error);
    alert(error.message || "티켓 저장에 실패했습니다.");
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap');

.box .ticket {
  width: 1000px;
  height: 500px;
}

.ticket-wrapper {
  width: 1000px;
  height: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.ticket {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: row;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  position: relative;
}

.poster-section {
  width: 300px;
  flex-shrink: 0;
  background: #000;
}

.poster-container {
  width: 100%;
  height: 100%;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  flex: 1;
  min-width: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  background: white;
}

.info-container {
  height: 100%;
}

.ticket-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cinema-name {
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.movie-title {
  text-align: center;
  font-size: 25px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0px 15px 0 15px;
  background: white;
}

.ticket-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px dashed #ccc;
}

.movie-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative; /* 위치 조정을 위해 추가 */
}

.serial-number {
  font-family: monospace;
  font-size: 14px;
  color: #666;
  letter-spacing: 2px;
  align-self: flex-end;
}

.admit {
  font-family: 'Libre Barcode 39';
  font-size: 45px; 
  color: #686666;
  letter-spacing: 1px;
  font-weight: normal;
  align-self: flex-end; /* 바코드를 아래로 */
  margin-bottom: -20px; /* 바코드 위치 미세 조정 */
}

.preview-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.preview-row {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: flex-start;
}

.preview-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 15px;
  background: rgba(210, 153, 228, 0.1);
  border-radius: 8px;
  position: relative;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  position: relative;
}

.detail-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -7.5px;
  top: 0;
  height: 100%;
  width: 1px;
  background: #e4c8e0;
}

.label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
}

.value {
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.value.location {
  font-size: 15px;
  line-height: 1.4;
}

.preview-row .label,
.from-section .label {
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
}

.preview-row .value,
.from-section .value {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.preview-details .label,
.streaming-section .label {
  font-size: 12px;
}

.preview-details .value {
  font-size: 15px;
}

.message-box {
  background: #faf5fb;
  padding: 13px;
  border-radius: 8px;
  border-left: 3px solid #d299e4;
}

.message-content {
  font-style: italic;
  font-size: 18px;
  line-height: 1.5;
  color: #444;
}

.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  width: 100%;
  margin-bottom: 0;
}

.streaming-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.streaming-logos {
  display: flex;
  gap: 10px;
  align-items: center;
}

.streaming-logos img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.from-section {
  display: flex;
  align-items: center;
  justify-content: flex-end; 
  gap: 8px;
}

.ticket-footer {
  margin-top: 0;
  padding-top: 5px;
  border-top: 1px dashed #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  font-size: 12px;
  color: #666;
}

.ticket-logo {
  height: 30px;
  width: auto;
}

.button-container {
  position: absolute;
  bottom: 0px;
  top: 33rem;
  left: 10rem;
  right: 0;
  height: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 0 10px;
}

.back-button,
.save-button {
  font-size: 20px;
  height: 50px;
  width: 150px;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button {
  background-color: #6c757d;
}

.save-button {
  background-color: #d299e4;
}

.back-button:hover,
.save-button:hover {
  background-color: #4b4b4b;
  transform: translateY(-2px);
}

.save-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

:deep(.kakao-share-button) {
  transform: scale(0.7);
  height: 50px !important;
  width: 50px !important;
  border-radius: 10px !important;
  margin-top: 10px;
  margin-left: 10px;
}

@media (max-width: 1200px) {
  .ticket-wrapper {
    width: 100%;
    padding: 10px;
  }
}

@media (max-width: 768px) {
  .poster-section {
    width: 200px;
  }
  
  .movie-title {
    font-size: 20px;
  }

  .preview-details {
    grid-template-columns: 1fr;
  }

  .value {
    font-size: 13px;
  }

  .detail-item:not(:last-child)::after {
    display: none;
  }
}
</style>