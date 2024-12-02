<template>
  <div class="ticket-container">
    <template v-if="movieStore.movieDetail">
      <TicketFront
        :movie-title="movieStore.movieDetail.title"
        :poster-path="movieStore.movieDetail.poster_path"
        :providers="movieProviders"
      />
    </template>
    <div v-else class="loading">
      Loading...
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useMovieStore } from "@/stores/movie";
import TicketFront from "@/components/ticket/TicketFront.vue";

const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
});

const movieStore = useMovieStore();

onMounted(async () => {
  if (props.movieId) {
    await movieStore.getMovieDetails(props.movieId);
  }
});

const movieProviders = computed(() => {
  return movieStore.movieDetail["watch/providers"]?.results?.KR || null;
});
</script>

<style scoped>
.ticket-container {
  width: 1200px;
  height: 500px;
  display: flex;
  justify-content: center;
  padding: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>