<script setup>
import { ref } from 'vue'
import Reel from './Reel.vue'
import { ACTIVITIES, DURATIONS, UNITS, VALID_HOUR_DURATION_INDICES } from '../constants'

const emit = defineEmits(['result', 'spin'])

const isSpinning     = ref(false)
const spinTrigger    = ref(0)
const totalDuration  = ref(5000)
const activityTarget = ref(0)
const durationTarget = ref(0)
const unitTarget     = ref(0)
const isPulled       = ref(false)

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

  stoppedCount     = 0
  isSpinning.value = true
  spinTrigger.value++
}

function onReelStopped() {
  stoppedCount++
  if (stoppedCount === 3) {
    isSpinning.value = false
    emit('result', resolvedResult)
  }
}

// ── Lever interaction ───────────────────────────────────────
function onLeverDown(e) {
  if (isSpinning.value || isPulled.value) return
  e.preventDefault()
  isPulled.value = true
}

function onLeverRelease() {
  if (!isPulled.value) return
  isPulled.value = false
  // Spring back first (300ms transition), then kick off spin
  setTimeout(onSpin, 280)
}
</script>

<template>
  <div class="machine" :class="{ spinning: isSpinning }">

    <!-- Lights (top) -->
    <div class="lights">
      <span v-for="i in NUM_LIGHTS" :key="i" class="bulb" :class="{ alt: i % 2 === 0 }" />
    </div>

    <!-- Title -->
    <h1 class="title">🎰 Procrastiwheel</h1>
    <p class="subtitle">What are you doing next?</p>

    <!-- Body: reels + lever -->
    <div class="machine-body">

      <!-- Reels panel -->
      <div class="reels-panel">
        <div class="reel-wrap wide">
          <Reel :items="ACTIVITIES" :targetIndex="activityTarget"
                :stopFraction="0.6" :totalDuration="totalDuration"
                :trigger="spinTrigger" @stopped="onReelStopped" />
        </div>
        <div class="divider" />
        <div class="reel-wrap narrow">
          <Reel :items="durationLabels" :targetIndex="durationTarget"
                :stopFraction="0.8" :totalDuration="totalDuration"
                :trigger="spinTrigger" @stopped="onReelStopped" />
        </div>
        <div class="divider" />
        <div class="reel-wrap medium">
          <Reel :items="UNITS" :targetIndex="unitTarget"
                :stopFraction="1.0" :totalDuration="totalDuration"
                :trigger="spinTrigger" @stopped="onReelStopped" />
        </div>
      </div>

      <!-- Lever -->
      <div
        class="lever-wrap"
        :class="{ pulled: isPulled, spinning: isSpinning }"
        @pointerdown="onLeverDown"
        @pointerup="onLeverRelease"
        @pointercancel="onLeverRelease"
        @pointerleave="onLeverRelease"
      >
        <!-- Track (rail) -->
        <div class="lever-track" />

        <!-- Arm + ball (this whole thing rotates) -->
        <div class="lever-arm">
          <div class="lever-ball">
            <div class="lever-ball-shine" />
          </div>
          <div class="lever-rod" />
        </div>

        <!-- Pivot base -->
        <div class="lever-pivot">
          <div class="lever-pivot-inner" />
        </div>

        <!-- Label -->
        <span class="lever-label">PULL</span>
      </div>

    </div>

    <!-- Lights (bottom) -->
    <div class="lights">
      <span v-for="i in NUM_LIGHTS" :key="i" class="bulb" :class="{ alt: i % 2 !== 0 }" />
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
  max-width: min(92vw, 760px);
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
  width: 14px; height: 14px;
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

/* ── Machine body (reels + lever row) ───────────────────── */
.machine-body {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
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
  flex: 1;
  min-width: 0;
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
  align-self: stretch;
}

/* ── Lever ──────────────────────────────────────────────── */
.lever-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: grab;
  user-select: none;
  touch-action: none;
  flex-shrink: 0;
  padding-bottom: 4px;
}

.lever-wrap.spinning {
  cursor: not-allowed;
  opacity: 0.5;
  pointer-events: none;
}

/* Rail / track groove behind the arm */
.lever-track {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 28px;           /* below the ball */
  width: 6px;
  height: 108px;       /* matches rod height + pivot */
  background: linear-gradient(to right, #0a0a1a, #2a2a4a, #0a0a1a);
  border-radius: 3px;
  box-shadow: inset 0 0 6px rgba(0,0,0,0.8);
  z-index: 0;
}

/* The whole arm (ball + rod) rotates together */
.lever-arm {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-origin: bottom center;
  transform: rotate(0deg);
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); /* spring back */
  z-index: 2;
  position: relative;
}

/* When pulled → snap down fast */
.lever-wrap.pulled .lever-arm {
  transform: rotate(52deg);
  transition: transform 0.1s ease-in;
}

/* Ball / handle */
.lever-ball {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ff8fa3, #e94560, #a01535);
  box-shadow:
    0 0 14px rgba(233, 69, 96, 0.7),
    0 4px 10px rgba(0,0,0,0.5),
    inset 0 -4px 8px rgba(0,0,0,0.3);
  position: relative;
  flex-shrink: 0;
  transition: box-shadow 0.15s;
}

.lever-wrap:not(.spinning):hover .lever-ball {
  box-shadow:
    0 0 22px rgba(233, 69, 96, 0.95),
    0 4px 12px rgba(0,0,0,0.5),
    inset 0 -4px 8px rgba(0,0,0,0.3);
}

/* Shine dot on the ball */
.lever-ball-shine {
  position: absolute;
  top: 6px; left: 7px;
  width: 9px; height: 7px;
  border-radius: 50%;
  background: rgba(255,255,255,0.45);
  transform: rotate(-30deg);
}

/* Rod / stick */
.lever-rod {
  width: 10px;
  height: 100px;
  background: linear-gradient(to right, #2a2a4a, #7a7aaa, #c0c0e0, #7a7aaa, #2a2a4a);
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
  flex-shrink: 0;
}

/* Pivot base */
.lever-pivot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a3a5a, #1a1a2e);
  border: 2px solid #5a5a7a;
  box-shadow: 0 3px 8px rgba(0,0,0,0.6), 0 0 6px rgba(100,100,160,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
  margin-top: -4px;
}

.lever-pivot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #9090c0, #3a3a5a);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.5);
}

/* Label */
.lever-label {
  font-family: 'Orbitron', monospace;
  font-size: 0.6rem;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.3);
  margin-top: 6px;
  text-transform: uppercase;
  transition: color 0.2s;
}

.lever-wrap:not(.spinning):hover .lever-label {
  color: #f5a623;
}
</style>
