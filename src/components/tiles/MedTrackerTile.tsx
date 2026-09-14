import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { computeMedState, isLoggedToday } from '../../lib/med'
import { formatRelative } from '../../lib/util'
import type { Medication, MedState } from '../../types'

const DOT_COLOR: Record<MedState, string> = {
  green: '#4CAF50',
  yellow: '#FFC107',
  orange: '#FF9800',
  red: '#F44336',
  gray: '#9E9E9E',
}

export default function MedTrackerTile() {
  const medications = useAppStore((s) => s.medications)
  const logMed = useAppStore((s) => s.logMed)
  const deleteMedication = useAppStore((s) => s.deleteMedication)
  const [configOpen, setConfigOpen] = useState(false)
  const [editing, setEditing] = useState<Medication | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  if (configOpen) {
    return (
      <ItemConfig
        item={editing}
        onDone={() => {
          setConfigOpen(false)
          setEditing(null)
        }}
      />
    )
  }

  function openAdd() {
    setEditing(null)
    setConfigOpen(true)
  }

  function openEdit(m: Medication) {
    setEditing(m)
    setConfigOpen(true)
  }

  return (
    <div className="tile-body med-tile-body">
      {medications.length === 0 ? (
        <div className="med-empty" onClick={openAdd}>
          <span style={{ fontSize: 22 }}>＋</span>
          <span>Add item</span>
        </div>
      ) : (
        <>
          <div className="med-list">
            {medications.map((m) => {
              const state = computeMedState(m, now)
              const loggedToday = isLoggedToday(m, now)
              return (
                <div
                  key={m.id}
                  className="med-row"
                  onClick={() => logMed(m.id)}
                  title={loggedToday ? `Done ${formatRelative(m.lastTakenAt!)}. Tap to log again.` : 'Tap to mark done'}
                >
                  <span className="med-dot" style={{ background: DOT_COLOR[state] }} />
                  <span className="med-name">{m.name}</span>
                  {loggedToday && <span className="med-check">✓</span>}
                  <button
                    className="icon-btn"
                    title="Edit"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEdit(m)
                    }}
                  >
                    ✎
                  </button>
                  <button
                    className="icon-btn"
                    title="Remove"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteMedication(m.id)
                    }}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
          <button className="goal-add" onClick={openAdd}>
            + add item
          </button>
        </>
      )}
    </div>
  )
}

function ItemConfig({ item, onDone }: { item: Medication | null; onDone: () => void }) {
  const addMedication = useAppStore((s) => s.addMedication)
  const updateMedication = useAppStore((s) => s.updateMedication)
  const [name, setName] = useState(item?.name || '')
  const [scheduleTime, setScheduleTime] = useState(item?.scheduleTime || '')

  function save() {
    const patch = { name: name.trim() || 'Item', scheduleTime: scheduleTime || null }
    if (item) {
      updateMedication(item.id, patch)
    } else {
      addMedication({ ...patch, lastTakenAt: null, lateThresholdMin: 60 })
    }
    onDone()
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-title">{item ? 'Edit item' : 'Add item'}</div>
        <div className="field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vitamin D" autoFocus />
        </div>
        <div className="field">
          <label>Time — optional, 24h</label>
          <input value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} placeholder="e.g. 08:00" />
        </div>
        <div className="overlay-actions" style={{ flexDirection: 'row' }}>
          <button className="btn btn-primary" onClick={save}>
            Save
          </button>
          <button className="btn btn-ghost" onClick={onDone}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
