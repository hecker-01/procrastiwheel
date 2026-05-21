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
    <!-- Machine always occupies the centre zone -->
    <div class="machine-zone">
      <SlotMachine @result="onResult" @spin="onSpin" />
    </div>

    <!-- Banner zone: always the same height so it never shifts the machine -->
    <div class="banner-zone">
      <ResultBanner :result="result" />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px 28px;
  position: relative;
  z-index: 1;
}

/* Takes all remaining vertical space → keeps machine centred */
.machine-zone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

/* Always reserves room for the banner so the machine never moves */
.banner-zone {
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
}
</style>
