import { useAppStore } from '../../store/useAppStore'
import { TILE_META, ALL_TILE_TYPES, type TileSize } from '../../types'

const SIZES: TileSize[] = ['1x1', '2x1', '1x2', '2x2']

export default function TileConfigPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const tiles = useAppStore((s) => s.tiles)
  const addTile = useAppStore((s) => s.addTile)
  const removeTile = useAppStore((s) => s.removeTile)
  const resizeTile = useAppStore((s) => s.resizeTile)
  const resetLayout = useAppStore((s) => s.resetLayout)
  const scrollEnabled = useAppStore((s) => s.scrollEnabled)
  const setScrollEnabled = useAppStore((s) => s.setScrollEnabled)
  const scrollThresholdMin = useAppStore((s) => s.scrollThresholdMin)
  const setScrollThresholdMin = useAppStore((s) => s.setScrollThresholdMin)
  const scrollCoolDownMin = useAppStore((s) => s.scrollCoolDownMin)
  const setScrollCoolDownMin = useAppStore((s) => s.setScrollCoolDownMin)
  const resetOnboarding = useAppStore((s) => s.resetOnboarding)

  if (!open) return null

  const visible = tiles.filter((t) => t.visible)
  const hidden = tiles.filter((t) => !t.visible)

  function cycleSize(type: string) {
    const tile = tiles.find((t) => t.type === type)
    if (!tile) return
    const idx = SIZES.indexOf(tile.size)
    resizeTile(type as (typeof ALL_TILE_TYPES)[number], SIZES[(idx + 1) % SIZES.length])
  }

  return (
    <>
      <div className="config-backdrop" onClick={onClose} />
      <div className="config-panel">
        <h2>My Tools</h2>
        <div className="config-sub">Add, remove, and resize tiles. Empty space stays empty — you build it.</div>

        <div className="config-section">
          <h3>Visible tiles</h3>
          {visible.map((t) => (
            <div key={t.type} className="config-row">
              <span>
                {TILE_META[t.type].icon} {TILE_META[t.type].label}
              </span>
              <div className="tile-actions">
                <button className="size-badge" onClick={() => cycleSize(t.type)} title="Cycle size">
                  {t.size}
                </button>
                <button className="icon-btn" title="Hide" onClick={() => removeTile(t.type)}>
                  −
                </button>
              </div>
            </div>
          ))}
        </div>

        {hidden.length > 0 && (
          <div className="config-section">
            <h3>Hidden</h3>
            {hidden.map((t) => (
              <div key={t.type} className="config-row">
                <span style={{ color: 'var(--text-dim)' }}>
                  {TILE_META[t.type].icon} {TILE_META[t.type].label}
                </span>
                <button className="btn btn-sm" onClick={() => addTile(t.type)}>
                  Show
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="config-section">
          <h3>Scroll intervention</h3>
          <div className="config-row">
            <span>Enabled</span>
            <button className={`btn btn-sm ${scrollEnabled ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setScrollEnabled(!scrollEnabled)}>
              {scrollEnabled ? 'On' : 'Off'}
            </button>
          </div>
          <div className="config-row">
            <span>Threshold (min)</span>
            <select
              value={scrollThresholdMin}
              onChange={(e) => setScrollThresholdMin(parseInt(e.target.value, 10))}
              style={{ background: 'var(--surface-raised)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '4px 6px' }}
            >
              {[2, 5, 10, 15, 20, 30, 45, 60].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div className="config-row">
            <span>Cool-down (min)</span>
            <select
              value={scrollCoolDownMin}
              onChange={(e) => setScrollCoolDownMin(parseInt(e.target.value, 10))}
              style={{ background: 'var(--surface-raised)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 6, padding: '4px 6px' }}
            >
              {[1, 2, 5, 10, 15, 30].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="config-section">
          <h3>Danger zone</h3>
          <div className="config-row">
            <span>Reset layout</span>
            <button className="btn btn-ghost btn-sm" onClick={resetLayout}>
              Reset
            </button>
          </div>
          <div className="config-row">
            <span>Restart onboarding</span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                resetOnboarding()
                onClose()
              }}
            >
              Restart
            </button>
          </div>
        </div>

        <div className="section-note">Local-first demo mode. No account, no cloud sync.</div>
      </div>
    </>
  )
}
