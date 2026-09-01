import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { formatMs } from '../../lib/util'
import { TIMER_PRESETS_MIN } from '../../types'
import type { Timer } from '../../types'

function TimerBar({ timer }: { timer: Timer }) {
  const pauseTimer = useAppStore((s) => s.pauseTimer)
  const resumeTimer = useAppStore((s) => s.resumeTimer)
  const deleteTimer = useAppStore((s) => s.deleteTimer)

  const value = timer.type === 'stopwatch' ? formatMs(timer.elapsedMs) : formatMs(timer.remainingMs)
  const urgent = timer.type === 'countdown' && timer.status === 'running' && timer.remainingMs < 60000
  const cls = ['timer-bar', timer.status === 'paused' ? 'paused' : '', timer.status === 'expired' ? 'expired' : '', urgent ? 'urgent' : '']
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cls} style={{ borderLeftColor: timer.color }} onClick={() => (timer.status === 'running' ? pauseTimer(timer.id) : resumeTimer(timer.id))}>
      <span className="timer-label">{timer.label}</span>
      <span className="timer-value">{value}</span>
      <button
        className="icon-btn"
        title="Delete"
        onClick={(e) => {
          e.stopPropagation()
          deleteTimer(timer.id)
        }}
      >
        ✕
      </button>
    </div>
  )
}

export default function TimerStackTile() {
  const timers = useAppStore((s) => s.timers)
  const createTimer = useAppStore((s) => s.createTimer)
  const createStopwatch = useAppStore((s) => s.createStopwatch)
  const [creating, setCreating] = useState(false)
  const [label, setLabel] = useState('')
  const [minutes, setMinutes] = useState(25)

  const atCap = timers.length >= 3

  function startCountdown() {
    const name = label.trim() || 'focus'
    createTimer(name, minutes)
    setLabel('')
    setCreating(false)
  }

  function startStopwatch() {
    const name = label.trim() || 'focus'
    createStopwatch(name)
    setLabel('')
    setCreating(false)
  }

  return (
    <div className="tile-body">
      <div className="timer-stack">
        {timers.map((t) => (
          <TimerBar key={t.id} timer={t} />
        ))}

        {creating ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="pill-input">
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="What are you working on?"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && startCountdown()}
              />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {TIMER_PRESETS_MIN.map((m) => (
                <button
                  key={m}
                  className="btn btn-sm"
                  style={minutes === m ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
                  onClick={() => setMinutes(m)}
                >
                  {m}m
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-primary btn-sm" onClick={startCountdown} disabled={!label.trim()}>
                Start {minutes}m
              </button>
              <button className="btn btn-sm" onClick={startStopwatch} disabled={!label.trim()}>
                Stopwatch
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setCreating(false)}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="timer-new" onClick={() => setCreating(true)} disabled={atCap}>
            + New Timer
          </button>
        )}
      </div>
    </div>
  )
}
