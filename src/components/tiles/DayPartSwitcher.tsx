import { useAppStore } from '../../store/useAppStore'
import type { DayPart } from '../../types'

// FR-DP-04: manual day-part picker. Neutral labels; direction shown on the two commute buttons.
const PARTS: Array<{ id: DayPart; label: string; title: string }> = [
  { id: 'morning', label: 'Morning', title: 'Morning' },
  { id: 'commuteTo', label: 'Commute →', title: 'Commute to LA' },
  { id: 'work', label: 'Work', title: 'Work' },
  { id: 'commuteFrom', label: 'Commute ←', title: 'Commute home' },
  { id: 'evening', label: 'Evening', title: 'Evening' },
  { id: 'off', label: 'Off', title: 'Off' },
]

export default function DayPartSwitcher() {
  const dayPart = useAppStore((s) => s.dayPart)
  const setDayPart = useAppStore((s) => s.setDayPart)
  return (
    <div className="daypart-switcher" role="group" aria-label="Part of day">
      {PARTS.map((p) => (
        <button
          key={p.id}
          className={`daypart-btn${dayPart === p.id ? ' active' : ''}`}
          aria-pressed={dayPart === p.id}
          title={p.title}
          onClick={() => setDayPart(p.id)}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
