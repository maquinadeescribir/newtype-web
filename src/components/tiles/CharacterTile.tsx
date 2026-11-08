import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { buildResponse } from '../../services/dialogue'
import type { DayPart } from '../../types'
import Scene from '../character/scenes'
import { useReaction } from '../character/useReaction'
import { REACTION_BURST } from '../character/reactions'
import '../character/character.css'

// FR-DP-02: per-day-part body-double scene (v1: emoji + label + accent, layered over the art).
const DAY_PART_SCENE: Record<DayPart, { emoji: string; label: string; accent: string }> = {
  morning: { emoji: '☕', label: 'getting ready', accent: '#ffb347' },
  commuteTo: { emoji: '🚆', label: 'on the train', accent: '#4fc3f7' },
  work: { emoji: '💼', label: 'focus', accent: '#81c784' },
  commuteFrom: { emoji: '🚆', label: 'heading home', accent: '#ba68c8' },
  evening: { emoji: '🛋️', label: 'winding down', accent: '#ff8a65' },
  off: { emoji: '🌿', label: 'off duty', accent: '#a5d6a7' },
}

export default function CharacterTile() {
  const characterState = useAppStore((s) => s.characterState)
  const dayPart = useAppStore((s) => s.dayPart)
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

  const { reaction, seq } = useReaction()
  const [listening, setListening] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const anyRunning = timers.some((timer) => timer.status === 'running')
  const effectiveState = characterState === 'idle' && anyRunning ? 'working' : characterState

  useEffect(() => {
    if (!characterSpeech) return
    const ms = Math.min(6000, 1800 + characterSpeech.length * 45)
    const timeout = setTimeout(() => {
      clearSpeech()
      setCharacterState(anyRunning ? 'working' : 'idle')
    }, ms)
    return () => clearTimeout(timeout)
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
    <div
      className="char-scene"
      data-daypart={dayPart}
      data-scene={dayPart}
      data-state={effectiveState}
      data-reaction={reaction ?? 'none'}
      style={{ '--scene-accent': DAY_PART_SCENE[dayPart].accent } as CSSProperties}
    >
      <Scene dayPart={dayPart} />
      {reaction && (
        <span key={seq} className="char-burst" aria-hidden="true">
          {REACTION_BURST[reaction]}
        </span>
      )}
      <div className="char-vignette" aria-hidden="true" />
      <div className="char-daypart" role="status" aria-label={`Scene: ${DAY_PART_SCENE[dayPart].label}`}>
        <span className="char-daypart-emoji" aria-hidden="true">
          {DAY_PART_SCENE[dayPart].emoji}
        </span>
        <span>{DAY_PART_SCENE[dayPart].label}</span>
      </div>

      {characterSpeech && <div className="char-speech">{characterSpeech}</div>}

      {listening ? (
        <div className="char-input-row">
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit()
              if (event.key === 'Escape') closeTalk()
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
