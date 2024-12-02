<template>
  <div class="firstdescrip">
    <div class="content-container">

      <div class="logo-section">
        <img class="pinkpuffylogo" alt="Pinkpuffylogo" src="/logo/first02+logo.png" />
      </div>
      
      <div class="title-section">
        <div class="title-line">Hi! We are representative</div>
        <div class="service-line">
          <span class="movie-text">movie</span>
          <img class="logo-black" alt="Logo black" src="/logo/logo.png" />
          <span class="endation-text">endation service</span>
        </div>
        <div class="location-line">
          <span>based in Korea.</span>
          <img class="tryit-img" alt="Try it" src="/tryit.png" @click="goToMovie" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const goToMovie = function() {
  router.push({name: 'MovieView'})
}
</script>

<style>
.firstdescrip {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 120px;
}

.content-container {
  width: 100%;
  max-width: 1380px;
  min-height: 720px;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 147px; /* 왼쪽 여백 */
}

.logo-section {
  position: absolute;
  height: auto;
  top: -20px; /* 살짝 위로 올려서 잘리게 */
  left: -20px; /* 살짝 왼쪽으로 이동해서 잘리게 */
}

.pinkpuffylogo {
  width: 691px;
  height: 234px;
  object-fit: cover;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 400px; 
}

.title-line {
  font-family: "Inter-Regular", Helvetica;
  font-size: 64px;
  font-weight: 400;
  white-space: nowrap;
}

.service-line {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.movie-text {
  font-family: "Inter-Regular", Helvetica;
  font-size: 64px;
  font-weight: 400;
  margin-left: -56px; /* movie 텍스트를 더 왼쪽으로 */
}

.logo-black {
  height: 76px;
  width: 279px;
  object-fit: cover;
  margin-right: -1.5rem;
}

.endation-text {
  font-family: "Inter-Regular", Helvetica;
  font-size: 64px;
  font-weight: 400;
}

.location-line {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-family: "Inter-Regular", Helvetica;
  font-size: 64px;
  font-weight: 400;
  margin-left: 344px; /* based in Korea 텍스트 위치 조정 */
}


@keyframes floatRotate {
  0% {
    transform: rotate(0deg) translate(0, 0);
  }
  25% {
    transform: rotate(90deg) translate(5px, 5px);
  }
  50% {
    transform: rotate(180deg) translate(0, 10px);
  }
  75% {
    transform: rotate(270deg) translate(-5px, 5px);
  }
  100% {
    transform: rotate(360deg) translate(0, 0);
  }
}

.tryit-img {
  height: 80px;
  width: 179px;
  object-fit: cover;
  margin-left: 2rem;
  animation: floatRotate 8s infinite linear; /* 8초 동안 무한 반복 */
}

/* 호버 시 애니메이션 일시 정지 */
.tryit-img:hover {
  animation-play-state: paused;
}

/* 화면 크기 줄어들때 텍스트 아래로 내려가! */
@media (max-width: 768px) {
  .title-section {
    margin-top: 800px;
  }
}

@media (max-width: 576px) {
  .title-section {
    margin-top: 320px;
  }
}

/* 더 작은 모바일 화면용 */
@media (max-width: 480px) {
  .title-section {
    margin-top: 350px;
  }
}

@media (max-width: 1024px) {
  .content-container {
    padding: 0 1rem;
  }
  
  .title-section {
    margin-top: 250px;
  }

  .logo-section {
    position: absolute;
    top: -20px;
    left: -20px;
    width: 100%;
    height: 350px;
    overflow: visible; /* 로고가 잘리지 않도록 설정 */
    z-index: 1; /* 다른 컨텐츠 위에 표시 */
  }

  .pinkpuffylogo {
    width: 100%;
    /* max-width: 856px; */
    height: 100%;
    max-height: 100%;
    object-fit: contain; /* cover 대신 contain으로 변경 */
    transform: scale(1.05); /* 약간 더 크게 표시 */
    transform-origin: top left; /* 왼쪽 상단 기준으로 크기 조정 */
  }

  .movie-text {
    margin-left: 0;
  }

  .location-line {
    margin-left: 0;
  }

  .footer-section {
    margin-left: 0;
  }

  .title-line, .movie-text, .endation-text, .location-line {
    font-size: clamp(2rem, 5vw, 64px);
  }
}
</style>