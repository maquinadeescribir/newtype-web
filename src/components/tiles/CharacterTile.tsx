import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { buildResponse } from '../../services/dialogue'

function skyColors(hour: number): [string, string, string] {
  if (hour >= 5 && hour < 11) return ['#2b3a5c', '#6b4a6b', '#ffb74d'] // morning
  if (hour >= 11 && hour < 17) return ['#1b2a4a', '#3a6ea5', '#5aa0c8'] // day
  if (hour >= 17 && hour < 20) return ['#2a1f3d', '#7a3a4a', '#ff7043'] // sundown
  return ['#0d1117', '#1b2a4a', '#2a3a5a'] // night
}

export default function CharacterTile() {
  const characterState = useAppStore((s) => s.characterState)
  const characterSpeech = useAppStore((s) => s.characterSpeech)
  const setCharacterState = useAppStore((s) => s.setCharacterState)
  const speak = useAppStore((s) => s.speak)
  const clearSpeech = useAppStore((s) => s.clearSpeech)
  const timers = useAppStore((s) => s.timers)
  const medications = useAppStore((s) => s.medications)
  const goals = useAppStore((s) => s.goals)
  const scrollTimeMs = useAppStore((s) => s.scrollTimeMs)
  const lastActivity = useAppStore((s) => s.lastActivity)
  const createTimer = useAppStore((s) => s.createTimer)

  const [listening, setListening] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const [skyTop, skyHorizon, ambient] = useMemo(() => skyColors(new Date().getHours()), [])

  const anyRunning = timers.some((t) => t.status === 'running')
  const effectiveState = characterState === 'idle' && anyRunning ? 'working' : characterState

  // auto-clear speech after a few seconds
  useEffect(() => {
    if (!characterSpeech) return
    const ms = Math.min(6000, 1800 + characterSpeech.length * 45)
    const t = setTimeout(() => {
      clearSpeech()
      setCharacterState(anyRunning ? 'working' : 'idle')
    }, ms)
    return () => clearTimeout(t)
  }, [characterSpeech, clearSpeech, setCharacterState, anyRunning])

  useEffect(() => {
    if (listening) inputRef.current?.focus()
  }, [listening])

  function openTalk() {
    setListening(true)
    setCharacterState('listening')
  }

  function closeTalk() {
    setListening(false)
    setInput('')
    setCharacterState(anyRunning ? 'working' : 'idle')
  }

  function submit() {
    const text = input.trim()
    if (!text) {
      closeTalk()
      return
    }
    const result = buildResponse(text, { timers, medications, goals, scrollTimeMs, lastActivity })
    setInput('')
    setListening(false)
    setCharacterState('thinking')
    setTimeout(() => {
      if (result.action === 'timer' && result.durationMin) {
        createTimer(result.label || 'focus', result.durationMin)
      }
      speak(result.text)
    }, 550)
  }

  return (
    <div className="char-scene">
      <svg viewBox="0 0 240 180" className="char-svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="saw-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={skyTop} />
            <stop offset="1" stopColor={skyHorizon} />
          </linearGradient>
        </defs>

        {/* Background layer — sky */}
        <rect x="0" y="0" width="240" height="122" fill="url(#saw-sky)" />
        <circle cx="196" cy="40" r="12" fill={ambient} opacity="0.8" />
        <ellipse cx="60" cy="34" rx="18" ry="6" fill="#ffffff" opacity="0.08" />
        <ellipse cx="120" cy="22" rx="24" ry="7" fill="#ffffff" opacity="0.06" />

        {/* Background layer — skyline silhouette */}
        <g fill="#10141f">
          <rect x="0" y="92" width="34" height="30" />
          <rect x="40" y="74" width="26" height="48" />
          <rect x="72" y="88" width="40" height="34" />
          <rect x="118" y="66" width="22" height="56" />
          <rect x="146" y="82" width="36" height="40" />
          <rect x="188" y="70" width="30" height="52" />
          <rect x="222" y="92" width="18" height="30" />
        </g>
        <g fill="#26303f">
          <rect x="44" y="80" width="4" height="4" />
          <rect x="52" y="88" width="4" height="4" />
          <rect x="76" y="94" width="4" height="4" />
          <rect x="84" y="102" width="4" height="4" />
          <rect x="122" y="72" width="4" height="4" />
          <rect x="152" y="90" width="4" height="4" />
          <rect x="194" y="78" width="4" height="4" />
        </g>

        {/* Office layer — interior wall + floor */}
        <rect x="0" y="122" width="240" height="36" fill="#161b22" />
        <rect x="0" y="158" width="240" height="22" fill="#10141f" />
        <rect x="0" y="138" width="240" height="12" fill="#21262d" />

        {/* Worker layer — monitors on desk */}
        <rect x="36" y="102" width="46" height="30" rx="3" fill="#0d1117" stroke="#30363d" strokeWidth="1" />
        <rect x="39" y="105" width="40" height="24" fill="#0a2a1a" />
        <rect x="39" y="105" width="40" height="24" fill="none" stroke="#4caf50" strokeWidth="1" opacity="0.5" />
        <rect x="39" y="129" width="4" height="9" fill="#30363d" />
        <rect x="158" y="102" width="46" height="30" rx="3" fill="#0d1117" stroke="#30363d" strokeWidth="1" />
        <rect x="161" y="105" width="40" height="24" fill="#2a0a1e" />
        <rect x="161" y="105" width="40" height="24" fill="none" stroke="#ff006e" strokeWidth="1" opacity="0.5" />
        <rect x="178" y="129" width="4" height="9" fill="#30363d" />

        {/* Worker layer — character */}
        <g className="char-figure" data-state={effectiveState}>
          <rect x="96" y="96" width="34" height="42" rx="13" fill="#2a3a5a" />
          <rect x="90" y="102" width="8" height="22" rx="4" fill="#243352" />
          <rect x="128" y="102" width="8" height="22" rx="4" fill="#243352" />
          <circle cx="113" cy="82" r="14" fill="#c9a06b" />
          <path d="M99 80 a14 12 0 0 1 28 0 l0 -6 a14 14 0 0 0 -28 0 z" fill="#2a2f3a" />
        </g>

        {/* Desk contents */}
        <rect x="86" y="128" width="10" height="10" rx="2" fill="#3a2a1a" />
        <rect x="220" y="126" width="12" height="12" rx="2" fill="#2a3a2a" />
        <path d="M226 126 l0 -8 M222 124 l4 2 M230 124 l-4 2" stroke="#4caf50" strokeWidth="2" fill="none" />
      </svg>

      {characterSpeech && <div className="char-speech">{characterSpeech}</div>}

      {listening ? (
        <div className="char-input-row">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
              if (e.key === 'Escape') closeTalk()
            }}
            placeholder='Try "start a 25 minute timer called report draft"'
          />
          <button className="btn btn-primary btn-sm" onClick={submit}>
            Say
          </button>
        </div>
      ) : (
        <button className="tap-to-talk" onClick={openTalk}>
          Tap to talk
        </button>
      )}
    </div>
  )
}
