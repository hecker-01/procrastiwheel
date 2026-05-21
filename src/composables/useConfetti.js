import confetti from 'canvas-confetti'

export function useConfetti() {
  function foodConfetti() {
    const colors = ['#FF6B6B', '#FFE66D', '#FF8C42', '#C0392B', '#F7DC6F', '#27AE60']
    confetti({ particleCount: 130, angle: 60, spread: 60, origin: { x: 0, y: 0.65 }, colors, startVelocity: 50, ticks: 320 })
    confetti({ particleCount: 130, angle: 120, spread: 60, origin: { x: 1, y: 0.65 }, colors, startVelocity: 50, ticks: 320 })
  }

  function relaxConfetti() {
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#A29BFE', '#74B9FF', '#6C5CE7', '#DFE6E9', '#FD79A8'],
      shapes: ['circle'],
      gravity: 0.5,
      ticks: 450,
      startVelocity: 28,
    })
  }

  function megaConfetti() {
    const base = {
      particleCount: 220,
      spread: 110,
      colors: ['#FFD700', '#FF6B6B', '#A29BFE', '#55EFC4', '#FD79A8', '#f5a623'],
      shapes: ['star', 'circle', 'square'],
      startVelocity: 60,
      ticks: 550,
      scalar: 1.3,
    }
    confetti({ ...base, origin: { y: 0.4 } })
    setTimeout(() => confetti({ ...base, angle: 60, origin: { x: 0.1, y: 0.5 }, particleCount: 160 }), 280)
    setTimeout(() => confetti({ ...base, angle: 120, origin: { x: 0.9, y: 0.5 }, particleCount: 160 }), 560)
  }

  function triggerConfetti(result) {
    const { activity, duration, unit } = result
    if (duration === 3 && unit === 'hours') {
      megaConfetti()
      return
    }
    if (activity === 'go eat something for') {
      foodConfetti()
    } else if (activity === 'take a break for' && unit === 'hours') {
      relaxConfetti()
    }
  }

  return { triggerConfetti }
}
