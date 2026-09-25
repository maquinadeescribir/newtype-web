import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { BODY_PARTS, FEELINGS, FEELING_CATEGORIES } from '../data/body'
import { startOfToday, formatRelative } from '../lib/util'

function BodyOutline({ selected, onPick }: { selected: string | null; onPick: (id: string) => void }) {
  const fill = (id: string) => (selected === id ? '#ff006e' : '#2a3346')
  return (
    <svg className="bs-svg" viewBox="0 0 220 360" role="img" aria-label="Body outline">
      <circle className="bs-part" cx="110" cy="38" r="30" fill={fill('head')} onClick={() => onPick('head')} />
      <rect className="bs-part" x="97" y="66" width="26" height="22" rx="7" fill={fill('neck')} onClick={() => onPick('neck')} />
      <rect className="bs-part" x="76" y="86" width="68" height="54" rx="15" fill={fill('chest')} onClick={() => onPick('chest')} />
      <rect className="bs-part" x="78" y="140" width="64" height="58" rx="15" fill={fill('stomach')} onClick={() => onPick('stomach')} />
      <rect className="bs-part" x="46" y="88" width="24" height="82" rx="12" fill={fill('l-arm')} onClick={() => onPick('l-arm')} />
      <rect className="bs-part" x="150" y="88" width="24" height="82" rx="12" fill={fill('r-arm')} onClick={() => onPick('r-arm')} />
      <rect className="bs-part" x="82" y="198" width="56" height="34" rx="13" fill={fill('hip')} onClick={() => onPick('hip')} />
      <rect className="bs-part" x="80" y="232" width="24" height="96" rx="12" fill={fill('l-leg')} onClick={() => onPick('l-leg')} />
      <rect className="bs-part" x="116" y="232" width="24" height="96" rx="12" fill={fill('r-leg')} onClick={() => onPick('r-leg')} />
      <ellipse className="bs-part" cx="92" cy="336" rx="18" ry="9" fill={fill('l-foot')} onClick={() => onPick('l-foot')} />
      <ellipse className="bs-part" cx="128" cy="336" rx="18" ry="9" fill={fill('r-foot')} onClick={() => onPick('r-foot')} />
    </svg>
  )
}

export default function BodyScanPanel() {
  const bodyEntries = useAppStore((s) => s.bodyEntries)
  const addBodyEntry = useAppStore((s) => s.addBodyEntry)
  const deleteBodyEntry = useAppStore((s) => s.deleteBodyEntry)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const [part, setPart] = useState<string | null>(null)

  const start = startOfToday()
  const today = bodyEntries.filter((e) => e.at >= start)
  const earlier = bodyEntries.filter((e) => e.at < start)
  const partLabel = BODY_PARTS.find((p) => p.id === part)?.label

  function pickFeeling(label: string, color: string, category: string) {
    if (!part) return
    addBodyEntry({ part, partLabel: partLabel ?? part, feeling: label, color, category })
    setPart(null)
  }

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Body Scan</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="com-sub">Tap a spot, then a feeling.</div>

          <div className="bs-stage">
            <BodyOutline selected={part} onPick={(id) => setPart(id)} />
          </div>
          <div className={`bs-selected${part ? '' : ' empty'}`}>{partLabel ? `Spot: ${partLabel}` : 'No spot selected yet'}</div>

          {FEELING_CATEGORIES.map((cat) => {
            const items = FEELINGS.filter((f) => f.category === cat)
            if (items.length === 0) return null
            return (
              <div key={cat} className="bs-cat">
                <div className="bs-cat-label">{cat}</div>
                <div className="bs-chips">
                  {items.map((f) => (
                    <button
                      key={f.label}
                      className="bs-chip"
                      style={{ borderColor: f.color, color: f.color }}
                      onClick={() => pickFeeling(f.label, f.color, f.category)}
                    >
                      <span className="bs-dot" style={{ background: f.color }} />
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}

          <div className="com-section-label">Today · {today.length}</div>
          <div className="gt-list">
            {today.length === 0 && <div className="com-hint">No entries yet — tap a spot and a feeling to record one.</div>}
            {today.map((e) => (
              <div key={e.id} className="gt-row">
                <span className="bs-dot" style={{ background: e.color }} />
                <span className="gt-text">
                  {e.feeling} <span className="gt-time">· {e.partLabel}</span>
                </span>
                <span className="gt-time">{formatRelative(e.at)}</span>
                <button className="icon-btn" title="Remove" onClick={() => deleteBodyEntry(e.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          {earlier.length > 0 && (
            <>
              <div className="com-section-label" style={{ marginTop: 16 }}>
                Earlier
              </div>
              <div className="gt-list">
                {earlier.slice(0, 30).map((e) => (
                  <div key={e.id} className="gt-row gt-row-old">
                    <span className="bs-dot" style={{ background: e.color }} />
                    <span className="gt-text">
                      {e.feeling} <span className="gt-time">· {e.partLabel}</span>
                    </span>
                    <span className="gt-time">{formatRelative(e.at)}</span>
                    <button className="icon-btn" title="Remove" onClick={() => deleteBodyEntry(e.id)}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
