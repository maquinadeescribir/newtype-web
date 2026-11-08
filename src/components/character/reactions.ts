import type { LogKind } from '../../types'

export type Reaction = 'nod' | 'celebrate' | 'focus' | 'smile' | 'soothe' | 'wave' | 'sip' | 'write' | 'alert'

export const REACTION_BURST: Record<Reaction, string> = {
  nod: '✔️',
  celebrate: '🎉',
  focus: '🎯',
  smile: '😊',
  soothe: '💜',
  wave: '👋',
  sip: '☕',
  write: '✍️',
  alert: '⚠️',
}

export const REACTION_MS = 1500

/** Map a log entry (kind + text, as written by store.logEvent) to a reaction. Returns null for no reaction. */
export function reactionForLog(kind: LogKind, text: string): Reaction | null {
  if (kind === 'scroll') return 'alert'
  if (kind === 'timer') {
    if (text.startsWith('Timer done')) return 'celebrate'
    if (text.startsWith('Timer started') || text.startsWith('Stopwatch started') || text.startsWith('Timer resumed')) return 'focus'
    return null
  }
  if (kind === 'goal') {
    if (text.startsWith('Goal completed')) return 'celebrate'
    if (text.startsWith('Goal added')) return 'write'
    return null
  }
  if (kind === 'reminder') return text.startsWith('Logged:') ? 'nod' : null
  if (kind === 'app') {
    if (text.startsWith('Good thing')) return 'smile'
    if (text.startsWith('Good deed done')) return 'celebrate'
    if (text.startsWith('AHH')) return 'soothe'
    if (text.startsWith('Water') || text.startsWith('Coffee')) return 'sip'
    if (text.startsWith('Checklist done')) return 'nod'
    if (text.startsWith('Day part:')) return 'wave'
    if (text.startsWith('Food logged') || text.startsWith('Body scan')) return 'nod'
  }
  return null
}
