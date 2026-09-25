import type { NoiseKind } from '../lib/noise'

export interface Soundscape {
  id: string
  label: string
  emoji: string
  kind: NoiseKind
}

// FR-ST-03: sensory-friendly soundscapes, generated locally (no network, no bundled assets).
export const SOUNDSCAPES: Soundscape[] = [
  { id: 'brown', label: 'Brown noise', emoji: '🌫️', kind: 'brown' },
  { id: 'pink', label: 'Pink noise', emoji: '🌸', kind: 'pink' },
  { id: 'white', label: 'White noise', emoji: '📻', kind: 'white' },
  { id: 'rain', label: 'Rain on a tin roof', emoji: '🌧️', kind: 'rain' },
]

// FR-ST-02: need-based entry — the user says what they need, the menu picks the tool.
export interface StimNeed {
  id: string
  label: string
  emoji: string
  hint: string
  soundscapeIds: string[]
}

export const STIM_NEEDS: StimNeed[] = [
  { id: 'quiet', label: 'Quiet', emoji: '🤫', hint: 'Noise-cancelling + low rumble', soundscapeIds: ['brown', 'pink'] },
  { id: 'input', label: 'Input', emoji: '🎮', hint: 'Fidget + steady noise', soundscapeIds: ['white', 'rain'] },
  { id: 'pressure', label: 'Pressure', emoji: '🫂', hint: 'Weighted blanket + deep pressure', soundscapeIds: ['rain', 'brown'] },
]

// FR-ST-11: Encouragement — curated, locked (not user-editable).
export const ENCOURAGEMENT_LINKS: { label: string; url: string }[] = [
  { label: 'Words of encouragement', url: 'https://www.youtube.com/results?search_query=words+of+encouragement' },
]
