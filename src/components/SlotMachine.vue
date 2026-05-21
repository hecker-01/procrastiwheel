<script setup>
import { ref } from 'vue'
import Reel from './Reel.vue'
import { ACTIVITIES, DURATIONS, UNITS, VALID_HOUR_DURATION_INDICES } from '../constants'

const emit = defineEmits(['result', 'spin'])

const isSpinning          = ref(false)
const spinTrigger         = ref(0)
const totalDuration       = ref(10000)
const activityTarget      = ref(0)
const durationTarget      = ref(0)
const unitTarget          = ref(0)

const durationLabels = DURATIONS.map(String)
const NUM_LIGHTS     = 10

let stoppedCount   = 0
let resolvedResult = null

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function onSpin() {
  if (isSpinning.value) return
  emit('spin')

  totalDuration.value = 5000

  const unitIdx = randInt(0, UNITS.length - 1)
  const durIdx  = UNITS[unitIdx] === 'hours'
    ? VALID_HOUR_DURATION_INDICES[randInt(0, VALID_HOUR_DURATION_INDICES.length - 1)]
    : randInt(0, DURATIONS.length - 1)
  const actIdx  = randInt(0, ACTIVITIES.length - 1)

  activityTarget.value = actIdx
  durationTarget.value = durIdx
  unitTarget.value     = unitIdx

  resolvedResult = {
    activity: ACTIVITIES[actIdx],
    duration: DURATIONS[durIdx],
    unit:     UNITS[unitIdx],
  }

  stoppedCount        = 0
  isSpinning.value    = true
  spinTrigger.value++
}

function onReelStopped() {
  stoppedCount++
  if (stoppedCount === 3) {
    isSpinning.value = false
    emit('result', resolvedResult)
  }
}
</script>

<template>
  <div class="machine" :class="{ spinning: isSpinning }">

    <!-- Lights row (top) -->
    <div class="lights">
      <span
        v-for="i in NUM_LIGHTS" :key="i"
        class="bulb"
        :class="{ alt: i % 2 === 0 }"
      />
    </div>

    <!-- Title -->
    <h1 class="title">🎰 Procrastiwheel</h1>
    <p class="subtitle">What are you doing next?</p>

    <!-- Reels panel -->
    <div class="reels-panel">
      <!-- Activity reel -->
      <div class="reel-wrap wide">
        <Reel
          :items="ACTIVITIES"
          :targetIndex="activityTarget"
          :stopFraction="0.6"
          :totalDuration="totalDuration"
          :trigger="spinTrigger"
          @stopped="onReelStopped"
        />
      </div>

      <div class="divider" />

      <!-- Duration reel -->
      <div class="reel-wrap narrow">
        <Reel
          :items="durationLabels"
          :targetIndex="durationTarget"
          :stopFraction="0.8"
          :totalDuration="totalDuration"
          :trigger="spinTrigger"
          @stopped="onReelStopped"
        />
      </div>

      <div class="divider" />

      <!-- Unit reel -->
      <div class="reel-wrap medium">
        <Reel
          :items="UNITS"
          :targetIndex="unitTarget"
          :stopFraction="1.0"
          :totalDuration="totalDuration"
          :trigger="spinTrigger"
          @stopped="onReelStopped"
        />
      </div>
    </div>

    <!-- Spin button -->
    <button
      class="spin-btn"
      :class="{ pulsing: !isSpinning }"
      :disabled="isSpinning"
      @click="onSpin"
    >
      <span v-if="isSpinning">⏳ Spinning…</span>
      <span v-else>🎲 SPIN</span>
    </button>

    <!-- Lights row (bottom) -->
    <div class="lights">
      <span
        v-for="i in NUM_LIGHTS" :key="i"
        class="bulb"
        :class="{ alt: i % 2 !== 0 }"
      />
    </div>

  </div>
</template>

<style scoped>
/* ── Machine frame ──────────────────────────────────────── */
.machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 28px 32px;
  background: #1a1a2e;
  border: 3px solid #e94560;
  border-radius: 22px;
  box-shadow:
    0 0 30px rgba(233, 69, 96, 0.28),
    inset 0 0 30px rgba(0, 0, 0, 0.55);
  transition: box-shadow 0.5s ease, border-color 0.4s ease;
  max-width: min(92vw, 720px);
  width: 100%;
}

.machine.spinning {
  border-color: #ff6b8a;
  box-shadow:
    0 0 70px rgba(233, 69, 96, 0.65),
    0 0 120px rgba(233, 69, 96, 0.2),
    inset 0 0 30px rgba(0, 0, 0, 0.55);
}

/* ── Lights ─────────────────────────────────────────────── */
.lights { display: flex; gap: 10px; }

.bulb {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #f5a623;
  box-shadow: 0 0 7px #f5a623;
  animation: glow 1.8s ease-in-out infinite;
}
.bulb.alt { animation-delay: 0.9s; }

.spinning .bulb {
  animation-duration: 0.35s;
  background: #e94560;
  box-shadow: 0 0 10px #e94560, 0 0 20px rgba(233,69,96,0.4);
}

@keyframes glow {
  0%, 100% { opacity: 0.35; transform: scale(0.88); }
  50%       { opacity: 1;    transform: scale(1.15); }
}

/* ── Title ──────────────────────────────────────────────── */
.title {
  font-family: 'Orbitron', monospace;
  font-weight: 900;
  font-size: clamp(1.1rem, 4vw, 1.7rem);
  color: #f5a623;
  letter-spacing: 3px;
  text-shadow: 0 0 22px rgba(245, 166, 35, 0.55);
  margin: 0;
}

.subtitle {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: -8px 0 0;
}

/* ── Reels panel ────────────────────────────────────────── */
.reels-panel {
  display: flex;
  align-items: center;
  background: #090915;
  border-radius: 14px;
  padding: 16px 12px;
  border: 2px solid #1e1e3a;
  box-shadow: inset 0 0 24px rgba(0, 0, 0, 0.9);
  width: 100%;
  gap: 0;
}

.reel-wrap        { min-width: 0; }
.reel-wrap.wide   { flex: 3; }
.reel-wrap.medium { flex: 1.4; }
.reel-wrap.narrow { flex: 0.9; }

.divider {
  width: 2px;
  margin: 0 10px;
  background: linear-gradient(to bottom, transparent, #e94560 30%, #e94560 70%, transparent);
  border-radius: 2px;
  flex-shrink: 0;
}

/* ── Spin button ────────────────────────────────────────── */
.spin-btn {
  font-family: 'Orbitron', monospace;
  font-weight: 700;
  font-size: clamp(1rem, 3vw, 1.25rem);
  letter-spacing: 3px;
  padding: 14px 52px;
  background: linear-gradient(135deg, #e94560 0%, #c23152 100%);
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 0 22px rgba(233, 69, 96, 0.5), 0 5px 18px rgba(0,0,0,0.35);
  transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s;
  text-transform: uppercase;
}

.spin-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 0 36px rgba(233, 69, 96, 0.8), 0 8px 24px rgba(0,0,0,0.4);
}

.spin-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.spin-btn:disabled { opacity: 0.65; cursor: not-allowed; }

.spin-btn.pulsing { animation: btnPulse 2s ease-in-out infinite; }

@keyframes btnPulse {
  0%, 100% { box-shadow: 0 0 22px rgba(233,69,96,0.5), 0 5px 18px rgba(0,0,0,0.35); transform: scale(1); }
  50%       { box-shadow: 0 0 42px rgba(233,69,96,0.9), 0 8px 26px rgba(0,0,0,0.4); transform: scale(1.04); }
}
</style>
