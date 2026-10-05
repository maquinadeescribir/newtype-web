import { useAppStore } from '../../store/useAppStore'
import { EDC_ITEMS } from '../../data/edc'

export default function EdcTile() {
  const edcOwned = useAppStore((s) => s.edcOwned)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const got = EDC_ITEMS.filter((i) => edcOwned.includes(i.id)).length
  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('edc')} aria-label="Open everyday carry kit">
      <div className="com-stat">
        🎒 <b>{got}</b>/{EDC_ITEMS.length}
      </div>
      <div className="com-hint">everyday carry — what to keep on you</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
