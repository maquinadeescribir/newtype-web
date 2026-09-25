import { useAppStore } from '../../store/useAppStore'

export default function StimTile() {
  const fidgets = useAppStore((s) => s.fidgets)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('stim')} aria-label="Open stim menu">
      <div className="com-stat">
        🌀 <b>{fidgets.length}</b> fidgets
      </div>
      <div className="com-hint">quiet · input · pressure</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
