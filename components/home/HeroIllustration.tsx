type Props = { className?: string };

export default function HeroIllustration({ className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Three volunteers planting a young tree together"
      className={`hero-illustration ${className}`}
    >
      {/* Sky, sun, clouds, birds */}
      <rect width="400" height="500" fill="var(--il-sky)" />
      <circle cx="312" cy="84" r="44" fill="var(--il-sun)" />
      <g fill="var(--il-cloud)">
        <rect x="34" y="78" width="96" height="26" rx="13" />
        <rect x="60" y="62" width="52" height="26" rx="13" />
        <rect x="238" y="148" width="72" height="22" rx="11" />
      </g>
      <path
        d="M258 122q8-8 16 0q8-8 16 0"
        fill="none"
        stroke="var(--il-ink)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Hills */}
      <path d="M0 300Q110 250 230 290T400 280V500H0Z" fill="var(--il-far)" />
      <path d="M0 345Q140 300 260 335T400 325V500H0Z" fill="var(--il-mid)" />

      {/* Big tree */}
      <rect
        x="58"
        y="238"
        width="12"
        height="152"
        rx="6"
        fill="var(--il-trunk)"
      />
      <g fill="var(--il-primary)">
        <circle cx="64" cy="212" r="50" />
        <circle cx="28" cy="244" r="34" />
        <circle cx="102" cy="242" r="36" />
      </g>
      <circle cx="48" cy="200" r="14" fill="var(--il-primary2)" />
      <circle cx="92" cy="226" r="10" fill="var(--il-primary2)" />
      <g fill="var(--il-sun)">
        <circle cx="70" cy="180" r="4" />
        <circle cx="36" cy="232" r="4" />
        <circle cx="108" cy="250" r="4" />
        <circle cx="80" cy="238" r="4" />
      </g>

      {/* Foreground ground + flowers */}
      <path d="M0 392Q200 352 400 396V500H0Z" fill="var(--il-ground)" />
      <g fill="var(--il-sun)">
        <circle cx="30" cy="440" r="4" />
        <circle cx="96" cy="480" r="4" />
        <circle cx="350" cy="474" r="4" />
        <circle cx="380" cy="430" r="4" />
      </g>
      <g fill="var(--il-primary2)">
        <circle cx="58" cy="470" r="3.5" />
        <circle cx="330" cy="440" r="3.5" />
      </g>

      {/* Sapling */}
      <ellipse cx="210" cy="456" rx="30" ry="8" fill="var(--il-soil)" />
      <path
        d="M210 454V424"
        stroke="var(--il-trunk)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse
        cx="199"
        cy="424"
        rx="11"
        ry="5.5"
        transform="rotate(-30 199 424)"
        fill="var(--il-primary)"
      />
      <ellipse
        cx="221"
        cy="420"
        rx="11"
        ry="5.5"
        transform="rotate(30 221 420)"
        fill="var(--il-primary)"
      />

      {/* Person 1 (left) */}
      <path
        d="M132 428L131 458M148 428L149 458"
        stroke="var(--il-pants)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect
        x="124"
        y="374"
        width="32"
        height="60"
        rx="14"
        fill="var(--il-primary)"
      />
      <path
        d="M150 392L202 434"
        stroke="#8D5A3B"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="140" cy="356" r="15" fill="#8D5A3B" />
      <path d="M125 354a15 15 0 0 1 30 0Z" fill="var(--il-hair)" />

      {/* Person 2 (right) */}
      <path
        d="M292 428L291 458M308 428L309 458"
        stroke="var(--il-pants)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <rect
        x="284"
        y="374"
        width="32"
        height="60"
        rx="14"
        fill="var(--il-sun)"
      />
      <path
        d="M290 392L220 434"
        stroke="#E8B48A"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="300" cy="356" r="15" fill="#E8B48A" />
      <path d="M285 354a15 15 0 0 1 30 0Z" fill="var(--il-hair)" />

      {/* Child (middle) */}
      <path
        d="M246 440L245 460M258 440L259 460"
        stroke="var(--il-pants)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <rect
        x="240"
        y="396"
        width="24"
        height="48"
        rx="11"
        fill="var(--il-primary2)"
      />
      <path
        d="M258 410L216 436"
        stroke="#C68B5B"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="252" cy="382" r="12" fill="#C68B5B" />
      <path d="M240 380a12 12 0 0 1 24 0Z" fill="var(--il-hair)" />
    </svg>
  );
}
