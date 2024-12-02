<template>
  <div class="logo-container"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @click="goToDescription"
    ref="container"
  >
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default {
  name: 'FirstConcept',
  props: {
    svgPath: {
      type: String,
      required: true
    },
    useAsImage: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter()
    const container = ref(null)
    const canvas = ref(null)
    const rotation = reactive({
      x: 0,
      y: 0
    })

    let scene, camera, renderer, model

    onMounted(() => {
      initThree()
      loadModel()
      animate()
    })

    const initThree = () => {
      scene = new THREE.Scene()
      // FOV(시야각), , ,far 값
      camera = new THREE.PerspectiveCamera(60, 700/700, 0.1, 2000)
      
      // 렌더 설정
      renderer = new THREE.WebGLRenderer({
        canvas: canvas.value,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
      })

      // 렌더러 크기를 화면 크기에 맞게 설정
      const width = Math.min(window.innerWidth * 0.9, 1400)
      const height = Math.min(window.innerHeight * 0.9, 1400)
      renderer.setSize(width, height)

      // 색상 관련 설정
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.5

      renderer.setSize(1400, 1400) // 캔버스 크기
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 픽셀 비율 최적화

      // 그림자 설정
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      
      // 조명 설정
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
      scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
      directionalLight.position.set(0, 1, 0)
      directionalLight.castShadow = true // 그림자를 활성화
      scene.add(directionalLight)

      // 조명 추가
      const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6)
      scene.add(hemisphereLight)

      // 보조 조명들 추가
      const frontLight = new THREE.DirectionalLight(0xffffff, 1.5)
      frontLight.position.set(0, 0, 5)
      scene.add(frontLight)

      const backLight = new THREE.DirectionalLight(0xffffff, 1.0)
      backLight.position.set(0, 0, -5)
      scene.add(backLight)

      const topLight = new THREE.DirectionalLight(0xffffff, 1.0)
      topLight.position.set(0, 5, 0)
      scene.add(topLight)

      camera.position.z = 3
    }

    const loadModel = () => {
      const loader = new GLTFLoader()
      loader.load(
        props.svgPath,
        (gltf) => {
          model = gltf.scene

          // 색 지정
          const customColor = new THREE.Color('#D1A1CD')
          
          // 모델 크기 조정
          model.scale.set(9, 9, 9)

          // 모델 위치 조정
          model.position.x =  0 // 필요한 경우 조정

          // 초기 회전 설정
          model.rotation.x = -0.3  // 아래쪽으로 회전
          model.rotation.y = 0.3   // 오른쪽으로 회전

          model.traverse((node) => {
            if (node.isMesh) {
              if (node.material) {
                // 재질의 채도와 밝기 조정
                node.material.color = customColor // 색상 강도 증가
                node.material.needsUpdate = true
                
                // 메탈릭/러프니스 조정으로 재질감 개선
                if(node.material.metalness !== undefined) {
                  node.material.metalness = 0.4  // 메탈릭 느낌 증가
                }
                if(node.material.roughness !== undefined) {
                  node.material.roughness = 4  // 높을 수록 매트
                }

                // 추가 매트 효과를 위한 설정
                node.material.flatShading = true  // 플랫 셰이딩 적용
                node.material.transparent = true   // 투명도 활성화
                node.material.opacity = 0.95      // 살짝 투명하게

              }
            }
          })

          scene.add(model)
          
        },
        (progress) => {
          console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%')
        },
        (error) => {
          console.error('Error loading model:', error)
        }
      )
    }

    const animate = () => {
      requestAnimationFrame(animate)
      if (model) {
        model.rotation.x = rotation.x * Math.PI / 180
        model.rotation.y = rotation.y * Math.PI / 180
      }
      renderer.render(scene, camera)
    }

    const handleMouseMove = (e) => {
      if (!container.value) return
      const rect = container.value.getBoundingClientRect()
      
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      rotation.y = ((e.clientX - centerX) / rect.width) * 300
      rotation.x = ((e.clientY - centerY) / rect.height) * -300
    }

    const handleMouseLeave = () => {
      rotation.x = 0
      rotation.y = 0
    }

    const goToDescription = () => {
      router.push({name: 'firstDescription'})
    }

    return {
      container,
      canvas,
      handleMouseMove,
      handleMouseLeave,
      goToDescription
    }
  }
}
</script>

<style scoped>
.logo-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

canvas {
  width: auto !important;
  height: auto !important;
}
</style>