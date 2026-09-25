import { useEffect, useState } from 'react'
import { useAppStore } from './store/useAppStore'
import TileGrid from './components/layout/TileGrid'
import ScrollOverlay from './components/ScrollOverlay'
import Onboarding from './components/onboarding/Onboarding'
import TileConfigPanel from './components/config/TileConfigPanel'
import CommunityPanel from './components/CommunityPanel'
import { NewsPanel } from './components/tiles/NewsTile'
import ActivityPanel from './components/ActivityPanel'
import HyperfixationPanel from './components/HyperfixationPanel'
import ResourcesPanel from './components/ResourcesPanel'
import GoodThingsPanel from './components/GoodThingsPanel'
import DaySummaryPanel from './components/DaySummaryPanel'
import StimPanel from './components/StimPanel'
import GoodDeedsPanel from './components/GoodDeedsPanel'
import BodyScanPanel from './components/BodyScanPanel'
import FoodPanel from './components/FoodPanel'
import WeightPanel from './components/WeightPanel'
import { useScrollIntervention } from './hooks/useScrollIntervention'
import type { CommunityVariant } from './types'

export default function App() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete)
  const lastActivity = useAppStore((s) => s.lastActivity)
  const speak = useAppStore((s) => s.speak)
  const setLastActivity = useAppStore((s) => s.setLastActivity)
  const activePanel = useAppStore((s) => s.activePanel)
  const [configOpen, setConfigOpen] = useState(false)

  useScrollIntervention()

  // timer tick — wall-clock based, survives backgrounding
  useEffect(() => {
    const t = setInterval(() => useAppStore.getState().tickTimers(Date.now()), 500)
    return () => clearInterval(t)
  }, [])

  // welcome back (FR-MC-02) + seed context
  useEffect(() => {
    const t = setTimeout(() => {
      if (lastActivity) {
        speak(`Back. Last session: ${lastActivity}.`)
      }
    }, 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // record "now working" as current context when a timer starts (cheap proxy)
  useEffect(() => {
    return () => {
      const t = useAppStore.getState().timers.find((x) => x.status === 'running')
      if (t) setLastActivity(t.label)
    }
  }, [setLastActivity])

  return (
    <div className="app">
      <div className="topbar">
        <div className="topbar-brand">
          <span className="dot" />
          Saw
          <span className="topbar-sub">· neurospicy assistant</span>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost btn-sm" onClick={() => setConfigOpen(true)}>
            ⚙ My Tools
          </button>
        </div>
      </div>

      {onboardingComplete ? (
        <div className="dashboard">
          <TileGrid />
        </div>
      ) : (
        <Onboarding />
      )}

      <ScrollOverlay />
      <TileConfigPanel open={configOpen} onClose={() => setConfigOpen(false)} />
      {activePanel?.startsWith('community') && (
        <CommunityPanel initialTab={activePanel.split(':')[1] as CommunityVariant} />
      )}
      {activePanel === 'news' && <NewsPanel />}
      {activePanel === 'activity' && <ActivityPanel />}
      {activePanel === 'hyperfixation' && <HyperfixationPanel />}
      {activePanel === 'resources' && <ResourcesPanel />}
      {activePanel === 'goodthings' && <GoodThingsPanel />}
      {activePanel === 'daysummary' && <DaySummaryPanel />}
      {activePanel === 'stim' && <StimPanel />}
      {activePanel === 'gooddeeds' && <GoodDeedsPanel />}
      {activePanel === 'bodyscan' && <BodyScanPanel />}
      {activePanel === 'food' && <FoodPanel />}
      {activePanel === 'weight' && <WeightPanel />}
    </div>
  )
}
