<template>
  <div class="container">
    <!-- 검색 결과가 없다면? -->
    <div v-if="movieStore.movieInfo.length === 0">
      <p>"{{ props.keyword }} " 에 대한 검색 결과가 없습니다.</p>
      <p>다른 키워드로 검색해 보세요.</p>
    </div>
    
    
    <div v-else-if="!movieStore.isLoading" class="movie-list">
      <div v-for="(movie, index) in movieStore.movieInfo" :key="movie.id"  @click="goToMovieDetail(movie.id)" class="movie-card" :style="{left: `${index *60}px`}">
        <img :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`" alt="movie.title">
        <h3>{{ movie.title }}</h3>
      </div>
    </div>  
  </div>
</template>

<script setup>
import { useMovieStore } from '@/stores/movie'
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
  keyword: {
    type: String,
    required: true
  }
})

const movieStore = useMovieStore()

// 각 영화 카드 클릭시 영화 디테일 페이지로 이동하는 함수
const goToMovieDetail = function(selectedmovieId) {
  router.push({name: 'MovieDetail', params: {movie_id : selectedmovieId}})
}

// 마운트 될때 데이터 가져오자!
onMounted(()=>{
  movieStore.fetchMoviesByKeyword(props.keyword)
})

// KEYWORD 변경될 때마다 새로운 영화 목록 가져오자!
watch(()=>
  props.keyword, (newKeyword) => {
    movieStore.fetchMoviesByKeyword(newKeyword)
  }
)
</script>

<style scoped>
.container {
  width: 100%;
  /* margin: 0 auto; */
  padding: 120px 20px;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  /* position: relative;
  height: 200px;
  margin-left: 20px; */
}

.movie-card {
  position: absolute;
  width: 300px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  padding: 10px;
  transform-origin: left center;
}

.movie-card:hover {
  transform: scale(1.05);
  z-index: 100;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.movie-card img {
  width: 100%;
  border-radius: 8px;
}

.movie-card h3 {
  margin-top: 10px;
  font-size: 1.1em;
  text-align: center;
}
</style>