// Environment — sensory load factors.
// The tile is a bare gauge (no text). The panel holds the specifics: rate each factor 1-5,
// the gauge sums them, and the log turns "I'm overwhelmed" into "Tuesdays ~2pm, open plan, 9/10".

export interface EnvFactor {
  id: string
  label: string
  emoji: string
  hint: string
}

export interface EnvReading {
  id: string
  at: number
  score: number
  levels: Record<string, number>
}

export const ENV_FACTORS: EnvFactor[] = [
  { id: 'sound', label: 'Sound', emoji: '🔊', hint: 'loudness + how sudden' },
  { id: 'light', label: 'Light', emoji: '💡', hint: 'brightness + harshness' },
  { id: 'people', label: 'People', emoji: '👥', hint: 'how many, how close' },
  { id: 'motion', label: 'Motion', emoji: '🌀', hint: 'movement in view' },
  { id: 'smell', label: 'Smell', emoji: '👃', hint: 'intensity + type' },
]

/** Weighted sum of the factor levels → 0–100. */
export function envIndex(levels: Record<string, number>): number {
  const total = ENV_FACTORS.reduce((sum, f) => sum + (levels[f.id] ?? 0), 0)
  const max = ENV_FACTORS.length * 5
  return Math.round((total / max) * 100)
}

export function envColor(idx: number): string {
  if (idx < 34) return '#4CAF50'
  if (idx < 67) return '#FF9800'
  return '#F44336'
}

export function envWord(idx: number): string {
  if (idx < 34) return 'Low load'
  if (idx < 67) return 'Building'
  return 'High load'
}

export const ENV_MITIGATION: Record<string, string> = {
  sound: 'Headphones or earplugs. EDC → Sound.',
  light: 'Sunglasses, cap or hood. EDC → Light.',
  people: 'Move to an edge, back to a wall, fewer faces in view.',
  motion: 'Face a fixed point — wall or window — instead of the room.',
  smell: 'Step out, or something sharp under the nose: mint or sour candy.',
}
