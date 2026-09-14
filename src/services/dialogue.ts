import type { Timer, Medication, Goal } from '../types'
import { formatMs, formatScrollTime, formatRelative } from '../lib/util'

export interface DialogueContext {
  timers: Timer[]
  medications: Medication[]
  goals: Goal[]
  scrollTimeMs: number
  lastActivity: string
}

export interface DialogueResult {
  text: string
  action?: 'timer'
  durationMin?: number
  label?: string
}

export function buildResponse(input: string, ctx: DialogueContext): DialogueResult {
  const lower = input.toLowerCase().trim()

  // timer creation: "start a 25 minute timer called report draft"
  if (/(timer|start|countdown)/.test(lower) && /\d+/.test(lower)) {
    const durMatch = lower.match(/(\d+)\s*(min|mins|minutes|hr|hrs|hours|hour|sec|secs|seconds)?/)
    if (durMatch) {
      let durationMin = parseInt(durMatch[1], 10)
      const unit = durMatch[2] || 'min'
      if (unit.startsWith('hr')) durationMin *= 60
      if (unit.startsWith('sec')) durationMin = Math.max(1, Math.round(durationMin / 60))
      const labelMatch = input.match(/(?:called|for|timer for)\s+(.+)$/i)
      const label = labelMatch ? labelMatch[1].trim().replace(/[.?!]+$/g, '') : 'focus'
      if (ctx.timers.length >= 3) {
        return { text: 'Three timers already running. Clear one first.' }
      }
      return { text: `${durationMin} minute timer started for ${label}.`, action: 'timer', durationMin, label }
    }
  }

  // what's running / timers
  if (/what.{0,20}(running|active)|active timers|^\s*timers?\b/.test(lower) && !/start|new/.test(lower)) {
    return { text: runningSummary(ctx) }
  }

  // routine items (stealth: no "med"/"medication" in the reply)
  if (/med|medication|pill|vyvanse|dose|vitamin|supplement|routine/.test(lower)) {
    return { text: routineSummary(ctx) }
  }

  // goals
  if (/goal/.test(lower)) {
    return { text: goalsSummary(ctx) }
  }

  // scroll / how long
  if (/scroll|how long|doom|doomscroll/.test(lower)) {
    return { text: `You've been scrolling ${formatScrollTime(ctx.scrollTimeMs)}.` }
  }

  // nothing matters
  if (/nothing matters|pointless|why bother|give up|hopeless|can'?t do/.test(lower)) {
    return { text: `That's the depression. Here's what's real: ${factsSummary(ctx)} Want to do something now?` }
  }

  // greeting
  if (/^(hi|hey|hello|yo)\b/.test(lower)) {
    return { text: `Hey. ${runningSummary(ctx)}` }
  }

  // fallback
  return {
    text: `I run timers, track your routine, and watch scroll time. Try "start a 25 minute timer called report draft".`,
  }
}

function runningSummary(ctx: DialogueContext): string {
  const active = ctx.timers.filter((t) => t.status === 'running' || t.status === 'paused')
  if (active.length === 0) return 'Nothing running. Start a timer.'
  return active
    .map((t) => {
      const v = t.type === 'stopwatch' ? formatMs(t.elapsedMs) : formatMs(t.remainingMs)
      const state = t.status === 'paused' ? 'paused' : 'left'
      return `${t.label} — ${v} ${state}`
    })
    .join('. ')
}

function routineSummary(ctx: DialogueContext): string {
  const items = ctx.medications
  if (items.length === 0) return 'Nothing on your routine yet. Tap the routine tile to add an item.'
  return items
    .map((m) => {
      if (m.lastTakenAt) return `${m.name}: logged ${formatRelative(m.lastTakenAt)}`
      return `${m.name}: not done${m.scheduleTime ? ` (due ${m.scheduleTime})` : ''}`
    })
    .join('. ')
}

function goalsSummary(ctx: DialogueContext): string {
  const active = ctx.goals.filter((g) => g.status === 'active')
  if (active.length === 0) return 'No goals set. You can add up to three.'
  return active.map((g, i) => `${i + 1}. ${g.title}`).join('  ')
}

function factsSummary(ctx: DialogueContext): string {
  const facts: string[] = []
  const active = ctx.timers.filter((t) => t.status !== 'expired')
  if (active.length) facts.push(`${active.length} timer${active.length > 1 ? 's' : ''} going`)
  const item = ctx.medications[0]
  if (item?.lastTakenAt) facts.push(`${item.name} done ${formatRelative(item.lastTakenAt)}`)
  const activeGoals = ctx.goals.filter((g) => g.status === 'active')
  if (activeGoals.length) facts.push(`${activeGoals.length} active goal${activeGoals.length > 1 ? 's' : ''}`)
  if (ctx.lastActivity) facts.push(`last working on "${ctx.lastActivity}"`)
  if (facts.length === 0) return 'you showed up today.'
  return facts.join(', ') + '.'
}
