import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TileConfig, Timer, Medication, Goal, CharacterState } from '../types'
import { TILE_META } from '../types'
import { TIMER_COLORS } from '../constants/theme'
import { defaultLayout } from '../constants/defaultLayout'
import { uid, tileRows } from '../lib/util'

let timerColorIndex = 0

interface AppStore {
  onboardingComplete: boolean
  onboardingStep: number
  setOnboardingStep: (n: number) => void
  completeOnboarding: () => void
  resetOnboarding: () => void

  tiles: TileConfig[]
  addTile: (type: TileConfig['type']) => void
  removeTile: (type: TileConfig['type']) => void
  resizeTile: (type: TileConfig['type'], size: TileConfig['size']) => void
  resetLayout: () => void

  timers: Timer[]
  createTimer: (label: string, durationMin: number, type?: Timer['type']) => void
  createStopwatch: (label: string) => void
  pauseTimer: (id: string) => void
  resumeTimer: (id: string) => void
  deleteTimer: (id: string) => void
  tickTimers: (now: number) => void

  medications: Medication[]
  addMedication: (m: Omit<Medication, 'id'>) => void
  updateMedication: (id: string, patch: Partial<Medication>) => void
  logMed: (id: string) => void

  goals: Goal[]
  addGoal: (g: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, patch: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  scrollEnabled: boolean
  scrollThresholdMin: number
  scrollCoolDownMin: number
  scrollTimeMs: number
  lastInterventionAt: number | null
  interventionsToday: number
  interventionsAccepted: number
  setScrollEnabled: (v: boolean) => void
  setScrollThresholdMin: (v: number) => void
  setScrollCoolDownMin: (v: number) => void
  addScrollTime: (deltaMs: number) => void
  resetScrollTime: () => void
  registerIntervention: (accepted: boolean) => void

  characterState: CharacterState
  characterSpeech: string | null
  setCharacterState: (s: CharacterState) => void
  speak: (text: string) => void
  clearSpeech: () => void

  lastActivity: string
  lastActivityAt: number | null
  setLastActivity: (text: string) => void

  scrollOverlayOpen: boolean
  openScrollOverlay: () => void
  closeScrollOverlay: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      onboardingStep: 0,
      setOnboardingStep: (n) => set({ onboardingStep: n }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      resetOnboarding: () => set({ onboardingComplete: false, onboardingStep: 0 }),

      tiles: defaultLayout,
      addTile: (type) => {
        const tiles = get().tiles
        const existing = tiles.find((t) => t.type === type)
        if (existing) {
          set({ tiles: tiles.map((t) => (t.type === type ? { ...t, visible: true } : t)) })
          return
        }
        const meta = TILE_META[type]
        const maxRow = tiles.reduce((m, t) => Math.max(m, t.position.row + tileRows(t.size)), 0)
        set({
          tiles: [...tiles, { type, size: meta.defaultSize, position: { row: maxRow, col: 0 }, visible: true }],
        })
      },
      removeTile: (type) =>
        set({ tiles: get().tiles.map((t) => (t.type === type ? { ...t, visible: false } : t)) }),
      resizeTile: (type, size) =>
        set({ tiles: get().tiles.map((t) => (t.type === type ? { ...t, size } : t)) }),
      resetLayout: () => set({ tiles: defaultLayout }),

      timers: [],
      createTimer: (label, durationMin, type = 'countdown') => {
        const durationMs = durationMin * 60 * 1000
        const now = Date.now()
        const timer: Timer = {
          id: uid(),
          label,
          type,
          color: TIMER_COLORS[timerColorIndex++ % TIMER_COLORS.length],
          status: 'running',
          durationMs,
          remainingMs: durationMs,
          elapsedMs: 0,
          lastTickAt: now,
          createdAt: now,
        }
        set({ timers: [...get().timers, timer] })
      },
      createStopwatch: (label) => {
        const now = Date.now()
        const timer: Timer = {
          id: uid(),
          label,
          type: 'stopwatch',
          color: TIMER_COLORS[timerColorIndex++ % TIMER_COLORS.length],
          status: 'running',
          durationMs: 0,
          remainingMs: 0,
          elapsedMs: 0,
          lastTickAt: now,
          createdAt: now,
        }
        set({ timers: [...get().timers, timer] })
      },
      pauseTimer: (id) =>
        set({ timers: get().timers.map((t) => (t.id === id ? { ...t, status: 'paused' as const } : t)) }),
      resumeTimer: (id) =>
        set({
          timers: get().timers.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status: t.type === 'countdown' && t.remainingMs <= 0 ? ('expired' as const) : ('running' as const),
                  lastTickAt: Date.now(),
                }
              : t,
          ),
        }),
      deleteTimer: (id) => set({ timers: get().timers.filter((t) => t.id !== id) }),
      tickTimers: (now) => {
        const timers = get().timers
        let changed = false
        const next = timers.map((t) => {
          if (t.status !== 'running') return t
          const delta = Math.max(0, now - t.lastTickAt)
          if (t.type === 'countdown') {
            const remainingMs = t.remainingMs - delta
            changed = true
            if (remainingMs <= 0) return { ...t, remainingMs: 0, lastTickAt: now, status: 'expired' as const }
            return { ...t, remainingMs, lastTickAt: now }
          }
          changed = true
          return { ...t, elapsedMs: t.elapsedMs + delta, lastTickAt: now }
        })
        if (changed) set({ timers: next })
      },

