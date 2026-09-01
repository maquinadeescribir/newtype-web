import type { Medication, MedState } from '../types'

function sameDay(a: number, b: number): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

export function computeMedState(med: Medication, now = Date.now()): MedState {
  const takenToday = med.lastTakenAt != null && sameDay(med.lastTakenAt, now)

  if (!takenToday) {
    if (!med.scheduleTime) return 'gray'
    const scheduledToday = scheduleToEpoch(med.scheduleTime, now)
    const diffMin = (now - scheduledToday) / 60000
    if (diffMin < 0) return 'gray' // not due yet
    if (diffMin <= 60) return 'orange' // due soon
    return 'red' // overdue
  }

  // taken today
  if (med.scheduleTime) {
    const scheduled = scheduleToEpoch(med.scheduleTime, med.lastTakenAt!)
    const lateByMin = (med.lastTakenAt! - scheduled) / 60000
    if (lateByMin > med.lateThresholdMin) return 'yellow'
    return 'green'
  }
  return 'green'
}

function scheduleToEpoch(hhmm: string, ref: number): number {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(ref)
  d.setHours(h, m, 0, 0)
  return d.getTime()
}

export function medStateLabel(state: MedState): string {
  switch (state) {
    case 'green':
      return 'Taken'
    case 'yellow':
      return 'Taken late'
    case 'orange':
      return 'Due soon'
    case 'red':
      return 'Overdue'
    case 'gray':
      return 'Not scheduled'
  }
}
