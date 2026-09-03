import type { AhhArchetype } from '../../lib/ahh'

// Each scene is a flat dark stage with a "destroyer" element animated via CSS
// (.ahh-* keyframes in index.css). Opposition figures are simple silhouettes.
export default function DestructionScene({ id }: { id: string }) {
  switch (id) {
    case 'principal':
      return (
        <svg viewBox="0 0 400 240" className="ahh-scene">
          <rect width="400" height="240" fill="#161b22" />
          <rect y="196" width="400" height="44" fill="#10141f" />
          {/* podium */}
          <rect x="88" y="158" width="66" height="40" rx="3" fill="#2b2e38" />
          <rect x="82" y="153" width="78" height="7" rx="2" fill="#3a3e49" />
          {/* principal (bald, tie) */}
          <g className="ahh-principal">
            <circle cx="121" cy="126" r="15" fill="#e9c39f" />
            <path d="M106 124 a15 10 0 0 1 30 0 l0 -6 a15 15 0 0 0 -30 0 z" fill="#8a8f9a" />
            <rect x="110" y="140" width="22" height="22" rx="5" fill="#1b1e28" />
            <path d="M121 141 l-4 14 h8 z" fill="#ff006e" />
            <rect x="100" y="158" width="8" height="10" rx="2" fill="#1b1e28" />
          </g>
          {/* speech bubble */}
          <g className="ahh-bubble">
            <rect x="40" y="82" width="150" height="44" rx="10" fill="#eceff4" />
            <text x="52" y="101" fontFamily="sans-serif" fontSize="12" fill="#1b1e28">
              …just needs to
            </text>
            <text x="52" y="117" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#ff006e">
              appl— AHHHH!
            </text>
            <path d="M118 126 L124 142 L130 126 Z" fill="#eceff4" />
          </g>
          {/* kaiju stomping down */}
          <g className="ahh-kaiju">
            <rect x="110" y="10" width="88" height="34" rx="12" fill="#3f7a4a" />
            <rect x="120" y="34" width="66" height="40" rx="10" fill="#35703f" />
            <path d="M96 44 q-20 8 -12 22 l20 -8 z" fill="#2e6136" />
            <path d="M212 44 q20 8 12 22 l-20 -8 z" fill="#2e6136" />
          </g>
        </svg>
      )

    case 'rich80':
      return (
        <svg viewBox="0 0 400 240" className="ahh-scene">
          <rect width="400" height="240" fill="#161b22" />
          <rect y="196" width="400" height="44" fill="#10141f" />
          {/* rich guy */}
          <g className="ahh-rich80">
            <circle cx="120" cy="128" r="15" fill="#e9c39f" />
            <path d="M105 128 q0 -16 15 -16 q15 0 15 16 q-3 -8 -15 -8 q-12 0 -15 8 z" fill="#3a2a1a" />
            <rect x="109" y="142" width="22" height="26" rx="5" fill="#1b1e28" />
            <rect x="112" y="145" width="16" height="3" fill="#ffd24a" />
            <rect x="104" y="142" width="6" height="22" rx="3" fill="#2a2f3d" />
            <rect x="130" y="142" width="6" height="22" rx="3" fill="#2a2f3d" />
            <rect x="128" y="156" width="12" height="20" rx="2" fill="#3a3e49" />
          </g>
          {/* buffalo charging */}
          <g className="ahh-buffalo">
            <ellipse cx="300" cy="150" rx="52" ry="34" fill="#4a3624" />
            <rect x="240" y="120" width="52" height="34" rx="10" fill="#3a2a1a" />
            <path d="M240 124 q-26 4 -30 26 q22 -2 30 6 z" fill="#3a2a1a" />
            <path d="M236 126 q-20 -10 -28 2 q16 10 26 2 z" fill="#e9d9c0" />
            <path d="M244 118 q-8 -14 -20 -8 q8 12 18 8 z" fill="#e9d9c0" />
            <circle cx="268" cy="140" r="3" fill="#10141f" />
            <rect x="286" y="178" width="10" height="22" fill="#2a1f12" />
            <rect x="312" y="178" width="10" height="22" fill="#2a1f12" />
          </g>
        </svg>
      )

    case 'kid':
      return (
        <svg viewBox="0 0 400 240" className="ahh-scene">
          <rect width="400" height="240" fill="#161b22" />
          <rect y="196" width="400" height="44" fill="#10141f" />
          {/* obnoxious kid — big head, small body (child proportions) */}
          <g className="ahh-kid">
            <circle cx="150" cy="142" r="17" fill="#e9c39f" />
            <path d="M133 134 a17 15 0 0 1 34 0 z" fill="#c98a4a" />
            <path d="M143 120 q-14 -4 -20 -14 l6 -4 q6 10 18 12 z" fill="#2b6cb0" />
            <path d="M143 122 q-14 0 -18 8 l-6 -2 q6 -12 24 -10 z" fill="#2b6cb0" />
            <circle cx="144" cy="140" r="1.8" fill="#10141f" />
            <circle cx="156" cy="140" r="1.8" fill="#10141f" />
            <path d="M144 148 q6 -6 12 0" stroke="#a06a3a" strokeWidth="1.8" fill="none" />
            <rect x="140" y="156" width="20" height="20" rx="5" fill="#e8491d" />
            <rect x="134" y="158" width="6" height="16" rx="3" fill="#e9c39f" />
            <rect x="160" y="158" width="6" height="16" rx="3" fill="#e9c39f" />
          </g>
          {/* burlap sack (drops over the kid) */}
          <g className="ahh-sack">
            <rect x="136" y="112" width="58" height="64" rx="9" fill="#c9a15a" />
            <path d="M136 124 q29 -16 58 0 l-5 8 q-24 -9 -48 0 z" fill="#a8833f" />
            <path d="M160 106 q4 8 10 12 q-10 -2 -10 -8 z" fill="#8a6a3a" />
            <path d="M140 132 l56 -2 M141 148 l54 -2" stroke="#a8833f" strokeWidth="1.5" fill="none" />
          </g>
          {/* krampus (horned demon) beating the sack */}
          <g className="ahh-krampus">
            <circle cx="58" cy="150" r="14" fill="#7a2430" />
            <path d="M48 146 l-7 -15 l7 2 z" fill="#5e1c26" />
            <path d="M68 146 l7 -15 l-7 2 z" fill="#5e1c26" />
            <circle cx="53" cy="149" r="2" fill="#ffd24a" />
            <circle cx="63" cy="149" r="2" fill="#ffd24a" />
            <path d="M53 156 q6 5 12 0" stroke="#5e1c26" strokeWidth="1.5" fill="none" />
            <rect x="49" y="162" width="18" height="28" rx="7" fill="#7a2430" />
            <rect x="34" y="150" width="26" height="9" rx="4" fill="#5e1c26" transform="rotate(28 34 150)" />
            <rect x="18" y="138" width="11" height="24" rx="5" fill="#4a1a20" transform="rotate(-16 18 138)" />
          </g>
        </svg>
      )

    case 'crowd':
      return (
        <svg viewBox="0 0 400 240" className="ahh-scene">
          <rect width="400" height="240" fill="#161b22" />
          <rect y="196" width="400" height="44" fill="#10141f" />
          {/* crowd of mean people */}
          <g className="ahh-crowd">
            {[70, 105, 140].map((x, i) => (
              <g key={i} className={`ahh-fig ahh-fig-${i}`}>
                <circle cx={x} cy={150} r="13" fill="#d8ac85" />
                <path d={`M${x - 9} 150 q4 4 8 4`} stroke="#10141f" strokeWidth="2" fill="none" />
                <path d={`M${x + 1} 150 q4 4 8 4`} stroke="#10141f" strokeWidth="2" fill="none" />
                <rect x={x - 10} y="162" width="20" height="24" rx="5" fill="#2a2f3d" />
              </g>
            ))}
          </g>
          {/* bison plowing through */}
          <g className="ahh-bison">
            <ellipse cx="330" cy="150" rx="60" ry="38" fill="#4a3624" />
            <rect x="262" y="118" width="56" height="36" rx="12" fill="#3a2a1a" />
            <path d="M262 122 q-30 4 -32 30 q24 -2 32 8 z" fill="#3a2a1a" />
            <path d="M258 124 q-24 -12 -32 0 q18 12 30 2 z" fill="#e9d9c0" />
            <path d="M266 116 q-10 -16 -24 -10 q10 14 22 10 z" fill="#e9d9c0" />
            <circle cx="292" cy="140" r="3" fill="#10141f" />
            <rect x="308" y="180" width="11" height="24" fill="#2a1f12" />
            <rect x="338" y="180" width="11" height="24" fill="#2a1f12" />
          </g>
        </svg>
      )

    case 'posh':
      return (
        <svg viewBox="0 0 400 240" className="ahh-scene">
          <rect width="400" height="240" fill="#161b22" />
          <rect y="196" width="400" height="44" fill="#10141f" />
          {/* posh rich guy (top hat, monocle, cravat) */}
          <g className="ahh-posh">
            <rect x="104" y="82" width="34" height="30" rx="3" fill="#10141f" />
            <rect x="100" y="108" width="42" height="5" rx="2" fill="#10141f" />
            <circle cx="121" cy="128" r="15" fill="#e9c39f" />
            <circle cx="113" cy="128" r="5" fill="none" stroke="#ffd24a" strokeWidth="1.6" />
            <path d="M113 126 l8 4" stroke="#ffd24a" strokeWidth="1.2" />
            <path d="M108 122 a15 10 0 0 1 26 0 q-2 -8 -13 -8 q-11 0 -13 8 z" fill="#6a6f7a" />
            <path d="M112 134 q4 -4 8 0" stroke="#a06a3a" strokeWidth="1.6" fill="none" />
            <rect x="110" y="142" width="22" height="26" rx="5" fill="#1b1e28" />
            <path d="M114 142 l7 -8 l7 8 z" fill="#eceff4" />
          </g>
          {/* maid (dark dress + white apron + cap) */}
          <g className="ahh-maid">
            <circle cx="292" cy="140" r="13" fill="#e9c39f" />
            <path d="M279 134 q13 -13 26 0 q-2 -11 -13 -11 q-11 0 -13 11 z" fill="#5a4a3a" />
            <rect x="279" y="130" width="26" height="8" rx="4" fill="#eceff4" />
            <rect x="281" y="152" width="22" height="30" rx="6" fill="#1b1e28" />
            <rect x="284" y="156" width="16" height="24" rx="4" fill="#eceff4" />
            <rect x="290" y="156" width="26" height="7" rx="3" fill="#e9c39f" transform="rotate(-22 290 156)" />
          </g>
          {/* feather duster on a stick, swung toward posh guy */}
          <g className="ahh-duster">
            <rect x="252" y="120" width="46" height="5" rx="2" fill="#8a6a3a" transform="rotate(22 252 120)" />
            <circle cx="256" cy="103" r="13" fill="#e85a8a" />
            <circle cx="243" cy="108" r="8" fill="#ff8ab0" />
            <circle cx="267" cy="110" r="8" fill="#ff8ab0" />
          </g>
        </svg>
      )

    case 'karen':
      return (
        <svg viewBox="0 0 400 240" className="ahh-scene">
          <rect width="400" height="240" fill="#161b22" />
          <rect y="196" width="400" height="44" fill="#10141f" />
          {/* karen (angular hair, pointing) */}
          <g className="ahh-karen">
            <circle cx="150" cy="128" r="15" fill="#e9c39f" />
            <path d="M134 120 l-10 -22 l12 6 l2 -12 l8 12 l12 -6 l-4 20 l-10 6 z" fill="#e8c33a" />
            <path d="M140 132 q4 4 8 4 M158 132 q4 4 8 4" stroke="#10141f" strokeWidth="2" fill="none" />
            <path d="M144 140 q4 -5 8 0" stroke="#a06a3a" strokeWidth="1.6" fill="none" />
            <rect x="139" y="142" width="22" height="28" rx="6" fill="#7a2a5a" />
            <rect x="132" y="146" width="20" height="5" rx="2" fill="#e9c39f" transform="rotate(-14 132 146)" />
          </g>
          {/* speech bubble */}
          <g className="ahh-bubble">
            <rect x="160" y="84" width="150" height="34" rx="9" fill="#eceff4" />
            <text x="170" y="106" fontFamily="sans-serif" fontSize="12" fill="#1b1e28">
              I want to speak to the—
            </text>
            <path d="M164 118 L158 132 L170 118 Z" fill="#eceff4" />
          </g>
          {/* fist punching in (forearm + knuckles) */}
          <g className="ahh-fist">
            <rect x="126" y="80" width="18" height="42" rx="7" fill="#e9c39f" stroke="#b9834f" strokeWidth="1.2" transform="rotate(38 135 101)" />
            <ellipse cx="150" cy="126" rx="19" ry="21" fill="#e9c39f" stroke="#b9834f" strokeWidth="1.6" />
            <path d="M139 115 q7 -7 14 0 M138 121 q7 -7 14 0" stroke="#c99a72" strokeWidth="1.6" fill="none" />
            <path d="M133 121 q-8 1 -5 9 q5 5 10 1" fill="#e9c39f" stroke="#b9834f" strokeWidth="1.2" />
          </g>
          {/* impact starburst */}
          <g className="ahh-starburst">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <rect
                key={a}
                x="148"
                y="64"
                width="6"
                height="26"
                rx="3"
                fill="#ff8ab0"
                transform={`rotate(${a} 151 126)`}
              />
            ))}
            <circle cx="151" cy="126" r="16" fill="#ff3b8b" />
            <circle cx="151" cy="126" r="9" fill="#ffffff" />
          </g>
        </svg>
      )

    default:
      return null
  }
}
