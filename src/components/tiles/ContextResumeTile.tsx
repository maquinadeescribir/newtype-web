import { useAppStore } from '../../store/useAppStore'
import { formatRelative } from '../../lib/util'

export default function ContextResumeTile() {
  const lastActivity = useAppStore((s) => s.lastActivity)
  const lastActivityAt = useAppStore((s) => s.lastActivityAt)
  const speak = useAppStore((s) => s.speak)

  function resume() {
    const msg = lastActivity
      ? `Back. Last session: ${lastActivity}.`
      : 'No past session on record. What are we working on?'
    speak(msg)
  }

  return (
    <div className="tile-body context-tile-body">
      <div className="context-label">Last session</div>
      <div className="context-value">{lastActivity || '—'}</div>
      <div className="context-time">{lastActivityAt ? formatRelative(lastActivityAt) : ''}</div>
      <button className="btn btn-ghost btn-sm" onClick={resume}>
        What was I doing?
      </button>
    </div>
  )
}
