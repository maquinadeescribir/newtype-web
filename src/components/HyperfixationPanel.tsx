import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { fetchWikiSummary, fetchWikiRelated, type WikiSummary, type WikiRelatedItem } from '../lib/wiki'

export default function HyperfixationPanel() {
  const hf = useAppStore((s) => s.hyperfixation)
  const items = useAppStore((s) => s.hyperfixationItems)
  const history = useAppStore((s) => s.hyperfixationHistory)
  const setHyperfixation = useAppStore((s) => s.setHyperfixation)
  const addItem = useAppStore((s) => s.addHyperfixationItem)
  const deleteItem = useAppStore((s) => s.deleteHyperfixationItem)
  const clearHyperfixation = useAppStore((s) => s.clearHyperfixation)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const [topic, setTopic] = useState('')
  const [note, setNote] = useState('')
  const [summary, setSummary] = useState<WikiSummary | null>(null)
  const [related, setRelated] = useState<WikiRelatedItem[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  const close = () => setActivePanel(null)

  useEffect(() => {
    if (!hf) {
      setSummary(null)
      setRelated([])
      return
    }
    let cancelled = false
    setLoading(true)
    setFailed(false)
    setSummary(null)
    setRelated([])
    Promise.allSettled([fetchWikiSummary(hf.topic), fetchWikiRelated(hf.topic)])
      .then(([s, r]) => {
        if (cancelled) return
        if (s.status === 'fulfilled') setSummary(s.value)
        if (r.status === 'fulfilled') setRelated(r.value)
        if (s.status === 'rejected' || (s.status === 'fulfilled' && !s.value)) setFailed(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [hf?.topic]) // eslint-disable-line react-hooks/exhaustive-deps

  function start() {
    if (!topic.trim()) return
    setHyperfixation(topic)
    setTopic('')
  }

  function addNote() {
    const text = note.trim()
    if (!text) return
    addItem(text)
    setNote('')
  }

  return (
    <>
      <div className="overlay" onClick={close} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Hyperfixation</div>
          <button className="icon-btn com-close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="com-panel-body">
          {!hf ? (
            <>
              <div className="com-sub">What are you currently hyperfixated on? It'll pull a summary and related reading.</div>
              <div className="hf-start">
                <input
                  className="com-search"
                  placeholder="e.g. woodworking, quantum computing, mycology…"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && start()}
                  autoFocus
                />
                <button className="btn btn-primary" onClick={start} disabled={!topic.trim()}>
                  Start
                </button>
              </div>
              {history.length > 0 && (
                <>
                  <div className="com-section-label" style={{ marginTop: 18 }}>Recent</div>
                  <div className="hf-history">
                    {history.map((h, i) => (
                      <button key={i} className="hf-history-chip" onClick={() => setHyperfixation(h.topic)}>
                        {h.topic}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <div className="hf-head">
                <div className="hf-topic-big">{hf.topic}</div>
                <div className="hf-head-actions">
                  <button className="btn btn-ghost btn-sm" onClick={clearHyperfixation}>
                    Clear
                  </button>
                </div>
              </div>

              <div className="com-section-label">Summary</div>
              {loading && <div className="com-hint">Fetching from Wikipedia…</div>}
              {!loading && failed && <div className="com-hint">Couldn't find a Wikipedia entry — try a broader term.</div>}
              {summary && (
                <div className="hf-summary">
                  {summary.thumbnail && <img className="hf-thumb" src={summary.thumbnail.source} alt="" />}
                  <div className="hf-summary-body">
                    <div className="hf-summary-title">{summary.title}</div>
                    {summary.description && <div className="hf-summary-desc">{summary.description}</div>}
                    <div className="hf-summary-extract">{summary.extract}</div>
                    {summary.content_urls?.desktop?.page && (
                      <a className="news-link" href={summary.content_urls.desktop.page} target="_blank" rel="noreferrer">
                        read on Wikipedia ↗
                      </a>
                    )}
                  </div>
                </div>
              )}

              {related.length > 0 && (
                <>
                  <div className="com-section-label">Related</div>
                  <div className="hf-related">
                    {related.map((r) => (
                      <a key={r.url || r.title} className="hf-related-chip" href={r.url} target="_blank" rel="noreferrer">
                        {r.title}
                      </a>
                    ))}
                  </div>
                </>
              )}

              <div className="com-section-label">Saved stuff</div>
              <div className="hf-note-add">
                <input
                  className="com-search"
                  placeholder="Save a note, link, or idea…"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addNote()}
                />
                <button className="btn btn-sm" onClick={addNote} disabled={!note.trim()}>
                  + save
                </button>
              </div>
              {items.length === 0 ? (
                <div className="com-hint">Nothing saved yet.</div>
              ) : (
                <div className="hf-items">
                  {items.map((it) => (
                    <div key={it.id} className="hf-item">
                      {it.url ? (
                        <a href={it.url} target="_blank" rel="noreferrer" className="hf-item-text">
                          {it.text}
                        </a>
                      ) : (
                        <span className="hf-item-text">{it.text}</span>
                      )}
                      <button className="icon-btn" title="Remove" onClick={() => deleteItem(it.id)}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {history.length > 0 && (
                <>
                  <div className="com-section-label" style={{ marginTop: 16 }}>Recent</div>
                  <div className="hf-history">
                    {history.map((h, i) => (
                      <button key={i} className="hf-history-chip" onClick={() => setHyperfixation(h.topic)}>
                        {h.topic}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
