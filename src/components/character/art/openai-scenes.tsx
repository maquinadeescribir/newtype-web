import type { ReactElement, SVGProps } from 'react'

export type BodyDoubleSceneKey = 'morning' | 'commuteTo' | 'work' | 'commuteFrom' | 'evening' | 'off'
export type BodyDoubleSceneComponent = (props: SVGProps<SVGSVGElement>) => ReactElement

const sceneKeys = ['morning', 'commuteTo', 'work', 'commuteFrom', 'evening', 'off'] as const
export const BODY_DOUBLE_SCENE_KEYS: readonly BodyDoubleSceneKey[] = sceneKeys

const skin = '#efc29f'
const blush = '#e99a92'
const hair = '#5a3a32'
const hairShade = '#3f2a35'
const shirt = '#747fa6'
const shirtDark = '#5e688e'
const pants = '#3d4778'
const shoe = '#2d2835'

type CompanionPose = 'mug' | 'rail' | 'desk' | 'sofa' | 'bench'
type CompanionMood = 'groggy' | 'open' | 'focused' | 'tired' | 'content' | 'bright'

type CompanionProps = {
  scene: BodyDoubleSceneKey
  x?: number
  y?: number
  scale?: number
  pose?: CompanionPose
  mood?: CompanionMood
  gazeX?: number
  tilt?: number
  light?: string
  lightSide?: -1 | 1
  skinTone?: string
  shirtWarm?: string
  shadow?: string
}

function Eyes({ scene, mood, gazeX, skinTone }: { scene: BodyDoubleSceneKey; mood: CompanionMood; gazeX: number; skinTone: string }) {
  if (mood === 'tired') {
    return (
      <g id={`bd-${scene}-eyes`} data-hook="bd-eyes">
        <ellipse cx={-23 + gazeX} cy="-98" rx="7" ry="8" fill="#2b2130" opacity="0.9" />
        <ellipse cx={23 + gazeX} cy="-98" rx="7" ry="8" fill="#2b2130" opacity="0.9" />
        <path d="M-35 -106q12-7 25 0v13q-12 4-25-1z" fill={skinTone} />
        <path d="M11 -106q12-7 25 0v13q-12 4-25-1z" fill={skinTone} />
        <path d="M-34 -82q12 5 26 0M12 -82q12 5 26 0" stroke="#c98f86" strokeWidth="4" strokeLinecap="round" opacity="0.25" fill="none" />
      </g>
    )
  }
  if (mood === 'content') {
    return (
      <g id={`bd-${scene}-eyes`} data-hook="bd-eyes">
        <path d="M-34 -98q11 5 23 0" stroke="#2b2130" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M12 -99q12 4 24-1" stroke="#2b2130" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>
    )
  }
  const ry = mood === 'bright' ? 9 : mood === 'groggy' || mood === 'focused' ? 6 : 8
  return (
    <g id={`bd-${scene}-eyes`} data-hook="bd-eyes">
      <ellipse cx={-23 + gazeX} cy="-98" rx="6" ry={ry} fill="#2b2130" />
      <ellipse cx={23 + gazeX} cy="-98" rx="6" ry={ry} fill="#2b2130" />
      {mood === 'groggy' ? <><path d="M-34 -107q11-7 23 0v8q-12 4-23 0z" fill={skinTone} opacity="0.58" /><path d="M12 -107q11-7 23 0v8q-12 4-23 0z" fill={skinTone} opacity="0.58" /></> : null}
      <circle cx={-25 + gazeX} cy="-101" r="2" fill="#fff7ee" opacity="0.75" />
      <circle cx={21 + gazeX} cy="-101" r="2" fill="#fff7ee" opacity="0.75" />
    </g>
  )
}

