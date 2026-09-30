import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { HYPERFIXATION_TOPICS } from '../data/hyperfixations'

export default function HyperfixationTopicPanel({ topicId }: { topicId: string }) {
  const topic = HYPERFIXATION_TOPICS.find((t) => t.id === topicId)
  const items = useAppStore((s) => s.topicItems[topicId] ?? [])
  const addItem = useAppStore((s) => s.addTopicItem)
  const deleteItem = useAppStore((s) => s.deleteTopicItem)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const [note, setNote] = useState('')

  if (!topic) return null

  const close = () => setActivePanel(null)

  function add() {
    const text = note.trim()
    if (!text) return
    addItem(topicId, text)
    setNote('')
  }

  return (
    <>
      <div className="overlay" onClick={close} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">
            {topic.icon} {topic.topic}
          </div>
          <button className="icon-btn com-close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="com-panel-body">
          <div className="com-sub">{topic.blurb}</div>

          <div className="com-section-label" style={{ marginTop: 14 }}>
            Saved stuff
          </div>
          <div className="hf-note-add">
            <input
              className="com-search"
              placeholder="Save a note, link, or idea…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
            />
            <button className="btn btn-sm" onClick={add} disabled={!note.trim()}>
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
                  <button className="icon-btn" title="Remove" onClick={() => deleteItem(topicId, it.id)}>
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
