import type { Resource } from '../types'

// Vetted, reputable resources for autistic / AuDHD adults.
// Curated seed — you can add, hide, or delete entries from the panel.
export const SEED_RESOURCES: Resource[] = [
  { id: 'asan', name: 'ASAN — Autistic Self Advocacy Network', url: 'https://autisticadvocacy.org', category: 'advocacy', description: 'Autistic-led civil-rights org; policy, self-advocacy, and the free "Welcome to the Autistic Community" guide.', hidden: false },
  { id: 'awn', name: 'AWN — Autistic Women & Nonbinary Network', url: 'https://awnnetwork.org', category: 'community', description: 'Support and community run by and for autistic women and nonbinary people.', hidden: false },
  { id: 'chadd', name: 'CHADD', url: 'https://chadd.org', category: 'adhd', description: 'ADHD education, support groups, and advocacy for children and adults.', hidden: false },
  { id: 'adda', name: 'ADDA — Attention Deficit Disorder Association', url: 'https://add.org', category: 'adhd', description: 'Adult-ADHD support: webinars, peer groups, and coaching resources.', hidden: false },
  { id: 'aane', name: 'AANE — Association for Autism and Neurodiversity', url: 'https://aane.org', category: 'community', description: 'Support groups, workshops, and employment programs for autistic adults.', hidden: false },
  { id: 'nas', name: 'National Autistic Society (UK)', url: 'https://www.autism.org.uk', category: 'education', description: 'Guides, rights information, and services from the UK\u2019s leading autism charity.', hidden: false },
  { id: 'embrace', name: 'Embrace Autism', url: 'https://embrace-autism.com', category: 'diagnosis', description: 'Screening tests, research summaries, and info by autistic researchers. Not a substitute for assessment.', hidden: false },
  { id: 'autismsociety', name: 'Autism Society', url: 'https://autismsociety.org', category: 'advocacy', description: 'US national org — information, referrals, and local affiliates.', hidden: false },
  { id: 'neuroclastic', name: 'NeuroClastic', url: 'https://neuroclastic.com', category: 'community', description: 'Autistic-run collective publishing lived-experience writing and explainers.', hidden: false },
  { id: 'transmitter', name: 'The Transmitter (Spectrum)', url: 'https://www.thetransmitter.org', category: 'science', description: 'Evidence-based autism and neuroscience journalism.', hidden: false },
  { id: 'understood', name: 'Understood', url: 'https://www.understood.org', category: 'education', description: 'Learning and thinking differences — ADHD and learning resources for adults.', hidden: false },
  { id: 'howtoadhd', name: 'How to ADHD (Jessica McCabe)', url: 'https://www.youtube.com/@HowtoADHD', category: 'adhd', description: 'Practical, well-researched ADHD strategies on YouTube.', hidden: false },
  { id: 'adhdevidence', name: 'ADHD Evidence Project', url: 'https://www.adhdevidence.org', category: 'science', description: 'Curated, source-cited evidence base for ADHD claims.', hidden: false },
  { id: 'jan', name: 'JAN — Job Accommodation Network', url: 'https://askjan.org', category: 'workplace', description: 'Free guidance on workplace accommodations and disability disclosure.', hidden: false },
  { id: '988', name: '988 Suicide & Crisis Lifeline', url: 'https://988lifeline.org', category: 'crisis', description: '24/7 free crisis support — call or text 988.', hidden: false },
  { id: 'ctext', name: 'Crisis Text Line', url: 'https://www.crisistextline.org', category: 'crisis', description: 'Text HOME to 741741 for free, confidential 24/7 crisis support.', hidden: false },
]

export const RESOURCE_CATEGORIES: Record<string, string> = {
  advocacy: 'Advocacy',
  community: 'Community',
  adhd: 'ADHD',
  diagnosis: 'Diagnosis',
  education: 'Education',
  science: 'Science',
  workplace: 'Workplace',
  crisis: 'Crisis',
  other: 'Other',
}
