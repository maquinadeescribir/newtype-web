import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { LogEntry } from '../types'

type View = 'timeline' | 'list' | 'table'

const KIND_ICON: Record<string, string> = {
  app: '⚙️',
  timer: '⏱️',
  reminder: '💊',
  goal: '🎯',
  scroll: '📵',
  community: '👥',
  hyperfixation: '🧠',
  character: '💬',
}

function fmtTime(at: number): string {
  const d = new Date(at)
  const hm = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const md = d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  return `${md} ${hm}`
}

export default function ActivityPanel() {
  const log = useAppStore((s) => s.log)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const [view, setView] = useState<View>('timeline')
  const [sel, setSel] = useState<string | null>(null)
  const close = () => setActivePanel(null)

  const asc = useMemo(() => [...log].reverse(), [log]) // oldest → newest

  return (
    <>
      <div className="overlay" onClick={close} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-tabs">
            {(['timeline', 'list', 'table'] as View[]).map((v) => (
              <button key={v} className={`com-tab ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>
                {v === 'timeline' ? 'Timeline' : v === 'list' ? 'List' : 'Table'}
              </button>
            ))}
          </div>
          <button className="icon-btn com-close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          {log.length === 0 && <div className="com-empty-big">No activity yet — use the dashboard and it'll appear here.</div>}
          {view === 'timeline' && <Timeline events={asc} sel={sel} setSel={setSel} />}
          {view === 'list' && <ListView log={log} />}
          {view === 'table' && <TableView log={log} />}
        </div>
      </div>
    </>
  )
}

function Timeline({ events, sel, setSel }: { events: LogEntry[]; sel: string | null; setSel: (id: string) => void }) {
  if (events.length === 0) return null
  const step = 46
  const H = 150
  const baseY = 92
  const spike = 42
  const pts: string[] = []
  events.forEach((_, i) => {
    const x = i * step
    const up = i % 2 === 0
    pts.push(`${x},${baseY}`)
    pts.push(`${x + 7},${up ? baseY - spike : baseY + spike}`)
    pts.push(`${x + 14},${baseY}`)
  })
  const W = events.length * step
  const selEvent = events.find((e) => e.id === sel)

  return (
    <div className="act-timeline">
      <div className="act-ekg-scroll">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
          <line x1="0" y1={baseY} x2={W} y2={baseY} stroke="var(--border-strong)" strokeWidth="1" strokeDasharray="3 4" />
          <polyline points={pts.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="1.8" />
          {events.map((e, i) => {
            const x = i * step + 7
            const y = i % 2 === 0 ? baseY - spike : baseY + spike
            return (
              <circle
                key={e.id}
                cx={x}
                cy={y}
                r="4.5"
                fill={sel === e.id ? 'var(--text)' : 'var(--accent-soft)'}
                className="act-node"
                onClick={() => setSel(e.id)}
              >
                <title>{`${fmtTime(e.at)} · ${e.text}`}</title>
              </circle>
            )
          })}
        </svg>
      </div>
      <div className="act-detail">
        {selEvent ? (
          <>
            <span className="act-detail-time">{fmtTime(selEvent.at)}</span>
            <span className={`act-kind act-kind-${selEvent.kind}`}>{KIND_ICON[selEvent.kind]} {selEvent.kind}</span>
            <span className="act-detail-text">{selEvent.text}</span>
          </>
        ) : (
          <span className="com-hint">Click a point to inspect · {events.length} events</span>
        )}
      </div>
    </div>
  )
}

function ListView({ log }: { log: LogEntry[] }) {
  return (
    <div className="act-list">
      {log.map((e) => (
        <div key={e.id} className="act-row">
          <span className="act-time">{fmtTime(e.at)}</span>
          <span className={`act-kind act-kind-${e.kind}`}>{KIND_ICON[e.kind]} {e.kind}</span>
          <span className="act-text">{e.text}</span>
        </div>
      ))}
    </div>
  )
}

function TableView({ log }: { log: LogEntry[] }) {
  return (
    <table className="act-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Type</th>
          <th>Detail</th>
        </tr>
      </thead>
      <tbody>
        {log.map((e) => (
          <tr key={e.id}>
            <td className="act-time">{fmtTime(e.at)}</td>
            <td className="act-kind-cell">{KIND_ICON[e.kind]} {e.kind}</td>
            <td>{e.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
