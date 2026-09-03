import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { buildResponse } from '../../services/dialogue'
import { formatMs } from '../../lib/util'

interface SkyBand {
  top: string
  mid: string
  bot: string
  isNight: boolean
}

function skyAt(hour: number): SkyBand {
  if (hour >= 6 && hour < 11) return { top: '#2b3a5c', mid: '#6b4a6b', bot: '#ffb74d', isNight: false } // morning
  if (hour >= 11 && hour < 17) return { top: '#1b2a4a', mid: '#3a6ea5', bot: '#5aa0c8', isNight: false } // day
  if (hour >= 17 && hour < 20) return { top: '#2a1f3d', mid: '#7a3a4a', bot: '#ff7043', isNight: false } // sunset
  return { top: '#0d1117', mid: '#1b2a4a', bot: '#2a3a5a', isNight: true } // night
}

const STARS: [number, number, number][] = [
  [30, 22, 1.2],
  [48, 64, 0.9],
  [96, 30, 1.0],
  [122, 56, 0.8],
  [150, 22, 1.1],
  [205, 34, 0.9],
  [238, 58, 0.8],
  [306, 36, 1.0],
]

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

  const sky = useMemo(() => skyAt(new Date().getHours()), [])

  const anyRunning = timers.some((t) => t.status === 'running')
  const effectiveState = characterState === 'idle' && anyRunning ? 'working' : characterState

  // monitor data: top 3 non-expired timers + first timer's time
  const active = timers.filter((t) => t.status !== 'expired').slice(0, 3)
  const top = active[0]
  const timeText = top ? (top.type === 'stopwatch' ? formatMs(top.elapsedMs) : formatMs(top.remainingMs)) : '--:--'
  const barWidths = [26, 38, 30]

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
      <svg viewBox="0 0 320 240" className="char-svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="saw-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={sky.top} />
            <stop offset="0.55" stopColor={sky.mid} />
            <stop offset="1" stopColor={sky.bot} />
          </linearGradient>
          <linearGradient id="saw-desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2e313c" />
            <stop offset="1" stopColor="#23262f" />
          </linearGradient>
          <linearGradient id="saw-hair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#242b40" />
            <stop offset="1" stopColor="#141824" />
          </linearGradient>
        </defs>

        {/* SKY */}
        <rect x="0" y="0" width="320" height="140" fill="url(#saw-sky)" />
        {sky.isNight ? (
          <g>
            {STARS.map(([cx, cy, r], i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="#cdd6ea" opacity="0.7" />
            ))}
            <circle cx="70" cy="42" r="15" fill="#e8ecf5" opacity="0.9" />
            <circle cx="76" cy="38" r="12" fill={sky.top} opacity="0.85" />
          </g>
        ) : (
          <g>
            <circle cx="70" cy="42" r="15" fill="#ffd9a0" opacity="0.9" />
            <circle cx="70" cy="42" r="26" fill="#ffd9a0" opacity="0.15" />
          </g>
        )}
        {!sky.isNight && (
          <g>
            <ellipse cx="120" cy="34" rx="40" ry="7" fill="#ffffff" opacity="0.1" />
            <ellipse cx="190" cy="50" rx="30" ry="5" fill="#ffffff" opacity="0.07" />
          </g>
        )}

        {/* SKYLINE silhouette */}
        <g fill="#0f141d">
          <rect x="0" y="96" width="44" height="44" />
          <rect x="48" y="78" width="30" height="62" />
          <rect x="84" y="104" width="40" height="36" />
          <rect x="130" y="88" width="26" height="52" />
          <rect x="160" y="70" width="22" height="70" />
          <rect x="186" y="100" width="34" height="40" />
          <rect x="224" y="82" width="18" height="58" />
          <rect x="298" y="92" width="22" height="48" />
        </g>
        <g fill="#2b3648">
          <rect x="52" y="84" width="4" height="4" />
          <rect x="60" y="92" width="4" height="4" />
          <rect x="90" y="110" width="4" height="4" />
          <rect x="100" y="118" width="4" height="4" />
          <rect x="134" y="94" width="4" height="4" />
          <rect x="166" y="78" width="4" height="4" />
          <rect x="190" y="108" width="4" height="4" />
          <rect x="230" y="90" width="4" height="4" />
          <rect x="302" y="100" width="4" height="4" />
        </g>

        {/* TOKYO TOWER */}
        <g fill="#161c29">
          <polygon points="258,140 270,58 288,58 300,140" />
          <rect x="258" y="132" width="42" height="8" />
          <rect x="264" y="82" width="30" height="6" />
          <rect x="266" y="60" width="26" height="5" />
          <polygon points="272,58 279,30 279,58" />
        </g>
        <g stroke="#39455c" strokeWidth="1" fill="none">
          <line x1="266" y1="132" x2="270" y2="82" />
          <line x1="292" y1="132" x2="288" y2="82" />
          <line x1="270" y1="82" x2="279" y2="60" />
          <line x1="288" y1="82" x2="279" y2="60" />
          <line x1="268" y1="132" x2="290" y2="132" />
        </g>
        <g fill="#ff9a5a" opacity="0.9">
          <circle cx="271" cy="86" r="1.6" />
          <circle cx="283" cy="96" r="1.4" />
          <circle cx="276" cy="112" r="1.5" />
        </g>

        {/* INTERIOR WALL */}
        <rect x="0" y="140" width="320" height="26" fill="#161b22" />
        <rect x="0" y="140" width="320" height="2" fill="#242a34" />

        {/* CHARACTER (animated) */}
        <g className="char-figure" data-state={effectiveState}>
          {/* hair back */}
          <path
            d="M132 96 C 126 54, 146 42, 160 42 C 174 42, 194 54, 188 96 C 191 120, 194 142, 186 156 C 178 166, 166 168, 160 168 C 154 168, 142 166, 134 156 C 126 142, 129 120, 132 96 Z"
            fill="url(#saw-hair)"
          />
          {/* neck */}
          <rect x="152" y="104" width="16" height="20" rx="5" fill="#e2b78f" />
          <rect x="152" y="114" width="16" height="7" fill="#d3a67e" />
          {/* torso / blazer */}
          <path d="M124 172 L129 144 Q132 128 152 126 L168 126 Q188 128 191 144 L196 172 Z" fill="#1b1e28" />
          <path d="M148 126 L160 140 L172 126 L168 130 L160 142 L152 130 Z" fill="#eceff4" />
          <path d="M148 126 L160 140 L154 126 Z" fill="#252a3a" />
          <path d="M172 126 L160 140 L166 126 Z" fill="#252a3a" />
          {/* left shoulder / upper arm hint */}
          <path d="M124 172 C 116 166, 113 154, 118 144 L 132 144 C 126 152, 128 164, 136 172 Z" fill="#1b1e28" />
          {/* head */}
          <g>
            <path
              d="M139 96 C 139 66, 146 58, 160 58 C 174 58, 181 66, 181 96 C 181 106, 178 112, 174 117 C 170 122, 164 123, 160 123 C 156 123, 150 122, 146 117 C 142 112, 139 106, 139 96 Z"
              fill="#e9c39f"
            />
            <path
              d="M139 102 C 143 120, 154 123, 160 123 C 166 123, 177 120, 181 102 C 176 121, 168 124, 160 124 C 152 124, 144 121, 139 102 Z"
              fill="#d8ac85"
              opacity="0.5"
            />
            <path
              d="M139 94 C 139 66, 147 58, 160 58 C 173 58, 181 66, 181 94 C 176 80, 172 72, 166 74 C 164 68, 159 72, 155 69 C 151 72, 147 69, 144 75 C 142 72, 140 82, 139 94 Z"
              fill="#242b40"
            />
            <path d="M148 63 C 156 59, 166 59, 173 63 C 166 61, 154 61, 148 63 Z" fill="#39455c" opacity="0.7" />
            {/* eyes */}
            <path d="M144 91 Q150 85 156 91 Q150 97 144 91 Z" fill="#ffffff" />
            <path d="M144 91 Q150 85 156 91" stroke="#20263a" strokeWidth="1.4" fill="none" />
            <circle cx="150" cy="91" r="2.6" fill="#4a3550" />
            <circle cx="151" cy="90" r="0.9" fill="#ffffff" />
            <path d="M164 91 Q170 85 176 91 Q170 97 164 91 Z" fill="#ffffff" />
            <path d="M164 91 Q170 85 176 91" stroke="#20263a" strokeWidth="1.4" fill="none" />
            <circle cx="170" cy="91" r="2.6" fill="#4a3550" />
            <circle cx="171" cy="90" r="0.9" fill="#ffffff" />
            <path d="M143 90 L140 92 M141 91 L143 92" stroke="#20263a" strokeWidth="1.1" fill="none" />
            <path d="M177 90 L180 92 M179 91 L177 92" stroke="#20263a" strokeWidth="1.1" fill="none" />
            {/* brows */}
            <path d="M145 83 Q151 81 157 83" stroke="#242b40" strokeWidth="1.3" fill="none" />
            <path d="M163 83 Q169 81 175 83" stroke="#242b40" strokeWidth="1.3" fill="none" />
            {/* nose */}
            <path d="M160 91 L159 98 Q160 99 161 98" stroke="#d8ac85" strokeWidth="1.1" fill="none" />
            {/* mouth */}
            <path d="M155 107 Q160 111 165 107" stroke="#b06a4a" strokeWidth="1.7" fill="none" strokeLinecap="round" />
            {/* ear + earring */}
            <circle cx="139" cy="98" r="4" fill="#e9c39f" />
            <path d="M139 95 Q138 98 139 101" stroke="#d8ac85" strokeWidth="0.8" fill="none" />
            <circle cx="139" cy="103" r="1.6" fill="#ffd9a0" />
          </g>
          {/* right arm + fist near chin */}
          <path d="M168 152 C 180 140, 184 124, 181 118 L 173 120 C 176 130, 174 142, 162 152 Z" fill="#1b1e28" />
          <path
            d="M167 117 C 167 112, 171 109, 175 109 C 179 109, 182 112, 182 117 C 182 122, 178 125, 174 125 C 170 125, 167 122, 167 117 Z"
            fill="#e9c39f"
            stroke="#b9834f"
            strokeWidth="1.2"
          />
          <path d="M170 110 Q171 107 173 110 M175 109 Q176 106 178 109" stroke="#b9834f" strokeWidth="1" fill="none" />
        </g>

        {/* DESK surface */}
        <rect x="0" y="166" width="320" height="22" fill="url(#saw-desk)" />
        <rect x="0" y="166" width="320" height="2" fill="#3a3e49" />

        {/* LEFT MONITOR — live timer data */}
        <g>
          <rect x="44" y="128" width="58" height="38" rx="3" fill="#0d1117" stroke="#3a3e49" strokeWidth="1.5" />
          <rect x="48" y="132" width="50" height="30" fill="#0a2a1a" />
          <rect x="48" y="132" width="50" height="30" fill="none" stroke="#4caf50" strokeWidth="1" opacity="0.4" />
          {active.length === 0 ? (
            <g fill="#3a4a40" opacity="0.7">
              <rect x="52" y="136" width="26" height="5" rx="1" />
              <rect x="52" y="144" width="38" height="4" rx="1" />
              <rect x="52" y="151" width="30" height="4" rx="1" />
            </g>
          ) : (
            active.map((t, i) => (
              <rect key={t.id} x="52" y={136 + i * 8} width={barWidths[i] ?? 30} height="4" rx="1" fill={t.color} opacity="0.9" />
            ))
          )}
          <text x="52" y="160" fontFamily="monospace" fontSize="6.5" fill="#7ddb8a">
            {timeText}
          </text>
          <rect x="69" y="166" width="5" height="8" fill="#3a3e49" />
          <rect x="63" y="174" width="17" height="3" rx="1" fill="#2e313c" />
        </g>

        {/* RIGHT MONITOR — waveform */}
        <g>
          <rect x="218" y="124" width="58" height="42" rx="3" fill="#0d1117" stroke="#3a3e49" strokeWidth="1.5" />
          <rect x="222" y="128" width="50" height="34" fill="#2a0a1e" />
          <rect x="222" y="128" width="50" height="34" fill="none" stroke="#ff006e" strokeWidth="1" opacity="0.4" />
          <path
            d="M226 156 L230 150 L234 154 L238 146 L242 152 L246 144 L250 150 L254 143 L258 149 L262 146 L266 152"
            stroke="#ff3b8b"
            strokeWidth="1.4"
            fill="none"
          />
          <rect x="243" y="166" width="5" height="8" fill="#3a3e49" />
          <rect x="237" y="174" width="17" height="3" rx="1" fill="#2e313c" />
        </g>

        {/* KEYBOARD */}
        <rect x="112" y="172" width="52" height="8" rx="2" fill="#2b2e38" />
        <g fill="#3a3e49">
          <rect x="115" y="174" width="46" height="1.6" />
          <rect x="115" y="176.5" width="46" height="1.6" />
        </g>

        {/* LEFT forearm + hand on keyboard (animated, front layer) */}
        <g className="char-figure" data-state={effectiveState}>
          <path d="M132 150 C 124 158, 120 164, 122 170 L 138 170 C 136 162, 136 154, 142 150 Z" fill="#1b1e28" />
          <path
            d="M120 172 C 112 172, 108 176, 108 181 C 108 186, 114 189, 122 189 L 138 189 C 135 184, 131 174, 120 172 Z"
            fill="#e9c39f"
            stroke="#b9834f"
            strokeWidth="1.5"
          />
          <path d="M114 176 L 113 184 M 120 174 L 119 185 M 126 173 L 125 186 M 132 173 L 131 186" stroke="#c99a72" strokeWidth="1.3" fill="none" />
        </g>

        {/* PLANT */}
        <g>
          <path d="M98 168 L92 168 L94 180 L104 180 Z" fill="#3a2a1a" />
          <path d="M98 168 Q96 156 90 152 Q94 148 98 154" fill="#3f7a4a" />
          <path d="M98 168 Q102 154 108 152 Q104 148 98 152" fill="#4caf50" />
          <path d="M98 168 Q92 158 86 160 Q92 156 98 158" fill="#35703f" />
          <path d="M98 168 Q104 158 110 160 Q104 156 98 160" fill="#4caf50" />
        </g>

        {/* MUG */}
        <g>
          <path d="M268 172 L268 180 L278 180 L278 172 Z" fill="#2b2e38" />
          <path d="M278 173 Q285 174 285 178 Q285 181 278 181" fill="none" stroke="#2b2e38" strokeWidth="2" />
        </g>

        {/* DESK front */}
        <rect x="0" y="188" width="320" height="52" fill="#1a1d25" />
        <rect x="0" y="188" width="320" height="2" fill="#0e1117" />
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
