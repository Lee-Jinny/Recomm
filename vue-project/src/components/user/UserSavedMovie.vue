<template>
  <div class="container">
    <div class="header">
      <img src="/heart_fill.png" alt="userlikedmovie" class="heart-icon" />
    </div>

    <div v-if="likedMovies.length === 0" class="no-movies">
      <p>좋아요한 영화가 없습니다.</p>
      <p>영화를 검색하고 좋아요를 눌러보세요!</p>
    </div>

    <div
      v-else
      class="scroll-container"
      ref="scrollContainer"
      @wheel.prevent="handleWheel"
      @scroll="handleScroll"
    >
      <div class="movie-list">
        <div
          v-for="(movie, index) in likedMovies"
          :key="movie.id"
          @click="goToMovieDetail(movie.tmdb_id)"
          :class="['movie-card', { hovered: hoveredIndex === index }]"
          :style="{ left: `${index * 60}px` }"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`"
            :alt="movie.title"
          />
          <h3>{{ movie.title }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const likedMovies = ref([]);
const scrollContainer = ref(null);
const hoveredIndex = ref(0);

// 마우스 휠로 가로 스크롤 제어
const handleWheel = (event) => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollLeft += event.deltaY; // 세로 휠 -> 가로 스크롤
};

// 스크롤 위치 기반으로 호버 카드 계산
const handleScroll = () => {
  if (!scrollContainer.value) return;

  const scrollLeft = scrollContainer.value.scrollLeft;
  const cardWidth = 320; // 카드 가로 폭 + 여백
  hoveredIndex.value = Math.round(scrollLeft / cardWidth);
};

// 좋아요한 영화 데이터 가져오기
const fetchLikedMoviesDetail = async () => {
  try {
    const response = await axios.get(
      'http://localhost:8000/api/v1/movies/liked-movies/',
      {
        headers: {
          Authorization: `Token ${authStore.token}`,
        },
      }
    );
    likedMovies.value = response.data;
  } catch (error) {
    console.error('좋아요한 영화 정보를 가져오는 데 실패했습니다:', error);
  }
};

const goToMovieDetail = (movieId) => {
  console.log('이동할 영화 ID:', movieId);  // movieId 확인
  if (!movieId) {
    console.error('영화 ID가 없습니다');
    return;
  }
  router.push({ 
    name: 'MovieDetail', 
    params: { movie_id: movieId } 
  });
};


onMounted(async () => {
 await fetchLikedMoviesDetail();
 document.addEventListener('scroll', () => {
   const scrollPosition = window.scrollY;
   hoveredIndex.value = Math.floor(scrollPosition / 200); // 200은 카드 간격에 따라 조정
 });
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.heart-icon {
  width: 100px;
  height: 100px;
}

.no-movies {
  text-align: center;
}

.scroll-container {
  scroll-behavior: smooth;
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  overflow-y: hidden; /* 세로 스크롤 제거 */
  margin: 0 auto;
  padding: 20px 0;
  scrollbar-width: thin;
  scrollbar-color: #e4c8e0 #f0f0f0;
}

.scroll-container::-webkit-scrollbar {
  height: 8px;
}

.scroll-container::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 4px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background-color: #e4c8e0;
  border-radius: 4px;
}

.movie-list {
  display: flex;
  position: relative;
  height: 500px;
  min-width: max-content;
  padding: 0 20px;
}

.movie-card {
  width: 300px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin-right: 20px;
  transform-origin: center center;
}

.movie-card.hovered {
  transform: scale(1.05) !important;
  z-index: 100;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.movie-card img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.movie-card h3 {
  margin-top: 10px;
  font-size: 1.1em;
  text-align: center;
  color: #333;
}

.container p {
  text-align: center;
  color: #666;
  margin: 10px 0;
}
</style>
