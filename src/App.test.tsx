import { describe, it, expect, beforeEach } from 'vitest'
import { render } from '@testing-library/react'

describe('App', () => {
  beforeEach(() => {
    // Seed persisted state so the app skips onboarding (store key 'saw-state', version 9).
    localStorage.setItem('saw-state', JSON.stringify({ state: { onboardingComplete: true }, version: 9 }))
  })

  it('mounts without throwing and renders content', async () => {
    const { default: App } = await import('./App')
    const { container } = render(<App />)
    expect(container.innerHTML.length).toBeGreaterThan(0)
    expect(document.body.textContent?.length ?? 0).toBeGreaterThan(0)
  })
})
