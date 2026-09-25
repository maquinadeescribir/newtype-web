import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { startOfToday, formatRelative } from '../lib/util'

export default function GoodThingsPanel() {
  const goodThings = useAppStore((s) => s.goodThings)
  const addGoodThing = useAppStore((s) => s.addGoodThing)
  const deleteGoodThing = useAppStore((s) => s.deleteGoodThing)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const [text, setText] = useState('')

  const start = startOfToday()
  const today = goodThings.filter((g) => g.at >= start)
  const earlier = goodThings.filter((g) => g.at < start)

  function add() {
    if (!text.trim()) return
    addGoodThing(text)
    setText('')
  }

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Good Things</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="stim-add">
            <input
              className="com-search"
              placeholder="I went for a walk, I…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') add()
              }}
              autoFocus
            />
            <button className="btn btn-sm" onClick={add}>
              + add
            </button>
          </div>
          <div className="com-sub">Small wins count · {today.length} today</div>

          <div className="gt-list">
            {today.length === 0 && <div className="com-hint">Nothing yet today. Even "I got up" counts.</div>}
            {today.map((g) => (
              <div key={g.id} className="gt-row">
                <span className="gt-text">🌟 {g.text}</span>
                <span className="gt-time">{formatRelative(g.at)}</span>
                <button className="icon-btn" title="Remove" onClick={() => deleteGoodThing(g.id)}>
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
                {earlier.slice(0, 30).map((g) => (
                  <div key={g.id} className="gt-row gt-row-old">
                    <span className="gt-text">{g.text}</span>
                    <span className="gt-time">{formatRelative(g.at)}</span>
                    <button className="icon-btn" title="Remove" onClick={() => deleteGoodThing(g.id)}>
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
