let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    try { ctx = new AudioContext() } catch { return null }
  }
  return ctx
}

function tone(freq: number, durationMs: number, type: OscillatorType = 'triangle') {
  const ac = getCtx()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.18, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + durationMs / 1000)
  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + durationMs / 1000)
}

export function ding() {
  tone(440, 80)
  if (navigator.vibrate) navigator.vibrate(50)
}

export function thud() {
  tone(220, 150)
}
