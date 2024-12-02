<template>
  <div>
    {{ loginStore.logout() }}
  </div>
</template>

<script setup>
import { useLoginStore } from '@/stores/login';

const loginStore = useLoginStore() 

</script>

<style lang="scss" scoped>

</style>