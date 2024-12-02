<template>
  <div>
    <h1>MovieSearch</h1>
    <form @submit.prevent="goToMovieList(keyword)">
      <input type="text" v-model="keyword" placeholder="뭐가 궁금해?">
      <button type="submit">검색</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const keyword = ref('')

const goToMovieList = function(selectedWord) {
  if (!selectedWord) {
    alert('검색어를 입력하세요!')
    return
  }
  router.push({name:'MovieList', params:{keyword: selectedWord}})
}
</script>

<style scoped>

</style>