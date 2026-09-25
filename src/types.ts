export type TileSize = '1x1' | '2x1' | '1x2' | '2x2'

export type TileType =
  | 'character'
  | 'timer'
  | 'med'
  | 'scroll'
  | 'goals'
  | 'context'
  | 'ahh'
  | 'breathing'
  | 'stretch'
  | 'read'
  | 'quicktask'
  | 'briefing'
  | 'impact'
  | 'notes'
  | 'mood'
  | 'focus'
  | 'nextevent'
  | 'weather'
  | 'directory'
  | 'trending'
  | 'following'
  | 'watchout'
  | 'news'
  | 'activity'
  | 'hyperfixation'

export interface TileConfig {
  type: TileType
  size: TileSize
  position: { row: number; col: number }
  visible: boolean
}

export type Platform = 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'web' | 'other'

export interface Influencer {
  id: string
  handle: string
  name: string
  platform: Platform
  focus: string
  monetisation?: string
  watchReason?: string
  flags: string[]
  following: boolean
}

export interface CommunityPost {
  ownerHandle: string
  ownerName: string
  caption: string
  url?: string
  savedAt: number
  source: 'instagram' | 'facebook'
}

export type CommunityVariant = 'directory' | 'trending' | 'following' | 'watchout'

export type LogKind =
  | 'app'
  | 'timer'
  | 'reminder'
  | 'goal'
  | 'scroll'
  | 'community'
  | 'hyperfixation'
  | 'character'

export interface LogEntry {
  id: string
  at: number
  kind: LogKind
  text: string
}

export interface HyperItem {
  id: string
  text: string
  url?: string
  at: number
}

export interface Hyperfixation {
  topic: string
  startedAt: number
}

export type TimerType = 'countdown' | 'stopwatch'
export type TimerStatus = 'running' | 'paused' | 'expired'

export interface Timer {
  id: string
  label: string
  type: TimerType
  color: string
  status: TimerStatus
  durationMs: number
  remainingMs: number
  elapsedMs: number
  lastTickAt: number
  createdAt: number
}

export type MedState = 'green' | 'yellow' | 'orange' | 'red' | 'gray'

export interface Medication {
  id: string
  name: string
  lastTakenAt: number | null
  scheduleTime: string | null
  lateThresholdMin: number
}

export interface Goal {
  id: string
  title: string
  why: string
  priority: 1 | 2 | 3
  status: 'active' | 'paused' | 'completed'
  actionSuggestion: string
  createdAt: number
}

export type CharacterState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'working'
  | 'speaking'
  | 'checking-in'
  | 'alert'

export interface ContextSnapshot {
  lastActivity: string
  lastActivityAt: number | null
}

export const TILE_META: Record<TileType, { label: string; defaultSize: TileSize; icon: string }> = {
  character: { label: 'Character', defaultSize: '2x2', icon: '🧑‍💼' },
  timer: { label: 'Timer Stack', defaultSize: '2x2', icon: '⏱️' },
  med: { label: 'Routine', defaultSize: '1x1', icon: '·' },
  scroll: { label: 'Scroll Intervention', defaultSize: '1x1', icon: '📵' },
  goals: { label: 'Goals', defaultSize: '1x1', icon: '🎯' },
  context: { label: 'Context Resume', defaultSize: '1x1', icon: '↩️' },
  ahh: { label: 'AHH Button', defaultSize: '1x1', icon: '💥' },
  breathing: { label: 'Breathing', defaultSize: '1x1', icon: '🫁' },
  stretch: { label: 'Stretch Break', defaultSize: '1x1', icon: '🧘' },
  read: { label: 'Read Break', defaultSize: '1x1', icon: '📖' },
  quicktask: { label: 'Quick Task', defaultSize: '1x1', icon: '⚡' },
  briefing: { label: 'Briefing', defaultSize: '2x1', icon: '🌅' },
  impact: { label: 'Impact Log', defaultSize: '2x1', icon: '📊' },
  notes: { label: 'Notes', defaultSize: '1x1', icon: '📝' },
  mood: { label: 'Mood', defaultSize: '1x1', icon: '🎭' },
  focus: { label: 'Focus Mode', defaultSize: '1x1', icon: '🔕' },
  nextevent: { label: 'Next Event', defaultSize: '1x1', icon: '📅' },
  weather: { label: 'Weather', defaultSize: '1x1', icon: '🌤️' },
  directory: { label: 'Directory', defaultSize: '1x1', icon: '📚' },
  trending: { label: 'Trending', defaultSize: '1x1', icon: '🔥' },
  following: { label: 'Following', defaultSize: '1x1', icon: '👥' },
  watchout: { label: 'Watch out', defaultSize: '1x1', icon: '🚩' },
  news: { label: 'News', defaultSize: '2x1', icon: '📰' },
  activity: { label: 'Activity', defaultSize: '2x1', icon: '📈' },
  hyperfixation: { label: 'Hyperfixation', defaultSize: '1x1', icon: '🧠' },
}

export const ALL_TILE_TYPES = Object.keys(TILE_META) as TileType[]

export const TIMER_PRESETS_MIN = [2, 5, 10, 15, 20, 25, 30, 35, 45, 60, 90, 120]
