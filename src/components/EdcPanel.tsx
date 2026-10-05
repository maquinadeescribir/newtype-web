import { useAppStore } from '../store/useAppStore'
import { EDC_GROUPS, EDC_ITEMS } from '../data/edc'

export default function EdcPanel() {
  const edcOwned = useAppStore((s) => s.edcOwned)
  const toggleEdc = useAppStore((s) => s.toggleEdc)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const got = EDC_ITEMS.filter((i) => edcOwned.includes(i.id)).length

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">EDC — Everyday Carry</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="com-sub">
            Nobody handed us this list — it was just assumed we already knew. Tick what you carry, and build the rest one
            item at a time. <b>{got}/{EDC_ITEMS.length}</b> packed.
          </div>
          {EDC_GROUPS.map((g) => (
            <div key={g}>
              <div className="com-section-label">{g}</div>
              <div className="edc-list">
                {EDC_ITEMS.filter((i) => i.group === g).map((item) => {
                  const on = edcOwned.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      className={`edc-row${on ? ' on' : ''}`}
                      onClick={() => toggleEdc(item.id)}
                      aria-pressed={on}
                    >
                      <span className="edc-check">{on ? '✓' : ''}</span>
                      <span className="edc-body">
                        <span className="edc-name">
                          {item.emoji} {item.name}
                        </span>
                        <span className="edc-why">{item.why}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
