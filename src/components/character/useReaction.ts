import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { REACTION_MS, reactionForLog, type Reaction } from './reactions'

export interface ReactionState {
  reaction: Reaction | null
  /** increments on every reaction so the emoji burst can remount/replay */
  seq: number
}

/**
 * Watches the newest store log entry and plays a short reaction. Latest wins:
 * a new entry cancels the pending clear timer and restarts the animation.
 * Entries already present at mount are ignored.
 */
export function useReaction(): ReactionState {
  const latest = useAppStore((s) => s.log[0])
  const [state, setState] = useState<ReactionState>({ reaction: null, seq: 0 })
  const lastId = useRef<string | undefined>(latest?.id)
  const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!latest || latest.id === lastId.current) return
    lastId.current = latest.id
    const next = reactionForLog(latest.kind, latest.text)
    if (!next) return

    if (clearTimer.current) clearTimeout(clearTimer.current)
    if (raf.current !== undefined) cancelAnimationFrame(raf.current)
    // drop to null first so repeating the same reaction restarts the CSS animation
    setState((s) => ({ reaction: null, seq: s.seq }))
    raf.current = requestAnimationFrame(() => {
      setState((s) => ({ reaction: next, seq: s.seq + 1 }))
      clearTimer.current = setTimeout(() => setState((s) => ({ reaction: null, seq: s.seq })), REACTION_MS)
    })
  }, [latest])

  useEffect(
    () => () => {
      if (clearTimer.current) clearTimeout(clearTimer.current)
      if (raf.current !== undefined) cancelAnimationFrame(raf.current)
    },
    [],
  )

  return state
}
