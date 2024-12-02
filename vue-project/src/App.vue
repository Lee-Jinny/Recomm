<template>
  <div
      class="app-container"
      :class="{ 'no-padding': hideNav.includes($route.name) }"
  >
      <template v-if="$route.name === 'first'">
          <FirstConcept :svgPath="'/logo/1123.gltf'" :use-as-image="false" />
      </template>

      <template v-else>
          <Navbar v-if="!hideNav.includes($route.name)" />
          <RouterView />
      </template>

      <Footer />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import Navbar from '@/components/common/navbar.vue';
import FirstConcept from '@/components/first/FirstConcept.vue';
import { useRoute } from 'vue-router';
import Footer from './components/common/Footer.vue';

const route = useRoute();

const hideNav = ['first', 'firstDescription', 'LoginView', 'SignupBasic', 'SignupProfile'];
</script>

<style>
/* navbar 높이 관리 변수 */
:root {
  --navbar-height: 100px;
  --navbar-height-mobile: 200px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  margin: 0;
  padding: 0;
}

.navbar {
  height: var(--navbar-height);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  /* background-color: #fff; navbar 배경색 지정 */
}

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  /* navbar 높이만큼 패딩 추가하자! */
  padding-top: var(--navbar-height);
  position: relative;
}

/* firstpage용 */
.no-padding {
  padding-top: 0 !important;
}


body {
  font-family: 'Inter', 'Pretendard', -apple-system, sans-serif;
}

/* 반응형 스타일 */
@media screen and (max-width: 768px) {
  :root {
      --navbar-height: var(--navbar-height-mobile);
  }

  .navbar {
      height: var(--navbar-height-mobile);
  }

  .app-container {
      padding-top: var(--navbar-height-mobile);
  }
}
</style>
