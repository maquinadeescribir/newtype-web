import type { TileSize } from '../types'

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// TileSize is "WIDTHxHEIGHT" (natural reading): '2x1' = 2 wide, 1 tall.
export function tileCols(size: TileSize): number {
  return size[0] === '1' ? 1 : 2 // first char = width → columns
}

export function tileRows(size: TileSize): number {
  return size[2] === '1' ? 1 : 2 // third char = height → rows
}

export function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

// countdown-style mm:ss (or h:mm:ss)
export function formatMs(ms: number): string {
  if (ms < 0) ms = 0
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  if (h > 0) return `${h}:${mm}:${ss}`
  return `${m}:${ss}`
}

// stopwatch-style elapsed
export function formatElapsed(ms: number): string {
  return formatMs(ms)
}

export function formatRelative(epoch: number | null): string {
  if (epoch == null) return ''
  const diff = Date.now() - epoch
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const h = Math.floor(min / 60)
  if (h < 24) return `${h}h ${min % 60}m ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

// "Been scrolling 12 min" -> human readable scroll time
export function formatScrollTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  if (totalSec < 60) return `${totalSec} sec`
  const m = Math.floor(totalSec / 60)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

export function scrollMsToMin(ms: number): number {
  return Math.floor(ms / 60000)
}