function Companion({ scene, x = 400, y = 300, scale = 0.9, pose = 'mug', mood = 'open', gazeX = 0, tilt = 0, light, lightSide = 1, skinTone = skin, shirtWarm, shadow = '#2b2330' }: CompanionProps) {
  const seated = pose !== 'rail'
  const smile = mood === 'bright' ? 'M-20 -75q20 22 40 0' : mood === 'content' ? 'M-17 -75q12 12 31 2' : mood === 'tired' ? 'M-14 -74q15 9 30 0' : mood === 'focused' ? 'M-13 -73q14 9 29 0' : 'M-16 -75q16 14 32 0'
  const brow = mood === 'focused' ? 'M-38-121q13 2 25 8M18-113q12-8 26-8' : mood === 'tired' ? 'M-38-115q12-10 25-6M18-121q13-4 26 6' : mood === 'bright' ? 'M-38-123q12-12 26-5M16-128q14-3 28 7' : 'M-36-118q11-8 24 0M18-118q12-8 25 0'
  const lightPath = lightSide === 1 ? 'M56-148q30 80 8 250q-23 48-84 53q22-84 4-300z' : 'M-56-148q-30 80-8 250q23 48 84 53q-22-84-4-300z'
  const rimPath = lightSide === 1 ? 'M62-132q16 88-2 239q-7 34-33 44' : 'M-62-132q-16 88 2 239q7 34 33 44'

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <defs>
        <radialGradient id={`bd-${scene}-blush`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor={blush} stopOpacity="0.5" /><stop offset="1" stopColor={blush} stopOpacity="0" /></radialGradient>
        <filter id={`bd-${scene}-rim-blur`} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>
      <ellipse cx={lightSide === 1 ? -18 : 18} cy={seated ? 156 : 222} rx={seated ? 92 : 104} ry={seated ? 22 : 24} fill={shadow} opacity="0.2" />
      <g id={`bd-${scene}-body`} data-hook="bd-body">
        <path d="M-54-34q54-28 108 0q18 64 4 148q-58 26-116 0q-14-84 4-148z" fill={shirt} />
        <path d="M-36-18q36 20 72 0v92q-36 18-72 0z" fill="#8f9ada" opacity="0.35" />
        {pose === 'rail' ? (
          <>
            <path d="M-56-10q-38 48-40 108q0 18 18 17q17-5 28-72" fill={shirtDark} />
            <circle cx="-82" cy="111" r="14" fill={skinTone} /><circle cx="-94" cy="105" r="5" fill={skinTone} /><path d="M-92 114q16 9 30-2" stroke="#c28a75" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.58" />
            <path d="M55-12q62-48 150-76" fill="none" stroke={shirtDark} strokeWidth="29" strokeLinecap="round" />
            <circle cx="204" cy="-89" r="14" fill={skinTone} /><circle cx="214" cy="-96" r="5" fill={skinTone} />
          </>
        ) : pose === 'desk' ? (
          <>
            <path d="M-54-8q-50 40-68 104" fill="none" stroke={shirtDark} strokeWidth="30" strokeLinecap="round" />
            <circle cx="-126" cy="100" r="14" fill={skinTone} /><circle cx="-136" cy="95" r="5" fill={skinTone} />
            <path d="M54-8q50 40 78 102" fill="none" stroke={shirtDark} strokeWidth="30" strokeLinecap="round" />
            <circle cx="136" cy="99" r="14" fill={skinTone} /><circle cx="146" cy="94" r="5" fill={skinTone} />
          </>
        ) : pose === 'bench' ? (
          <>
            <path d="M-52-4q-58 36-70 98" fill="none" stroke={shirtDark} strokeWidth="28" strokeLinecap="round" />
            <circle cx="-126" cy="101" r="14" fill={skinTone} />
            <path d="M52-4q42 38 42 96" fill="none" stroke={shirtDark} strokeWidth="28" strokeLinecap="round" />
            <circle cx="94" cy="101" r="14" fill={skinTone} />
          </>
        ) : (
          <>
            <path d="M-54-8q-38 42-40 102" fill="none" stroke={shirtDark} strokeWidth="30" strokeLinecap="round" />
            <circle cx="-96" cy="100" r="14" fill={skinTone} /><circle cx="-108" cy="96" r="5" fill={skinTone} />
            <path d="M54-8q38 42 40 102" fill="none" stroke={shirtDark} strokeWidth="30" strokeLinecap="round" />
            <circle cx="96" cy="100" r="14" fill={skinTone} /><circle cx="106" cy="96" r="5" fill={skinTone} />
          </>
        )}
        {seated ? (
          <>
            <path d="M-54 106q-42 28-64 72q44 18 102-28q14-16 28-36z" fill={pants} />
            <path d="M54 106q42 28 64 72q-44 18-102-28q-14-16-28-36z" fill={pants} />
            <path d="M-136 174q26 8 52-2q12 2 14 14l-68 6q-12-8 2-18z" fill={shoe} />
            <path d="M72 186q30 0 52-16q14-2 20 10l-62 30q-14-2-10-24z" fill={shoe} />
          </>
        ) : (
          <>
            <path d="M-44 110q-14 46-10 86h38q8-42 18-82z" fill={pants} />
            <path d="M44 110q14 46 10 86H16q-8-42-18-82z" fill={pants} />
            <path d="M-60 196h50q10 0 10 10v6h-68v-8q0-8 8-8z" fill={shoe} />
            <path d="M10 196h50q8 0 8 8v8H0v-6q0-10 10-10z" fill={shoe} />
          </>
        )}
        <rect x="-14" y="-58" width="28" height="44" rx="14" fill={skinTone} />
        {pose === 'mug' || pose === 'sofa' ? (
          <g>
            <rect x="-34" y="70" width="68" height="48" rx="11" fill="#fff0da" />
            <path d="M34 82h16a16 16 0 0 1 0 32H34" fill="none" stroke="#fff0da" strokeWidth="9" strokeLinecap="round" />
            <path d="M-28 82q-20 8-34 26M28 82q20 8 34 26" stroke={skinTone} strokeWidth="15" strokeLinecap="round" fill="none" />
            <path d="M-14 58q-10-18 0-36M10 58q-10-18 0-36M30 58q-8-15 2-30" stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.72" />
          </g>
        ) : null}
      </g>
      <g id={`bd-${scene}-head`} data-hook="bd-head" transform={`rotate(${tilt})`}>
        <circle cx="0" cy="-102" r="61" fill={skinTone} />
        <path d="M-59-111q4-51 60-58q54 8 60 58q-17-28-62-28q-44 0-58 28z" fill={hair} />
        <path d="M-60-112q-8 36 10 68q16-12 14-52q-11-2-24-16z" fill={hairShade} opacity="0.86" />
        <path d="M60-112q8 36-10 68q-16-12-14-52q11-2 24-16z" fill={hairShade} opacity="0.86" />
        <path d="M-38-144q21-28 56-26q-8 34-50 48z" fill={hair} />
        <path d="M-30-148q28-16 58-7q-10 18-48 26" stroke="#8a5f51" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.34" />
        <path d="M-48-122q-18 22-12 48M44-123q18 23 12 48M-16-157q-8 16-4 31" stroke={hairShade} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.72" />
        <path d={brow} stroke="#7d4b4d" strokeWidth="4" strokeLinecap="round" opacity="0.55" fill="none" />
        <ellipse cx="-40" cy="-84" rx="16" ry="11" fill={`url(#bd-${scene}-blush)`} />
        <ellipse cx="40" cy="-84" rx="16" ry="11" fill={`url(#bd-${scene}-blush)`} />
        <Eyes scene={scene} mood={mood} gazeX={gazeX} skinTone={skinTone} />
        <path d="M0-88q-4 8 3 11" stroke="#b97872" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.62" />
        <path d={smile} fill="none" stroke="#7d4b4d" strokeWidth="5" strokeLinecap="round" />
      </g>
      {shirtWarm ? <path d="M-50-30q50-22 100 0q14 62 0 140q-52 24-104 0q-10-78 4-140z" fill={shirtWarm} opacity="0.22" /> : null}
      {light ? <path d={lightPath} fill={light} opacity="0.24" /> : null}
      <path d={rimPath} stroke={light || '#fff4bb'} strokeWidth="15" strokeLinecap="round" opacity="0.22" filter={`url(#bd-${scene}-rim-blur)`} fill="none" />
    </g>
  )
}
export { Companion }

