import type { CSSProperties } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { TILE_META, type TileType } from '../../types'
import { tileRows, tileCols } from '../../lib/util'
import CharacterTile from '../tiles/CharacterTile'
import TimerStackTile from '../tiles/TimerStackTile'
import MedTrackerTile from '../tiles/MedTrackerTile'
import ScrollInterventionTile from '../tiles/ScrollInterventionTile'
import GoalsTile from '../tiles/GoalsTile'
import ContextResumeTile from '../tiles/ContextResumeTile'
import AhhButtonTile from '../tiles/AhhButtonTile'
import MockupTile from '../tiles/MockupTile'

const BUILT_TILES: Partial<Record<TileType, () => JSX.Element>> = {
  character: CharacterTile,
  timer: TimerStackTile,
  med: MedTrackerTile,
  scroll: ScrollInterventionTile,
  goals: GoalsTile,
  context: ContextResumeTile,
  ahh: AhhButtonTile,
}

export default function TileGrid() {
  const tiles = useAppStore((s) => s.tiles)
  const visible = tiles.filter((t) => t.visible)

  return (
    <div className="grid">
      {visible.map((tile) => {
        const Built = BUILT_TILES[tile.type]
        const isMock = !Built
        const meta = TILE_META[tile.type]
        const style: CSSProperties = {
          gridColumn: `${tile.position.col + 1} / span ${tileCols(tile.size)}`,
          gridRow: `${tile.position.row + 1} / span ${tileRows(tile.size)}`,
        }
        return (
          <div key={tile.type} className={`tile tile-${tile.type}${isMock ? ' tile-mock' : ''}`} style={style}>
            {tile.type !== 'character' && tile.type !== 'med' && (
              <div className="tile-header">
                <span className="icon">{meta.icon}</span>
                <span>{meta.label}</span>
              </div>
            )}
            {Built ? <Built /> : <MockupTile type={tile.type} />}
          </div>
        )
      })}
    </div>
  )
}
