import { useAppStore } from '../../store/useAppStore'

export default function ActivityTile() {
  const log = useAppStore((s) => s.log)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const events = [...log].slice(0, 60).reverse() // oldest → newest
  const n = Math.max(events.length, 2)
  const pts: string[] = []
  events.forEach((_, i) => {
    const x = (i / (n - 1)) * 100
    const up = i % 2 === 0
    pts.push(`${x.toFixed(2)},15`)
    pts.push(`${(x + 0.5).toFixed(2)},${up ? 6 : 24}`)
    pts.push(`${(x + 1).toFixed(2)},15`)
  })

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('activity')} aria-label="Open activity log">
      <div className="act-spark">
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="act-spark-svg">
          <line x1="0" y1="15" x2="100" y2="15" stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 4" />
          <polyline points={pts.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="1.8" />
        </svg>
      </div>
      <div className="com-hint">{log.length} events logged</div>
      <div className="com-more">open timeline ▸</div>
    </button>
  )
}
