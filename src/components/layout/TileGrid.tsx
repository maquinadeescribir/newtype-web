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

const TILE_COMPONENTS: Record<TileType, () => JSX.Element> = {
  character: CharacterTile,
  timer: TimerStackTile,
  med: MedTrackerTile,
  scroll: ScrollInterventionTile,
  goals: GoalsTile,
  context: ContextResumeTile,
}

export default function TileGrid() {
  const tiles = useAppStore((s) => s.tiles)
  const visible = tiles.filter((t) => t.visible)

  return (
    <div className="grid">
      {visible.map((tile) => {
        const Comp = TILE_COMPONENTS[tile.type]
        const meta = TILE_META[tile.type]
        const style: CSSProperties = {
          gridColumn: `${tile.position.col + 1} / span ${tileCols(tile.size)}`,
          gridRow: `${tile.position.row + 1} / span ${tileRows(tile.size)}`,
        }
        return (
          <div key={tile.type} className={`tile tile-${tile.type}`} style={style}>
            {tile.type !== 'character' && (
              <div className="tile-header">
                <span className="icon">{meta.icon}</span>
                <span>{meta.label}</span>
              </div>
            )}
            <Comp />
          </div>
        )
      })}
    </div>
  )
}
