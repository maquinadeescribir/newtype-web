// Deep Space palette — Appendix B.3 of IT Requirements v3.0
export const palette = {
  bg: '#0D1117',
  surface: '#161B22',
  surfaceAlt: '#1B2A4A',
  surfaceRaised: '#21262D',
  border: '#30363D',
  borderStrong: '#3d444d',
  text: '#E6EDF3',
  textMuted: '#8B949E',
  textDim: '#667799',
  accent: '#FF006E',
  accentSoft: '#FF3B8B',
  // timers
  timerMagenta: '#FF006E',
  timerNavy: '#1B2A4A',
  timerCoral: '#FF6B6B',
  timerGray: '#1A1A1A',
  // med states
  medGreen: '#4CAF50',
  medYellow: '#FFC107',
  medOrange: '#FF9800',
  medRed: '#F44336',
  medGray: '#9E9E9E',
} as const

export const TIMER_COLORS = [palette.timerMagenta, palette.timerNavy, palette.timerCoral]
