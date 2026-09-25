import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { RESOURCE_CATEGORIES } from '../data/resources'

export default function ResourcesPanel() {
  const resources = useAppStore((s) => s.resources)
  const toggleResourceHidden = useAppStore((s) => s.toggleResourceHidden)
  const deleteResource = useAppStore((s) => s.deleteResource)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)

  const close = () => setActivePanel(null)
  const visible = resources.filter((r) => !r.hidden)
  const hidden = resources.filter((r) => r.hidden)
  const q = query.trim().toLowerCase()
  const filtered = visible.filter(
    (r) =>
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      (RESOURCE_CATEGORIES[r.category] || r.category).toLowerCase().includes(q),
  )

  return (
    <>
      <div className="overlay" onClick={close} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Resources</div>
          <button className="icon-btn com-close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="com-panel-body">
          <div className="com-toolbar">
            <input
              className="com-search"
              placeholder="Search resources…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-sm" onClick={() => setAdding(true)}>
              + add resource
            </button>
          </div>
          <div className="com-sub">Vetted resources for autistic / AuDHD adults · {visible.length} shown.</div>

          <div className="res-list">
            {filtered.map((r) => (
              <div key={r.id} className="res-row">
                <div className="res-main">
                  <a className="res-name" href={r.url} target="_blank" rel="noreferrer">
                    {r.name} <span className="res-ext">↗</span>
                  </a>
                  <span className="res-cat">{RESOURCE_CATEGORIES[r.category] || r.category}</span>
                  <div className="res-desc">{r.description}</div>
                </div>
                <div className="res-actions">
                  <button className="btn btn-ghost btn-sm" title="Hide" onClick={() => toggleResourceHidden(r.id)}>
                    hide
                  </button>
                  <button className="icon-btn" title="Remove" onClick={() => deleteResource(r.id)}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="com-hint">No matches.</div>}
          </div>

          {hidden.length > 0 && (
            <>
              <div className="com-section-label" style={{ marginTop: 18 }}>
                Hidden
              </div>
              <div className="res-list">
                {hidden.map((r) => (
                  <div key={r.id} className="res-row res-row-hidden">
                    <div className="res-main">
                      <span className="res-name">{r.name}</span>
                    </div>
                    <div className="res-actions">
                      <button className="btn btn-sm" onClick={() => toggleResourceHidden(r.id)}>
                        Show
                      </button>
                      <button className="icon-btn" title="Remove" onClick={() => deleteResource(r.id)}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {adding && <AddResourceModal onDone={() => setAdding(false)} />}
      </div>
    </>
  )
}

function AddResourceModal({ onDone }: { onDone: () => void }) {
  const addResource = useAppStore((s) => s.addResource)
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('other')
  const [description, setDescription] = useState('')

  function save() {
    const n = name.trim()
    let u = url.trim()
    if (!n || !u) return
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u
    addResource({ name: n, url: u, category, description: description.trim() })
    onDone()
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-title">Add resource</div>
        <div className="field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ASAN" autoFocus />
        </div>
        <div className="field">
          <label>URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        </div>
        <div className="field">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', background: 'var(--surface-raised)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 9, padding: '10px 12px', fontSize: 14 }}
          >
            {Object.entries(RESOURCE_CATEGORIES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Description (optional)</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="One line on why it's vetted" />
        </div>
        <div className="overlay-actions" style={{ flexDirection: 'row' }}>
          <button className="btn btn-primary" onClick={save} disabled={!name.trim() || !url.trim()}>
            Add
          </button>
          <button className="btn btn-ghost" onClick={onDone}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