function SoftNoise({ opacity = 0.1, variant = 0, filterId }: { opacity?: number; variant?: number; filterId?: string }) {
  const motes = [[84 + variant * 11, 90, 2], [190, 70 + variant * 7, 1.6], [720 - variant * 18, 122, 2.2], [636, 72 + variant * 9, 1.5], [520 - variant * 21, 518, 1.7], [120 + variant * 13, 510, 1.9]]
  return (
    <g opacity={opacity} filter={filterId ? `url(#${filterId})` : undefined}>
      {motes.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#fff" />)}
    </g>
  )
}

function SvgShell({ scene, children, ...props }: SVGProps<SVGSVGElement> & { scene: BodyDoubleSceneKey; children: ReactElement | ReactElement[] }) {
  return (
    <svg className="char-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" data-scene={scene} aria-hidden="true" {...props}>
      <defs><filter id={`bd-${scene}-soft-particles`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.7" /></filter></defs>
      {children}
    </svg>
  )
}

export function MorningScene(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgShell scene="morning" {...props}>
      <defs>
        <linearGradient id="bd-morning-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f9d9a7" />
          <stop offset="0.52" stopColor="#f6e3c7" />
          <stop offset="1" stopColor="#d8b88e" />
        </linearGradient>
        <radialGradient id="bd-morning-sun" cx="70%" cy="22%" r="55%">
          <stop offset="0" stopColor="#fff4bb" stopOpacity="0.95" />
          <stop offset="0.42" stopColor="#ffd083" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd083" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bd-morning-floor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9e765b" />
          <stop offset="1" stopColor="#6f5146" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bd-morning-sky)" />
      <rect width="800" height="600" fill="url(#bd-morning-sun)" />
      <g id="bd-morning-ambient" data-hook="bd-ambient">
        <rect x="0" y="430" width="800" height="170" fill="url(#bd-morning-floor)" />
        <path d="M0 430q190-42 390-16t410-20v206H0z" fill="#8b6655" opacity="0.32" />
        <rect x="520" y="78" width="202" height="220" rx="18" fill="#ffe7b8" />
        <rect x="544" y="100" width="154" height="176" rx="10" fill="#ffd78f" opacity="0.76" />
        <circle cx="654" cy="178" r="48" fill="#ffbd63" opacity="0.78" />
        <path d="M544 190h154M621 100v176" stroke="#8d664f" strokeWidth="10" strokeLinecap="round" opacity="0.72" />
        <rect x="520" y="78" width="202" height="220" rx="18" fill="none" stroke="#7b5849" strokeWidth="12" opacity="0.72" />
        <path d="M70 432q56-74 146-46q48 14 94-8q52-26 110 6q70 40 146 10q104-42 188 34v172H70z" fill="#b98a69" opacity="0.22" />
        <rect x="72" y="350" width="312" height="88" rx="22" fill="#a87968" />
        <rect x="66" y="316" width="210" height="52" rx="26" fill="#fff1dd" />
        <rect x="86" y="396" width="334" height="34" rx="17" fill="#c79a83" />
        <path d="M88 439h330v35H88z" fill="#815d52" opacity="0.46" />
        <ellipse cx="344" cy="430" rx="128" ry="18" fill="#4b3340" opacity="0.16" />
        <SoftNoise opacity={0.16} variant={1} filterId="bd-morning-soft-particles" />
      </g>
      <Companion scene="morning" x={282} y={284} scale={0.84} pose="mug" mood="groggy" gazeX={-4} tilt={-4} light="#ffd083" lightSide={1} skinTone="#f2c49d" shirtWarm="#ffd083" shadow="#9a6348" />
      <path d="M-20 520q72-48 154-28q-28 28-154 70z" fill="#4d6c4f" opacity="0.22" filter="url(#bd-morning-soft-particles)" />
      <path d="M166 500q110-28 226-18t240-2" stroke="#f9d6a7" strokeWidth="18" strokeLinecap="round" opacity="0.18" fill="none" />
    </SvgShell>
  )
}

