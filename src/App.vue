<script setup>
import { ref } from 'vue'
import SlotMachine from './components/SlotMachine.vue'
import ResultBanner from './components/ResultBanner.vue'
import { useConfetti } from './composables/useConfetti'

const result = ref(null)
const { triggerConfetti } = useConfetti()

function onResult(r) {
  result.value = r
  setTimeout(() => triggerConfetti(r), 200)
}

function onSpin() {
  result.value = null
}
</script>

<template>
  <div class="page">
    <SlotMachine @result="onResult" @spin="onSpin" />
    <ResultBanner :result="result" />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  min-height: 100vh;
  padding: 40px 20px;
}
</style>
