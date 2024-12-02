<template>
  <a 
    v-if="streamingUrl"
    :href="streamingUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="streaming-info"
  >
    <div class="streaming-content">
      <img
        :src="getLogoPath"
        :alt="`${provider.provider_name} logo`"
        class="streaming-logo"
      />
    </div>
  </a>
  <div v-else class="streaming-info">
    <div class="streaming-content">
      <img
        :src="getLogoPath"
        :alt="`${provider.provider_name} logo`"
        class="streaming-logo"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  provider: {
    type: Object,
    required: true,
  }
});

// provider_id를 기준으로 서비스명 매핑
const providerIdMapping = {
  8: 'netflix',    // Netflix
  337: 'disneyplus',  // Disney Plus
  97: 'watcha',    // Watcha
  356: 'wavve',    // Wavve
  357: 'tving',    // Tving
  350: 'appletv',  // Apple TV Plus
  119: 'primevideo', // Amazon Prime
  1350: 'coupangplay', // Coupang Play
  96: 'naverstore'  // Naver Store
};

// 한국 OTT 서비스 URL 매핑
const ottUrls = {
  wavve: 'https://www.wavve.com/',
  watcha: 'https://watcha.com/',
  netflix: 'https://www.netflix.com/kr/',
  tving: 'https://www.tving.com/',
  disneyplus: 'https://www.disneyplus.com/ko-kr',
  appletv: 'https://tv.apple.com/kr',
  primevideo: 'https://www.primevideo.com/region/fe/storefront/',
  coupangplay: 'https://www.coupangplay.com/',
  naverstore: 'https://serieson.naver.com/movie/'
};

const getLogoPath = computed(() => {
  try {
    // provider_id를 기준으로 서비스명 가져오기
    const serviceName = providerIdMapping[props.provider.provider_id];
    if (!serviceName) {
      return `https://image.tmdb.org/t/p/original${props.provider.logo_path}`;
    }
    
    // 로컬 이미지 경로 생성
    return `/src/assets/ottlogo/${serviceName}.png`;
  } catch (error) {
    return `https://image.tmdb.org/t/p/original${props.provider.logo_path}`;
  }
});

const streamingUrl = computed(() => {
  const serviceName = providerIdMapping[props.provider.provider_id];
  return serviceName ? ottUrls[serviceName] : null;
});
</script>

<style scoped>
.streaming-info {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.streaming-info:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.streaming-content {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 12px;
}

.streaming-logo {
  width: 30px;
  height: 30px;
  border-radius: 4px;
}
</style>