function TrainInterior({ dusk = false }: { dusk?: boolean }) {
  const sky = dusk ? 'bd-train-dusk-sky' : 'bd-train-day-sky'
  return (
    <>
      <defs>
        <linearGradient id="bd-train-day-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9e2f4" />
          <stop offset="1" stopColor="#ffe2b2" />
        </linearGradient>
        <linearGradient id="bd-train-dusk-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#353b77" />
          <stop offset="0.55" stopColor="#c56a72" />
          <stop offset="1" stopColor="#f6a65f" />
        </linearGradient>
        <linearGradient id={dusk ? 'bd-train-wall-dusk' : 'bd-train-wall-day'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={dusk ? '#343150' : '#d8d7c9'} />
          <stop offset="1" stopColor={dusk ? '#24223c' : '#b9b4a6'} />
        </linearGradient>
        <clipPath id={dusk ? 'bd-train-window-dusk' : 'bd-train-window-day'}>
          <rect x="82" y="72" width="636" height="256" rx="28" />
        </clipPath>
      </defs>
      <rect width="800" height="600" fill={dusk ? 'url(#bd-train-wall-dusk)' : 'url(#bd-train-wall-day)'} />
      <g id={dusk ? 'bd-commuteFrom-ambient' : 'bd-commuteTo-ambient'} data-hook="bd-ambient">
        <g clipPath={dusk ? 'url(#bd-train-window-dusk)' : 'url(#bd-train-window-day)'}>
          <rect x="82" y="72" width="636" height="256" fill={`url(#${sky})`} />
          <circle cx={dusk ? 604 : 598} cy={dusk ? 186 : 128} r={dusk ? 37 : 48} fill={dusk ? '#ffd17a' : '#fff1a7'} opacity="0.88" />
          {dusk && [118, 190, 304, 514, 678].map((x, i) => <circle key={x} cx={x} cy={92 + (i % 3) * 28} r="2.2" fill="#fff7df" opacity="0.82" />)}
          <path d="M52 276q108-56 210-10t196-6t300 0v90H52z" fill={dusk ? '#4a3b5e' : '#7396a8'} opacity="0.72" />
          <g opacity="0.68">
            {[0, 170, 340, 510].map((x) => (
              <g key={x} transform={`translate(${x} 0)`}>
                <rect x="78" y="210" width="58" height="118" fill={dusk ? '#3b3355' : '#7692a1'} />
                <rect x="154" y="174" width="44" height="154" fill={dusk ? '#42385d' : '#86a1ad'} />
                <rect x="224" y="232" width="84" height="96" fill={dusk ? '#38304f' : '#6f8b9b'} />
              </g>
            ))}
          </g>
        </g>
        <rect x="82" y="72" width="636" height="256" rx="28" fill="none" stroke={dusk ? '#2a2038' : '#776d65'} strokeWidth="18" />
        <path d="M470 72v256" stroke={dusk ? '#2a2038' : '#776d65'} strokeWidth="13" strokeLinecap="round" />
        <path d="M0 452h800v148H0z" fill={dusk ? '#51344a' : '#bf7660'} />
        <path d="M44 434h712q18 0 18 18v36H26v-36q0-18 18-18z" fill={dusk ? '#6a4253' : '#d4876b'} />
        <path d="M704 0v600" stroke={dusk ? '#c5b4be' : '#f1e8db'} strokeWidth="11" opacity="0.62" />
        <path d="M704 178q-26 34 0 66q26-32 0-66z" fill="none" stroke={dusk ? '#f2cfb7' : '#fff7ec'} strokeWidth="8" opacity="0.75" />
        <path d="M104 22v410M258 22v410M606 22v410" stroke={dusk ? '#f2cfb7' : '#fff7ec'} strokeWidth="5" opacity="0.16" />
        <SoftNoise opacity={dusk ? 0.13 : 0.1} variant={dusk ? 2 : 3} filterId={dusk ? "bd-commuteFrom-soft-particles" : "bd-commuteTo-soft-particles"} />
      </g>
    </>
  )
}

export function CommuteToScene(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgShell scene="commuteTo" {...props}>
      <TrainInterior />
      <Companion scene="commuteTo" x={560} y={318} scale={0.72} pose="rail" mood="open" gazeX={8} tilt={3} light="#fff1a7" lightSide={1} skinTone="#f0c5a4" shirtWarm="#fff1a7" shadow="#8a4a42" />
      <path d="M704 0v600" stroke="#fff7ec" strokeWidth="13" opacity="0.42" />
      <ellipse cx="500" cy="552" rx="160" ry="28" fill="#542d31" opacity="0.14" />
    </SvgShell>
  )
}

