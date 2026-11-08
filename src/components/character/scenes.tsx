import type { CSSProperties } from 'react'
import type { DayPart } from '../../types'

// Lofi flat SVG scenes (viewBox 400x300). One shared companion figure; backdrop + foreground differ per day part.
const SKIN = '#f2c9a5'
const HAIR = '#3b2a3f'
const SHIRT = '#7e8bd6'

function Train({ sky, glow, stars }: { sky: [string, string]; glow: string; stars?: boolean }) {
  const id = stars ? 'h' : 't'
  return (
    <g>
      <rect width="400" height="300" fill="#2b3350" />
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
        <clipPath id={`win-${id}`}>
          <rect x="40" y="36" width="320" height="140" rx="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#win-${id})`}>
        <rect x="40" y="36" width="320" height="140" fill={`url(#sky-${id})`} />
        {stars &&
          [
            [70, 60],
            [130, 48],
            [250, 66],
            [320, 52],
            [190, 82],
          ].map(([x, y]) => <circle key={x} cx={x} cy={y} r="1.6" fill="#fff" opacity=".8" />)}
        <circle cx="300" cy="84" r="20" fill={glow} opacity=".9" />
        <g className="sc-scroll">
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${k * 320} 0)`}>
              <rect x="0" y="120" width="40" height="60" fill="#3d4670" />
              <rect x="50" y="98" width="34" height="80" fill="#46507d" />
              <rect x="96" y="130" width="50" height="50" fill="#3d4670" />
              <rect x="160" y="88" width="30" height="90" fill="#4a557f" />
              <rect x="204" y="116" width="46" height="64" fill="#3d4670" />
              <rect x="266" y="104" width="38" height="76" fill="#46507d" />
            </g>
          ))}
        </g>
      </g>
      <rect x="40" y="36" width="320" height="140" rx="10" fill="none" stroke="#1d2238" strokeWidth="6" />
      <line x1="200" y1="36" x2="200" y2="176" stroke="#1d2238" strokeWidth="5" />
      <rect x="0" y="236" width="400" height="64" fill="#c46a5a" />
      <rect x="0" y="228" width="400" height="12" rx="6" fill="#a95446" />
      <line x1="330" y1="0" x2="330" y2="236" stroke="#d6dae8" strokeWidth="5" opacity=".75" />
    </g>
  )
}

function Backdrop({ dayPart }: { dayPart: DayPart }) {
  switch (dayPart) {
    case 'morning':
      return (
        <g>
          <rect width="400" height="300" fill="#f3d9b8" />
          <rect y="236" width="400" height="64" fill="#b98a68" />
          <rect x="262" y="40" width="100" height="90" rx="6" fill="#ffd89a" />
          <circle cx="330" cy="104" r="22" fill="#ffb347" />
          <rect x="262" y="40" width="100" height="90" rx="6" fill="none" stroke="#8a5a3c" strokeWidth="5" />
          <line x1="312" y1="40" x2="312" y2="130" stroke="#8a5a3c" strokeWidth="4" />
          <rect x="0" y="150" width="130" height="100" rx="8" fill="#8e7cc3" />
          <rect x="0" y="136" width="64" height="30" rx="14" fill="#fff4e6" />
          <rect x="0" y="176" width="130" height="14" fill="#a89bd9" />
          <rect x="290" y="196" width="80" height="54" rx="4" fill="#8a5a3c" />
          <rect x="316" y="176" width="28" height="22" rx="4" fill="#fff" />
          <path d="M344 182h8a6 6 0 010 12h-8" fill="none" stroke="#fff" strokeWidth="3" />
          <path className="sc-steam" d="M325 170q-4-8 0-14M335 170q-4-8 0-14" stroke="#fff" strokeWidth="2" fill="none" opacity=".7" />
        </g>
      )
    case 'commuteTo':
      return <Train sky={['#8fd3f4', '#d7f0fb']} glow="#fff3b0" />
    case 'commuteFrom':
      return <Train sky={['#6a3f8f', '#ff9a6b']} glow="#ffd27f" stars />
    case 'work':
      return (
        <g>
          <rect width="400" height="300" fill="#dfe9e0" />
          <rect x="30" y="34" width="150" height="96" rx="6" fill="#a8d8ea" stroke="#5c6f64" strokeWidth="5" />
          <rect x="44" y="76" width="18" height="54" fill="#6f8aa0" />
          <rect x="70" y="58" width="22" height="72" fill="#7d96ab" />
          <rect x="100" y="86" width="28" height="44" fill="#6f8aa0" />
          <rect x="136" y="64" width="20" height="66" fill="#7d96ab" />
          <rect x="250" y="40" width="110" height="70" rx="4" fill="#f7f4ea" stroke="#5c6f64" strokeWidth="4" />
          <rect x="262" y="54" width="40" height="6" fill="#81c784" />
          <rect x="262" y="68" width="70" height="6" fill="#bbb" />
          <rect x="262" y="82" width="56" height="6" fill="#bbb" />
          <rect y="262" width="400" height="38" fill="#9db3a0" />
        </g>
      )
    case 'evening':
      return (
        <g>
          <rect width="400" height="300" fill="#3a2c4a" />
          <rect x="30" y="40" width="110" height="90" rx="6" fill="#1e1a33" stroke="#6b5580" strokeWidth="5" />
          <circle cx="104" cy="70" r="14" fill="#fff0c4" />
          <circle cx="97" cy="66" r="12" fill="#1e1a33" />
          <circle cx="60" cy="62" r="1.6" fill="#fff" />
          <circle cx="80" cy="100" r="1.6" fill="#fff" />
          <rect y="250" width="400" height="50" fill="#4b3a5c" />
          <rect x="316" y="90" width="6" height="140" fill="#2c2238" />
          <path d="M296 96h42l-10-30h-22z" fill="#ff8a65" />
          <ellipse cx="317" cy="100" rx="60" ry="46" fill="#ff8a65" opacity=".13" />
          <rect x="70" y="150" width="260" height="110" rx="26" fill="#c75b45" />
          <rect x="30" y="170" width="44" height="90" rx="16" fill="#b04c38" />
          <rect x="326" y="170" width="44" height="90" rx="16" fill="#b04c38" />
          <rect x="360" y="210" width="26" height="30" rx="4" fill="#a1664a" />
          <path d="M372 210q-18-30-8-48M372 210q16-26 10-44M372 210q-2-34 0-52" stroke="#6fbf73" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      )
    default:
      return (
        <g>
          <rect width="400" height="300" fill="#bfe6f5" />
          <circle cx="320" cy="64" r="26" fill="#ffe08a" />
          <g className="sc-cloud">
            <ellipse cx="90" cy="64" rx="38" ry="12" fill="#fff" />
            <ellipse cx="116" cy="56" rx="24" ry="12" fill="#fff" />
          </g>
          <path d="M0 190q70-70 150-20t140-30q60-30 110 20v140H0z" fill="#8fcf9c" />
          <path d="M0 230q100-40 200-10t200-10v90H0z" fill="#6fb77f" />
          <rect x="48" y="120" width="12" height="80" fill="#8a5a3c" />
          <circle cx="54" cy="108" r="36" fill="#4f9d62" />
          <circle cx="76" cy="124" r="22" fill="#5fb072" />
          <rect x="110" y="214" width="180" height="12" rx="4" fill="#a8764f" />
          <rect x="116" y="170" width="168" height="10" rx="4" fill="#a8764f" />
          <rect x="124" y="226" width="8" height="32" fill="#7d5538" />
          <rect x="268" y="226" width="8" height="32" fill="#7d5538" />
          {[
            [330, 262],
            [352, 272],
            [30, 268],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="4" fill="#ff8fab" />
          ))}
        </g>
      )
  }
}

function Foreground({ dayPart }: { dayPart: DayPart }) {
  if (dayPart === 'work') {
    return (
      <g>
        <rect x="0" y="232" width="400" height="14" rx="3" fill="#a77b55" />
        <rect x="0" y="244" width="400" height="56" fill="#8c6644" />
        <rect x="262" y="164" width="92" height="64" rx="5" fill="#2f3a4a" />
        <rect x="268" y="170" width="80" height="50" rx="2" fill="#9be7b2" />
        <rect x="274" y="178" width="46" height="4" fill="#2f3a4a" />
        <rect x="274" y="188" width="62" height="4" fill="#2f3a4a" />
        <rect x="274" y="198" width="34" height="4" fill="#2f3a4a" />
        <rect x="302" y="226" width="14" height="8" fill="#2f3a4a" />
        <rect x="40" y="214" width="26" height="20" rx="4" fill="#fff" />
        <path className="sc-steam" d="M48 208q-4-8 0-14M58 208q-4-8 0-14" stroke="#fff" strokeWidth="2" fill="none" opacity=".7" />
      </g>
    )
  }
  if (dayPart === 'commuteTo' || dayPart === 'commuteFrom') {
    return <rect x="120" y="252" width="160" height="48" rx="12" fill="#8a3f33" />
  }
  if (dayPart === 'evening') {
    return (
      <g>
        <rect x="90" y="226" width="220" height="50" rx="20" fill="#d96a52" />
        <rect x="236" y="196" width="60" height="44" rx="12" fill="#ffd36e" transform="rotate(-8 266 218)" />
      </g>
    )
  }
  if (dayPart === 'morning') {
    return <rect x="150" y="248" width="100" height="10" rx="5" fill="#a07a58" opacity=".5" />
  }
  return null
}

const FIGURE_STYLE = { transformOrigin: '200px 250px' } as CSSProperties
const ARM_STYLE = { transformOrigin: '224px 192px' } as CSSProperties
const HEAD_STYLE = { transformOrigin: '200px 178px' } as CSSProperties

export function Companion() {
  return (
    <g className="cf" style={FIGURE_STYLE}>
      <rect x="168" y="176" width="64" height="86" rx="26" fill={SHIRT} />
      <g className="cf-arm" style={ARM_STYLE}>
        <rect x="218" y="186" width="16" height="52" rx="8" fill={SHIRT} />
        <circle cx="228" cy="240" r="8" fill={SKIN} />
      </g>
      <g className="cf-head" style={HEAD_STYLE}>
        <rect x="192" y="166" width="16" height="14" fill={SKIN} />
        <circle cx="200" cy="148" r="27" fill={SKIN} />
        <path d="M172 148a28 28 0 0156 0q-8-14-28-14t-28 14z" fill={HAIR} />
        <rect x="172" y="144" width="9" height="30" rx="4" fill={HAIR} />
        <g className="cf-eyes">
          <ellipse cx="190" cy="152" rx="3" ry="4" fill="#2a2030" />
          <ellipse cx="210" cy="152" rx="3" ry="4" fill="#2a2030" />
        </g>
        <circle cx="184" cy="162" r="4" fill="#f09a9a" opacity=".5" />
        <circle cx="216" cy="162" r="4" fill="#f09a9a" opacity=".5" />
        <g className="cf-mouth">
          <path d="M193 164q7 6 14 0" stroke="#8a4a4a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      </g>
    </g>
  )
}

export default function Scene({ dayPart }: { dayPart: DayPart }) {
  return (
    <svg className="char-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Companion scene: ${dayPart}`}>
      <g key={dayPart} className="char-backdrop">
        <Backdrop dayPart={dayPart} />
      </g>
      <Companion />
      <g key={`fg-${dayPart}`} className="char-backdrop">
        <Foreground dayPart={dayPart} />
      </g>
    </svg>
  )
}
