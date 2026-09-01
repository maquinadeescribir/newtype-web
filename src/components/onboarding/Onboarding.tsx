import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

const GOAL_EXAMPLES = ['Finish thesis', 'Exercise 3x/week', 'Learn Rust', 'Organise the revolution', 'Just survive tomorrow']

interface GoalDraft {
  title: string
  why: string
}

export default function Onboarding() {
  const step = useAppStore((s) => s.onboardingStep)
  const setStep = useAppStore((s) => s.setOnboardingStep)
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const addGoal = useAppStore((s) => s.addGoal)
  const setScrollEnabled = useAppStore((s) => s.setScrollEnabled)
  const setScrollThresholdMin = useAppStore((s) => s.setScrollThresholdMin)
  const speak = useAppStore((s) => s.speak)

  const [goals, setGoals] = useState<GoalDraft[]>([{ title: '', why: '' }])
  const [scrollOn, setScrollOn] = useState(true)
  const [threshold, setThreshold] = useState(10)

  const TOTAL = 3

  function updateGoal(i: number, patch: Partial<GoalDraft>) {
    setGoals((gs) => gs.map((g, idx) => (idx === i ? { ...g, ...patch } : g)))
  }

  function addGoalRow() {
    if (goals.length >= 3) return
    setGoals((gs) => [...gs, { title: '', why: '' }])
  }

  function commitGoals() {
    let n = 0
    goals.forEach((g) => {
      if (g.title.trim() && n < 3) {
        addGoal({
          title: g.title.trim(),
          why: g.why.trim(),
          priority: (n + 1) as 1 | 2 | 3,
          status: 'active',
          actionSuggestion: `Work on ${g.title.trim()} for 25 min`,
        })
        n++
      }
    })
  }

  function finish() {
    commitGoals()
    setScrollEnabled(scrollOn)
    setScrollThresholdMin(threshold)
    completeOnboarding()
    speak(`Dashboard's live. Timers work right now.`)
  }

  function skipGoals() {
    setStep(2)
  }

  return (
    <div className="onboarding">
      <div className="ob-progress">
        {Array.from({ length: TOTAL }).map((_, i) => (
          <span key={i} className={i === step ? 'active' : ''} />
        ))}
      </div>

      {step === 0 && (
        <div className="ob-step">
          <h1>I'm Saw.</h1>
          <p className="ob-sub">
            I hold the stuff your brain shouldn't have to — timers, meds, goals. And when you start doomscrolling, I point you back
            at what you actually want. No cheerleading. No shame. Just the facts.
          </p>
          <div className="ob-footer">
            <button className="btn btn-primary" onClick={() => setStep(1)}>
              Let's go
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="ob-step">
          <h1>What do you want?</h1>
          <p className="ob-sub">Up to three, one line each. These drive everything — including the scroll redirect.</p>

          {goals.map((g, i) => (
            <div key={i} className="ob-goal-card">
              <div className="field" style={{ marginBottom: 8 }}>
                <label>Goal {i + 1}</label>
                <input
                  value={g.title}
                  onChange={(e) => updateGoal(i, { title: e.target.value })}
                  placeholder="One line"
                  autoFocus={i === 0}
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <input
                  value={g.why}
                  onChange={(e) => updateGoal(i, { why: e.target.value })}
                  placeholder="Why (optional)"
                />
              </div>
            </div>
          ))}

          {goals.length < 3 && (
            <button className="btn btn-ghost btn-sm" onClick={addGoalRow}>
              + another goal
            </button>
          )}

          <div className="field" style={{ marginTop: 16 }}>
            <label>Examples</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {GOAL_EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  className="btn btn-sm"
                  onClick={() => {
                    const empty = goals.findIndex((g) => !g.title.trim())
                    if (empty >= 0) updateGoal(empty, { title: ex })
                    else if (goals.length < 3) setGoals((gs) => [...gs, { title: ex, why: '' }])
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div className="ob-footer">
            <button className="ob-skip" onClick={skipGoals}>
              Set goals later — timers work now
            </button>
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="ob-step">
          <h1>Catch me scrolling?</h1>
          <p className="ob-sub">
            I watch how long you scroll in this app. After a threshold, I interrupt — not with "stop scrolling", but with a
            redirect to your goals. Dismiss any time, no guilt.
          </p>

          <div className="field">
            <label>Scroll intervention</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn ${scrollOn ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setScrollOn(true)}
              >
                On
              </button>
              <button
                className={`btn ${!scrollOn ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setScrollOn(false)}
              >
                Off
              </button>
            </div>
          </div>

          {scrollOn && (
            <div className="field">
              <label>Threshold — {threshold} minutes</label>
              <input
                type="range"
                min={2}
                max={60}
                value={threshold}
                onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
              />
              <div className="hint">Default 10 min. Range 2–60.</div>
            </div>
          )}

          <div className="ob-footer">
            <button className="btn btn-primary" onClick={finish}>
              Open dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
