import { useAppStore } from '../../store/useAppStore'

export default function ResourcesTile() {
  const resources = useAppStore((s) => s.resources)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const visible = resources.filter((r) => !r.hidden)

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('resources')} aria-label="Open resources">
      <div className="com-stat">
        <b>{visible.length}</b> vetted
      </div>
      <div className="com-hint">resources · tap to browse</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
