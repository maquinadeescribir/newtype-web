import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { formatRelative } from '../lib/util'

function sparkPoints(values: number[]): string {
  const w = 200
  const h = 48
  const pad = 4
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  return values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (w - 2 * pad)
      const y = pad + (1 - (v - min) / range) * (h - 2 * pad)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}

export default function WeightPanel() {
  const weightEntries = useAppStore((s) => s.weightEntries)
  const addWeight = useAppStore((s) => s.addWeight)
  const deleteWeight = useAppStore((s) => s.deleteWeight)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState<'lb' | 'kg'>('lb')

  function add() {
    const n = parseFloat(value)
    if (!n || n <= 0) return
    addWeight(n, unit)
    setValue('')
  }

  const recent = [...weightEntries].slice(0, 30).reverse()
  const latest = weightEntries[0]

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Weight</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="stim-add">
            <input
              className="com-search"
              type="number"
              inputMode="decimal"
              placeholder="Weight"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') add()
              }}
            />
            <select
              className="unit-select"
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'lb' | 'kg')}
            >
              <option value="lb">lb</option>
              <option value="kg">kg</option>
            </select>
            <button className="btn btn-sm" onClick={add}>
              + log
            </button>
          </div>

          {recent.length >= 2 && (
            <div className="wt-spark">
              <svg viewBox="0 0 200 48" preserveAspectRatio="none">
                <polyline points={sparkPoints(recent.map((w) => w.value))} />
              </svg>
            </div>
          )}

          <div className="com-sub">
            {latest ? `Latest: ${latest.value} ${latest.unit}` : 'No entries yet'} · {weightEntries.length} total
          </div>
          <div className="gt-list">
            {weightEntries.length === 0 && <div className="com-hint">Log a weight to start tracking.</div>}
            {weightEntries.slice(0, 30).map((w) => (
              <div key={w.id} className="gt-row">
                <span className="gt-text">
                  <b>
                    {w.value} {w.unit}
                  </b>
                </span>
                <span className="gt-time">{formatRelative(w.at)}</span>
                <button className="icon-btn" title="Remove" onClick={() => deleteWeight(w.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
