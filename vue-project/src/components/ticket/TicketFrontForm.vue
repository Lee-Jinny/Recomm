<template>
  <div class="form-wrapper">
    <!-- 폼 작성 -->
    <div v-if="!isConfirmed" class="form-container">
      <div class="form-group">
        <label class="form-label">DATE & TIME</label>
        <div class="input-row">
          <input
            type="date"
            v-model="ticketData.date"
            class="input-field"
            required
          />
          <input
            type="text"
            v-model="ticketData.time"
            class="input-field"
            placeholder="Time (e.g., 10:00 - 12:36)"
            required
          />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">LOCATION</label>
        <input
          type="text"
          v-model="ticketData.address"
          class="input-field"
          placeholder="Enter Address"
          maxlength="200"
          required
        />
      </div>

      <div class="form-group">
        <div class="input-row">
          <div class="input-group">
            <label class="form-label">TO</label>
            <input
              type="text"
              v-model="ticketData.invited"
              class="input-field"
              placeholder="Recipient name"
              maxlength="30"
              required
            />
          </div>
          <div class="input-group">
            <label class="form-label">FROM</label>
            <input
              type="text"
              v-model="ticketData.inviter"
              class="input-field"
              placeholder="Your name"
              maxlength="30"
              required
            />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">MESSAGE</label>
        <textarea
          v-model="ticketData.message"
          class="message-field"
          placeholder="Write a short message..."
          rows="3"
        ></textarea>
      </div>

      <div class="form-footer">
        <button
          @click="handleConfirm"
          class="next-button"
          :disabled="!isFormValid"
        >
          NEXT
        </button>
      </div>
    </div>

    <!-- 티켓 확인 -->
    <div v-else class="preview-container">
      <div class="ticket-info">
        <div class="preview-group">
          <label class="preview-label">TO</label>
          <div class="preview-value">{{ ticketData.inviter }}</div>
        </div>

        <div class="preview-details">
          <div class="preview-group">
            <label class="preview-label">DATE</label>
            <div class="preview-value">{{ ticketData.date }}</div>
          </div>
          <div class="preview-group">
            <label class="preview-label">TIME</label>
            <div class="preview-value">{{ ticketData.time }}</div>
          </div>
          <div class="preview-group">
            <label class="preview-label">LOCATION</label>
            <div class="preview-value">{{ ticketData.address }}</div>
          </div>
        </div>

        <div v-if="ticketData.message" class="preview-group">
          <label class="preview-label">MESSAGE</label>
          <div class="preview-message">{{ ticketData.message }}</div>
        </div>

        <div class="preview-footer">
          <slot name="streaming-logo"></slot>
          <div class="preview-group">
            <label class="preview-label">FROM</label>
            <div class="preview-value">{{ ticketData.invited }}</div>
          </div>
        </div>
      </div>

      <div class="button-container">
        <button @click="handleBack" class="back-button">BACK</button>
        <button @click="$emit('save', ticketData)" class="save-button">
          SAVE
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(['save', 'confirmed', 'back']);

const isConfirmed = ref(false);

const ticketData = ref({
  date: "",
  time: "",
  address: "",
  inviter: "",
  invited: "",
  message: "",
});

const isFormValid = computed(() => {
  return (
    ticketData.value.date &&
    ticketData.value.time &&
    ticketData.value.address &&
    ticketData.value.inviter &&
    ticketData.value.invited
  );
});

const handleConfirm = () => {
  if (!isFormValid.value) {
    alert("모든 필수 정보를 입력해주세요.");
    return;
  }

  isConfirmed.value = true;
  emit('confirmed', ticketData.value);
};

const handleBack = () => {
  isConfirmed.value = false;
  emit('back');
};
</script>

<style scoped>
.form-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  max-height: 320px; /* 전체 높이 제한 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 */
}

/* 입력 폼 스타일 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 간격 축소 */
  padding: 0 4px; /* 좌우 여백 추가 */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px; /* 간격 축소 */
}

.form-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
}

.input-row {
  display: flex;
  gap: 12px;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-field {
  padding: 7px 10px; /* 패딩 축소 */
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  width: 100%;
   height: 32px; /* 높이 고정 */
  background: #fff;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #d299e4;
  box-shadow: 0 0 0 2px rgba(210, 153, 228, 0.1);
}

.message-field {
  width: 100%;
  height: 50px;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 13px;
  resize: none;
  font-family: inherit;
  line-height: 1.5;
  background: #fff;
  transition: all 0.3s ease;
}

.message-field:focus {
  outline: none;
  border-color: #d299e4;
  box-shadow: 0 0 0 2px rgba(210, 153, 228, 0.1);
}

/* 미리보기 스타일 */
.preview-container {
  height: 100%;
  max-height: 320px;
  overflow-y: auto;
}

.ticket-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px; 
}

.preview-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
}

.preview-value {
  padding: 6px 12px; /* 패딩 축소 */
  font-size: 13px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  color: #333;
}

.preview-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.preview-message {
  padding: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  font-size: 13px;
  max-height: 80px;
  overflow-y: auto;
  line-height: 1.5;
  color: #444;
  font-style: italic;
}

.preview-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

/* 버튼 스타일 */
.form-footer {
  margin-top: 0;
  padding-top: 0PX;
  display: flex;
  justify-content: center;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 20px;
  margin-top: auto;
}

.next-button,
.back-button,
.save-button {
  padding: 6px 20px;
  font-size: 13px;
  height: 32px;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.next-button,
.save-button {
  background-color: #d299e4;
}

.back-button {
  background-color: #6c757d;
}

.next-button:hover,
.save-button:hover,
.back-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.next-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.preview-details {
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}



.form-label,
.preview-label {
  font-size: 11px;
  margin-bottom: 2px;
}

/* 스트리밍 로고 섹션 */
.streaming-section {
  flex: 1;
  display: flex;
  align-items: center;
}

.streaming-logos {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
</style>