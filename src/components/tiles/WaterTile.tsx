import { useAppStore } from '../../store/useAppStore'
import { todayKey } from '../../lib/util'

const GOAL = 8

export default function WaterTile() {
  const waterLog = useAppStore((s) => s.waterLog)
  const addWater = useAppStore((s) => s.addWater)
  const removeWater = useAppStore((s) => s.removeWater)
  const n = waterLog[todayKey()] ?? 0
  const pct = Math.min(100, Math.round((n / GOAL) * 100))

  return (
    <div className="tile-body water-body">
      <div className="water-count">
        💧 <b>{n}</b>
        <span className="water-goal"> / {GOAL} glasses</span>
      </div>
      <div className="water-progress">
        <div className="water-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="water-actions">
        <button className="btn btn-sm water-add" onClick={addWater}>
          + glass
        </button>
        {n > 0 && (
          <button className="icon-btn" title="Undo" onClick={removeWater}>
            −
          </button>
        )}
      </div>
    </div>
  )
}
