import { useEffect, useState, type DependencyList, type ReactNode } from 'react'
import { useAppStore } from '../../store/useAppStore'
import type { transit_realtime } from 'gtfs-realtime-bindings'
import type { DayPart } from '../../types'
import DayPartSwitcher from './DayPartSwitcher'

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

type MetrolinkAlert = { header: string; desc: string }
type TrafficInfo = { live: string; typical: string; heavy: boolean }
type BoardRow = {
  train: string
  line: string
  dest: string
  sched: string
  eta: string | null
  delayMin: number | null
  status: 'cancelled' | 'no_live' | 'late' | 'on_time'
}

// Metrolink GTFS-RT service alerts — keyless + CORS-open (Appendix A §12.6)
const ALERTS_URL = 'https://cdn.simplifytransit.com/metrolink/alerts/service-alerts.pb'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=33.87&longitude=-117.92&current_weather=true'
// Mapbox traffic (public token, CORS-open) — token is user-supplied via the store (never in the repo).
const TRAFFIC_COORDS = '-117.9248,33.8703;-118.2355,34.0562'
// Backend proxy (Cloudflare Worker) — holds Metrolink's secret key, returns CORS JSON.
const PROXY_URL = 'https://saw-proxy.neurospicyass.workers.dev'

function alertEnglish(ts: { translation?: Array<{ text?: string }> | null } | null | undefined): string {
  return ts?.translation?.[0]?.text ?? ''
}

// Commute-relevant: the user's line (Orange County) and endpoints (Fullerton ↔ LA Union).
function isRelevantAlert(a: transit_realtime.IAlert): boolean {
  const routes = (a.informedEntity ?? []).map((ie) => ie.routeId ?? '').join(' ')
  const text = `${alertEnglish(a.headerText)} ${alertEnglish(a.descriptionText)}`.toLowerCase()
  return /orange county|ieoc|fullerton|union station|los angeles|oc line|91 line|riverside/.test(`${routes} ${text}`)
}

// Poll a fetcher on mount and every intervalMs. null result = unavailable (distinct from "no data yet").
function usePolling<T>(
  fetcher: () => Promise<T | null>,
  intervalMs: number,
  deps: DependencyList = [],
  enabled = true,
): T | null {
  const [value, setValue] = useState<T | null>(null)
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    const run = () => {
      fetcher()
        .then((v) => {
          if (!cancelled) setValue(v)
        })
        .catch(() => {})
    }
    run()
    const t = setInterval(run, intervalMs)
    return () => {
      cancelled = true
      clearInterval(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled])
  return value
}

function lineShort(line: string): string {
  if (/orange/i.test(line)) return 'OC'
  if (/^91| 91/i.test(line)) return '91'
  if (/ieoc|inland/i.test(line)) return 'IE-OC'
  return line.replace(/ line$/i, '')
}

const DAY_PART_TITLE: Record<DayPart, string> = {
  morning: 'Morning',
  commuteTo: 'In transit → LA',
  work: 'Work',
  commuteFrom: 'In transit → home',
  evening: 'Evening',
  off: 'Off',
}

