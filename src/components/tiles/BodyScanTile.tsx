import { useAppStore } from '../../store/useAppStore'
import { startOfToday } from '../../lib/util'

export default function BodyScanTile() {
  const bodyEntries = useAppStore((s) => s.bodyEntries)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const today = bodyEntries.filter((e) => e.at >= startOfToday())
  const last = today[0]

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('bodyscan')} aria-label="Open body scan">
      <div className="com-stat">
        🧍 <b>{today.length}</b> today
      </div>
      <div className="com-hint">{last ? `${last.partLabel} · ${last.feeling}` : 'tap a spot, tap a feeling'}</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
