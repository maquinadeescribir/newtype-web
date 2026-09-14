import type { TileType } from '../../types'

// Static visual mockups for tiles that aren't built yet — FR §5.3 full tile set.
export default function MockupTile({ type }: { type: TileType }) {
  return (
    <div className="tile-body mock-body">
      {render(type)}
      <span className="mock-tag">· mock</span>
    </div>
  )
}

function render(type: TileType) {
  switch (type) {
    case 'breathing':
      return (
        <div className="mock-center">
          <div className="mock-circle" />
          <div className="mock-label">4-4-4-4</div>
          <div className="mock-hint">in · hold · out</div>
        </div>
      )
    case 'stretch':
      return (
        <div className="mock-center">
          <div className="mock-icon">🧘</div>
          <div className="mock-label">Neck rolls · 15s</div>
          <div className="mock-hint">6 desk exercises</div>
        </div>
      )
    case 'read':
      return (
        <div className="mock-center">
          <div className="mock-icon">📖</div>
          <div className="mock-label">5:00</div>
          <div className="mock-hint">break lock on</div>
        </div>
      )
    case 'quicktask':
      return (
        <div className="mock-center">
          <div className="mock-pill">the one thing?</div>
          <div className="mock-hint">single task focus</div>
        </div>
      )
    case 'briefing':
      return (
        <div className="mock-list">
          <div className="mock-label">Morning briefing</div>
          <div className="mock-row">🌤️ 72° · clear</div>
          <div className="mock-row">1. Finish thesis draft</div>
          <div className="mock-row">2. Call clinic · 2pm</div>
          <div className="mock-row">3. 25 min on report</div>
        </div>
      )
    case 'impact':
      return (
        <div className="mock-list">
          <div className="mock-label">This week</div>
          <div className="mock-row">4h 12m scrolling</div>
          <div className="mock-row">8 interrupts · 3 accepted</div>
          <div className="mock-row">2 impact actions</div>
        </div>
      )
    case 'notes':
      return (
        <div className="mock-list">
          <div className="mock-note">idea — tile engine</div>
          <div className="mock-note">call dentist</div>
          <div className="mock-note">refactor scroll hook</div>
        </div>
      )
    case 'mood':
      return (
        <div className="mock-center">
          <div className="mock-faces">😞 😕 😐 🙂 😄</div>
          <div className="mock-hint">one-tap check-in</div>
        </div>
      )
    case 'focus':
      return (
        <div className="mock-center">
          <div className="mock-toggle on" />
          <div className="mock-hint">do not disturb</div>
        </div>
      )
    case 'nextevent':
      return (
        <div className="mock-center">
          <div className="mock-label">2:00 PM</div>
          <div className="mock-row">Call clinic</div>
          <div className="mock-hint">in 3h</div>
        </div>
      )
    case 'weather':
      return (
        <div className="mock-center">
          <div className="mock-icon">☀️</div>
          <div className="mock-label">72°F</div>
          <div className="mock-hint">clear · H 78 L 58</div>
        </div>
      )
    default:
      return <div className="mock-hint">not built yet</div>
  }
}
