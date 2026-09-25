import { useAppStore } from '../store/useAppStore'
import { startOfToday, todayKey } from '../lib/util'

export default function DaySummaryPanel() {
  const goodThings = useAppStore((s) => s.goodThings)
  const waterLog = useAppStore((s) => s.waterLog)
  const medications = useAppStore((s) => s.medications)
  const log = useAppStore((s) => s.log)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const start = startOfToday()
  const todayGood = goodThings.filter((g) => g.at >= start)
  const water = waterLog[todayKey()] ?? 0
  const medsTaken = medications.filter((m) => m.lastTakenAt && m.lastTakenAt >= start).length
  const medsTotal = medications.length
  const timersDone = log.filter((e) => e.at >= start && e.kind === 'timer' && /done/i.test(e.text)).length
  const goalsDone = log.filter((e) => e.at >= start && e.kind === 'goal' && /completed/i.test(e.text)).length

  const s = (n: number) => (n === 1 ? '' : 's')
  const lines: string[] = []
  lines.push('You are alive, and you showed up today.')
  if (todayGood.length) lines.push(`You did ${todayGood.length} good thing${s(todayGood.length)}: ${todayGood.map((g) => g.text).join(', ')}.`)
  if (water > 0) lines.push(`You drank ${water} glass${s(water)} of water.`)
  if (medsTaken > 0) lines.push(`You kept ${medsTaken} of ${medsTotal} routine${s(medsTotal)} on track.`)
  if (timersDone > 0) lines.push(`You finished ${timersDone} timer${s(timersDone)}.`)
  if (goalsDone > 0) lines.push(`You completed ${goalsDone} goal${s(goalsDone)}.`)
  const empty = todayGood.length === 0 && water === 0 && medsTaken === 0 && timersDone === 0 && goalsDone === 0
  if (empty) lines.push('Nothing logged yet today — that is okay too. The day is still happening.')
  lines.push('Keep going. You are doing better than you think. 💪')

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Today</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          {lines.map((l, i) => (
            <p key={i} className="day-line">
              {l}
            </p>
          ))}
        </div>
      </div>
    </>
  )
}
