export interface NewsItem {
  text: string
  url?: string
}

export interface NewsEntry {
  date: string
  headline: string
  items: NewsItem[]
  mostImportant: string
}

// Seed archive — real digests produced by the `spectrum-news` cron (5:30am daily).
// The live pipeline (cron → JSON → deploy) is Phase 2; this bundles the recent history.
export const NEWS_ARCHIVE: NewsEntry[] = [
  {
    date: '2026-09-25',
    headline: 'ASD research digest — Sep 24–25',
    items: [
      { text: 'JAMA Psychiatry (Sep 24): Danish study of 2.1M youth finds today\u2019s ASD/ADHD diagnoses resemble the general population more closely than a decade ago — rising rates partly reflect broader identification, not more underlying cases.', url: 'https://www.sciencedaily.com/releases/2026/09/260924020353.htm' },
      { text: 'Dev Med & Child Neurology umbrella review (Sep 23): no causal link between prenatal acetaminophen and autism/ADHD across 7 meta-analyses (>3M participants); the association vanishes in high-quality data.', url: 'https://www.cidrap.umn.edu/anti-science/tylenol-during-pregnancy-not-linked-autism-adhd-major-review-finds' },
      { text: 'Molecular Autism (Sep 23): first RCT evidence for N170 latency as an EEG biomarker of arbaclofen treatment response in autism.', url: 'https://link.springer.com/article/10.1186/s13229-026-00742-z' },
      { text: 'Molecular Autism (Sep 22): new study characterizes autism presentation in Klinefelter syndrome (47,XXY), an under-diagnosed group.', url: 'https://link.springer.com/article/10.1186/s13229-026-00745-w' },
    ],
    mostImportant: 'The JAMA Psychiatry finding that surging ASD/ADHD diagnoses largely reflect who is being identified (broader diagnostic patterns), not an equivalent rise in underlying prevalence.',
  },
  {
    date: '2026-09-24',
    headline: 'ASD research digest — last 24h + recent week',
    items: [
      { text: 'Congenital TORCH infections tied to ~3× autism risk — Karolinska/JAMA Pediatrics (Sept 23): among 3.7M Swedish births, 975 with toxo/rubella/CMV/herpes/HSV showed 3× autism and 7× intellectual-disability risk; ~1 in 5 exposed later develops autism.', url: 'https://jamanetwork.com/journals/jamapediatrics/fullarticle/2853867' },
      { text: 'Autism-CLIP vision-language model (Nature Communications, Sept 16) automates early autism screening from 3-min home videos of toddlers aged 15–24 months.', url: 'https://www.nature.com/articles/s41467-026-77721-8' },
      { text: 'No evidence of an autism "epidemic" (JAMA cohort via CIDRAP, Sept 18) — 7-year cumulative incidence and age-7 prevalence held stable across 12 consecutive birth cohorts.', url: 'https://www.cidrap.umn.edu/public-health/study-uncovers-no-evidence-autism-epidemic-despite-claims' },
      { text: 'Autism linked to a 14-year life-expectancy deficit (JAMA Network Open, Sept 10) — Columbia/Colorado study of US Medicaid data; flu/pneumonia the leading contributor to excess mortality.', url: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2853885' },
      { text: 'Debate over splitting the spectrum (PBS NewsHour, Sept 21) — experts weigh whether autism should be divided into subtypes for research and diagnosis.', url: 'https://www.pbs.org/video/disability-reframed-1777320271/' },
    ],
    mostImportant: 'The Karolinska TORCH study — the largest ever linking congenital TORCH infections to autism and intellectual disability, with roughly one in five infected children later developing autism.',
  },
  {
    date: '2026-09-21',
    headline: 'ASD science digest — past week',
    items: [
      { text: 'Science (Sep 17): 1,000+ mouse-brain transcriptomes show 1,200+ autism-risk mutations converge on just two opposing gene-activity states, sex- and age-dependent, with differing fluoxetine/lithium responses.', url: 'https://medicalxpress.com/news/2026-09-autism-mutations-reveal-opposing-patterns.html' },
      { text: 'JAMA Pediatrics (Sep 18): South Korean study of 12 birth cohorts (62,000+ children) finds ASD incidence/prevalence stable over 7 years — "does not support an ASD epidemic," rise reflects detection.', url: 'https://jamanetwork.com/journals/jamapediatrics/article-abstract/2853636' },
      { text: 'JAMA Network Open (Sep 14): Medicaid data show autistic people die ~14 years earlier; influenza (SMR 10.55), malnutrition, pneumonitis, drowning, pneumonia are the preventable drivers.', url: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2853885' },
      { text: 'Nature Communications (Sep 16): altered brain-activity patterns in MECP2 transgenic monkeys inform Rett/ASD mechanisms.', url: 'https://www.nature.com/subjects/autism-spectrum-disorders/ncomms' },
      { text: 'The Transmitter/Spectrum (Sep 21): Kevin Mitchell interviews Huda Zoghbi on identifying the MECP2/Rett gene and emerging fixes.', url: 'https://www.thetransmitter.org/spectrum/finding-the-rett-syndrome-gene-and-ways-to-fix-it/' },
    ],
    mostImportant: 'The 14-year life-expectancy deficit (JAMA Network Open) — a large, actionable mortality gap driven largely by preventable causes like flu and pneumonia.',
  },
  {
    date: '2026-09-20',
    headline: 'ASD research digest — Sept 20',
    items: [
      { text: 'JAMA Pediatrics (this week): UT Austin cohort study of 12 South Korean birth cohorts finds ASD incidence/prevalence held steady at 1.9–3.2%, concluding rising diagnoses reflect improved detection, not an "epidemic."', url: 'https://www.cidrap.umn.edu/public-health/study-uncovers-no-evidence-autism-epidemic-despite-claims' },
      { text: 'Science (Sept 17): IBS Korea analyzed 1,000+ mouse-brain transcriptomes across 17 ASD-risk mutations, showing they collapse into two opposing gene-expression patterns with divergent fluoxetine/lithium responses.', url: 'https://medicalxpress.com/news/2026-09-autism-mutations-reveal-opposing-patterns.html' },
      { text: 'Nature Communications (Sept 16): "Autism-CLIP" vision-language model screens toddlers (15–24 mo) for autism from 3-minute home videos.', url: 'https://www.nature.com/articles/s41467-026-77721-8' },
      { text: 'Molecular Psychiatry (Sept 12): common genetic variants tied to latent co-occurring neurodevelopmental/mental-health factors among autistic individuals.', url: 'https://www.nature.com/articles/s41380-026-03880-1' },
    ],
    mostImportant: 'The JAMA Pediatrics cohort finding — no autism "epidemic," rising rates reflect detection, directly undercutting the current HHS narrative.',
  },
]
