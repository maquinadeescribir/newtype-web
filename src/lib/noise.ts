export type NoiseKind = 'white' | 'pink' | 'brown' | 'rain'

// Generates looping noise buffers locally via Web Audio — no assets, works offline (FR-ST-07).
export function makeNoiseBuffer(ctx: AudioContext, kind: NoiseKind, seconds = 4): AudioBuffer {
  const sr = ctx.sampleRate
  const len = Math.floor(sr * seconds)
  const buffer = ctx.createBuffer(1, len, sr)
  const data = buffer.getChannelData(0)

  if (kind === 'white') {
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  } else if (kind === 'pink') {
    // Paul Kellet's refined pink-noise filter
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179
      b1 = 0.99332 * b1 + w * 0.0750759
      b2 = 0.969 * b2 + w * 0.153852
      b3 = 0.8665 * b3 + w * 0.3104856
      b4 = 0.55 * b4 + w * 0.5329522
      b5 = -0.7616 * b5 - w * 0.016898
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
      b6 = w * 0.115926
    }
  } else if (kind === 'brown') {
    let last = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      last = (last + 0.02 * w) / 1.02
      data[i] = last * 3.5
    }
  } else {
    // rain: soft noise bed + droplet transients
    for (let i = 0; i < len; i++) {
      const drop = Math.random() < 0.03 ? (Math.random() * 2 - 1) * 0.7 : 0
      data[i] = (Math.random() * 2 - 1) * 0.16 + drop
    }
  }
  return buffer
}
