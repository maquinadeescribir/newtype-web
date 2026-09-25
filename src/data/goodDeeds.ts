import type { GoodDeed } from '../types'

// FR-DC: quick, one-tap ways to do good in the world. Factual, no motivational language (FR-DC-05).
export const SEED_GOOD_DEEDS: GoodDeed[] = [
  { id: 'givewell', text: 'Give $5 to GiveWell (evidence-based giving)', done: false, doneAt: null },
  { id: 'foodbank', text: 'Donate to a local food bank', done: false, doneAt: null },
  { id: 'rep', text: 'Call your representative about an issue you care about', done: false, doneAt: null },
  { id: 'petition', text: 'Sign a petition (ACLU, change.org, …)', done: false, doneAt: null },
  { id: 'review', text: 'Leave a kind review for a local business', done: false, doneAt: null },
  { id: 'litter', text: 'Pick up litter on your next walk', done: false, doneAt: null },
  { id: 'friend', text: 'Message a friend something you appreciate about them', done: false, doneAt: null },
  { id: 'volunteer', text: 'Volunteer for a local cause', done: false, doneAt: null },
]
