import type { TileConfig } from '../types'

export const TILE_GRID_COLS_WIDE = 6
export const TILE_GRID_COLS_NARROW = 4

// FR-TS-02: default layout ships out of box — §5.3 tile set (reminders are derived, not listed here)
export const defaultLayout: TileConfig[] = [
  // Row 0–1
  { type: 'character', size: '2x2', position: { row: 0, col: 0 }, visible: true },
  { type: 'timer', size: '2x2', position: { row: 0, col: 2 }, visible: true },
  { type: 'briefing', size: '2x1', position: { row: 0, col: 4 }, visible: true },
  { type: 'impact', size: '2x1', position: { row: 1, col: 4 }, visible: true },
  // Row 2
  { type: 'scroll', size: '1x1', position: { row: 2, col: 0 }, visible: true },
  { type: 'goals', size: '1x1', position: { row: 2, col: 1 }, visible: true },
  { type: 'breathing', size: '1x1', position: { row: 2, col: 2 }, visible: true },
  { type: 'stretch', size: '1x1', position: { row: 2, col: 3 }, visible: true },
  { type: 'read', size: '1x1', position: { row: 2, col: 4 }, visible: true },
  // Row 3
  { type: 'ahh', size: '1x1', position: { row: 3, col: 0 }, visible: true },
  { type: 'context', size: '1x1', position: { row: 3, col: 1 }, visible: true },
  { type: 'quicktask', size: '1x1', position: { row: 3, col: 2 }, visible: true },
  { type: 'notes', size: '1x1', position: { row: 3, col: 3 }, visible: true },
  { type: 'mood', size: '1x1', position: { row: 3, col: 4 }, visible: true },
  { type: 'focus', size: '1x1', position: { row: 3, col: 5 }, visible: true },
  // Row 4
  { type: 'nextevent', size: '1x1', position: { row: 4, col: 0 }, visible: true },
  { type: 'weather', size: '1x1', position: { row: 4, col: 1 }, visible: true },
  // Row 5 — community + news
  { type: 'news', size: '2x1', position: { row: 5, col: 0 }, visible: true },
  { type: 'directory', size: '1x1', position: { row: 5, col: 2 }, visible: true },
  { type: 'trending', size: '1x1', position: { row: 5, col: 3 }, visible: true },
  { type: 'following', size: '1x1', position: { row: 5, col: 4 }, visible: true },
  { type: 'watchout', size: '1x1', position: { row: 5, col: 5 }, visible: true },
]
