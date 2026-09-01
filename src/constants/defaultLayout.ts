import type { TileConfig } from '../types'

export const TILE_GRID_COLS_WIDE = 6
export const TILE_GRID_COLS_NARROW = 4

// FR-TS-02: default layout ships out of box
export const defaultLayout: TileConfig[] = [
  { type: 'character', size: '2x2', position: { row: 0, col: 0 }, visible: true },
  { type: 'timer', size: '2x2', position: { row: 0, col: 2 }, visible: true },
  { type: 'med', size: '1x1', position: { row: 2, col: 0 }, visible: true },
  { type: 'scroll', size: '1x1', position: { row: 2, col: 1 }, visible: true },
  { type: 'goals', size: '1x1', position: { row: 2, col: 2 }, visible: true },
  { type: 'context', size: '1x1', position: { row: 2, col: 3 }, visible: true },
]
