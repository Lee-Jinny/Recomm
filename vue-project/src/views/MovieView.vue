<template>
  <div>

    <div class="word-container">
      <span v-for="(keyword, index) in keywords" :key="index" class="word-pill" @click="goToMovieList(keyword)" style="cursor: pointer">
        {{ keyword }}
      </span>
    </div>

    <!-- <button @click="$router.push({name:'MovieSearch'})">검색</button> -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';


const router = useRouter()

// keyword 변수 저장
const keywords = [
  'superhero', '복수', 'time travel', '평화', 'weird', 'romantic',
  '행복한', '슬픈', 'sports', 'dangerous', 'lonely', 'new york', '우정', 
  'robot', 'zombie', 'magic', 'school', 'adventure',
  '강한', '용감한', "20th century",'순수한', 'dystopia', '이상한', '사랑', 'love', 'revenge',
  '싸움', '꿈', 'funny', '요리', 'disney', '판타지', 'mysterious', 'strong',
  'smart', '애니', 'animal', 'fiction', '드라마', 'musical', '가족','마법',
  'documantory', 'religion','pixa', 
  ]

const goToMovieList = function(selectedWord) {
  router.push({name:'MovieList', params:{keyword: selectedWord}})
}
</script>

<style scoped>
.word-container {
  width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 40px;
}

.word-pill {
  border: 1px solid black;
  padding:6px 24px;
  border-radius: 30px;
  font-size: 26px;
  display: inline-block;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.word-pill:hover {
  background-color: #4A474D;
  color: aliceblue;
  transform: scale(1.05);
}

</style>