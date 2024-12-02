import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMovieStore = defineStore('movie', () => {
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const movieInfo = ref([])
  const isLoading = ref(false)
  const movieDetail = ref({})
  
  // 기본 fetch 옵션
  const getOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }

  // 포스터가 있는 영화만 필터링하는 함수
  const filterMoviesWithPoster = (movies) => {
    return movies.filter(movie => movie.poster_path !== null)
  }

  // 키워드 ID를 찾는 함수
  const findKeywordId = async (keyword) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/keyword?query=${encodeURIComponent(keyword)}`,
        getOptions
      )
      const data = await response.json()
      return data.results[0]?.id
    } catch (err) {
      console.error('Error finding keyword:', err)
      return null
    }
  }

  // 키워드 ID로 영화를 검색하는 함수
  const fetchMoviesByKeywordId = async (keywordId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/discover/movie?with_keywords=${keywordId}&language=ko-KR&sort_by=release_date.desc`,
        getOptions
      )
      const data = await response.json()
      return filterMoviesWithPoster(data.results)
    } catch (err) {
      console.error('Error fetching movies by keyword:', err)
      return []
    }
  }

  // 키워드로 영화 검색하는 함수
  const fetchMoviesByKeyword = async (keyword) => {
    isLoading.value = true
    try {
      // 1. 일반 제목 검색
      const titleSearchResponse = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(keyword)}&language=ko-KR&sort_by=release_date.desc`,
        getOptions
      )
      const titleSearchData = await titleSearchResponse.json()
      let results = filterMoviesWithPoster(titleSearchData.results)

      // 2. 키워드 ID 검색
      const keywordId = await findKeywordId(keyword)
      if (keywordId) {
        const keywordResults = await fetchMoviesByKeywordId(keywordId)
        
        // 결과 합치기 및 중복 제거
        results = [...results, ...keywordResults]
        results = Array.from(new Map(results.map(movie => [movie.id, movie])).values())
      }

      // 3. 결과 정렬
      movieInfo.value = results.sort((a, b) => {
        return new Date(b.release_date) - new Date(a.release_date)
      })

      // 4. 결과가 없는 경우
      if (movieInfo.value.length === 0 && keyword) {
        // 영어 검색 시도 
        const englishKeywordResponse = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(keyword)}&language=ko-KR&sort_by=release_date.desc`,
          getOptions
        )
        const englishData = await englishKeywordResponse.json()
        movieInfo.value = filterMoviesWithPoster(englishData.results)
      }
    } catch (err) {
      console.error('Error in enhanced movie search:', err)
      movieInfo.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 여러 키워드로 동시에 검색하는 함수
  const fetchMoviesByMultipleKeywords = async (keywords) => {
    isLoading.value = true
    try {
      // 모든 키워드의 ID 찾기
      const keywordIds = await Promise.all(
        keywords.map(keyword => findKeywordId(keyword))
      )

      // 유효한 키워드 ID만 필터링
      const validKeywordIds = keywordIds.filter(id => id !== null)

      if (validKeywordIds.length > 0) {
        // 키워드 ID들을 쉼표로 구분하여 하나의 문자열로 만듦
        const keywordString = validKeywordIds.join(',')
        
        // 모든 키워드를 포함하는 영화 검색
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?with_keywords=${keywordString}&language=ko-KR&sort_by=release_date.desc`,
          getOptions
        )
        const data = await response.json()
        
        // 포스터가 있는 영화만 필터링하고 정렬
        movieInfo.value = filterMoviesWithPoster(data.results).sort((a, b) => {
          return new Date(b.release_date) - new Date(a.release_date)
        })
      }
    } catch (err) {
      console.error('Error in multiple keyword search:', err)
      movieInfo.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 영화 상세 정보 가져오는 함수
  const getMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR&append_to_response=credits,watch/providers,keywords`,
        getOptions
      )
      const data = await response.json()
      
      // 포스터가 있는 경우에만 상세 정보 저장
      if (data.poster_path) {
        movieDetail.value = data
        return data
      } else {
        throw new Error('No poster available for this movie')
      }
    } catch (err) {
      console.error('Error fetching movie details:', err)
      return null
    }
  }
  
  return { 
    isLoading, 
    movieInfo, 
    movieDetail, 
    fetchMoviesByKeyword,
    fetchMoviesByMultipleKeywords,
    getMovieDetails 
  }
})