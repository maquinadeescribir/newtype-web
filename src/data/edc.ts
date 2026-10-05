// EDC — Everyday Carry.
// A kit, not a personality. Most of us were never taught this: someone just assumed we already knew
// to carry water and earplugs. Here it is written down, with the reason, so it can be built once.

export interface EdcItem {
  id: string
  emoji: string
  name: string
  why: string
  group: string
}

export const EDC_GROUPS = ['Water & food', 'Sound', 'Light', 'Calm', 'Body', 'Backup'] as const

export const EDC_ITEMS: EdcItem[] = [
  {
    id: 'water',
    emoji: '💧',
    name: 'Water bottle',
    why: 'Dehydration makes focus, mood and headaches worse. A drink is also the fastest reset there is — twenty seconds of doing one simple thing.',
    group: 'Water & food',
  },
  {
    id: 'snack',
    emoji: '🍫',
    name: 'Protein snack',
    why: 'Low blood sugar feels exactly like a mood crash. Some meds kill appetite — eat on a schedule anyway.',
    group: 'Water & food',
  },
  {
    id: 'sour',
    emoji: '🍬',
    name: 'Sour candy',
    why: 'A strong taste is grounding. It grabs the senses and interrupts a spiral — and it is a stim nobody around you notices.',
    group: 'Water & food',
  },
  {
    id: 'mint',
    emoji: '🌿',
    name: 'Mint or gum',
    why: 'The same trick as sour candy, cheaper and quieter. Chewing discharges restless energy.',
    group: 'Water & food',
  },
  {
    id: 'antacid',
    emoji: '🧴',
    name: 'Antacids',
    why: 'Stress and anxiety produce real stomach acid. Heartburn makes you feel worse and feeds the loop.',
    group: 'Water & food',
  },
  {
    id: 'headphones',
    emoji: '🎧',
    name: 'Noise-cancelling headphones',
    why: 'The biggest single switch you can carry. They turn a bus, an office or a mall into a room you can think in.',
    group: 'Sound',
  },
  {
    id: 'earplugs',
    emoji: '🔇',
    name: 'Earplugs',
    why: 'For when headphones are too much or need to stay off. No battery, fits in a pocket, works anywhere.',
    group: 'Sound',
  },
  {
    id: 'sunglasses',
    emoji: '🕶️',
    name: 'Sunglasses',
    why: 'Harsh light and fluorescent glare are sensory input too. Also a polite way to skip eye contact.',
    group: 'Light',
  },
  {
    id: 'cap',
    emoji: '🧢',
    name: 'Cap or hood',
    why: 'Shades your eyes indoors without sunglasses looking odd. A hood also blocks movement in your peripheral vision.',
    group: 'Light',
  },
  {
    id: 'fidget',
    emoji: '🤲',
    name: 'Fidget',
    why: 'Discharges restless energy without leaving your seat. Keeps the hands busy so the brain can work.',
    group: 'Calm',
  },
  {
    id: 'chewelry',
    emoji: '🍋',
    name: 'Chewelry',
    why: 'For when you need to bite or chew. Takes it off your nails, your pens and the inside of your cheek.',
    group: 'Calm',
  },
  {
    id: 'weight',
    emoji: '📿',
    name: 'Something heavy',
    why: 'Deep pressure is calming. A heavy keyring, a full bottle, a bag on your lap — all of it counts.',
    group: 'Calm',
  },
  {
    id: 'cool',
    emoji: '🧊',
    name: 'Cold drink or cooling cloth',
    why: 'Cold to the wrist or the back of the neck is a fast reset for overload and for panic.',
    group: 'Calm',
  },
  {
    id: 'layer',
    emoji: '🧣',
    name: 'A layer (hoodie)',
    why: 'Temperature swings wreck regulation. A layer is also a portable cocoon you can pull over your head.',
    group: 'Body',
  },
  {
    id: 'plasters',
    emoji: '🩹',
    name: 'Plasters & painkillers',
    why: 'Small injuries derail a whole day. Handle it in the moment rather than enduring it for six hours.',
    group: 'Body',
  },
  {
    id: 'wipes',
    emoji: '🧻',
    name: 'Wipes / hand gel',
    why: 'Sticky hands and public surfaces are sensory problems. Fix it in ten seconds instead of simmering.',
    group: 'Body',
  },
  {
    id: 'notebook',
    emoji: '📓',
    name: 'Notebook & pen',
    why: 'External memory. Write it down and the brain is finally allowed to let go of it.',
    group: 'Backup',
  },
  {
    id: 'power',
    emoji: '🔋',
    name: 'Power bank & cable',
    why: 'A dead phone is an emergency when the phone is your map, your money and your coping tool.',
    group: 'Backup',
  },
  {
    id: 'spare',
    emoji: '🎒',
    name: 'Spare daily kit',
    why: 'One backup of whatever you take on a schedule, kept in the bag. Running out is a bad afternoon you can simply prevent.',
    group: 'Backup',
  },
]
