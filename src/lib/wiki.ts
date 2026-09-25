// Free, CORS-friendly Wikipedia endpoints — no key needed for the POC.

export interface WikiSummary {
  title: string
  extract: string
  thumbnail?: { source: string }
  description?: string
  content_urls?: { desktop?: { page?: string } }
}

export interface WikiRelatedItem {
  title: string
  url: string
  description: string
}

export async function fetchWikiSummary(topic: string): Promise<WikiSummary | null> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) return null
  const j = (await res.json()) as WikiSummary
  if (!j || !j.title) return null
  return j
}

// opensearch returns [query, [titles], [descriptions], [urls]]
export async function fetchWikiRelated(topic: string): Promise<WikiRelatedItem[]> {
  const url =
    'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&limit=8&search=' +
    encodeURIComponent(topic)
  const res = await fetch(url)
  if (!res.ok) return []
  const j = (await res.json()) as unknown[]
  if (!Array.isArray(j) || j.length < 4) return []
  const titles = j[1] as string[]
  const descs = j[2] as string[]
  const urls = j[3] as string[]
  return titles.map((t, i) => ({ title: t, description: descs[i] || '', url: urls[i] || '' }))
}
