import { useAppStore } from '../../store/useAppStore'
import { startOfToday } from '../../lib/util'

export default function GoodThingsTile() {
  const goodThings = useAppStore((s) => s.goodThings)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const today = goodThings.filter((g) => g.at >= startOfToday()).length

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('goodthings')} aria-label="Open good things">
      <div className="com-stat">
        <b>{today}</b> today
      </div>
      <div className="com-hint">good things · tap to log</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
