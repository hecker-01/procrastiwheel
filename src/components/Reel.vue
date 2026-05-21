<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const ITEM_HEIGHT = 80

const props = defineProps({
  items:         { type: Array,  required: true },
  targetIndex:   { type: Number, default: 0 },
  stopFraction:  { type: Number, default: 1.0 },
  totalDuration: { type: Number, default: 10000 },
  trigger:       { type: Number, default: 0 },
})

const emit = defineEmits(['stopped'])

const scrollY   = ref(0)
const isShaking = ref(false)
const isLanded  = ref(false)

let rafId = null

function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5)
}

function posMod(n, m) {
  return ((n % m) + m) % m
}

// Which item in the infinite sequence is at center
const centerSeqIdx = computed(() => Math.floor(scrollY.value / ITEM_HEIGHT))
const centerIndex  = computed(() => posMod(centerSeqIdx.value, props.items.length))
const subOffset    = computed(() => -(scrollY.value % ITEM_HEIGHT))

// 5 items shown: [-2, -1, CENTER, +1, +2]
const displayItems = computed(() =>
  [-2, -1, 0, 1, 2].map(offset => {
    const idx = posMod(centerIndex.value + offset, props.items.length)
    return props.items[idx]
  })
)

// display[2] (center item) sits at strip-y = 2*ITEM_HEIGHT = 160px.
// We want it at ITEM_HEIGHT = 80px (center of 240px window).
// Shift: -ITEM_HEIGHT. Plus subOffset for smooth animation.
const transformY = computed(() => -ITEM_HEIGHT + subOffset.value)

function startSpin() {
  if (rafId) cancelAnimationFrame(rafId)
  isLanded.value = false

  const spinDuration = props.totalDuration * props.stopFraction

  // Snap current position to nearest item boundary
  const snappedStart  = Math.round(scrollY.value / ITEM_HEIGHT) * ITEM_HEIGHT
  const currentIdx    = posMod(Math.floor(snappedStart / ITEM_HEIGHT), props.items.length)
  const delta         = posMod(props.targetIndex - currentIdx, props.items.length)
  const N_LOOPS       = 12
  const totalDist     = (N_LOOPS * props.items.length + delta) * ITEM_HEIGHT

  const startSY = snappedStart
  const endSY   = startSY + totalDist
  let   startTime = null

  function tick(ts) {
    if (!startTime) startTime = ts
    const elapsed     = ts - startTime
    const rawT        = Math.min(elapsed / spinDuration, 1)
    const easedT      = easeOutQuint(rawT)

    scrollY.value = startSY + totalDist * easedT

    if (rawT < 1) {
      rafId = requestAnimationFrame(tick)
    } else {
      scrollY.value = endSY
      rafId = null
      isShaking.value = true
      isLanded.value  = true
      setTimeout(() => { isShaking.value = false }, 520)
      emit('stopped', centerIndex.value)
    }
  }

  rafId = requestAnimationFrame(tick)
}

watch(() => props.trigger, (v) => { if (v > 0) startSpin() })
onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })
</script>

<template>
  <div class="reel-col" :class="{ shake: isShaking }">
    <div class="fade fade-top" />
    <div class="fade fade-bottom" />
    <div class="highlight" />

    <div class="strip" :style="{ transform: `translateY(${transformY}px)` }">
      <div
        v-for="(item, i) in displayItems"
        :key="i"
        class="item"
        :class="{ 'item-center': i === 2 && isLanded }"
      >{{ item }}</div>
    </div>
  </div>
</template>

<style scoped>
.reel-col {
  position: relative;
  height: 240px; /* 3 × 80px */
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  background: #0e0e24;
}

/* ── Strip ────────────────────────────────────────────── */
.strip {
  position: absolute;
  width: 100%;
  top: 0;
  will-change: transform;
}

.item {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  text-align: center;
  color: rgba(255, 255, 255, 0.65);
  white-space: nowrap;
  transition: color 0.3s, text-shadow 0.3s;
}

.item-center {
  color: #f5a623;
  font-weight: 700;
  text-shadow: 0 0 12px rgba(245, 166, 35, 0.7);
  font-size: 1.05rem;
}

/* ── Center gold frame ────────────────────────────────── */
.highlight {
  position: absolute;
  top: 80px;
  height: 80px;
  width: 100%;
  border-top: 2px solid #f5a623;
  border-bottom: 2px solid #f5a623;
  box-shadow:
    inset 0 0 18px rgba(245, 166, 35, 0.12),
    0 0 8px rgba(245, 166, 35, 0.25);
  pointer-events: none;
  z-index: 2;
}

/* ── Gradient fades ───────────────────────────────────── */
.fade {
  position: absolute;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 3;
  pointer-events: none;
}
.fade-top    { top: 0;    background: linear-gradient(to bottom, #0e0e24 0%, transparent 100%); }
.fade-bottom { bottom: 0; background: linear-gradient(to top,   #0e0e24 0%, transparent 100%); }

/* ── Shake on stop ────────────────────────────────────── */
@keyframes shake {
  0%   { transform: translateX(0); }
  15%  { transform: translateX(-6px); }
  30%  { transform: translateX(6px); }
  45%  { transform: translateX(-4px); }
  60%  { transform: translateX(4px); }
  75%  { transform: translateX(-2px); }
  90%  { transform: translateX(2px); }
  100% { transform: translateX(0); }
}

.shake { animation: shake 0.52s ease-out; }
</style>
