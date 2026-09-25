export interface BodyPart {
  id: string
  label: string
}

// Front-view clickable regions on the body outline.
export const BODY_PARTS: BodyPart[] = [
  { id: 'head', label: 'Head' },
  { id: 'neck', label: 'Neck' },
  { id: 'chest', label: 'Chest' },
  { id: 'stomach', label: 'Stomach / gut' },
  { id: 'l-arm', label: 'Left arm' },
  { id: 'r-arm', label: 'Right arm' },
  { id: 'hip', label: 'Hips / pelvis' },
  { id: 'l-leg', label: 'Left leg' },
  { id: 'r-leg', label: 'Right leg' },
  { id: 'l-foot', label: 'Left foot' },
  { id: 'r-foot', label: 'Right foot' },
]

export interface Feeling {
  label: string
  color: string
  category: string
}

// Colour-coded list — everyday aches plus autistic/ADHD-relevant sensations.
export const FEELING_CATEGORIES = ['Pain', 'Head & thinking', 'Digestive', 'Energy', 'Sensory', 'Body & emotion']

export const FEELINGS: Feeling[] = [
  // Pain
  { label: 'Sharp pain', color: '#f44336', category: 'Pain' },
  { label: 'Dull ache', color: '#ff7043', category: 'Pain' },
  { label: 'Throbbing', color: '#e91e63', category: 'Pain' },
  { label: 'Cramp', color: '#ff5722', category: 'Pain' },
  { label: 'Sore', color: '#ff9800', category: 'Pain' },
  // Head & thinking
  { label: 'Headache', color: '#9c27b0', category: 'Head & thinking' },
  { label: 'Pressure', color: '#7e57c2', category: 'Head & thinking' },
  { label: 'Brain fog', color: '#7986cb', category: 'Head & thinking' },
  { label: 'Dizzy', color: '#5c6bc0', category: 'Head & thinking' },
  { label: 'Light-sensitive', color: '#3f51b5', category: 'Head & thinking' },
  // Digestive
  { label: 'Bubble guts', color: '#4caf50', category: 'Digestive' },
  { label: 'Gurgly', color: '#8bc34a', category: 'Digestive' },
  { label: 'Bloated', color: '#66bb6a', category: 'Digestive' },
  { label: 'Nausea', color: '#aed581', category: 'Digestive' },
  { label: 'Reflux', color: '#2e7d32', category: 'Digestive' },
  // Energy
  { label: 'Wired / racing', color: '#ffc107', category: 'Energy' },
  { label: 'Exhausted', color: '#ffeb3b', category: 'Energy' },
  { label: 'Restless', color: '#fdd835', category: 'Energy' },
  { label: 'Heavy / sluggish', color: '#c0ca33', category: 'Energy' },
  // Sensory
  { label: 'Overstimulated', color: '#00bcd4', category: 'Sensory' },
  { label: 'Overwhelmed', color: '#26c6da', category: 'Sensory' },
  { label: 'Sound-sensitive', color: '#4dd0e1', category: 'Sensory' },
  { label: 'Touch-sensitive', color: '#80deea', category: 'Sensory' },
  // Body & emotion
  { label: 'Tight chest', color: '#00897b', category: 'Body & emotion' },
  { label: 'Racing heart', color: '#ef5350', category: 'Body & emotion' },
  { label: 'Knot in stomach', color: '#26a69a', category: 'Body & emotion' },
  { label: 'Jaw clenched', color: '#00695c', category: 'Body & emotion' },
  { label: 'Shaky / trembly', color: '#4db6ac', category: 'Body & emotion' },
]
