import { useAppStore } from '../../store/useAppStore'
import { startOfToday, todayKey } from '../../lib/util'

export default function DaySummaryTile() {
  const goodThings = useAppStore((s) => s.goodThings)
  const waterLog = useAppStore((s) => s.waterLog)
  const medications = useAppStore((s) => s.medications)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const start = startOfToday()
  const g = goodThings.filter((x) => x.at >= start).length
  const w = waterLog[todayKey()] ?? 0
  const m = medications.filter((x) => x.lastTakenAt && x.lastTakenAt >= start).length

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('daysummary')} aria-label="Open day recap">
      <div className="com-stat">
        ✨ <b>{g}</b> good
      </div>
      <div className="com-hint">
        💧{w} · ✓{m} routines · tap for today
      </div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