export function WorkScene(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgShell scene="work" {...props}>
      <defs>
        <linearGradient id="bd-work-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8e4cf" />
          <stop offset="1" stopColor="#a9c2a8" />
        </linearGradient>
        <radialGradient id="bd-work-light" cx="22%" cy="12%" r="72%">
          <stop offset="0" stopColor="#fff7d8" stopOpacity="0.72" />
          <stop offset="1" stopColor="#fff7d8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bd-work-desk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b98259" />
          <stop offset="1" stopColor="#745044" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bd-work-wall)" />
      <rect width="800" height="600" fill="url(#bd-work-light)" />
      <g id="bd-work-ambient" data-hook="bd-ambient">
        <rect x="66" y="70" width="238" height="174" rx="18" fill="#a8d7e1" />
        <path d="M78 222q58-62 128-32t104-28v82H78z" fill="#6f9f91" opacity="0.75" />
        <path d="M102 196h36v48h-36zM162 166h42v78h-42zM228 184h46v60h-46z" fill="#62788b" opacity="0.62" />
        <rect x="66" y="70" width="238" height="174" rx="18" fill="none" stroke="#5d695d" strokeWidth="10" opacity="0.72" />
        <rect x="0" y="380" width="800" height="50" fill="#d2a073" />
        <rect x="0" y="430" width="800" height="170" fill="url(#bd-work-desk)" />
        <path d="M0 382q170-24 338-10t462-18v76H0z" fill="#fff0bd" opacity="0.16" />
        <rect x="234" y="394" width="280" height="34" rx="10" fill="#3d4458" />
        <path d="M258 406h210" stroke="#9ba2b9" strokeWidth="8" strokeLinecap="round" opacity="0.45" />
        <rect x="338" y="116" width="42" height="42" rx="4" fill="#ffd083" opacity="0.82" />
        <path d="M350 138l8 8l16-20" stroke="#6f7b57" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="520" y="214" width="188" height="136" rx="16" fill="#273746" />
        <rect x="540" y="232" width="148" height="94" rx="8" fill="#f4c979" />
        <rect x="590" y="350" width="68" height="20" rx="6" fill="#273746" />
        <rect x="570" y="376" width="108" height="16" rx="8" fill="#273746" />
        <path d="M562 256h80M562 280h96M562 304h52" stroke="#815c49" strokeWidth="8" strokeLinecap="round" opacity="0.55" />
        <rect x="94" y="346" width="74" height="54" rx="12" fill="#fff1de" />
        <path d="M168 360h16a17 17 0 0 1 0 34h-16" fill="none" stroke="#fff1de" strokeWidth="9" />
        <path d="M118 328q-12-21 0-42M142 328q-12-21 0-42" stroke="#fff7ed" strokeWidth="6" strokeLinecap="round" opacity="0.66" fill="none" />
        <ellipse cx="385" cy="430" rx="142" ry="20" fill="#3a2728" opacity="0.18" />
        <SoftNoise opacity={0.12} variant={4} filterId="bd-work-soft-particles" />
      </g>
      <Companion scene="work" x={384} y={288} scale={0.84} pose="desk" mood="focused" gazeX={3} tilt={2} light="#f4c979" lightSide={-1} skinTone="#f0c7a8" shirtWarm="#ffe1a8" shadow="#5e4638" />
      <path d="M0 510h800v90H0z" fill="#5a3e37" opacity="0.2" />
    </SvgShell>
  )
}

