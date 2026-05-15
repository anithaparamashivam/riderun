export default function FrenzzLogo({ size = 72 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Frenzz logo"
      role="img"
    >
      {/* Outer circle */}
      <circle cx="100" cy="100" r="88" stroke="#F46E1B" strokeWidth="9" />

      {/* Upper hand — palm facing down from upper-right */}
      <path
        d="M148 78 C140 58 118 60 104 68 C90 60 68 58 58 75 C50 88 62 98 78 96 C88 100 100 98 100 98 C100 98 112 100 122 96 C140 98 154 90 148 78Z"
        fill="#F46E1B"
      />
      {/* Finger lines on upper hand */}
      <line x1="82"  y1="90" x2="77"  y2="78" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="95"  y1="87" x2="93"  y2="75" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="108" y1="87" x2="108" y2="75" stroke="white" strokeWidth="4" strokeLinecap="round" />

      {/* Lower hand — palm facing up from lower-left */}
      <path
        d="M52 122 C60 142 82 140 96 132 C110 140 132 142 142 125 C150 112 138 102 122 104 C112 100 100 102 100 102 C100 102 88 100 78 104 C60 102 46 110 52 122Z"
        fill="#F46E1B"
      />
      {/* Finger lines on lower hand */}
      <line x1="118" y1="110" x2="123" y2="122" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="105" y1="113" x2="107" y2="125" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1="92"  y1="113" x2="92"  y2="125" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
