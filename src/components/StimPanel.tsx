import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { SOUNDSCAPES, STIM_NEEDS, ENCOURAGEMENT_LINKS } from '../data/stim'
import { makeNoiseBuffer } from '../lib/noise'

const AUTO_STOP_MS = 10 * 60 * 1000 // FR-ST-03: never run all night

export default function StimPanel() {
  const stimFavs = useAppStore((s) => s.stimFavs)
  const addStimFav = useAppStore((s) => s.addStimFav)
  const removeStimFav = useAppStore((s) => s.removeStimFav)
  const fidgets = useAppStore((s) => s.fidgets)
  const addFidget = useAppStore((s) => s.addFidget)
  const deleteFidget = useAppStore((s) => s.deleteFidget)
  const setActivePanel = useAppStore((s) => s.setActivePanel)

  const [playing, setPlaying] = useState<string | null>(null)
  const [activeNeed, setActiveNeed] = useState<string | null>(null)
  const [favText, setFavText] = useState('')
  const [fidgetName, setFidgetName] = useState('')
  const [fidgetLoc, setFidgetLoc] = useState('')

  const ctxRef = useRef<AudioContext | null>(null)
  const srcRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const stopTimerRef = useRef<number | null>(null)

  function stopSound() {
    if (srcRef.current) {
      try {
        srcRef.current.stop()
      } catch {}
      try {
        srcRef.current.disconnect()
      } catch {}
      srcRef.current = null
    }
    if (gainRef.current) {
      gainRef.current.disconnect()
      gainRef.current = null
    }
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    setPlaying(null)
  }

  useEffect(() => stopSound, [])

  function play(id: string) {
    const sc = SOUNDSCAPES.find((x) => x.id === id)
    if (!sc) return
    if (playing === id) {
      stopSound()
      return
    }
    stopSound()
    try {
      const ctx = (ctxRef.current ??= new AudioContext())
      if (ctx.state === 'suspended') ctx.resume()
      const src = ctx.createBufferSource()
      src.buffer = makeNoiseBuffer(ctx, sc.kind)
      src.loop = true
      const gain = ctx.createGain()
      gain.gain.value = 0.35
      src.connect(gain)
      gain.connect(ctx.destination)
      src.start()
      srcRef.current = src
      gainRef.current = gain
      setPlaying(id)
      stopTimerRef.current = window.setTimeout(stopSound, AUTO_STOP_MS)
    } catch {
      setPlaying(null)
    }
  }

  const need = activeNeed ? STIM_NEEDS.find((n) => n.id === activeNeed) : null

  return (
    <>
      <div className="overlay" onClick={() => setActivePanel(null)} />
      <div className="com-panel">
        <div className="com-panel-head">
          <div className="com-panel-title">Stim Menu</div>
          <button className="icon-btn com-close" onClick={() => setActivePanel(null)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="com-panel-body">
          <div className="com-sub">What do you need right now?</div>
          <div className="stim-needs">
            {STIM_NEEDS.map((n) => (
              <button
                key={n.id}
                className={`stim-need${activeNeed === n.id ? ' active' : ''}`}
                onClick={() => setActiveNeed(activeNeed === n.id ? null : n.id)}
              >
                <span>{n.emoji}</span> {n.label}
              </button>
            ))}
          </div>
          {need && (
            <div className="com-hint" style={{ marginBottom: 8 }}>
              {need.emoji} {need.hint}
            </div>
          )}

          <div className="com-section-label">Soundscapes</div>
          <div className="stim-sounds">
            {SOUNDSCAPES.map((sc) => (
              <button key={sc.id} className={`stim-sound${playing === sc.id ? ' playing' : ''}`} onClick={() => play(sc.id)}>
                <span>{sc.emoji}</span> {sc.label}
                <span className="stim-play">{playing === sc.id ? 'stop' : 'play'}</span>
              </button>
            ))}
          </div>

          <div className="com-section-label">Fidget companion</div>
          <div className="stim-add">
            <input className="com-search" placeholder="Fidget (e.g. tangle)" value={fidgetName} onChange={(e) => setFidgetName(e.target.value)} />
            <input className="com-search" placeholder="Where is it?" value={fidgetLoc} onChange={(e) => setFidgetLoc(e.target.value)} />
            <button
              className="btn btn-sm"
              onClick={() => {
                addFidget(fidgetName, fidgetLoc)
                setFidgetName('')
                setFidgetLoc('')
              }}
            >
              + add
            </button>
          </div>
          <div className="gt-list">
            {fidgets.length === 0 && <div className="com-hint">No fidgets yet — add one and note where it lives.</div>}
            {fidgets.map((f) => (
              <div key={f.id} className="gt-row">
                <span className="gt-text">
                  🧸 {f.name}
                  {f.location ? ` — ${f.location}` : ''}
                </span>
                <button className="icon-btn" title="Remove" onClick={() => deleteFidget(f.id)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="com-section-label">My Favs</div>
          <div className="stim-add">
            <input
              className="com-search"
              placeholder="A stim song, video, or link"
              value={favText}
              onChange={(e) => setFavText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && favText.trim()) {
                  addStimFav(favText)
                  setFavText('')
                }
              }}
            />
            <button
              className="btn btn-sm"
              onClick={() => {
                addStimFav(favText)
                setFavText('')
              }}
            >
              + add
            </button>
          </div>
          <div className="gt-list">
            {stimFavs.map((f, i) => (
              <div key={i} className="gt-row">
                <span className="gt-text">🎵 {f}</span>
                <button className="icon-btn" title="Remove" onClick={() => removeStimFav(f)}>
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="com-section-label">
            Encouragement <span className="locked-badge">locked</span>
          </div>
          <div className="gt-list">
            {ENCOURAGEMENT_LINKS.map((l) => (
              <a key={l.url} className="gt-row gt-link" href={l.url} target="_blank" rel="noreferrer">
                <span className="gt-text">💛 {l.label} ↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
