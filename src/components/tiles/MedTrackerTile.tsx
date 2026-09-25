import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { computeMedState, isLoggedToday } from '../../lib/med'
import { formatRelative } from '../../lib/util'
import type { MedState } from '../../types'

const DOT_COLOR: Record<MedState, string> = {
  green: '#4CAF50',
  yellow: '#FFC107',
  orange: '#FF9800',
  red: '#F44336',
  gray: '#9E9E9E',
}

// One reminder = one tile (stealth: no icon, no label — just a status dot + name)
export default function MedTrackerTile({ medId }: { medId: string }) {
  const medication = useAppStore((s) => s.medications.find((m) => m.id === medId))
  const logMed = useAppStore((s) => s.logMed)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  if (!medication) return null

  const state = computeMedState(medication, now)
  const loggedToday = isLoggedToday(medication, now)

  return (
    <div
      className="tile-body med-tile-body"
      onClick={() => logMed(medication.id)}
      title={
        loggedToday
          ? `Done ${formatRelative(medication.lastTakenAt!)}. Tap to log again.`
          : 'Tap to mark done'
      }
    >
      <span className="med-dot-lg" style={{ background: DOT_COLOR[state] }} />
      <span className="med-name">{medication.name}</span>
      {loggedToday && <span className="med-check">✓</span>}
    </div>
  )
}
