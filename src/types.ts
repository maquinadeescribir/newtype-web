export type TileSize = '1x1' | '2x1' | '1x2' | '2x2'

export type TileType =
  | 'character'
  | 'timer'
  | 'med'
  | 'scroll'
  | 'goals'
  | 'context'

export interface TileConfig {
  type: TileType
  size: TileSize
  position: { row: number; col: number }
  visible: boolean
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

export type MedShape = 'pill' | 'flower' | 'star'
export type MedState = 'green' | 'yellow' | 'orange' | 'red' | 'gray'

export interface Medication {
  id: string
  name: string
  dosage: string
  shape: MedShape
  lastTakenAt: number | null
  scheduleTime: string | null // "HH:MM" 24h, or null = no schedule
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
  med: { label: 'Med Tracker', defaultSize: '1x1', icon: '💊' },
  scroll: { label: 'Scroll Intervention', defaultSize: '1x1', icon: '📵' },
  goals: { label: 'Goals', defaultSize: '1x1', icon: '🎯' },
  context: { label: 'Context Resume', defaultSize: '1x1', icon: '↩️' },
}

export const ALL_TILE_TYPES = Object.keys(TILE_META) as TileType[]

export const TIMER_PRESETS_MIN = [2, 5, 10, 15, 20, 25, 30, 35, 45, 60, 90, 120]
