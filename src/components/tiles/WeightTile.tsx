import { useAppStore } from '../../store/useAppStore'

export default function WeightTile() {
  const weightEntries = useAppStore((s) => s.weightEntries)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const latest = weightEntries[0]
  const prev = weightEntries[1]
  let deltaText = 'tap to log weight'
  if (latest && prev) {
    const d = Math.round((latest.value - prev.value) * 10) / 10
    const arrow = d > 0 ? '↑' : d < 0 ? '↓' : '·'
    deltaText = `${arrow} ${Math.abs(d)} ${latest.unit} since last`
  } else if (latest) {
    deltaText = 'tap to add another'
  }

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('weight')} aria-label="Open weight tracker">
      <div className="com-stat">
        ⚖️ <b>{latest ? `${latest.value} ${latest.unit}` : '—'}</b>
      </div>
      <div className="com-hint">{deltaText}</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
