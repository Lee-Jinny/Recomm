import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from './auth';

export const useCartStore = defineStore('cart', () => {
  const likedMovies = ref([]);
  const isProcessing = ref(false);
  const authStore = useAuthStore();

  const isLiked = (movieId) => {
    return likedMovies.value.includes(Number(movieId));
  };

  const liked_count = computed(() => {
    return likedMovies.value.length;
  });

  const toggleLike = async (movieId) => {
    if (isProcessing.value || !authStore.isAuthenticated) return;

    isProcessing.value = true;
    const numericMovieId = Number(movieId);

    try {
      const config = {
        headers: {
          Authorization: `Token ${authStore.token}`,
        },
      };

      const response = await axios.post(
        `http://localhost:8000/api/v1/movies/toggle-like/${movieId}/`,
        {},
        config
      );

      // 서버 응답에 따라 상태 업데이트
      if (response.data.is_liked) {
        if (!likedMovies.value.includes(numericMovieId)) {
          likedMovies.value.push(numericMovieId);
        }
      } else {
        likedMovies.value = likedMovies.value.filter(id => id !== numericMovieId);
      }

      return response.data.is_liked;
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
      throw error;
    } finally {
      isProcessing.value = false;
    }
  };

  const checkLikeStatus = async (tmdbId) => {
    if (!authStore.isAuthenticated || !tmdbId) return false;

    try {
      const config = {
        headers: {
          Authorization: `Token ${authStore.token}`,
        },
      };

      const response = await axios.get(
        `http://localhost:8000/api/v1/movies/check-like/${tmdbId}/`,
        config
      );

      const numericTmdbId = Number(tmdbId);
      
      if (response.data.is_liked) {
        if (!likedMovies.value.includes(numericTmdbId)) {
          likedMovies.value = [...likedMovies.value, numericTmdbId];
        }
      } else {
        likedMovies.value = likedMovies.value.filter(id => id !== numericTmdbId);
      }

      return response.data.is_liked;
    } catch (error) {
      console.error('좋아요 상태 확인 중 오류:', error);
      return false;
    }
  };

  const fetchLikedMovies = async () => {
    if (!authStore.isAuthenticated) return;

    try {
      const config = {
        headers: {
          Authorization: `Token ${authStore.token}`,
        },
      };

      const response = await axios.get(
        'http://localhost:8000/api/v1/movies/liked-movies/',
        config
      );

      likedMovies.value = response.data.map(movie => Number(movie.id));
    } catch (error) {
      console.error('좋아요 목록 가져오기 실패:', error);
    }
  };

  const clearLikedMovies = () => {
    likedMovies.value = [];
  };

  return {
    likedMovies,
    isProcessing,
    isLiked,
    liked_count,
    toggleLike,
    checkLikeStatus,
    fetchLikedMovies,
    clearLikedMovies,
  };
});