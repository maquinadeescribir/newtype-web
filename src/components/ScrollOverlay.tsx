import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { formatScrollTime } from '../lib/util'
import type { Goal } from '../types'

export default function ScrollOverlay() {
  const scrollOverlayOpen = useAppStore((s) => s.scrollOverlayOpen)
  const closeScrollOverlay = useAppStore((s) => s.closeScrollOverlay)
  const scrollTimeMs = useAppStore((s) => s.scrollTimeMs)
  const goals = useAppStore((s) => s.goals)
  const registerIntervention = useAppStore((s) => s.registerIntervention)
  const resetScrollTime = useAppStore((s) => s.resetScrollTime)
  const createTimer = useAppStore((s) => s.createTimer)
  const speak = useAppStore((s) => s.speak)
  const [goalIndex, setGoalIndex] = useState(0)

  if (!scrollOverlayOpen) return null

  const activeGoals = goals.filter((g) => g.status === 'active')
  const suggestion: Goal | undefined = activeGoals[goalIndex % Math.max(activeGoals.length, 1)]
  const timeLabel = formatScrollTime(scrollTimeMs)

  function accept(goal?: Goal) {
    if (goal) {
      createTimer(goal.title, 25)
    }
    registerIntervention(true)
    resetScrollTime()
    closeScrollOverlay()
    speak(goal ? `25 minute timer started for ${goal.title}.` : 'Okay. Starting a timer.')
  }

  function dismiss() {
    registerIntervention(false)
    resetScrollTime()
    closeScrollOverlay()
    speak('Okay.') // FR-SI-13: shame-free — no guilt, no follow-up
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-title">Scroll check</div>
        <div className="overlay-scrolltime">📵 {timeLabel} scrolling</div>
        <div className="overlay-body">
          {suggestion ? (
            <>
              Been scrolling {timeLabel}. You said you wanted to <span className="overlay-goal">{suggestion.title}</span>. 25 minutes?
            </>
          ) : (
            <>Been scrolling {timeLabel}. Want to take a break? Breathing, stretch, or a timer.</>
          )}
        </div>
        <div className="overlay-actions">
          {suggestion ? (
            <>
              <button className="btn btn-primary" onClick={() => accept(suggestion)}>
                Work on {suggestion.title} — 25 min
              </button>
              {activeGoals.length > 1 && (
                <button className="btn" onClick={() => setGoalIndex((i) => (i + 1) % activeGoals.length)}>
                  Pick a different goal
                </button>
              )}
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => accept(undefined)}>
              Start a 25 minute timer
            </button>
          )}
          <button className="btn btn-ghost" onClick={dismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}
