import { useAppStore } from '../../store/useAppStore'

export default function AyudameTile() {
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('ayudame')} aria-label="Open Ayúdame">
      <div className="com-stat">🆘 <b>Ayúdame</b></div>
      <div className="com-hint">when it is too much — pick what is happening</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
