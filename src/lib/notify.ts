// Timer-completion notification: Web Audio chime + browser notification (both best-effort).
let audioCtx: AudioContext | null = null

function chime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return
    audioCtx = audioCtx || new Ctx()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
    const now = audioCtx.currentTime
    const notes = [880, 1318.5] // A5 → E6, a soft two-note "done"
    notes.forEach((freq, i) => {
      const osc = audioCtx!.createOscillator()
      const gain = audioCtx!.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = now + i * 0.16
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.linearRampToValueAtTime(0.22, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55)
      osc.connect(gain)
      gain.connect(audioCtx!.destination)
      osc.start(start)
      osc.stop(start + 0.6)
    })
  } catch {
    /* audio is best-effort — never throw from a timer */
  }
}

function browserNotify(label: string) {
  try {
    if (!('Notification' in window)) return
    if (Notification.permission === 'granted') {
      new Notification('Timer done', { body: label, tag: 'saw-timer' })
    } else if (Notification.permission === 'default') {
      // Best-effort; without a prior user gesture this may be ignored, which is fine.
      void Notification.requestPermission().then((p) => {
        if (p === 'granted') new Notification('Timer done', { body: label, tag: 'saw-timer' })
      })
    }
  } catch {
    /* ignore */
  }
}

export function notifyTimerDone(label: string) {
  chime()
  browserNotify(label)
}
