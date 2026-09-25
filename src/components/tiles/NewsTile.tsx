import { useAppStore } from '../../store/useAppStore'
import { NEWS_ARCHIVE } from '../../data/newsArchive'

// Compact tile: latest day + "previous days" affordance. Click opens the full archive panel.
export default function NewsTile() {
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const latest = NEWS_ARCHIVE[0]

  return (
    <button className="tile-body com-tile-body news-tile-body" onClick={() => setActivePanel('news')}>
      <div className="news-date">{latest.date}</div>
      <div className="news-headline">{latest.headline}</div>
      <div className="news-item">{latest.items[0].text}</div>
      <div className="news-item">{latest.items[1].text}</div>
      <div className="com-more">{NEWS_ARCHIVE.length} days archived · open ▸</div>
    </button>
  )
}

export function NewsPanel() {
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const close = () => setActivePanel(null)

  return (
    <>
      <div className="overlay" onClick={close} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">News — previous days</div>
          <button className="icon-btn com-close" onClick={close} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          {NEWS_ARCHIVE.map((day) => (
            <div key={day.date} className="news-day">
              <div className="news-day-head">
                <span className="news-date">{day.date}</span>
                <span className="news-headline">{day.headline}</span>
              </div>
              <ul className="news-list">
                {day.items.map((it, idx) => (
                  <li key={idx}>
                    {it.text}{' '}
                    {it.url && (
                      <a href={it.url} target="_blank" rel="noreferrer" className="news-link">
                        source
                      </a>
                    )}
                  </li>
                ))}
              </ul>
              <div className="news-important">
                <span className="news-important-label">Most important</span> {day.mostImportant}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
