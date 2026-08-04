/**
 * Original, self-authored hero artwork: a stylised "stadium at golden dusk"
 * with a backlit lineup of sport-specific athlete silhouettes.
 * Pure SVG — no photography, no real likenesses, fully responsive.
 */
export function HeroArt({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101d47" />
          <stop offset="34%" stopColor="#2a45a6" />
          <stop offset="62%" stopColor="#5f74cf" />
          <stop offset="82%" stopColor="#e79f57" />
          <stop offset="100%" stopColor="#ffcf8a" />
        </linearGradient>
        <radialGradient id="sun" cx="72%" cy="30%" r="46%">
          <stop offset="0%" stopColor="#fff7e6" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#ffdb9c" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffdb9c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#122048" />
          <stop offset="100%" stopColor="#0a1128" />
        </linearGradient>
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff3d6" stopOpacity="0" />
        </linearGradient>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id="softer" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="30" />
        </filter>

        {/* ---- sport-specific athlete silhouettes ---- */}
        {/* Track — sprinter mid-stride */}
        <g id="athSprint">
          <circle cx="66" cy="42" r="16" />
          <path d="M50 66 C54 56 80 58 82 70 L70 166 C64 174 52 174 46 166 Z" />
          <rect x="30" y="80" width="12" height="58" rx="6" transform="rotate(-32 36 86)" />
          <rect x="78" y="74" width="12" height="52" rx="6" transform="rotate(28 84 82)" />
          <rect x="58" y="156" width="15" height="60" rx="7" transform="rotate(-42 62 162)" />
          <rect x="24" y="196" width="14" height="58" rx="7" transform="rotate(8 31 200)" />
          <rect x="52" y="156" width="15" height="96" rx="7" transform="rotate(30 58 162)" />
        </g>

        {/* Football — running back, ball tucked */}
        <g id="athFootball">
          <circle cx="64" cy="42" r="16" />
          <path d="M48 66 C52 56 78 58 82 70 L70 166 C64 174 52 174 46 166 Z" />
          <ellipse cx="38" cy="126" rx="16" ry="9" transform="rotate(-22 38 126)" />
          <rect x="46" y="92" width="12" height="44" rx="6" transform="rotate(22 52 98)" />
          <rect x="78" y="86" width="12" height="50" rx="6" transform="rotate(42 84 92)" />
          <rect x="58" y="156" width="15" height="62" rx="7" transform="rotate(-30 62 162)" />
          <rect x="30" y="192" width="14" height="56" rx="7" transform="rotate(6 37 196)" />
          <rect x="52" y="156" width="15" height="92" rx="7" transform="rotate(28 58 162)" />
        </g>

        {/* Basketball — jump shot, ball overhead */}
        <g id="athBasket">
          <circle cx="60" cy="44" r="16" />
          <path d="M44 68 C48 58 74 58 78 68 L70 166 C64 174 52 174 46 166 Z" />
          <rect x="66" y="12" width="12" height="66" rx="6" transform="rotate(14 72 74)" />
          <rect x="44" y="14" width="12" height="64" rx="6" transform="rotate(-12 50 74)" />
          <circle cx="61" cy="8" r="17" />
          <rect x="46" y="158" width="15" height="70" rx="7" transform="rotate(-14 53 164)" />
          <rect x="60" y="158" width="15" height="64" rx="7" transform="rotate(20 66 164)" />
        </g>

        {/* Soccer — striking the ball */}
        <g id="athSoccer">
          <circle cx="54" cy="42" r="16" />
          <path d="M38 66 C42 56 68 56 72 66 L64 162 C58 170 46 170 40 162 Z" />
          <rect x="18" y="80" width="12" height="52" rx="6" transform="rotate(-42 24 86)" />
          <rect x="70" y="82" width="12" height="52" rx="6" transform="rotate(28 76 88)" />
          <rect x="44" y="156" width="15" height="98" rx="7" transform="rotate(6 51 162)" />
          <rect x="54" y="156" width="15" height="58" rx="7" transform="rotate(-54 58 162)" />
          <rect x="80" y="150" width="14" height="54" rx="7" transform="rotate(-92 87 156)" />
          <circle cx="120" cy="196" r="14" />
        </g>

        {/* Baseball — batter, bat cocked */}
        <g id="athBaseball">
          <circle cx="58" cy="44" r="16" />
          <path d="M42 68 C46 58 72 58 76 68 L68 164 C62 172 50 172 44 164 Z" />
          <rect x="66" y="62" width="12" height="40" rx="6" transform="rotate(-30 72 80)" />
          <rect x="60" y="60" width="12" height="40" rx="6" transform="rotate(-48 66 78)" />
          <rect x="70" y="-8" width="12" height="88" rx="6" transform="rotate(40 76 74)" />
          <rect x="40" y="158" width="15" height="94" rx="7" transform="rotate(-16 47 164)" />
          <rect x="64" y="158" width="15" height="94" rx="7" transform="rotate(18 71 164)" />
        </g>
      </defs>

      {/* Sky + bloom */}
      <rect width="1600" height="900" fill="url(#sky)" />
      <rect width="1600" height="900" fill="url(#sun)" />

      {/* Bokeh */}
      <g filter="url(#soft)">
        {[
          [180, 150, 26, "#bcd0ff", 0.5],
          [420, 90, 16, "#ffe6b0", 0.55],
          [980, 120, 20, "#dbe6ff", 0.45],
          [1180, 210, 30, "#ffe6b0", 0.4],
          [1360, 90, 18, "#ffffff", 0.5],
          [640, 200, 14, "#cdd9ff", 0.4],
          [300, 300, 12, "#ffe6b0", 0.35],
          [1480, 320, 22, "#dbe6ff", 0.35],
        ].map(([cx, cy, r, fill, op], i) => (
          <circle
            key={i}
            cx={cx as number}
            cy={cy as number}
            r={r as number}
            fill={fill as string}
            opacity={op as number}
          />
        ))}
      </g>

      {/* Distant stadium rim */}
      <path
        d="M0 560 Q 800 430 1600 560 L1600 640 Q 800 520 0 640 Z"
        fill="#0e1a3d"
        opacity="0.9"
      />

      {/* Floodlight towers */}
      {[
        [250, 470],
        [560, 452],
        [1050, 452],
        [1360, 470],
      ].map(([x, top], i) => (
        <g key={i}>
          <polygon
            points={`${x},${top + 26} ${x - 140},900 ${x + 140},900`}
            fill="url(#cone)"
            opacity="0.7"
          />
          <rect x={(x as number) - 3} y={top as number} width="6" height="120" fill="#0b1430" />
          <rect x={(x as number) - 34} y={(top as number) - 16} width="68" height="26" rx="4" fill="#0b1430" />
          <ellipse cx={x as number} cy={(top as number) - 3} rx="40" ry="16" fill="#fff4d8" opacity="0.85" filter="url(#softer)" />
        </g>
      ))}

      {/* Ground */}
      <rect y="640" width="1600" height="260" fill="url(#ground)" />

      {/* Backlit sport lineup */}
      <g fill="#0a1326">
        {[
          { href: "#athSprint", x: 150, y: 452, s: 0.86, o: 0.55, flip: false },
          { href: "#athFootball", x: 430, y: 436, s: 0.95, o: 0.66, flip: false },
          { href: "#athBasket", x: 720, y: 404, s: 1.05, o: 0.8, flip: false },
          { href: "#athSoccer", x: 1010, y: 444, s: 0.92, o: 0.62, flip: true },
          { href: "#athBaseball", x: 1300, y: 446, s: 0.88, o: 0.55, flip: false },
        ].map((f, i) => (
          <use
            key={i}
            href={f.href}
            opacity={f.o}
            transform={`translate(${f.x} ${f.y}) scale(${f.flip ? -f.s : f.s} ${f.s})`}
          />
        ))}
      </g>

      {/* Perspective track lines */}
      <g stroke="#4a63c8" strokeOpacity="0.3" strokeWidth="2">
        <line x1="800" y1="648" x2="120" y2="900" />
        <line x1="800" y1="648" x2="520" y2="900" />
        <line x1="800" y1="648" x2="1080" y2="900" />
        <line x1="800" y1="648" x2="1480" y2="900" />
      </g>
      <g stroke="#4a63c8" strokeOpacity="0.16" strokeWidth="2" fill="none">
        <path d="M120 760 Q 800 700 1480 760" />
        <path d="M60 850 Q 800 770 1540 850" />
      </g>
    </svg>
  );
}
