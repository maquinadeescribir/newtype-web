import { useAppStore } from '../../store/useAppStore'
import { scrollMsToMin } from '../../lib/util'

export default function ScrollInterventionTile() {
  const scrollTimeMs = useAppStore((s) => s.scrollTimeMs)
  const scrollEnabled = useAppStore((s) => s.scrollEnabled)
  const scrollThresholdMin = useAppStore((s) => s.scrollThresholdMin)
  const interventionsToday = useAppStore((s) => s.interventionsToday)
  const interventionsAccepted = useAppStore((s) => s.interventionsAccepted)
  const openScrollOverlay = useAppStore((s) => s.openScrollOverlay)

  const min = scrollMsToMin(scrollTimeMs)
  const warn = scrollEnabled && min >= scrollThresholdMin

  return (
    <div className="tile-body scroll-tile-body">
      <div className={`scroll-counter ${warn ? 'warn' : ''}`}>📵 {min} min</div>
      <div className="scroll-label">{scrollEnabled ? `threshold ${scrollThresholdMin} min` : 'scroll watch off'}</div>
      <div className="scroll-label">
        {interventionsToday} today · {interventionsAccepted} accepted
      </div>
      <button className="scroll-demo" onClick={openScrollOverlay}>
        preview interrupt
      </button>
    </div>
  )
}