function startOfToday(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

function fmtMs(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

function hhmm(at: number): string {
  return new Date(at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function jumpToTile(type: 'stretch' | 'breathing') {
  document.querySelector(`.tile-${type}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

export default function MorningTile() {
  const dayPart = useAppStore((s) => s.dayPart)
  const setDayPart = useAppStore((s) => s.setDayPart)
  const leaveTime = useAppStore((s) => s.leaveTime)
  const checklist = useAppStore((s) => s.checklist)
  const setLeaveTime = useAppStore((s) => s.setLeaveTime)
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem)
  const resetChecklist = useAppStore((s) => s.resetChecklist)
  const mapboxToken = useAppStore((s) => s.mapboxToken)
  const timers = useAppStore((s) => s.timers)
  const pauseTimer = useAppStore((s) => s.pauseTimer)
  const resumeTimer = useAppStore((s) => s.resumeTimer)
  const goals = useAppStore((s) => s.goals)
  const goodThings = useAppStore((s) => s.goodThings)
  const log = useAppStore((s) => s.log)
  const hyperfixation = useAppStore((s) => s.hyperfixation)
  const hyperfixationItems = useAppStore((s) => s.hyperfixationItems)

  const [, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // Only poll the feeds the active day part actually shows.
  const wantWeather = dayPart === 'morning'
  const wantTraffic = dayPart === 'morning' || dayPart === 'commuteFrom'
  const wantAlerts = dayPart === 'morning' || dayPart === 'commuteTo'
  const wantBoard = dayPart === 'morning' || dayPart === 'commuteTo' || dayPart === 'commuteFrom'

  // FR-RT-CC-01: live weather — poll 15 min (slow-moving data)
  const weather = usePolling<{ temp: string; cond: string }>(
    () =>
      fetch(WEATHER_URL)
        .then((r) => r.json())
        .then((d) =>
          d?.current_weather
            ? { temp: `${Math.round(d.current_weather.temperature)}°`, cond: weatherLabel(d.current_weather.weathercode) }
            : null,
        ),
    15 * 60 * 1000,
    [],
    wantWeather,
  )

  // FR-RT-CC-02: live traffic — poll 5 min; needs the user's Mapbox token
  const traffic = usePolling<TrafficInfo>(
    async () => {
      if (!mapboxToken) return null
      const r = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${TRAFFIC_COORDS}?access_token=${mapboxToken}&overview=false`,
      )
      const d = await r.json()
      if (!d?.routes?.[0]) return null
      const rt = d.routes[0]
      const liveSec = rt.duration
      const typicalSec = rt.duration_typical ?? rt.duration
      return {
        live: `${Math.round(liveSec / 60)}m`,
        typical: `${Math.round(typicalSec / 60)}m`,
        heavy: liveSec > typicalSec + 60, // >1 min slower than typical = congestion
      }
    },
    5 * 60 * 1000,
    [mapboxToken],
    wantTraffic,
  )

  // FR-RT-CC-03: live service alerts — poll 60s
  const metrolinkAlerts = usePolling<MetrolinkAlert[]>(
    async () => {
      const r = await fetch(ALERTS_URL)
      const buf = await r.arrayBuffer()
      const { transit_realtime } = await import('gtfs-realtime-bindings')
      const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buf))
      return (feed.entity ?? [])
        .map((e) => e.alert)
        .filter((a): a is transit_realtime.IAlert => a != null)
        .filter(isRelevantAlert)
        .map((a) => ({ header: alertEnglish(a.headerText), desc: alertEnglish(a.descriptionText) }))
    },
    60 * 1000,
    [],
    wantAlerts,
  )

  // FR-RT-CC-08/09/10: live departure board — poll 60s. Direction is fixed by day part
  // (commuteTo → LA, commuteFrom → Fullerton); in Morning the user can still flip it.
  const [morningDir, setMorningDir] = useState<'toLA' | 'toFullerton'>('toLA')
  const boardDir: 'toLA' | 'toFullerton' =
    dayPart === 'commuteFrom' ? 'toFullerton' : dayPart === 'commuteTo' ? 'toLA' : morningDir
  const board = usePolling<BoardRow[]>(
    async () => {
      const r = await fetch(`${PROXY_URL}/metrolink/board?dir=${boardDir}`)
      const d = await r.json()
      return Array.isArray(d?.board) ? d.board : null
    },
    60 * 1000,
    [boardDir],
    wantBoard,
  )

  const cd = countdownTo(leaveTime)
  const doneCount = checklist.filter((c) => c.done).length
  const alertCount = metrolinkAlerts?.length ?? 0
  const activeTimers = timers.filter((t) => t.status === 'running' || t.status === 'paused')

  const boardSection = (
    <div className="morning-board">
      {dayPart === 'morning' ? (
        <button
          className="morning-board-head morning-board-toggle"
          onClick={() => setMorningDir((d) => (d === 'toLA' ? 'toFullerton' : 'toLA'))}
          aria-label="Toggle train direction"
        >
          Trains {boardDir === 'toLA' ? '→ LA Union' : '→ Fullerton'}
          <span className="morning-board-flip">⇄</span>
        </button>
      ) : (
        <div className="morning-board-head">Trains {boardDir === 'toLA' ? '→ LA Union' : '→ Fullerton'}</div>
      )}
      {board === null ? (
        <div className="morning-line">
          <span className="morning-dot" /> Status unavailable
        </div>
      ) : board.length === 0 ? (
        <div className="morning-line">
          <span className="morning-dot" /> No upcoming trains
        </div>
      ) : (
        <div className="morning-board-list">
          {board.map((row) => {
            const st =
              row.status === 'cancelled'
                ? { t: 'CANCELLED', c: 'morning-cancelled' }
                : row.status === 'late'
                  ? { t: `${row.delayMin}m late`, c: 'morning-late' }
                  : row.status === 'on_time'
                    ? { t: 'on time', c: 'morning-ok' }
                    : { t: '—', c: 'morning-muted' }
            return (
              <div key={row.train + row.sched} className="morning-board-row">
                <span className="morning-board-train">{row.train}</span>
                <span className="morning-board-line">{lineShort(row.line)}</span>
                <span className="morning-board-time">{row.eta ?? row.sched}</span>
                <span className={`morning-board-status ${st.c}`}>{st.t}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  const alertsSection = (
    <div className="morning-alerts">
      <div className="morning-alerts-head">Service alerts</div>
      {metrolinkAlerts === null ? (
        <div className="morning-line">
          <span className="morning-dot" /> Status unavailable
        </div>
      ) : alertCount === 0 ? (
        <div className="morning-line">
          <span className="morning-dot" /> No active Metrolink alerts
        </div>
      ) : (
        metrolinkAlerts.map((a, i) => (
          <div key={i} className="morning-alert" title={a.desc}>
            {a.header}
          </div>
        ))
      )}
    </div>
  )

  const trafficLine = (
    <div className="morning-line">
      <span className="morning-dot" /> Traffic —{' '}
      {traffic ? <b className={traffic.heavy ? 'morning-late' : ''}>{traffic.live}</b> : <i>—</i>}
      {traffic && traffic.live !== traffic.typical ? <i> (typ {traffic.typical})</i> : null}
    </div>
  )

  const checklistSection = (
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
  )

  let content: ReactNode
  if (dayPart === 'commuteTo') {
    content = (
      <>
        {boardSection}
        {alertsSection}
        <button className="btn btn-sm morning-arrive" onClick={() => setDayPart('work')}>
          Arrived
        </button>
      </>
    )
  } else if (dayPart === 'commuteFrom') {
    content = (
      <>
        {boardSection}
        <div className="morning-status">{trafficLine}</div>
        <button className="btn btn-sm morning-arrive" onClick={() => setDayPart('evening')}>
          Home
        </button>
      </>
    )
  } else if (dayPart === 'work') {
    const runningTimer = timers.find((t) => t.status === 'running')
    const topGoals = goals
      .filter((g) => g.status === 'active')
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3)
    content = (
      <div className="dp-sections">
        <div className="dp-block">
          <div className="dp-head">Next event</div>
          {/* No calendar integration yet: the 'nextevent' tile is a mockup, so say so rather than invent one. */}
          <div className="dp-line dp-muted">No calendar connected</div>
        </div>
        <div className="dp-block">
          <div className="dp-head">Focus</div>
          {runningTimer ? (
            <div className="dp-line">
              {runningTimer.label} <b>{fmtMs(runningTimer.remainingMs)}</b>
            </div>
          ) : (
            <div className="dp-line dp-muted">No timer running — start one when you’re ready</div>
          )}
        </div>
        <div className="dp-block">
          <div className="dp-head">Top goals</div>
          {topGoals.length === 0 ? (
            <div className="dp-line dp-muted">No active goals</div>
          ) : (
            topGoals.map((g) => (
              <div key={g.id} className="dp-line">
                {g.title}
              </div>
            ))
          )}
        </div>
        <div className="dp-block">
          <div className="dp-head">Break</div>
          <div className="dp-actions">
            <button className="btn btn-sm" onClick={() => jumpToTile('stretch')}>
              Stretch
            </button>
            <button className="btn btn-sm" onClick={() => jumpToTile('breathing')}>
              Breathe
            </button>
          </div>
        </div>
      </div>
    )
  } else if (dayPart === 'evening') {
    const since = startOfToday()
    const todayGood = goodThings.filter((g) => g.at >= since)
    const shownGood = (todayGood.length > 0 ? todayGood : goodThings).slice(0, 3)
    const todayLog = log.filter((e) => e.at >= since)
    content = (
      <div className="dp-sections">
        <div className="dp-block">
          <div className="dp-head">Good things{todayGood.length > 0 ? ' today' : ''}</div>
          {shownGood.length === 0 ? (
            <div className="dp-line dp-muted">Nothing logged yet</div>
          ) : (
            shownGood.map((g) => (
              <div key={g.id} className="dp-line">
                {g.text}
              </div>
            ))
          )}
        </div>
        <div className="dp-block">
          <div className="dp-head">Day recap</div>
          <div className="dp-line">
            {todayLog.length} {todayLog.length === 1 ? 'event' : 'events'} logged
          </div>
          {todayLog.slice(0, 3).map((e) => (
            <div key={e.id} className="dp-line dp-muted">
              {hhmm(e.at)} · {e.text}
            </div>
          ))}
        </div>
        <div className="dp-block">
          <div className="dp-head">Wind-down</div>
          <div className="dp-line dp-muted">Work is done. Dim the lights, slow down — tomorrow can wait.</div>
        </div>
      </div>
    )
  } else if (dayPart === 'off') {
    content = (
      <div className="dp-sections">
        <div className="dp-block">
          <div className="dp-head">Current topic</div>
          {hyperfixation ? (
            <div className="dp-line">
              <b>{hyperfixation.topic}</b>
            </div>
          ) : (
            <div className="dp-line dp-muted">No topic picked</div>
          )}
          {hyperfixationItems.slice(0, 3).map((i) => (
            <div key={i.id} className="dp-line dp-muted">
              {i.url ? (
                <a href={i.url} target="_blank" rel="noreferrer">
                  {i.text}
                </a>
              ) : (
                i.text
              )}
            </div>
          ))}
        </div>
        <div className="dp-block">
          <div className="dp-head">Leisure</div>
          <div className="dp-line dp-muted">Nothing scheduled. No work, no commute.</div>
        </div>
      </div>
    )
  } else {
    content = (
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
          {trafficLine}
        </div>
        {boardSection}
        {alertsSection}
        <button className="btn btn-primary btn-sm morning-leave" onClick={() => setDayPart('commuteTo')}>
          Leaving house
        </button>
        {checklistSection}
      </>
    )
  }

  return (
    <div className="tile-body morning-body" data-daypart={dayPart}>
      <DayPartSwitcher />
      <div className="morning-mode">{DAY_PART_TITLE[dayPart]}</div>
      {content}
      {activeTimers.length > 0 && (
        <div className="morning-minitimers">
          {activeTimers.map((t) => {
            const progress = t.type === 'countdown' && t.durationMs > 0 ? Math.max(0, Math.min(1, t.remainingMs / t.durationMs)) : 1
            return (
              <button
                key={t.id}
                className={`mini-timer${t.status === 'paused' ? ' paused' : ''}`}
                style={{ borderLeftColor: t.color }}
                onClick={() => (t.status === 'running' ? pauseTimer(t.id) : resumeTimer(t.id))}
                title={t.status === 'running' ? 'Tap to pause' : 'Tap to resume'}
              >
                <span className="mini-timer-fill" style={{ width: `${progress * 100}%`, background: t.color }} />
                <span className="mini-timer-label">{t.label}</span>
                <b className="mini-timer-value">
                  {t.type === 'stopwatch' ? fmtMs(t.elapsedMs) : fmtMs(t.remainingMs)}
                </b>
                {t.status === 'paused' && <span className="mini-timer-state">⏸</span>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
