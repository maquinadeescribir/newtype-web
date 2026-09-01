import { useEffect, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'

const IDLE_RESET_MS = 30000 // FR-SI-06: reset streak after 30s of no scrolling
const MAX_DELTA_MS = 1500 // cap per-event accumulation so stillness doesn't count

export function useScrollIntervention() {
  const lastScrollRef = useRef<number | null>(null)

  useEffect(() => {
    function onScroll() {
      const now = Date.now()
      const s = useAppStore.getState()
      if (!s.scrollEnabled) return

      // FR-SI-14: cool-down after an intervention — no re-tracking, no nagging
      if (s.lastInterventionAt && now - s.lastInterventionAt < s.scrollCoolDownMin * 60000) return

      const last = lastScrollRef.current
      if (last != null) {
        const gap = now - last
        if (gap > IDLE_RESET_MS) {
          s.resetScrollTime()
        } else {
          s.addScrollTime(Math.min(gap, MAX_DELTA_MS))
        }
      }
      lastScrollRef.current = now

      const after = useAppStore.getState()
      if (after.scrollEnabled && after.scrollTimeMs >= after.scrollThresholdMin * 60000 && !after.scrollOverlayOpen) {
        after.openScrollOverlay()
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', onScroll, { passive: true })
    window.addEventListener('touchmove', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', onScroll)
      window.removeEventListener('touchmove', onScroll)
    }
  }, [])
}