export function CommuteFromScene(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgShell scene="commuteFrom" {...props}>
      <TrainInterior dusk />
      <Companion scene="commuteFrom" x={506} y={314} scale={0.86} pose="rail" mood="tired" gazeX={-6} tilt={-6} light="#ffc27a" lightSide={1} skinTone="#eab491" shirtWarm="#ffc27a" shadow="#39263b" />
      <path d="M704 0v600" stroke="#f2cfb7" strokeWidth="13" opacity="0.38" />
      <path d="M130 520q154-22 300-10t250-8" stroke="#ffc27a" strokeWidth="12" strokeLinecap="round" opacity="0.16" fill="none" />
    </SvgShell>
  )
}

export function EveningScene(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgShell scene="evening" {...props}>
      <defs>
        <linearGradient id="bd-evening-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#342845" />
          <stop offset="1" stopColor="#1f1b31" />
        </linearGradient>
        <radialGradient id="bd-evening-lamp" cx="78%" cy="31%" r="48%">
          <stop offset="0" stopColor="#ffd787" stopOpacity="0.82" />
          <stop offset="0.48" stopColor="#ff9d68" stopOpacity="0.32" />
          <stop offset="1" stopColor="#ff9d68" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bd-evening-sofa" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d56a55" />
          <stop offset="1" stopColor="#843e4e" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bd-evening-wall)" />
      <rect width="800" height="600" fill="url(#bd-evening-lamp)" />
      <rect width="800" height="600" fill="#8fa4e8" opacity="0.12" />
      <g id="bd-evening-ambient" data-hook="bd-ambient">
        <rect x="58" y="72" width="214" height="168" rx="18" fill="#17182b" />
        <circle cx="206" cy="124" r="28" fill="#fff1b6" />
        <circle cx="193" cy="115" r="27" fill="#17182b" />
        {[88, 128, 232, 246, 174].map((x, i) => <circle key={x} cx={x} cy={98 + i * 24} r="2.5" fill="#fff4cd" opacity="0.86" />)}
        <rect x="58" y="72" width="214" height="168" rx="18" fill="none" stroke="#6d547c" strokeWidth="10" />
        <rect x="0" y="414" width="800" height="186" fill="#2b2438" />
        <path d="M70 488q180-34 358-12t304-16v140H70z" fill="#1c1828" opacity="0.34" />
        <rect x="136" y="324" width="528" height="144" rx="46" fill="url(#bd-evening-sofa)" />
        <rect x="82" y="360" width="94" height="126" rx="28" fill="#a94f50" />
        <rect x="624" y="360" width="94" height="126" rx="28" fill="#77384d" />
        <rect x="604" y="166" width="12" height="250" rx="6" fill="#211b2d" />
        <path d="M560 172h100l-24-66h-52z" fill="#ff9b67" />
        <ellipse cx="610" cy="184" rx="92" ry="58" fill="#ff9b67" opacity="0.16" />
        <rect x="690" y="386" width="54" height="76" rx="10" fill="#7a5645" />
        <path d="M718 386q-45-50-22-108M718 386q38-56 24-116M718 386q-4-70 8-128" stroke="#5a9d6b" strokeWidth="12" strokeLinecap="round" fill="none" />
        <circle cx="696" cy="278" r="16" fill="#6aa873" />
        <circle cx="748" cy="268" r="17" fill="#5a9d6b" />
        <circle cx="730" cy="238" r="15" fill="#6aa873" />
        <SoftNoise opacity={0.16} variant={5} filterId="bd-evening-soft-particles" />
      </g>
      <Companion scene="evening" x={394} y={306} scale={0.92} pose="sofa" mood="content" gazeX={-1} tilt={-4} light="#ff9d68" lightSide={1} skinTone="#eab18f" shirtWarm="#ff9d68" shadow="#181329" />
      <path d="M232 424q130 30 320 2v132q-146 34-324-10z" fill="#d79b73" opacity="0.72" />
      <path d="M204 522q120 24 392 0" stroke="#ffb276" strokeWidth="18" strokeLinecap="round" opacity="0.12" fill="none" />
    </SvgShell>
  )
}

