<!-- <template>
  <footer class="footer-wrapper">
    <div class="horizontal-line"></div>
    <p class="copyright">Copyright © 2024 Hanseul, Jieun. All Rights Reserved.</p>
    <p class="address">107, Hanamsandan 6beon-ro, Gwangsan-gu, Gwangju, Republic of Korea</p>
  </footer>
</template>

<style scoped>
.footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
}

.horizontal-line {
  width: 100%;
  height: 1px;
  background-color: #000000;
  /* opacity: 0.1; */
  margin-bottom: 1rem;
}

p {
  font-family: "Inter-Thin", Helvetica;
  font-size: 15px;
  font-weight: 100;
  margin: 0.25rem 0;
  color: #000000;
}
</style> -->



<template>
  <footer class="footer-wrapper">
    <div class="horizontal-line"></div>
      <div class="content">
        <div class="text-section">
          <p class="copyright">Copyright © 2024 Hanseul, Jieun. All Rights Reserved.</p>
          <p class="address">107, Hanamsandan 6beon-ro, Gwangsan-gu, Gwangju, Republic of Korea</p>
        </div>
        <img src="/logo/logo.png" alt="Company Logo" class="logo">
      </div>
  </footer>
</template>

<style scoped>
.footer-wrapper {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
}

.content {
  position: relative;
  display: flex ;
  margin-bottom: 1rem;
  justify-content: space-between;
}

.horizontal-line {
  width: 100%;
  height: 1px;
  background-color: #000000;
  margin-bottom: 0.5rem;
}

.logo {
  height: 40px; /* 로고 크기는 필요에 따라 조절하세요 */
  width: auto;
  object-fit: contain;
  align-items: center;
}

p {
  font-family: "Inter-Thin", Helvetica;
  font-size: 15px;
  font-weight: 100;
  margin: 0.25rem 0;
  color: #000000;
}
</style>