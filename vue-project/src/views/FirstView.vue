<template>
  <FirstConcept 
    svg-path="public/logo/1123.gltf"
    :use-as-image="true"
  />
</template>

<script>
import FirstConcept from '@/components/first/FirstConcept.vue'

export default {
  name: 'app',
  components: {
    FirstConcept
  }
}
</script>