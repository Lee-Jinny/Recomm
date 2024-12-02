<template>
  <div class="box">
      <div class="group">
          <!-- Movie Poster -->
          <img
              class="image"
              :src="`https://image.tmdb.org/t/p/w300${movieStore.movieDetail.poster_path}`"
              :alt="movieStore.movieDetail.original_title"
          />

          <div class="group-wrapper">
              <div class="rectangle">
                  <div class="heart-container">
                      <img
                          :src="isLiked ? '/heart_fill.png' : '/heart_empty.png'"
                          @click="toggleLike"
                          class="heart-icon"
                          :alt="isLiked ? 'liked' : 'not liked'"
                      />
                  </div>

                  <!-- Movie Title -->
                  <div class="div">{{ movieStore.movieDetail.original_title }}</div>

                  <!-- Movie Genres -->
                  <p class="movie-genres">
                      <span class="text-wrapper"><br /></span>
                      <span class="span">
                          {{ movieStore.movieDetail.genres?.map((genre) => genre.name).join(', ') }}
                      </span>
                  </p>

                  <!-- Movie Overview -->
                  <p class="p">{{ movieStore.movieDetail.overview }}</p>

                  <!-- OTT Providers using TicketLogo component -->
                  <div class="ott-container">
                      <TicketLogo
                          v-for="provider in streamingProviders"
                          :key="provider.provider_id"
                          :provider="provider"
                          class="ott-logo"
                      />
                  </div>

                  <!-- Review Button -->
                  <div class="rectangle-2" @click="goToMovieReview(movieStore.movieDetail.id)">
                      <div class="text-wrapper-2">REVIEW</div>
                  </div>

                  <!-- Ticket Button -->
                  <div class="rectangle-3" @click="openModal">
                      <div class="text-wrapper-3">SENDING TICKET</div>
                  </div>
              </div>
          </div>
      </div>

      <!-- Ticket Modal -->
      <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal">
              <button @click="closeModal" class="close-btn">&times;</button>
              <TicketView v-if="selectedMovieId" :movie-id="selectedMovieId" @ticket-saved="handleTicketSaved" />
          </div>
      </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useMovieStore } from '@/stores/movie';
import { useCartStore } from '@/stores/cart';
import axios from 'axios';
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TicketView from '@/views/TicketView.vue';
import TicketLogo from '@/components/ticket/TicketFrontLogo.vue';

const movieStore = useMovieStore();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const isModalOpen = ref(false);
const selectedMovieId = ref(null);
const isSaving = ref(false);
const saveComplete = ref(false);

// 영화 데이터 저장 함수
const saveMovieToDjango = async () => {
  if (isSaving.value) return;

  isSaving.value = true;

  try {
      if (!authStore.token) {
          console.log('로그인이 필요합니다!');
          return;
      }

      const movieData = movieStore.movieDetail;
      if (!movieData) return;

      const config = {
          headers: {
              Authorization: `Token ${authStore.token}`,
          },
      };

      try {
          const checkResponse = await axios.get(
              `http://localhost:8000/api/v1/movies/check-movie/${movieData.id}/`,
              config
          );
          if (checkResponse.data.exists) {
              console.log('영화가 이미 저장되어 있습니다.');
              saveComplete.value = true;
              return;
          }
      } catch (error) {
          if (error.response?.status !== 404) {
              throw error;
          }
      }

      const response = await axios.post(
          'http://localhost:8000/api/v1/movies/save-movie/',
          {
              tmdb_id: movieData.id,
              title: movieData.title,
              overview: movieData.overview,
              poster_path: movieData.poster_path,
              genre: movieData.genres.map((g) => g.name).join(', '),
              runtime: movieData.runtime,
              actors:
                  movieData.credits?.cast
                      ?.slice(0, 5)
                      .map((actor) => actor.name)
                      .join(', ') || '',
          },
          config
      );

      console.log('영화 정보 저장 성공!', response.data);

      const watchProviders = movieData['watch/providers']?.results?.KR;
      if (watchProviders && watchProviders.flatrate && watchProviders.flatrate.length > 0) {
          for (const provider of watchProviders.flatrate) {
              await axios.post(
                  'http://localhost:8000/api/v1/movies/save-movie-ott/',
                  {
                      movie_id: response.data.id,
                      ott_name: provider.provider_name,
                      ott_link: `https://www.themoviedb.org/movie/${movieData.id}/watch`,
                  },
                  config
              );
          }
          console.log('OTT 정보 저장 성공!');
      } else {
          console.log('저장할 OTT 정보가 없습니다.');
      }

      saveComplete.value = true;
  } catch (error) {
      if (error.response?.status === 401) {
          console.error('인증 오류: 로그인이 필요합니다.');
      } else {
          console.error('영화 정보 저장 실패:', error);
      }
  } finally {
      isSaving.value = false;
  }
};

// OTT 스트리밍 제공자 computed 속성
const streamingProviders = computed(() => {
  return movieStore.movieDetail['watch/providers']?.results?.KR?.flatrate || [];
});

const goToMovieReview = async function (movieId) {
  if (!saveComplete.value && !isSaving.value) {
      await saveMovieToDjango();
  }
  router.push({
      name: 'MovieReview',
      params: { movieid: movieId },
  });
};

// 모달 관련 함수들
const openModal = () => {
  selectedMovieId.value = Number(route.params.movie_id);
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedMovieId.value = null;
};

const handleTicketSaved = () => {
  closeModal();
};

// 좋아요 관련 computed와 함수
const isLiked = computed(() => {
  return cartStore.isLiked(movieStore.movieDetail?.id);
});

