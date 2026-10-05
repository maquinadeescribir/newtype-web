import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { buildResponse } from '../../services/dialogue'

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
    <div className="char-scene">
      <img
        className="char-art"
        data-state={effectiveState}
        src="./assets/scene-combined.png"
        alt="Lofi office companion seated at a desk, with city and mountains visible through the windows"
      />
      <div className="char-vignette" aria-hidden="true" />

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
