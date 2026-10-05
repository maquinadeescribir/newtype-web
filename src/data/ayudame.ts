// Ayúdame — what to do when it gets too much.
// Content is deliberately plain: what a body does, and what actually helps. No motivational language (FR-CH-IN-07).
// Not medical advice — see the footer note on the panic mode.

export interface AyudaMode {
  id: string
  label: string
  emoji: string
  tagline: string
  steps: string[]
  note?: string
}

export const AYUDA_MODES: AyudaMode[] = [
  {
    id: 'overload',
    label: 'Overload',
    emoji: '🔊',
    tagline: 'Too much coming in. Cut the input first, think after.',
    steps: [
      'Cut the input: headphones or earplugs on, sunglasses down, screen brightness to zero.',
      'Change the room if you can. Step out, or put your back against a wall.',
      'Deep pressure helps: press your palms together hard, hug your bag, press your back to the wall.',
      'Cold on the wrists or the back of the neck. A cold drink works if that is all you have.',
      'Feet flat on the floor. Name three things you can see, then one you can hear.',
      'One task only. Everything else waits — it will still be there.',
    ],
  },
  {
    id: 'panic',
    label: 'Panic',
    emoji: '💓',
    tagline: 'The alarm is real. The danger is not.',
    steps: [
      'This is a false alarm: your body ran a survival drill with nothing to fight. It is not a heart attack.',
      'It peaks and then falls, usually inside about ten minutes. You will not stay here.',
      'Slow the OUT breath: in for 4, out for 6 to 8. A long exhale is what switches the alarm off.',
      'Cold on your face or wrists, or hold something ice-cold. It resets the nervous system fast.',
      '5-4-3-2-1: five things you see, four you can touch, three you hear, two you smell, one you taste.',
      'Do not fight it. Fighting the wave is what makes it last longer. Ride it down.',
    ],
    note: 'Chest pain, one-sided weakness, or breathlessness when you are NOT panicking is not panic. Call emergency services.',
  },
  {
    id: 'anxiety',
    label: 'Anxiety',
    emoji: '🌀',
    tagline: 'A spiral, not an emergency.',
    steps: [
      'Name it out loud: "this is anxiety, not danger." Naming moves it from feeling into thinking.',
      'Box breathing: in 4, hold 4, out 4, hold 4.',
      'Write the worry down on paper. Written down, it gets smaller and stops looping.',
      'Move for five minutes — walk, stairs, shake it out. Anxiety is energy with nowhere to go.',
      'Drink water. Eat something if it has been a while since you did.',
      'Pick one next action. Not the whole plan — one.',
    ],
  },
  {
    id: 'shutdown',
    label: 'Shutdown',
    emoji: '🧊',
    tagline: 'Flat, frozen, cannot start.',
    steps: [
      'Permission to stop. This is a nervous-system limit, not laziness.',
      'Reduce demands: cancel what you can, postpone the rest. Nothing here is on fire.',
      'Warmth: blanket, hoodie, warm drink. Cold makes shutdown worse.',
      'Tiny movement — wiggle fingers and toes, then a bit more, then stand up.',
      'Turn input down: dim light, quiet, no screens if you can manage it.',
      'Rest is a thing you are doing. Recover first, decide after.',
    ],
  },
  {
    id: 'rage',
    label: 'Rage',
    emoji: '🔥',
    tagline: 'Flooded. Nothing good comes out right now.',
    steps: [
      'Leave the trigger. Physically leave the room.',
      'Discharge it: fast walk, push a wall, cold water, loud music in headphones.',
      'Do not send the message. Do not make the decision. Not now.',
      'Write it instead — everything you want to say, addressed to nobody. Then close the file.',
      'Wait for the wave to drop. It always drops.',
      'Come back when your voice is level. Then say the one thing that actually matters.',
    ],
  },
  {
    id: 'dissociation',
    label: 'Dissociation',
    emoji: '🌫️',
    tagline: 'Unreal, far away, numb.',
    steps: [
      'Ground: name five things you can see. Touch something with a texture.',
      'Cold or a strong taste — ice, sour candy, mint. Sharp senses pull you back.',
      'Move: press your feet hard into the floor, then stand and take a few steps.',
      'Say your name, the date, and where you are, out loud.',
      'Contact someone safe. You do not have to explain — "hi" is enough.',
      'This passes. You are still here.',
    ],
  },
]
