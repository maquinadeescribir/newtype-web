import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { startOfToday, formatRelative } from '../lib/util'

const MEALS = ['breakfast', 'lunch', 'dinner', 'snack', 'other']

export default function FoodPanel() {
  const foodEntries = useAppStore((s) => s.foodEntries)
  const addFood = useAppStore((s) => s.addFood)
  const deleteFood = useAppStore((s) => s.deleteFood)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const [text, setText] = useState('')
  const [meal, setMeal] = useState('snack')

  const start = startOfToday()
  const today = foodEntries.filter((f) => f.at >= start)
  const earlier = foodEntries.filter((f) => f.at < start)

  function add() {
    if (!text.trim()) return
    addFood(text, meal)
    setText('')
  }

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Food</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="stim-add">
            <input
              className="com-search"
              placeholder="What did you eat?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') add()
              }}
              autoFocus
            />
            <button className="btn btn-sm" onClick={add}>
              + log
            </button>
          </div>
          <div className="meal-pills">
            {MEALS.map((m) => (
              <button key={m} className={`meal-pill${meal === m ? ' active' : ''}`} onClick={() => setMeal(m)}>
                {m}
              </button>
            ))}
          </div>

          <div className="com-sub">Today · {today.length}</div>
          <div className="gt-list">
            {today.length === 0 && <div className="com-hint">Nothing logged yet today.</div>}
            {today.map((f) => (
              <div key={f.id} className="gt-row">
                <span className="gt-text">🍽️ {f.text}</span>
                <span className="meal-badge">{f.meal}</span>
                <span className="gt-time">{formatRelative(f.at)}</span>
                <button className="icon-btn" title="Remove" onClick={() => deleteFood(f.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {earlier.length > 0 && (
            <>
              <div className="com-section-label" style={{ marginTop: 16 }}>
                Earlier
              </div>
              <div className="gt-list">
                {earlier.slice(0, 30).map((f) => (
                  <div key={f.id} className="gt-row gt-row-old">
                    <span className="gt-text">{f.text}</span>
                    <span className="meal-badge">{f.meal}</span>
                    <span className="gt-time">{formatRelative(f.at)}</span>
                    <button className="icon-btn" title="Remove" onClick={() => deleteFood(f.id)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
