import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { computeMedState, medStateLabel } from '../../lib/med'
import { formatRelative } from '../../lib/util'
import { palette } from '../../constants/theme'
import type { MedShape, MedState, Medication } from '../../types'

const STATE_COLOR: Record<MedState, string> = {
  green: palette.medGreen,
  yellow: palette.medYellow,
  orange: palette.medOrange,
  red: palette.medRed,
  gray: palette.medGray,
}

function MedIcon({ shape, state }: { shape: MedShape; state: MedState }) {
  const color = STATE_COLOR[state]
  const solid = state === 'green' || state === 'yellow'
  const fill = state === 'gray' ? color : solid ? color : 'none'
  const opacity = state === 'gray' ? 0.4 : 1

  return (
    <svg viewBox="0 0 24 24" className={`med-icon ${state}`} width="52" height="52">
      {shape === 'pill' && (
        <g>
          <rect x="6" y="2.5" width="12" height="19" rx="6" fill={fill} fillOpacity={opacity} stroke={color} strokeWidth="1.6" />
          <line x1="6" y1="12" x2="18" y2="12" stroke={color} strokeWidth="1.2" opacity={solid ? 0.5 : 1} />
        </g>
      )}
      {shape === 'flower' && (
        <g fill={fill} fillOpacity={opacity} stroke={color} strokeWidth="1.4">
          <circle cx="12" cy="12" r="3.2" />
          <ellipse cx="12" cy="5.6" rx="2.6" ry="3.4" />
          <ellipse cx="12" cy="18.4" rx="2.6" ry="3.4" />
          <ellipse cx="5.6" cy="12" rx="3.4" ry="2.6" />
          <ellipse cx="18.4" cy="12" rx="3.4" ry="2.6" />
        </g>
      )}
      {shape === 'star' && (
        <path
          d="M12 2.5 L14.7 8.6 L21.5 9.3 L16.4 13.7 L17.9 20.4 L12 17 L6.1 20.4 L7.6 13.7 L2.5 9.3 L9.3 8.6 Z"
          fill={fill}
          fillOpacity={opacity}
          stroke={color}
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      )}
      {state === 'gray' && <path d="M8 12.5 l2.6 2.6 L16 9.6" stroke={color} strokeWidth="1.6" fill="none" />}
    </svg>
  )
}

export default function MedTrackerTile() {
  const medications = useAppStore((s) => s.medications)
  const logMed = useAppStore((s) => s.logMed)
  const [configOpen, setConfigOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  const med = medications[0]

  if (!med) {
    if (configOpen) return <MedConfig med={med} onDone={() => setConfigOpen(false)} />
    return (
      <div className="tile-body med-tile-body med-empty" onClick={() => setConfigOpen(true)}>
        <span style={{ fontSize: 22 }}>＋</span>
        <span>Add medication</span>
      </div>
    )
  }

  if (configOpen) return <MedConfig med={med} onDone={() => setConfigOpen(false)} />

  const state = computeMedState(med, now)

  return (
    <div className="tile-body med-tile-body">
      <div
        onClick={() => logMed(med.id)}
        title={med.lastTakenAt ? `Last taken ${formatRelative(med.lastTakenAt)}. Tap to log again.` : 'Tap to log'}
      >
        <MedIcon shape={med.shape} state={state} />
      </div>
      <div className="med-name">{med.name}</div>
      <div className="med-status">
        {med.lastTakenAt ? `${medStateLabel(state)} · ${formatRelative(med.lastTakenAt)}` : medStateLabel(state)}
      </div>
      <button className="scroll-demo" onClick={() => setConfigOpen(true)}>
        configure
      </button>
    </div>
  )
}

function MedConfig({ med, onDone }: { med: Medication | undefined; onDone: () => void }) {
  const addMedication = useAppStore((s) => s.addMedication)
  const updateMedication = useAppStore((s) => s.updateMedication)
  const [name, setName] = useState(med?.name || '')
  const [dosage, setDosage] = useState(med?.dosage || '')
  const [scheduleTime, setScheduleTime] = useState(med?.scheduleTime || '')
  const [shape, setShape] = useState<MedShape>(med?.shape || 'pill')

  function save() {
    const patch = {
      name: name.trim() || 'Medication',
      dosage,
      scheduleTime: scheduleTime || null,
      shape,
    }
    if (med) {
      updateMedication(med.id, patch)
    } else {
      addMedication({ ...patch, lastTakenAt: null, lateThresholdMin: 60 })
    }
    onDone()
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-title">Medication</div>
        <div className="field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vyvanse" autoFocus />
        </div>
        <div className="field">
          <label>Dosage</label>
          <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 30mg" />
        </div>
        <div className="field">
          <label>Schedule — 24h, optional</label>
          <input value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} placeholder="e.g. 08:00" />
        </div>
        <div className="field">
          <label>Shape</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['pill', 'flower', 'star'] as MedShape[]).map((s) => (
              <button
                key={s}
                className="btn btn-sm"
                style={shape === s ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : {}}
                onClick={() => setShape(s)}
              >
                {s}
              </button>
            ))}
          </div>
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
