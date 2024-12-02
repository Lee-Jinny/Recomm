<template>
    <div class="no-content-container">
      <div class="content-wrapper">
        <img 
          src="/no_content.png" 
          alt="No Content" 
          class="no-content-image"
        />
        <h1 class="no-content-title">204_NO_CONTENT</h1>
      </div>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style>
  /* Google Fonts import */
  @import url('https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&display=swap');
  </style>
  
  <style scoped>
  .no-content-container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
  }
  
  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .no-content-image {
    max-width: 100%;
    height: auto;
    width: 400px;
  }
  
  .no-content-title {
    color: #4a474d;
    font-family: 'Pixelify Sans', sans-serif;  /* 폰트 적용 */
    font-size: 24px;
    font-weight: 500;
    margin: 0;
    letter-spacing: 1px;
  }
  </style>