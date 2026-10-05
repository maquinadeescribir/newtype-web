import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { AYUDA_MODES } from '../data/ayudame'

export default function AyudamePanel() {
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const logEvent = useAppStore((s) => s.logEvent)
  const [modeId, setModeId] = useState(AYUDA_MODES[0].id)
  const mode = AYUDA_MODES.find((m) => m.id === modeId) ?? AYUDA_MODES[0]

  function pick(id: string) {
    setModeId(id)
    const m = AYUDA_MODES.find((x) => x.id === id)
    if (m) logEvent('app', `Ayúdame opened: ${m.label}`)
  }

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Ayúdame</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="com-sub">What is happening right now?</div>
          <div className="ayuda-modes">
            {AYUDA_MODES.map((m) => (
              <button
                key={m.id}
                className={`ayuda-mode${m.id === modeId ? ' active' : ''}`}
                onClick={() => pick(m.id)}
              >
                <span>{m.emoji}</span> {m.label}
              </button>
            ))}
          </div>
          <div className="ayuda-tagline">{mode.tagline}</div>
          <ol className="ayuda-steps">
            {mode.steps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
          {mode.note && <div className="ayuda-note">⚠️ {mode.note}</div>}
          <div className="ayuda-foot">
            General coping techniques, not medical advice. If something feels physically wrong, get help.
          </div>
        </div>
      </div>
    </>
  )
}
