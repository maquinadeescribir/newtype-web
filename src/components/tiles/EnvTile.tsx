import { useAppStore } from '../../store/useAppStore'
import { envColor, envIndex } from '../../data/env'

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180
  return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)]
}

// Bare gauge. No text on the tile — the shape and colour carry it. Click for the specifics.
export default function EnvTile() {
  const envLevels = useAppStore((s) => s.envLevels)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const idx = envIndex(envLevels)
  const color = envColor(idx)
  const cx = 50
  const cy = 58
  const r = 40
  const a = 180 - (idx / 100) * 180
  const [ex, ey] = polar(cx, cy, r, a)
  const [nx, ny] = polar(cx, cy, r - 13, a)

  return (
    <button className="tile-body env-tile" onClick={() => setActivePanel('env')} aria-label="Environment">
      <svg viewBox="0 0 100 70" className="env-gauge" preserveAspectRatio="xMidYMid meet">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} className="env-track" />
        {idx > 0 && (
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${ex} ${ey}`} className="env-fill" style={{ stroke: color }} />
        )}
        <line x1={cx} y1={cy} x2={nx} y2={ny} className="env-needle" style={{ stroke: color }} />
        <circle cx={cx} cy={cy} r="3.4" fill={color} />
      </svg>
    </button>
  )
}
