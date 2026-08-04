/**
 * Original, self-authored sport illustrations — a mini "stadium dusk" scene
 * per sport with a backlit action silhouette. Pure SVG, brand-tuned, reusable
 * at any size. No photography or real likenesses.
 */

const FIGURES: Record<string, React.ReactNode> = {
  soccer: (
    <>
      <circle cx="54" cy="42" r="16" />
      <path d="M38 66 C42 56 68 56 72 66 L64 162 C58 170 46 170 40 162 Z" />
      <rect x="18" y="80" width="12" height="52" rx="6" transform="rotate(-42 24 86)" />
      <rect x="70" y="82" width="12" height="52" rx="6" transform="rotate(28 76 88)" />
      <rect x="44" y="156" width="15" height="98" rx="7" transform="rotate(6 51 162)" />
      <rect x="54" y="156" width="15" height="58" rx="7" transform="rotate(-54 58 162)" />
      <rect x="80" y="150" width="14" height="54" rx="7" transform="rotate(-92 87 156)" />
      <circle cx="120" cy="196" r="14" />
    </>
  ),
  football: (
    <>
      <circle cx="64" cy="42" r="16" />
      <path d="M48 66 C52 56 78 58 82 70 L70 166 C64 174 52 174 46 166 Z" />
      <ellipse cx="38" cy="126" rx="16" ry="9" transform="rotate(-22 38 126)" />
      <rect x="46" y="92" width="12" height="44" rx="6" transform="rotate(22 52 98)" />
      <rect x="78" y="86" width="12" height="50" rx="6" transform="rotate(42 84 92)" />
      <rect x="58" y="156" width="15" height="62" rx="7" transform="rotate(-30 62 162)" />
      <rect x="30" y="192" width="14" height="56" rx="7" transform="rotate(6 37 196)" />
      <rect x="52" y="156" width="15" height="92" rx="7" transform="rotate(28 58 162)" />
    </>
  ),
  basketball: (
    <>
      <circle cx="60" cy="44" r="16" />
      <path d="M44 68 C48 58 74 58 78 68 L70 166 C64 174 52 174 46 166 Z" />
      <rect x="66" y="12" width="12" height="66" rx="6" transform="rotate(14 72 74)" />
      <rect x="44" y="14" width="12" height="64" rx="6" transform="rotate(-12 50 74)" />
      <circle cx="61" cy="8" r="17" />
      <rect x="46" y="158" width="15" height="70" rx="7" transform="rotate(-14 53 164)" />
      <rect x="60" y="158" width="15" height="64" rx="7" transform="rotate(20 66 164)" />
    </>
  ),
  hockey: (
    <>
      <circle cx="66" cy="46" r="16" />
      <path d="M50 70 C54 60 80 62 82 74 L70 168 C64 176 52 176 46 168 Z" />
      <rect x="50" y="158" width="15" height="82" rx="7" transform="rotate(34 56 164)" />
      <rect x="60" y="158" width="15" height="72" rx="7" transform="rotate(-14 66 164)" />
      <rect x="74" y="96" width="12" height="46" rx="6" transform="rotate(46 80 102)" />
      <rect x="60" y="100" width="12" height="52" rx="6" transform="rotate(62 66 106)" />
      {/* stick */}
      <rect x="104" y="138" width="9" height="128" rx="4" transform="rotate(-56 108 150)" />
      {/* puck */}
      <ellipse cx="182" cy="250" rx="11" ry="4" />
    </>
  ),
  generic: (
    <>
      <circle cx="60" cy="36" r="17" />
      <path d="M36 72 C40 60 80 60 84 72 L75 172 C69 180 51 180 45 172 Z" />
      <rect x="44" y="164" width="15" height="156" rx="7" />
      <rect x="61" y="164" width="15" height="156" rx="7" />
      <rect x="28" y="76" width="13" height="112" rx="6" transform="rotate(-6 34 82)" />
      <g transform="rotate(-24 86 84)">
        <rect x="80" y="-12" width="13" height="102" rx="6" />
        <circle cx="86" cy="-20" r="15" />
      </g>
    </>
  ),
};

function figureKey(sport: string): string {
  const s = sport.toLowerCase();
  if (s.includes("soccer")) return "soccer";
  if (s.includes("football")) return "football";
  if (s.includes("basketball")) return "basketball";
  if (s.includes("hockey")) return "hockey";
  return "generic";
}

/** A soft-gray montage of sport silhouettes — light-theme hero placeholder
 *  that sits where a real athlete photo (public/hero-athletes.png) would go. */
export function HeroFigures({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 760 600"
      preserveAspectRatio="xMidYMax meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Brand duotone so the figures read as a deliberate graphic */}
        <linearGradient id="figduo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#28407a" />
          <stop offset="100%" stopColor="#4f7cff" />
        </linearGradient>
        <radialGradient id="stage" cx="50%" cy="42%" r="52%">
          <stop offset="0%" stopColor="#dbe6ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#dbe6ff" stopOpacity="0" />
        </radialGradient>
        <filter id="figshadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="16" floodColor="#1b2c57" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* staged backdrop + ground shadow */}
      <ellipse cx="390" cy="230" rx="330" ry="230" fill="url(#stage)" />
      <ellipse cx="390" cy="560" rx="330" ry="34" fill="#26365f" opacity="0.12" />

      <g fill="url(#figduo)" filter="url(#figshadow)">
        <g transform="translate(20 240) scale(0.92)">{FIGURES.soccer}</g>
        <g transform="translate(150 268) scale(0.82)">{FIGURES.hockey}</g>
        <g transform="translate(500 226) scale(0.98)">{FIGURES.basketball}</g>
        <g transform="translate(636 244) scale(0.9)">{FIGURES.generic}</g>
        <g transform="translate(300 150) scale(1.2)">{FIGURES.football}</g>
      </g>
    </svg>
  );
}

export function SportScene({
  sport,
  className = "",
}: {
  sport: string;
  className?: string;
}) {
  const key = figureKey(sport);
  const fig = FIGURES[key];

  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sky-${key}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#122253" />
          <stop offset="48%" stopColor="#2f4bab" />
          <stop offset="78%" stopColor="#6c81d0" />
          <stop offset="100%" stopColor="#e9ac6a" />
        </linearGradient>
        <radialGradient id={`glow-${key}`} cx="52%" cy="58%" r="42%">
          <stop offset="0%" stopColor="#fff4dc" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#fff4dc" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#sky-${key})`} />
      <ellipse cx="205" cy="230" rx="150" ry="90" fill={`url(#glow-${key})`} />
      {/* ground */}
      <ellipse cx="200" cy="300" rx="260" ry="60" fill="#0c1636" opacity="0.55" />

      <g fill="#0b1327" transform="translate(150 40) scale(0.72)">
        {fig}
      </g>
    </svg>
  );
}
