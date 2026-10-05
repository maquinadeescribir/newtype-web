import { useAppStore } from '../store/useAppStore'
import { ENV_FACTORS, ENV_MITIGATION, envColor, envIndex, envWord } from '../data/env'

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)]
}

export default function EnvPanel() {
  const envLevels = useAppStore((s) => s.envLevels)
  const setEnvLevel = useAppStore((s) => s.setEnvLevel)
  const envLog = useAppStore((s) => s.envLog)
  const saveEnvReading = useAppStore((s) => s.saveEnvReading)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const idx = envIndex(envLevels)
  const color = envColor(idx)
  const top = [...ENV_FACTORS].sort((a, b) => (envLevels[b.id] ?? 0) - (envLevels[a.id] ?? 0))[0]
  const topLevel = envLevels[top.id] ?? 0

  const cx = 50
  const cy = 58
  const r = 40
  const a = 180 - (idx / 100) * 180
  const [ex, ey] = polar(cx, cy, r, a)
  const [nx, ny] = polar(cx, cy, r - 13, a)

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Environment</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="com-sub">Rate what is hitting you right now. The gauge is the sum of it.</div>

          <div className="env-readout">
            <svg viewBox="0 0 100 70" className="env-gauge env-gauge-lg" preserveAspectRatio="xMidYMid meet">
              <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} className="env-track" />
              {idx > 0 && (
                <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}`} className="env-fill" style={{ stroke: color }} />
              )}
              <line x1={cx} y1={cy} x2={nx} y2={ny} className="env-needle" style={{ stroke: color }} />
              <circle cx={cx} cy={cy} r="3.4" fill={color} />
            </svg>
            <div className="env-readout-text">
              <div className="env-score" style={{ color }}>
                {idx}
              </div>
              <div className="env-word">{envWord(idx)}</div>
            </div>
          </div>

          {ENV_FACTORS.map((f) => {
            const v = envLevels[f.id] ?? 0
            return (
              <div key={f.id} className="env-factor">
                <div className="env-factor-head">
                  <span className="env-factor-name">
                    {f.emoji} {f.label}
                  </span>
                  <span className="env-factor-hint">{f.hint}</span>
                </div>
                <div className="env-scale">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className={`env-seg${v >= n ? ' on' : ''}`}
                      style={v >= n ? { background: envColor((n / 5) * 100), borderColor: envColor((n / 5) * 100) } : undefined}
                      onClick={() => setEnvLevel(f.id, v === n ? 0 : n)}
                      aria-label={`${f.label} ${n} of 5`}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          <div className="env-actions">
            <button className="btn btn-sm" onClick={() => saveEnvReading()}>
              Log this reading
            </button>
          </div>

          {topLevel > 0 && (
            <div className="env-tip">
              <b>{top.label}</b> is the biggest hit right now. {ENV_MITIGATION[top.id]}
            </div>
          )}

          {envLog.length > 0 && (
            <>
              <div className="com-section-label">Recent readings</div>
              <div className="env-log">
                {envLog.slice(0, 8).map((e) => (
                  <div key={e.id} className="env-log-row">
                    <span className="env-log-dot" style={{ background: envColor(e.score) }} />
                    <span className="env-log-time">
                      {new Date(e.at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="env-log-score">{e.score}</span>
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
