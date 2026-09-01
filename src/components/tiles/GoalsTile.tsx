import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import type { Goal } from '../../types'

export default function GoalsTile() {
  const goals = useAppStore((s) => s.goals)
  const addGoal = useAppStore((s) => s.addGoal)
  const updateGoal = useAppStore((s) => s.updateGoal)
  const deleteGoal = useAppStore((s) => s.deleteGoal)
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [why, setWhy] = useState('')

  const active = goals.filter((g) => g.status === 'active')
  const completed = goals.filter((g) => g.status === 'completed')
  const atCap = active.length >= 3

  function add() {
    if (!title.trim()) return
    addGoal({
      title: title.trim(),
      why: why.trim(),
      priority: (Math.min(active.length + 1, 3)) as 1 | 2 | 3,
      status: 'active',
      actionSuggestion: `Work on ${title.trim()} for 25 min`,
    })
    setTitle('')
    setWhy('')
    setAdding(false)
  }

  function toggle(g: Goal) {
    updateGoal(g.id, { status: g.status === 'active' ? 'completed' : 'active' })
  }

  return (
    <div className="tile-body goals-tile-body">
      <div className="goal-count">🎯 {active.length} active</div>

      {active.map((g) => (
        <div key={g.id} className="goal-row" onClick={() => toggle(g)} title="Tap to complete">
          <span className={`goal-pri p${g.priority}`} />
          <span className="goal-title">{g.title}</span>
          <button
            className="icon-btn"
            style={{ marginLeft: 'auto' }}
            onClick={(e) => {
              e.stopPropagation()
              deleteGoal(g.id)
            }}
          >
            ✕
          </button>
        </div>
      ))}

      {completed.map((g) => (
        <div key={g.id} className="goal-row" style={{ opacity: 0.45, textDecoration: 'line-through' }} onClick={() => toggle(g)}>
          <span className={`goal-pri p${g.priority}`} />
          <span className="goal-title">{g.title}</span>
        </div>
      ))}

      {adding ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want?"
            autoFocus
            className="pill-input"
            style={{ width: '100%', background: 'var(--surface-raised)', border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--text)', padding: '6px 9px', fontSize: 12.5 }}
            onKeyDown={(e) => e.key === 'Enter' && add()}
          />
          <input
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            placeholder="Why (optional)"
            style={{ width: '100%', background: 'var(--surface-raised)', border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--text)', padding: '6px 9px', fontSize: 12.5 }}
          />
          <div style={{ display: 'flex', gap: 5 }}>
            <button className="btn btn-primary btn-sm" onClick={add}>
              Add
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="goal-add" onClick={() => setAdding(true)} disabled={atCap}>
          {atCap ? 'max 3 active goals' : '+ add goal'}
        </button>
      )}
    </div>
  )
}
