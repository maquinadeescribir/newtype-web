export interface AhhArchetype {
  id: string
  label: string
  destruction: string
  emoji: string
}

// FR-AH-04: animation library (v1)
export const AHH_ARCHETYPES: AhhArchetype[] = [
  { id: 'principal', label: 'School principal', destruction: 'Squished by a kaiju mid-sentence', emoji: '🏫' },
  { id: 'rich80', label: '80s movie rich guy', destruction: 'Trampled by a cape buffalo', emoji: '💼' },
  { id: 'kid', label: 'Obnoxious kid', destruction: 'Sacked and beaten by Krampus', emoji: '🧒' },
  { id: 'crowd', label: 'Crowd of mean people', destruction: 'Run off and gored by a bison', emoji: '👥' },
  { id: 'posh', label: 'Posh rich guy', destruction: 'Beaten by his maid', emoji: '🎩' },
  { id: 'karen', label: 'Karen / jerk', destruction: 'Catching fades', emoji: '💇' },
]
