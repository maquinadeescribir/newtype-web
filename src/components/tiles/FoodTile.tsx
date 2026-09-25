import { useAppStore } from '../../store/useAppStore'
import { startOfToday } from '../../lib/util'

export default function FoodTile() {
  const foodEntries = useAppStore((s) => s.foodEntries)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const today = foodEntries.filter((f) => f.at >= startOfToday())
  const last = today[0]

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('food')} aria-label="Open food log">
      <div className="com-stat">
        🍽️ <b>{today.length}</b> logged
      </div>
      <div className="com-hint">{last ? `last: ${last.text}` : 'tap to log a meal'}</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
