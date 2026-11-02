import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

// FR-RT-CC-05/06: countdown to a hard leave time; past zero is a factual "over", not shame.
function countdownTo(leaveTime: string): { text: string; overdue: boolean } {
  const [h, m] = leaveTime.split(':').map((n) => Number(n))
  const now = new Date()
  const target = new Date(now)
  target.setHours(h || 0, m || 0, 0, 0)
  const diff = target.getTime() - now.getTime()
  const overdue = diff < 0
  const abs = Math.abs(diff)
  const totalMin = Math.floor(abs / 60000)
  const hh = Math.floor(totalMin / 60)
  const mm = totalMin % 60
  return { text: `${hh}h ${String(mm).padStart(2, '0')}m`, overdue }
}

// WMO weathercode → short label (Open-Meteo, no key required — Appendix A §12.2)
function weatherLabel(code: number): string {
  if (code === 0) return 'clear'
  if (code <= 2) return 'partly cloudy'
  if (code === 3) return 'overcast'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 57) return 'drizzle'
  if (code >= 61 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 80 && code <= 82) return 'showers'
  if (code >= 95) return 'storm'
  return '—'
}

export default function MorningTile() {
  const routineMode = useAppStore((s) => s.routineMode)
  const leaveTime = useAppStore((s) => s.leaveTime)
  const checklist = useAppStore((s) => s.checklist)
  const setLeaveTime = useAppStore((s) => s.setLeaveTime)
  const leaveHouse = useAppStore((s) => s.leaveHouse)
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem)
  const resetChecklist = useAppStore((s) => s.resetChecklist)
  const setRoutineMode = useAppStore((s) => s.setRoutineMode)

  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // FR-RT-CC-01: live local weather (Fullerton, CA) — Open-Meteo, no key
  const [weather, setWeather] = useState<{ temp: string; cond: string } | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch('https://api.open-meteo.com/v1/forecast?latitude=33.87&longitude=-117.92&current_weather=true')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d?.current_weather) return
        setWeather({
          temp: `${Math.round(d.current_weather.temperature)}°`,
          cond: weatherLabel(d.current_weather.weathercode),
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const cd = countdownTo(leaveTime)
  const doneCount = checklist.filter((c) => c.done).length

  return (
    <div className="tile-body morning-body">
      {routineMode === 'commuting' ? (
        <>
          <div className="morning-mode morning-mode-commute">In transit</div>
          <div className="morning-status">
            <div className="morning-line">
              <span className="morning-dot" /> Metro — shuttle vs subway
            </div>
            <div className="morning-line">
              <span className="morning-dot" /> Shuttle — City National Plaza
            </div>
            <div className="morning-line">
              <span className="morning-dot" /> Metrolink — Orange County line
            </div>
            <div className="morning-line">
              <span className="morning-dot" /> Amtrak — Fullerton → LA Union
            </div>
          </div>
          <div className="morning-checklist">
            <div className="morning-checklist-head">
              <span>Checklist</span>
              <span className="morning-checklist-count">
                {doneCount}/{checklist.length}
              </span>
            </div>
            <div className="morning-checklist-items">
              {checklist.map((c) => (
                <button
                  key={c.id}
                  className={`morning-item${c.done ? ' done' : ''}`}
                  onClick={() => toggleChecklistItem(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button className="btn btn-sm morning-reset" onClick={resetChecklist}>
              Reset
            </button>
          </div>
          <button className="btn btn-sm morning-arrive" onClick={() => setRoutineMode('preparing')}>
            Arrived
          </button>
        </>
      ) : (
        <>
          <div className="morning-count">
            <span className="morning-count-label">Leave in</span>
            <b className={cd.overdue ? 'morning-overdue' : ''}>{cd.overdue ? `${cd.text} over` : cd.text}</b>
            <input
              type="time"
              className="morning-time-input"
              value={leaveTime}
              onChange={(e) => setLeaveTime(e.target.value)}
              aria-label="Leave time"
            />
          </div>
          <div className="morning-status">
            <div className="morning-line">
              <span className="morning-dot" /> Weather — {weather ? <b>{weather.temp} {weather.cond}</b> : <i>—</i>}
            </div>
            <div className="morning-line">
              <span className="morning-dot" /> Fullerton — <i>—</i>
            </div>
            <div className="morning-line">
              <span className="morning-dot" /> Metrolink — <i>—</i>
            </div>
            <div className="morning-line">
              <span className="morning-dot" /> Amtrak — <i>—</i>
            </div>
          </div>
          <button className="btn btn-primary btn-sm morning-leave" onClick={leaveHouse}>
            Leaving house
          </button>
          <div className="morning-checklist">
            <div className="morning-checklist-head">
              <span>Checklist</span>
              <span className="morning-checklist-count">
                {doneCount}/{checklist.length}
              </span>
            </div>
            <div className="morning-checklist-items">
              {checklist.map((c) => (
                <button
                  key={c.id}
                  className={`morning-item${c.done ? ' done' : ''}`}
                  onClick={() => toggleChecklistItem(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
