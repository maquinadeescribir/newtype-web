import { useAppStore } from '../../store/useAppStore'
import { todayKey } from '../../lib/util'

const CAP = 4

export default function CoffeeTile() {
  const coffeeLog = useAppStore((s) => s.coffeeLog)
  const addCoffee = useAppStore((s) => s.addCoffee)
  const removeCoffee = useAppStore((s) => s.removeCoffee)
  const n = coffeeLog[todayKey()] ?? 0
  const pct = Math.min(100, Math.round((n / CAP) * 100))

  return (
    <div className="tile-body water-body">
      <div className="water-count">
        ☕ <b>{n}</b>
        <span className="water-goal"> / {CAP} today</span>
      </div>
      <div className="water-progress">
        <div className={`water-fill coffee-fill${n > CAP ? ' over' : ''}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="water-actions">
        <button className="btn btn-sm water-add" onClick={addCoffee}>
          + cup
        </button>
        {n > 0 && (
          <button className="icon-btn" title="Undo" onClick={removeCoffee}>
            −
          </button>
        )}
      </div>
    </div>
  )
}
