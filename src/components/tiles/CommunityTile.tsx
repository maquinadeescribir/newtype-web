import { useAppStore } from '../../store/useAppStore'
import { SEED_POSTS } from '../../data/community'
import type { CommunityVariant } from '../../types'

// One tile, four flavours. Each opens the full Community panel to its matching tab.
export default function CommunityTile({ variant }: { variant: CommunityVariant }) {
  const influencers = useAppStore((s) => s.influencers)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const following = influencers.filter((i) => i.following)
  const watching = influencers.filter((i) => i.flags.includes('watch'))
  const followedHandles = new Set(following.map((i) => i.handle.toLowerCase()))
  const fromFollowing = SEED_POSTS.filter((p) => followedHandles.has(p.ownerHandle.toLowerCase()))

  const open = () => setActivePanel(`community:${variant}`)

  return (
    <button className="tile-body com-tile-body" onClick={open} aria-label={`Open ${variant}`}>
      {variant === 'directory' && (
        <>
          <div className="com-stat">
            <b>{influencers.length}</b> accounts
          </div>
          <div className="com-hint">{following.length} following</div>
          <div className="com-more">open directory ▸</div>
        </>
      )}
      {variant === 'trending' && (
        <div className="com-list">
          {SEED_POSTS.slice(0, 2).map((p) => (
            <div key={p.url || p.savedAt} className="com-post">
              <span className="com-owner">@{p.ownerHandle}</span>
              <span className="com-caption">{p.caption}</span>
            </div>
          ))}
        </div>
      )}
      {variant === 'following' &&
        (fromFollowing.length === 0 ? (
          <div className="com-empty">Follow accounts in the Directory to see their new posts.</div>
        ) : (
          <div className="com-list">
            {fromFollowing.slice(0, 2).map((p) => (
              <div key={p.url || p.savedAt} className="com-post">
                <span className="com-owner">@{p.ownerHandle}</span>
                <span className="com-caption">{p.caption}</span>
              </div>
            ))}
          </div>
        ))}
      {variant === 'watchout' && (
        <>
          <div className="com-stat com-warn">
            <b>{watching.length}</b> flagged
          </div>
          <div className="com-hint">{watching.slice(0, 2).map((i) => i.handle).join(' · ')}</div>
          <div className="com-more">review ▸</div>
        </>
      )}
    </button>
  )
}
