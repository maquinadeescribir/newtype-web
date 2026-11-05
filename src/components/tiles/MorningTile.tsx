import { useEffect, useState, type DependencyList } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { transit_realtime } from 'gtfs-realtime-bindings'

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
function usePolling<T>(fetcher: () => Promise<T | null>, intervalMs: number, deps: DependencyList = []): T | null {
  const [value, setValue] = useState<T | null>(null)
  useEffect(() => {
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
  }, deps)
  return value
}

function lineShort(line: string): string {
  if (/orange/i.test(line)) return 'OC'
  if (/^91| 91/i.test(line)) return '91'
  if (/ieoc|inland/i.test(line)) return 'IE-OC'
  return line.replace(/ line$/i, '')
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
  const mapboxToken = useAppStore((s) => s.mapboxToken)

  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

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
  )

  // FR-RT-CC-03: live service alerts — poll 60s
  const metrolinkAlerts = usePolling<MetrolinkAlert[]>(
    async () => {
      const r = await fetch(ALERTS_URL)
      const buf = await r.arrayBuffer()
      const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buf))
      return (feed.entity ?? [])
        .map((e) => e.alert)
        .filter((a): a is transit_realtime.IAlert => a != null)
        .filter(isRelevantAlert)
        .map((a) => ({ header: alertEnglish(a.headerText), desc: alertEnglish(a.descriptionText) }))
    },
    60 * 1000,
  )

  // FR-RT-CC-08/09/10: live departure board (train #, ETA, computed delay, cancellations) — poll 60s
  const board = usePolling<BoardRow[]>(
    async () => {
      const r = await fetch(`${PROXY_URL}/metrolink/board`)
      const d = await r.json()
      return Array.isArray(d?.board) ? d.board : null
    },
    60 * 1000,
  )

  const cd = countdownTo(leaveTime)
  const doneCount = checklist.filter((c) => c.done).length
  const alertCount = metrolinkAlerts?.length ?? 0

  const boardSection = (
    <div className="morning-board">
      <div className="morning-board-head">Trains → LA Union</div>
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

  return (
    <div className="tile-body morning-body">
      {routineMode === 'commuting' ? (
        <>
          <div className="morning-mode morning-mode-commute">In transit</div>
          {boardSection}
          {alertsSection}
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
              <span className="morning-dot" /> Traffic —{' '}
              {traffic ? <b className={traffic.heavy ? 'morning-late' : ''}>{traffic.live}</b> : <i>—</i>}
              {traffic && traffic.live !== traffic.typical ? <i> (typ {traffic.typical})</i> : null}
            </div>
          </div>
          {boardSection}
          {alertsSection}
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
