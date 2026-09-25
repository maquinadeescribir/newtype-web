import { useAppStore } from '../../store/useAppStore'
import { startOfToday } from '../../lib/util'

export default function GoodDeedsTile() {
  const goodDeeds = useAppStore((s) => s.goodDeeds)
  const setActivePanel = useAppStore((s) => s.setActivePanel)
  const start = startOfToday()
  const done = goodDeeds.filter((d) => d.done && d.doneAt && d.doneAt >= start).length

  return (
    <button className="tile-body com-tile-body" onClick={() => setActivePanel('gooddeeds')} aria-label="Open do good">
      <div className="com-stat">
        <b>{done}</b> done today
      </div>
      <div className="com-hint">quick ways to do good</div>
      <div className="com-more">open ▸</div>
    </button>
  )
}