      medications: [],
      addMedication: (m) => set({ medications: [...get().medications, { ...m, id: uid() }] }),
      updateMedication: (id, patch) =>
        set({ medications: get().medications.map((m) => (m.id === id ? { ...m, ...patch } : m)) }),
      logMed: (id) =>
        set({ medications: get().medications.map((m) => (m.id === id ? { ...m, lastTakenAt: Date.now() } : m)) }),

      goals: [],
      addGoal: (g) => {
        const active = get().goals.filter((x) => x.status === 'active')
        if (active.length >= 3) return // FR-GL-07: max 3 active
        set({
          goals: [...get().goals, { ...g, id: uid(), createdAt: Date.now() }],
        })
      },
      updateGoal: (id, patch) =>
        set({ goals: get().goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) }),
      deleteGoal: (id) => set({ goals: get().goals.filter((g) => g.id !== id) }),

      scrollEnabled: false,
      scrollThresholdMin: 10,
      scrollCoolDownMin: 5,
      scrollTimeMs: 0,
      lastInterventionAt: null,
      interventionsToday: 0,
      interventionsAccepted: 0,
      setScrollEnabled: (v) => set({ scrollEnabled: v }),
      setScrollThresholdMin: (v) => set({ scrollThresholdMin: v }),
      setScrollCoolDownMin: (v) => set({ scrollCoolDownMin: v }),
      addScrollTime: (deltaMs) => set({ scrollTimeMs: get().scrollTimeMs + deltaMs }),
      resetScrollTime: () => set({ scrollTimeMs: 0 }),
      registerIntervention: (accepted) =>
        set({
          lastInterventionAt: Date.now(),
          interventionsToday: get().interventionsToday + 1,
          interventionsAccepted: get().interventionsAccepted + (accepted ? 1 : 0),
        }),

      characterState: 'idle',
      characterSpeech: null,
      setCharacterState: (s) => set({ characterState: s }),
      speak: (text) => set({ characterSpeech: text, characterState: 'speaking' }),
      clearSpeech: () => set({ characterSpeech: null }),

      lastActivity: '',
      lastActivityAt: null,
      setLastActivity: (text) => set({ lastActivity: text, lastActivityAt: Date.now() }),

      scrollOverlayOpen: false,
      openScrollOverlay: () => set({ scrollOverlayOpen: true }),
      closeScrollOverlay: () => set({ scrollOverlayOpen: false }),
    }),
    {
      name: 'saw-state',
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        tiles: s.tiles,
        timers: s.timers,
        medications: s.medications,
        goals: s.goals,
        scrollEnabled: s.scrollEnabled,
        scrollThresholdMin: s.scrollThresholdMin,
        scrollCoolDownMin: s.scrollCoolDownMin,
        lastActivity: s.lastActivity,
        lastActivityAt: s.lastActivityAt,
      }),
    },
  ),
)
