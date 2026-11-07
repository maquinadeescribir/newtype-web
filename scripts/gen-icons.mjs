// One-off: node scripts/gen-icons.mjs  -> public/icons/icon-{192,512}.png
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<rect width="512" height="512" fill="#111827"/>
<path d="M96 384 L216 176 L272 264 L320 200 L416 384 Z" fill="#E5E7EB"/>
</svg>`

mkdirSync('public/icons', { recursive: true })
for (const s of [192, 512]) {
  await sharp(Buffer.from(svg)).resize(s, s).png().toFile(`public/icons/icon-${s}.png`)
}
