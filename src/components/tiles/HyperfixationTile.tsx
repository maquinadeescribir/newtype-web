import { useAppStore } from '../../store/useAppStore'

export default function HyperfixationTile() {
  const hf = useAppStore((s) => s.hyperfixation)
  const items = useAppStore((s) => s.hyperfixationItems)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('hyperfixation')} aria-label="Open hyperfixation">
      {hf ? (
        <>
          <div className="hf-topic">{hf.topic}</div>
          <div className="com-hint">active · {items.length} saved</div>
          <div className="com-more">open ▸</div>
        </>
      ) : (
        <>
          <div className="com-empty">Set your current hyperfixation</div>
          <div className="com-more">open ▸</div>
        </>
      )}
    </button>
  )
}
