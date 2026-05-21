<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: { type: Object, default: null },
})

const isSpecial = computed(() => {
  if (!props.result) return false
  const { activity, duration, unit } = props.result
  return (
    activity === 'go eat something for' ||
    (activity === 'take a break for' && unit === 'hours') ||
    (duration === 3 && unit === 'hours')
  )
})

const emoji = computed(() => {
  if (!props.result) return ''
  const { activity } = props.result
  if (activity === 'go eat something for') return '🍕'
  if (activity === 'take a break for') return '😴'
  return '💼'
})
</script>

<template>
  <Transition name="banner">
    <div v-if="result" class="banner" :class="{ special: isSpecial }">
      <span class="emo">{{ emoji }}</span>
      <span class="sentence">
        <em>{{ result.activity }}</em>
        &nbsp;<strong>{{ result.duration }}</strong>&nbsp;
        <em>{{ result.unit }}</em>
      </span>
      <span v-if="isSpecial" class="tag">✨ LUCKY!</span>
    </div>
  </Transition>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 36px;
  border-radius: 14px;
  background: linear-gradient(135deg, #1a1a2e, #0f3460);
  border: 2px solid #e94560;
  box-shadow: 0 0 24px rgba(233, 69, 96, 0.35);
  font-family: 'Boogaloo', cursive;
  font-size: 1.6rem;
  color: #fff;
  letter-spacing: 1px;
  max-width: 90vw;
  text-align: center;
  flex-wrap: wrap;
  justify-content: center;
}

.banner.special {
  border-color: #f5a623;
  box-shadow:
    0 0 30px rgba(245, 166, 35, 0.6),
    0 0 60px rgba(245, 166, 35, 0.25);
  animation: specialPulse 1.8s ease-in-out infinite;
}

@keyframes specialPulse {
  0%, 100% { box-shadow: 0 0 30px rgba(245, 166, 35, 0.6), 0 0 60px rgba(245, 166, 35, 0.25); }
  50%       { box-shadow: 0 0 50px rgba(245, 166, 35, 0.9), 0 0 90px rgba(245, 166, 35, 0.45); }
}

.emo  { font-size: 2rem; }

.sentence em     { color: #a29bfe; font-style: normal; }
.sentence strong { color: #f5a623; font-size: 1.9rem; }

.tag {
  background: #f5a623;
  color: #0d0d1a;
  font-size: 0.9rem;
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 2px;
}

/* Transition */
.banner-enter-active { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
.banner-leave-active { transition: all 0.25s ease-in; }
.banner-enter-from   { transform: translateY(30px) scale(0.9); opacity: 0; }
.banner-leave-to     { transform: translateY(-20px) scale(0.95); opacity: 0; }
</style>
