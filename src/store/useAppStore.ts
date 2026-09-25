import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  TileConfig,
  Timer,
  Medication,
  Goal,
  CharacterState,
  Influencer,
  LogEntry,
  LogKind,
  HyperItem,
  Hyperfixation,
  Resource,
  GoodThing,
  GoodDeed,
  Fidget,
} from '../types'
import { TILE_META } from '../types'
import { TIMER_COLORS } from '../constants/theme'
import { defaultLayout } from '../constants/defaultLayout'
import { SEED_INFLUENCERS } from '../data/community'
import { SEED_RESOURCES } from '../data/resources'
import { SEED_GOOD_DEEDS } from '../data/goodDeeds'
import { uid, tileRows, todayKey } from '../lib/util'

let timerColorIndex = 0

const LOG_CAP = 300

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
  deleteMedication: (id: string) => void

  goals: Goal[]
  addGoal: (g: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, patch: Partial<Goal>) => void
  deleteGoal: (id: string) => void

  influencers: Influencer[]
  addInfluencer: (i: Omit<Influencer, 'id' | 'following'>) => void
  toggleFollow: (id: string) => void
  toggleWatch: (id: string) => void
  deleteInfluencer: (id: string) => void

  activePanel: string | null
  setActivePanel: (p: string | null) => void

  log: LogEntry[]
  logEvent: (kind: LogKind, text: string) => void

  hyperfixation: Hyperfixation | null
  hyperfixationItems: HyperItem[]
  hyperfixationHistory: Hyperfixation[]
  setHyperfixation: (topic: string) => void
  addHyperfixationItem: (text: string, url?: string) => void
  deleteHyperfixationItem: (id: string) => void
  clearHyperfixation: () => void

  resources: Resource[]
  addResource: (r: Omit<Resource, 'id' | 'hidden'>) => void
  toggleResourceHidden: (id: string) => void
  deleteResource: (id: string) => void

  goodThings: GoodThing[]
  addGoodThing: (text: string) => void
  deleteGoodThing: (id: string) => void

  waterLog: Record<string, number>
  addWater: () => void
  removeWater: () => void

  stimFavs: string[]
  addStimFav: (entry: string) => void
  removeStimFav: (entry: string) => void
  fidgets: Fidget[]
  addFidget: (name: string, location: string) => void
  deleteFidget: (id: string) => void

  goodDeeds: GoodDeed[]
  addGoodDeed: (text: string) => void
  toggleGoodDeed: (id: string) => void
  deleteGoodDeed: (id: string) => void

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
      completeOnboarding: () => {
        set({ onboardingComplete: true })
        get().logEvent('app', 'Onboarding complete')
      },
      resetOnboarding: () => set({ onboardingComplete: false, onboardingStep: 0 }),

      tiles: defaultLayout,
      addTile: (type) => {
        const tiles = get().tiles
        const existing = tiles.find((t) => t.type === type)
        if (existing) {
          set({ tiles: tiles.map((t) => (t.type === type ? { ...t, visible: true } : t)) })
          get().logEvent('app', `Tile shown: ${TILE_META[type].label}`)
          return
        }
        const meta = TILE_META[type]
        const maxRow = tiles.reduce((m, t) => Math.max(m, t.position.row + tileRows(t.size)), 0)
        set({
          tiles: [...tiles, { type, size: meta.defaultSize, position: { row: maxRow, col: 0 }, visible: true }],
        })
        get().logEvent('app', `Tile added: ${TILE_META[type].label}`)
      },
      removeTile: (type) => {
        set({ tiles: get().tiles.map((t) => (t.type === type ? { ...t, visible: false } : t)) })
        get().logEvent('app', `Tile hidden: ${TILE_META[type].label}`)
      },
      resizeTile: (type, size) => set({ tiles: get().tiles.map((t) => (t.type === type ? { ...t, size } : t)) }),
      resetLayout: () => {
        set({ tiles: defaultLayout })
        get().logEvent('app', 'Layout reset to default')
      },

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
        get().logEvent('timer', `Timer started: ${label} · ${durationMin}m`)
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
        get().logEvent('timer', `Stopwatch started: ${label}`)
      },
      pauseTimer: (id) => {
        const t = get().timers.find((x) => x.id === id)
        set({ timers: get().timers.map((x) => (x.id === id ? { ...x, status: 'paused' as const } : x)) })
        if (t) get().logEvent('timer', `Timer paused: ${t.label}`)
      },
      resumeTimer: (id) => {
        const t = get().timers.find((x) => x.id === id)
        set({
          timers: get().timers.map((x) =>
            x.id === id
              ? {
                  ...x,
                  status: x.type === 'countdown' && x.remainingMs <= 0 ? ('expired' as const) : ('running' as const),
                  lastTickAt: Date.now(),
                }
              : x,
          ),
        })
        if (t) get().logEvent('timer', `Timer resumed: ${t.label}`)
      },
      deleteTimer: (id) => {
        const t = get().timers.find((x) => x.id === id)
        set({ timers: get().timers.filter((x) => x.id !== id) })
        if (t) get().logEvent('timer', `Timer removed: ${t.label}`)
      },
      tickTimers: (now) => {
        const timers = get().timers
        let changed = false
        const next = timers.map((t) => {
          if (t.status !== 'running') return t
          const delta = Math.max(0, now - t.lastTickAt)
          if (t.type === 'countdown') {
            const remainingMs = t.remainingMs - delta
            changed = true
            if (remainingMs <= 0) {
              get().logEvent('timer', `Timer done: ${t.label}`)
              return { ...t, remainingMs: 0, lastTickAt: now, status: 'expired' as const }
            }
            return { ...t, remainingMs, lastTickAt: now }
          }
          changed = true
          return { ...t, elapsedMs: t.elapsedMs + delta, lastTickAt: now }
        })
        if (changed) set({ timers: next })
      },

      medications: [],
      addMedication: (m) => {
        set({ medications: [...get().medications, { ...m, id: uid() }] })
        get().logEvent('reminder', `Reminder added: ${m.name}`)
      },
      updateMedication: (id, patch) =>
        set({ medications: get().medications.map((m) => (m.id === id ? { ...m, ...patch } : m)) }),
      logMed: (id) => {
        const m = get().medications.find((x) => x.id === id)
        set({ medications: get().medications.map((x) => (x.id === id ? { ...x, lastTakenAt: Date.now() } : x)) })
        if (m) get().logEvent('reminder', `Logged: ${m.name}`)
      },
      deleteMedication: (id) => {
        const m = get().medications.find((x) => x.id === id)
        set({ medications: get().medications.filter((x) => x.id !== id) })
        if (m) get().logEvent('reminder', `Reminder removed: ${m.name}`)
      },

      goals: [],
      addGoal: (g) => {
        const active = get().goals.filter((x) => x.status === 'active')
        if (active.length >= 3) return // FR-GL-07: max 3 active
        set({
          goals: [...get().goals, { ...g, id: uid(), createdAt: Date.now() }],
        })
        get().logEvent('goal', `Goal added: ${g.title}`)
      },
      updateGoal: (id, patch) => {
        const prev = get().goals.find((g) => g.id === id)
        set({ goals: get().goals.map((g) => (g.id === id ? { ...g, ...patch } : g)) })
        if (prev && patch.status === 'completed' && prev.status !== 'completed') {
          get().logEvent('goal', `Goal completed: ${prev.title}`)
        }
      },
      deleteGoal: (id) => {
        const g = get().goals.find((x) => x.id === id)
        set({ goals: get().goals.filter((x) => x.id !== id) })
        if (g) get().logEvent('goal', `Goal removed: ${g.title}`)
      },

      influencers: SEED_INFLUENCERS,
      addInfluencer: (i) => {
        set({ influencers: [{ ...i, id: uid(), following: false }, ...get().influencers] })
        get().logEvent('community', `Added account: @${i.handle}`)
      },
      toggleFollow: (id) => {
        const x = get().influencers.find((i) => i.id === id)
        set({
          influencers: get().influencers.map((i) => (i.id === id ? { ...i, following: !i.following } : i)),
        })
        if (x) get().logEvent('community', `${x.following ? 'Unfollowed' : 'Followed'} @${x.handle}`)
      },
      toggleWatch: (id) => {
        const x = get().influencers.find((i) => i.id === id)
        set({
          influencers: get().influencers.map((i) => {
            if (i.id !== id) return i
            const hasWatch = i.flags.includes('watch')
            return { ...i, flags: hasWatch ? i.flags.filter((f) => f !== 'watch') : [...i.flags, 'watch'] }
          }),
        })
        if (x) get().logEvent('community', `${x.flags.includes('watch') ? 'Unflagged' : 'Flagged'} @${x.handle}`)
      },
      deleteInfluencer: (id) => {
        const x = get().influencers.find((i) => i.id === id)
        set({ influencers: get().influencers.filter((i) => i.id !== id) })
        if (x) get().logEvent('community', `Removed @${x.handle}`)
      },

      activePanel: null,
      setActivePanel: (p) => set({ activePanel: p }),

      log: [],
      logEvent: (kind, text) => {
        const entry: LogEntry = { id: uid(), at: Date.now(), kind, text }
        set({ log: [entry, ...get().log].slice(0, LOG_CAP) })
      },

      hyperfixation: null,
      hyperfixationItems: [],
      hyperfixationHistory: [],
      setHyperfixation: (topic) => {
        const trimmed = topic.trim()
        if (!trimmed) return
        const cur = get().hyperfixation
        if (cur && cur.topic.toLowerCase() !== trimmed.toLowerCase()) {
          set({ hyperfixationHistory: [cur, ...get().hyperfixationHistory].slice(0, 30) })
        }
        const sameTopic = cur && cur.topic.toLowerCase() === trimmed.toLowerCase()
        set({
          hyperfixation: { topic: trimmed, startedAt: sameTopic ? cur.startedAt : Date.now() },
          hyperfixationItems: sameTopic ? get().hyperfixationItems : [],
        })
        get().logEvent('hyperfixation', `Hyperfixation set: ${trimmed}`)
      },
      addHyperfixationItem: (text, url) => {
        const item: HyperItem = { id: uid(), text, url, at: Date.now() }
        set({ hyperfixationItems: [item, ...get().hyperfixationItems] })
        get().logEvent('hyperfixation', `Saved note on ${get().hyperfixation?.topic ?? 'topic'}`)
      },
      deleteHyperfixationItem: (id) =>
        set({ hyperfixationItems: get().hyperfixationItems.filter((i) => i.id !== id) }),
      clearHyperfixation: () => {
        const cur = get().hyperfixation
        if (cur) set({ hyperfixationHistory: [cur, ...get().hyperfixationHistory].slice(0, 30) })
        set({ hyperfixation: null, hyperfixationItems: [] })
        get().logEvent('hyperfixation', `Hyperfixation cleared`)
      },

      resources: SEED_RESOURCES,
      addResource: (r) => {
        set({ resources: [{ ...r, id: uid(), hidden: false }, ...get().resources] })
        get().logEvent('app', `Resource added: ${r.name}`)
      },
      toggleResourceHidden: (id) => {
        const r = get().resources.find((x) => x.id === id)
        set({ resources: get().resources.map((x) => (x.id === id ? { ...x, hidden: !x.hidden } : x)) })
        if (r) get().logEvent('app', `Resource ${r.hidden ? 'shown' : 'hidden'}: ${r.name}`)
      },
      deleteResource: (id) => {
        const r = get().resources.find((x) => x.id === id)
        set({ resources: get().resources.filter((x) => x.id !== id) })
        if (r) get().logEvent('app', `Resource removed: ${r.name}`)
      },

      goodThings: [],
      addGoodThing: (text) => {
        const t = text.trim()
        if (!t) return
        set({ goodThings: [{ id: uid(), text: t, at: Date.now() }, ...get().goodThings] })
        get().logEvent('app', `Good thing: ${t}`)
      },
      deleteGoodThing: (id) => set({ goodThings: get().goodThings.filter((g) => g.id !== id) }),

      waterLog: {},
      addWater: () => {
        const k = todayKey()
        set({ waterLog: { ...get().waterLog, [k]: (get().waterLog[k] ?? 0) + 1 } })
      },
      removeWater: () => {
        const k = todayKey()
        const n = get().waterLog[k] ?? 0
        if (n <= 0) return
        set({ waterLog: { ...get().waterLog, [k]: n - 1 } })
      },

      stimFavs: [],
      addStimFav: (entry) => {
        const e = entry.trim()
        if (!e) return
        set({ stimFavs: [...get().stimFavs, e] })
        get().logEvent('app', `Stim fav added: ${e}`)
      },
      removeStimFav: (entry) => set({ stimFavs: get().stimFavs.filter((x) => x !== entry) }),
      fidgets: [],
      addFidget: (name, location) => {
        const n = name.trim()
        if (!n) return
        set({ fidgets: [...get().fidgets, { id: uid(), name: n, location: location.trim() }] })
      },
      deleteFidget: (id) => set({ fidgets: get().fidgets.filter((f) => f.id !== id) }),

      goodDeeds: SEED_GOOD_DEEDS,
      addGoodDeed: (text) => {
        const t = text.trim()
        if (!t) return
        set({ goodDeeds: [{ id: uid(), text: t, done: false, doneAt: null }, ...get().goodDeeds] })
      },
      toggleGoodDeed: (id) => {
        const d = get().goodDeeds.find((x) => x.id === id)
        if (!d) return
        set({
          goodDeeds: get().goodDeeds.map((x) =>
            x.id === id ? { ...x, done: !x.done, doneAt: !x.done ? Date.now() : null } : x,
          ),
        })
        if (!d.done) get().logEvent('app', `Good deed done: ${d.text}`)
      },
      deleteGoodDeed: (id) => set({ goodDeeds: get().goodDeeds.filter((d) => d.id !== id) }),

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
      registerIntervention: (accepted) => {
        set({
          lastInterventionAt: Date.now(),
          interventionsToday: get().interventionsToday + 1,
          interventionsAccepted: get().interventionsAccepted + (accepted ? 1 : 0),
        })
        get().logEvent('scroll', accepted ? 'Scroll break accepted' : 'Scroll break dismissed')
      },

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
      version: 4,
      migrate: (persisted, version) => {
        const p = persisted as { tiles?: TileConfig[] } | undefined
        if (!p || (version as number) < 1) {
          // v0: stale positions overlap the full-width character → full reset
          return { ...(p ?? {}), tiles: defaultLayout } as any
        }
        if ((version as number) < 4) {
          // v1–v3: add newly-introduced tiles without clobbering the user's layout
          const saved = p.tiles ?? []
          const have = new Set(saved.map((t) => t.type))
          const missing = defaultLayout.filter((t) => !have.has(t.type))
          return { ...p, tiles: [...saved, ...missing] } as any
        }
        return persisted as any
      },
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        tiles: s.tiles,
        timers: s.timers,
        medications: s.medications,
        goals: s.goals,
        influencers: s.influencers,
        log: s.log,
        hyperfixation: s.hyperfixation,
        hyperfixationItems: s.hyperfixationItems,
        hyperfixationHistory: s.hyperfixationHistory,
        resources: s.resources,
        goodThings: s.goodThings,
        waterLog: s.waterLog,
        stimFavs: s.stimFavs,
        fidgets: s.fidgets,
        goodDeeds: s.goodDeeds,
        scrollEnabled: s.scrollEnabled,
        scrollThresholdMin: s.scrollThresholdMin,
        scrollCoolDownMin: s.scrollCoolDownMin,
        lastActivity: s.lastActivity,
        lastActivityAt: s.lastActivityAt,
      }),
    },
  ),
)
