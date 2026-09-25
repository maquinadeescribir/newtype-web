import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { SEED_POSTS, SEED_TRENDING } from '../data/community'
import type { CommunityVariant, Platform } from '../types'

const TABS: { key: CommunityVariant; label: string }[] = [
  { key: 'directory', label: 'Directory' },
  { key: 'trending', label: 'Trending' },
  { key: 'following', label: 'Following' },
  { key: 'watchout', label: 'Watch out' },
]

const PLATFORMS: Platform[] = ['instagram', 'facebook', 'tiktok', 'youtube', 'web', 'other']

export default function CommunityPanel({ initialTab }: { initialTab: CommunityVariant }) {
  const [tab, setTab] = useState<CommunityVariant>(initialTab)
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const influencers = useAppStore((s) => s.influencers)
  const toggleFollow = useAppStore((s) => s.toggleFollow)
  const toggleWatch = useAppStore((s) => s.toggleWatch)
  const deleteInfluencer = useAppStore((s) => s.deleteInfluencer)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const close = () => setActivePanel(null)
  const following = influencers.filter((i) => i.following)
  const watching = influencers.filter((i) => i.flags.includes('watch'))
  const followedHandles = new Set(following.map((i) => i.handle.toLowerCase()))
  const fromFollowing = SEED_POSTS.filter((p) => followedHandles.has(p.ownerHandle.toLowerCase()))

  const q = query.trim().toLowerCase()
  const filtered = influencers.filter(
    (i) => !q || i.handle.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || i.focus.toLowerCase().includes(q),
  )

  return (
    <>
      <div className="overlay" onClick={close} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`com-tab ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button className="icon-btn com-close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="com-panel-body">
          {tab === 'directory' && (
            <>
              <div className="com-toolbar">
                <input
                  className="com-search"
                  placeholder="Search handle, name, focus…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-sm" onClick={() => setAdding(true)}>
                  + add account
                </button>
              </div>
              <div className="com-sub">
                {filtered.length} accounts · {following.length} following · tap a row to follow/unfollow
              </div>
              <div className="com-rows">
                {filtered.map((i) => {
                  const isWatch = i.flags.includes('watch')
                  return (
                    <div key={i.id} className={`com-row ${isWatch ? 'com-row-watch' : ''}`}>
                      <button className="com-row-main" onClick={() => toggleFollow(i.id)}>
                        <span className="com-follow-dot" data-on={i.following ? '1' : undefined} />
                        <span className="com-row-id">
                          <span className="com-row-name">
                            {i.name || i.handle} <span className="com-handle">@{i.handle}</span>
                          </span>
                          {i.focus && <span className="com-row-focus">{i.focus}</span>}
                          {i.monetisation && <span className="com-row-money">{i.monetisation}</span>}
                          {isWatch && i.watchReason && <span className="com-row-reason">⚠ {i.watchReason}</span>}
                        </span>
                        <span className="com-row-actions">
                          <span className="com-platform">{i.platform}</span>
                          <span className="com-follow-label">{i.following ? 'following' : 'follow'}</span>
                        </span>
                      </button>
                      <button
                        className={`icon-btn ${isWatch ? 'com-flag-on' : ''}`}
                        title={isWatch ? 'Unflag' : 'Flag for review'}
                        onClick={() => toggleWatch(i.id)}
                      >
                        🚩
                      </button>
                      <button className="icon-btn" title="Remove" onClick={() => deleteInfluencer(i.id)}>
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {tab === 'trending' && (
            <>
              <div className="com-sub">Most viral items + your latest saved posts.</div>
              <div className="com-cards">
                {SEED_TRENDING.map((t, idx) => (
                  <div key={idx} className="com-card">
                    <div className="com-card-title">{t.title}</div>
                    <div className="com-card-meta">
                      {t.platform} · <b>{t.reach}</b>
                    </div>
                    <div className="com-card-note">{t.note}</div>
                  </div>
                ))}
              </div>
              <div className="com-section-label">Latest saved posts</div>
              <PostList posts={SEED_POSTS.slice(0, 12)} />
            </>
          )}

          {tab === 'following' && (
            <>
              <div className="com-sub">
                {following.length === 0
                  ? 'No accounts followed yet — follow some in the Directory.'
                  : `New posts from ${following.length} accounts you follow.`}
              </div>
              {fromFollowing.length === 0 ? (
                <div className="com-empty-big">Nothing here yet. Follow accounts in the Directory tab.</div>
              ) : (
                <PostList posts={fromFollowing} />
              )}
            </>
          )}

          {tab === 'watchout' && (
            <>
              <div className="com-sub">
                {watching.length} flagged — bad info, pseudoscience, or products whose intent isn't altruistic. Reasons are
                kept factual (what they sell), not personal.
              </div>
              <div className="com-rows">
                {watching.map((i) => (
                  <div key={i.id} className="com-row com-row-watch">
                    <div className="com-row-id">
                      <span className="com-row-name">
                        {i.name || i.handle} <span className="com-handle">@{i.handle}</span>
                      </span>
                      {i.watchReason && <span className="com-row-reason">⚠ {i.watchReason}</span>}
                    </div>
                    <button className="icon-btn com-flag-on" title="Unflag" onClick={() => toggleWatch(i.id)}>
                      🚩
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {adding && <AddInfluencerModal onDone={() => setAdding(false)} />}
      </div>
    </>
  )
}

function PostList({ posts }: { posts: { ownerHandle: string; ownerName: string; caption: string; url?: string; savedAt: number }[] }) {
  return (
    <div className="com-posts">
      {posts.map((p) => (
        <a key={p.url || p.savedAt} className="com-post-card" href={p.url} target="_blank" rel="noreferrer">
          <div className="com-post-head">
            <span className="com-owner">@{p.ownerHandle}</span>
            {p.ownerName && <span className="com-post-name">{p.ownerName}</span>}
          </div>
          <div className="com-post-caption">{p.caption}</div>
        </a>
      ))}
    </div>
  )
}

function AddInfluencerModal({ onDone }: { onDone: () => void }) {
  const addInfluencer = useAppStore((s) => s.addInfluencer)
  const [handle, setHandle] = useState('')
  const [name, setName] = useState('')
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [focus, setFocus] = useState('')

  function save() {
    const h = handle.trim()
    if (!h) return
    addInfluencer({
      handle: h.startsWith('@') ? h.slice(1) : h,
      name: name.trim() || h,
      platform,
      focus: focus.trim(),
      flags: [],
    })
    onDone()
  }

  return (
    <div className="overlay">
      <div className="overlay-card">
        <div className="overlay-title">Add account</div>
        <div className="field">
          <label>Handle / username</label>
          <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="@handle" autoFocus />
        </div>
        <div className="field">
          <label>Name (optional)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" />
        </div>
        <div className="field">
          <label>Platform</label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            style={{ width: '100%', background: 'var(--surface-raised)', color: 'var(--text)', border: '1px solid var(--border-strong)', borderRadius: 9, padding: '10px 12px', fontSize: 14 }}
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Focus (optional)</label>
          <input value={focus} onChange={(e) => setFocus(e.target.value)} placeholder="e.g. ADHD research, autism advocacy" />
        </div>
        <div className="overlay-actions" style={{ flexDirection: 'row' }}>
          <button className="btn btn-primary" onClick={save} disabled={!handle.trim()}>
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
