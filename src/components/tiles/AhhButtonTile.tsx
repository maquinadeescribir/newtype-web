import { useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { AHH_ARCHETYPES } from '../../lib/ahh'
import DestructionScene from './AhhScenes'

type Stage = 'closed' | 'picker' | 'anim' | 'done'

const ANIM_MS = 5600

export default function AhhButtonTile() {
  const createTimer = useAppStore((s) => s.createTimer)
  const speak = useAppStore((s) => s.speak)
  const [stage, setStage] = useState<Stage>('closed')
  const [archetype, setArchetype] = useState<string | null>(null)

  useEffect(() => {
    if (stage !== 'anim') return
    const t = setTimeout(() => setStage('done'), ANIM_MS)
    return () => clearTimeout(t)
  }, [stage])

  function pick(id: string) {
    setArchetype(id)
    setStage('anim')
  }

  function close() {
    setStage('closed')
    setArchetype(null)
  }

  function startTimer() {
    createTimer('reset', 25)
    speak('25 minute timer started.')
    close()
  }

  const current = AHH_ARCHETYPES.find((a) => a.id === archetype)

  return (
    <>
      <div className="tile-body ahh-tile-body">
        <button className="ahh-trigger" onClick={() => setStage('picker')}>
          <span>💥</span> AHH
        </button>
        <div className="ahh-hint">destroy your inner opposition</div>
      </div>

      {stage !== 'closed' && (
        <div className="overlay ahh-overlay">
          <div className="overlay-card ahh-card">
            {stage === 'picker' && (
              <>
                <div className="overlay-title">Pick your opposition</div>
                <div className="ahh-grid">
                  {AHH_ARCHETYPES.map((a) => (
                    <button key={a.id} className="ahh-pick" onClick={() => pick(a.id)}>
                      <span className="ahh-pick-emoji">{a.emoji}</span>
                      <span className="ahh-pick-label">{a.label}</span>
                      <span className="ahh-pick-desc">{a.destruction}</span>
                    </button>
                  ))}
                </div>
                <div className="overlay-actions" style={{ flexDirection: 'row' }}>
                  <button className="btn btn-ghost" onClick={close}>
                    Not now
                  </button>
                </div>
              </>
            )}

            {stage === 'anim' && current && (
              <>
                <div className="ahh-stage">
                  <DestructionScene id={current.id} />
                </div>
                <div className="ahh-caption">{current.destruction}.</div>
              </>
            )}

            {stage === 'done' && current && (
              <>
                <div className="overlay-title">Gone.</div>
                <div className="overlay-body">
                  That was the {current.label.toLowerCase()}. It's handled. Want to do something real?
                </div>
                <div className="overlay-actions">
                  <button className="btn btn-primary" onClick={startTimer}>
                    Start a 25-min timer
                  </button>
                  <button
                    className="btn"
                    onClick={() => speak('You already won. Go easy on yourself.')}
                  >
                    Talk to Saw
                  </button>
                  <button className="btn btn-ghost" onClick={close}>
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
