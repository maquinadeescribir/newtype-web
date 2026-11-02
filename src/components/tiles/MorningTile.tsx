import { useEffect, useState } from 'react'
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
type TrafficInfo = { live: string; typical: string }
type DelayStatus = { maxDelayMin: number; delayedCount: number }

// Metrolink GTFS-RT service alerts — keyless + CORS-open (Appendix A §12.6)
const ALERTS_URL = 'https://cdn.simplifytransit.com/metrolink/alerts/service-alerts.pb'

// Mapbox traffic (public token, CORS-open) — Fullerton → LA Union Station, driving.
// Token is user-supplied via localStorage ('saw-mapbox-token'): GitHub push protection
// blocks committing the token, and the app is local-first — the key belongs in the user's browser.
const TRAFFIC_COORDS = '-117.9248,33.8703;-118.2355,34.0562'

// Backend proxy (Cloudflare Worker) — holds Metrolink's secret key, returns CORS JSON
const PROXY_URL = 'https://saw-proxy.neurospicyass.workers.dev'

function alertEnglish(ts: { translation?: Array<{ text?: string }> | null } | null | undefined): string {
  return ts?.translation?.[0]?.text ?? ''
}

// Commute-relevant: the user's line (Orange County) and endpoints (Fullerton ↔ LA Union).
function isRelevantAlert(a: transit_realtime.IAlert): boolean {
  const routes = (a.informedEntity ?? []).map((ie) => ie.routeId ?? '').join(' ')
  const text = `${alertEnglish(a.headerText)} ${alertEnglish(a.descriptionText)}`.toLowerCase()
  return /orange county|ieoc|fullerton|union station|los angeles|oc line/.test(`${routes} ${text}`)
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

  // FR-RT-CC-03: live Metrolink service alerts (keyless feed)
  const [metrolinkAlerts, setMetrolinkAlerts] = useState<MetrolinkAlert[] | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch(ALERTS_URL)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (cancelled) return
        const feed = transit_realtime.FeedMessage.decode(new Uint8Array(buf))
        const alerts = (feed.entity ?? [])
          .map((e) => e.alert)
          .filter((a): a is transit_realtime.IAlert => a != null)
          .filter(isRelevantAlert)
          .map((a) => ({
            header: alertEnglish(a.headerText),
            desc: alertEnglish(a.descriptionText),
          }))
        setMetrolinkAlerts(alerts)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // FR-RT-CC-02: live drive time Fullerton → LA Union (Mapbox traffic, user token)
  const mapboxToken = useAppStore((s) => s.mapboxToken)
  const [traffic, setTraffic] = useState<TrafficInfo | null>(null)
  useEffect(() => {
    if (!mapboxToken) {
      setTraffic(null)
      return
    }
    let cancelled = false
    fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${TRAFFIC_COORDS}?access_token=${mapboxToken}&overview=false`,
    )
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d?.routes?.[0]) return
        const rt = d.routes[0]
        setTraffic({
          live: `${Math.round(rt.duration / 60)}m`,
          typical: `${Math.round((rt.duration_typical ?? rt.duration) / 60)}m`,
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [mapboxToken])

  // FR-RT-CC-04: live Metrolink delays via the backend proxy (holds the secret key)
  const [delays, setDelays] = useState<DelayStatus | null>(null)
  useEffect(() => {
    let cancelled = false
    fetch(`${PROXY_URL}/metrolink/trips`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !Array.isArray(d?.trips)) return
        const oc = d.trips.filter((t: { routeId?: string }) => /orange county|ieoc|oc line/i.test(t.routeId ?? ''))
        const secs = oc.map((t: { delaySec?: number }) => t.delaySec ?? 0)
        setDelays({
          maxDelayMin: Math.max(0, ...secs.map((s: number) => Math.round(s / 60))),
          delayedCount: secs.filter((s: number) => s > 60).length,
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const cd = countdownTo(leaveTime)
  const doneCount = checklist.filter((c) => c.done).length
  const alertCount = metrolinkAlerts?.length ?? 0

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
              <span className="morning-dot" /> Metrolink —{' '}
              {delays === null ? <i>—</i> : delays.maxDelayMin > 0 ? <b className="morning-alert-n">{delays.maxDelayMin}m late</b> : <i>on time</i>}
            </div>
            <div className="morning-line">
              <span className="morning-dot" /> Amtrak — Fullerton → LA Union
            </div>
            <div className="morning-line">
              <span className="morning-dot" /> Traffic — {traffic ? <b>{traffic.live}</b> : <i>—</i>}
            </div>
          </div>
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
              {traffic ? <b>{traffic.live}</b> : <i>—</i>}
              {traffic && traffic.live !== traffic.typical ? <i> (typ {traffic.typical})</i> : null}
            </div>
            <div className="morning-line">
              <span className="morning-dot" /> Metrolink —{' '}
              {metrolinkAlerts === null ? (
                <i>—</i>
              ) : alertCount > 0 ? (
                <b className="morning-alert-n">{alertCount} alert{alertCount > 1 ? 's' : ''}</b>
              ) : (
                <i>no alerts</i>
              )}
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