export function OffScene(props: SVGProps<SVGSVGElement>) {
  return (
    <SvgShell scene="off" {...props}>
      <defs>
        <linearGradient id="bd-off-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6aa3b8" />
          <stop offset="0.62" stopColor="#d9d8b0" />
          <stop offset="1" stopColor="#e7b47b" />
        </linearGradient>
        <radialGradient id="bd-off-sun" cx="78%" cy="38%" r="52%">
          <stop offset="0" stopColor="#fff0a8" stopOpacity="0.82" />
          <stop offset="1" stopColor="#fff0a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bd-off-leaves" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#78c77a" />
          <stop offset="1" stopColor="#3c8e60" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#bd-off-sky)" />
      <rect width="800" height="600" fill="url(#bd-off-sun)" />
      <g id="bd-off-ambient" data-hook="bd-ambient">
        <path d="M0 320q124-92 260-48t242-44q172-76 298 54v318H0z" fill="#86c987" />
        <path d="M0 406q150-62 318-24t482-16v234H0z" fill="#5dac72" />
        <path d="M0 498q180-36 334-10t466-30v142H0z" fill="#3f8d62" opacity="0.65" />
        <path d="M112 110q-12 164 12 312" stroke="#8a5d40" strokeWidth="28" strokeLinecap="round" />
        <path d="M120 188q64-74 142-92" stroke="#8a5d40" strokeWidth="18" strokeLinecap="round" />
        <path d="M120 238q-48-56-94-78" stroke="#8a5d40" strokeWidth="16" strokeLinecap="round" />
        <g fill="url(#bd-off-leaves)">
          <circle cx="112" cy="96" r="70" />
          <circle cx="178" cy="122" r="64" />
          <circle cx="52" cy="144" r="58" />
          <circle cx="204" cy="72" r="50" />
          <circle cx="64" cy="62" r="54" />
        </g>
        <g opacity="0.88" fill="#f6fff1">
          <ellipse cx="548" cy="96" rx="74" ry="22" />
          <ellipse cx="602" cy="78" rx="42" ry="22" />
          <ellipse cx="232" cy="172" rx="54" ry="16" />
          <ellipse cx="270" cy="160" rx="34" ry="16" />
        </g>
        <ellipse cx="408" cy="468" rx="242" ry="28" fill="#21482d" opacity="0.2" />
        <rect x="218" y="400" width="364" height="28" rx="14" fill="#9d6d4a" />
        <rect x="246" y="346" width="308" height="24" rx="12" fill="#ad7a50" />
        <rect x="258" y="428" width="20" height="82" rx="8" fill="#74513d" />
        <rect x="522" y="428" width="20" height="82" rx="8" fill="#74513d" />
        <rect x="200" y="374" width="400" height="22" rx="11" fill="#8d6044" />
        <ellipse cx="566" cy="410" rx="28" ry="8" fill="#6f4d38" opacity="0.35" />
        {[42, 694, 724, 646, 164].map((x, i) => <circle key={x} cx={x} cy={514 + (i % 2) * 24} r="8" fill={i % 2 ? '#ffd083' : '#f39aa5'} opacity="0.85" />)}
        <SoftNoise opacity={0.18} variant={6} filterId="bd-off-soft-particles" />
      </g>
      <Companion scene="off" x={430} y={264} scale={0.86} pose="bench" mood="bright" gazeX={3} tilt={7} light="#fff0a8" lightSide={1} skinTone="#efbd93" shirtWarm="#ffc27a" shadow="#2f5a3a" />
      <path d="M42 30q140 12 198 94q-108 28-238-26z" fill="#2f704a" opacity="0.2" filter="url(#bd-off-soft-particles)" />
      <path d="M154 552q230 30 492-6" stroke="#e7f0af" strokeWidth="16" strokeLinecap="round" opacity="0.16" fill="none" />
    </SvgShell>
  )
}

export const bodyDoubleScenes = {
  morning: MorningScene,
  commuteTo: CommuteToScene,
  work: WorkScene,
  commuteFrom: CommuteFromScene,
  evening: EveningScene,
  off: OffScene,
} satisfies Record<BodyDoubleSceneKey, BodyDoubleSceneComponent>

export default bodyDoubleScenes