const toggleLike = async () => {
  console.log('Before:', cartStore.likedMovies);

  await cartStore.toggleLike(movieStore.movieDetail.id);

  console.log('After:', cartStore.likedMovies);
};

// Lifecycle Hooks
onMounted(async () => {
  const movieId = route.params.movie_id;
  await movieStore.getMovieDetails(movieId);

  if (authStore.isAuthenticated) {
      await cartStore.checkLikeStatus(movieId);
  }

  // 2. 인증된 사용자인 경우에만 좋아요 상태 확인
  if (authStore.isAuthenticated && movieId) {
      await cartStore.checkLikeStatus(movieId);
  }

  if (!saveComplete.value && !isSaving.value) {
      await saveMovieToDjango();
  }
});

watch(
  () => movieStore.movieDetail,
  async (newMovieDetail) => {
      if (newMovieDetail) {
          await saveMovieToDjango();
      }
  }
);
</script>

<style scoped>
.box {
  height: 500px;
  width: 1200px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
}

/* 그룹 레이아웃 */
.box .group {
  height: 536px;
  left: 0;
  position: relative;
  top: 0;
  width: 1200px;
}

/* 영화 포스터 이미지 */
.box .image {
  height: 500px; 
  /* left: -2px; */
  object-fit: cover;
  position: absolute;
  top: 18px;
  width: 350px; 
  border-radius: 20px;
}

/* 오른쪽 콘텐츠 영역 */
.box .group-wrapper {
  height: 536px; 
  left: 360px; 
  position: relative;
  top: 0;
  width: 780px; 
}

/* 메인 콘텐츠 배경 */
.box .rectangle {
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 6px 8px #00000040;
  height: 500px; 
  left: 0;
  position: absolute;
  top: 18px;
  width: 780px; 
  padding: 50px; 
}


/* 영화 제목 */
.box .div {
  color: #000000;
  font-family: 'Inter-Bold', Helvetica;
  font-size: 44px;
  font-weight: 700;
  line-height: 1.2;
  position: absolute;
  top: 50px;
  left: 48px;
  width: 600px;
  overflow-wrap: break-word;
}

/* 장르 섹션 */
.box .movie-genres {
  color: #000000;
  font-family: 'Inter-Light', Helvetica;
  font-size: 20px;
  font-weight: 450;
  position: absolute;
  top: 140px;
  left: 48px;
  width: 740px;
  line-height: 1.6;
  height: auto;
  margin-bottom: 20px;
}

.box .text-wrapper {
  font-weight: 700;
  letter-spacing: -0.04px;
}

.box .span {
  font-family: 'Inter-Light', Helvetica;
  font-weight: 300;
  letter-spacing: -0.04px;
  font-size: 20px;
}

/* 줄거리 텍스트 */
.box .p {
  color: #000000;
  font-family: 'Inter-Light', Helvetica;
  font-size: 19px;
  font-weight: 300;
  line-height: 1.6;
  position: absolute;
  top: 220px;
  left: 48px;
  width: 680px;
  height: 160px;
  margin-top: 10px;
  overflow-y: auto;
  padding-right: 20px;
}

/* OTT 로고 컨테이너 */
.ott-container {
  position: absolute;
  left: 60px;
  bottom: 40px;
  display: flex;
  gap: 14px;
  align-items: center;
  width: 280px;
}

.ott-logo {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

/* 리뷰 버튼 */
.box .rectangle-2 {
  background-color: #ffffff;
  border-radius: 40px;
  box-shadow: 0px 4px 4px #00000040;
  height: 48px;
  position: absolute;
  bottom: 40px;
  left: 360px;
  width: 150px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box .rectangle-2:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 8px #00000060;
}

.box .text-wrapper-2 {
  color: #4a474d;
  font-family: 'Inter-Light', Helvetica;
  font-size: 19px;
  font-weight: 300;
  text-align: center;
  width: 100%;
}

/* 티켓 버튼 */
.box .rectangle-3 {
  background-color: #e4c8e0;
  border-radius: 40px;
  box-shadow: 0px 4px 4px #00000040;
  height: 48px;
  position: absolute;
  bottom: 40px;
  left: 520px;
  width: 230px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box .rectangle-3:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 8px #00000060;
}

.box .text-wrapper-3 {
  color: #4a474d;
  font-family: 'Inter-Light', Helvetica;
  font-size: 19px;
  font-weight: 300;
  text-align: center;
  width: 100%;
}

/* 모달 오버레이 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 모달 */
.modal {
  background-color: white;
  padding: 45px;
  border-radius: 12px;
  position: relative;
  height: 650px;
  width: 1200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column; /* 세로 방향으로 변경 */
  justify-content: flex-start; /* 상단 정렬 */
  align-items: center;
  overflow: visible; /* hidden에서 visible로 변경 */
}


/* 모달 닫기 버튼 */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0 8px;
  color: #333;
  transition: color 0.3s ease;
  z-index: 1001;
}

.close-btn:hover {
  color: #666;
}

/* 하트 아이콘 컨테이너 */
.heart-container {
  position: absolute;
  top: 50px;
  right: 40px;
  z-index: 10;
}

.heart-icon {
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.heart-icon:hover {
  transform: scale(1.1);
}

/* 클릭 효과 */
.heart-icon:active {
  transform: scale(0.95);
}


/* 스크롤바 스타일링 */
.p::-webkit-scrollbar {
width: 8px;
}

.p::-webkit-scrollbar-track {
background: #f1f1f1;
border-radius: 4px;
}

.p::-webkit-scrollbar-thumb {
background: #888;
border-radius: 4px;
}

.p::-webkit-scrollbar-thumb:hover {
background: #555;
}
</style>
