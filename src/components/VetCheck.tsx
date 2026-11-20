import { useMemo, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { VET_DIRECTORY, type VetEntry } from '../data/vetDirectory'

type Bucket = 'all' | 'genuine' | 'selling' | 'scam' | 'other'

const FILTERS: { id: Bucket; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'genuine', label: '✅ Genuine' },
  { id: 'selling', label: '⚠️ Selling' },
  { id: 'scam', label: '🚫 Scam' },
]

export default function VetCheck() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Bucket>('all')
  const vetQueue = useAppStore((s) => s.vetQueue)
  const queueForVetting = useAppStore((s) => s.queueForVetting)
  const removeVetQueue = useAppStore((s) => s.removeVetQueue)

  const q = query.trim().toLowerCase()

  const results = useMemo(() => {
    let list = VET_DIRECTORY
    if (filter !== 'all') list = list.filter((e) => e.bucket === filter)
    if (q) {
      list = list.filter(
        (e) =>
          e.handle.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          e.focus.toLowerCase().includes(q),
      )
    }
    return list
  }, [q, filter])

  const notFound = q.length > 0 && results.length === 0
  const alreadyQueued = q.length > 0 && vetQueue.some((v) => v.handle.toLowerCase() === q.replace(/^@/, ''))

  if (!open) {
    return (
      <button className="vet-fab" onClick={() => setOpen(true)} aria-label="Creator check">
        <span aria-hidden="true">🔍</span>
        {vetQueue.length > 0 && <span className="vet-fab-badge">{vetQueue.length}</span>}
      </button>
    )
  }

  return (
    <>
      <div className="overlay" onClick={() => setOpen(false)} />
      <div className="com-panel vet-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Creator check</div>
          <button className="icon-btn com-close" onClick={() => setOpen(false)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="com-toolbar">
            <input
              className="com-search"
              placeholder="Search a handle or name…"
              value={query}
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="vet-filters">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`com-tab${filter === f.id ? ' active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {!q && <div className="com-hint">Type a handle to check it, or browse the list below.</div>}

          {notFound ? (
            <div className="vet-notfound">
              <div className="com-hint">Not in the directory yet — probably not vetted.</div>
              {alreadyQueued ? (
                <div className="com-hint">Already in your queue.</div>
              ) : (
                <button className="btn btn-sm" onClick={() => queueForVetting(q)}>
                  + queue for vetting
                </button>
              )}
            </div>
          ) : (
            <div className="vet-results">
              {results.map((e) => (
                <VetRow key={`${e.handle}-${e.link}`} e={e} />
              ))}
            </div>
          )}

          {vetQueue.length > 0 && (
            <div className="vet-queue">
              <div className="com-section-label">Queued for vetting ({vetQueue.length})</div>
              {vetQueue.map((v) => (
                <div key={v.at} className="gt-row">
                  <span className="gt-text">@{v.handle}</span>
                  <button className="icon-btn" title="Remove" onClick={() => removeVetQueue(v.at)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function VetRow({ e }: { e: VetEntry }) {
  return (
    <div className="vet-row">
      <div className="vet-row-head">
        <span className="vet-name">{e.handle}</span>
        {e.name && e.name.toLowerCase() !== e.handle.toLowerCase() && (
          <span className="vet-sub">{e.name}</span>
        )}
        <span className={`vet-badge vet-${e.bucket}`}>{e.verdict || '— unvetted'}</span>
      </div>
      {e.focus && <div className="vet-focus">{e.focus}</div>}
      {e.monetisation && <div className="vet-meta">💰 {e.monetisation}</div>}
      {e.notes && (
        <div className="vet-meta vet-notes" title={e.notes}>
          {e.notes}
        </div>
      )}
      {(e.platform || e.followers) && (
        <div className="vet-meta">📱 {[e.platform, e.followers].filter(Boolean).join(' · ')}</div>
      )}
    </div>
  )
}
