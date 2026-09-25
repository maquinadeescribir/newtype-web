import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'

export default function GoodDeedsPanel() {
  const goodDeeds = useAppStore((s) => s.goodDeeds)
  const toggleGoodDeed = useAppStore((s) => s.toggleGoodDeed)
  const addGoodDeed = useAppStore((s) => s.addGoodDeed)
  const deleteGoodDeed = useAppStore((s) => s.deleteGoodDeed)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const [text, setText] = useState('')

  function add() {
    if (!text.trim()) return
    addGoodDeed(text)
    setText('')
  }

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Do Good</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="stim-add">
            <input
              className="com-search"
              placeholder="Add your own way to do good"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') add()
              }}
            />
            <button className="btn btn-sm" onClick={add}>
              + add
            </button>
          </div>
          <div className="gd-list">
            {goodDeeds.map((d) => (
              <div key={d.id} className={`gd-row${d.done ? ' done' : ''}`}>
                <button className="gd-check" title={d.done ? 'Mark not done' : 'Mark done'} onClick={() => toggleGoodDeed(d.id)}>
                  {d.done ? '✓' : '○'}
                </button>
                <span className="gd-text">{d.text}</span>
                <button className="icon-btn" title="Remove" onClick={() => deleteGoodDeed(d.id)}>
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
