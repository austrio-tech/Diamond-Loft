interface Props {
  width?: number;
  light?: boolean;
  className?: string;
}

export default function DiamondLoftLogo({
  width = 160,
  className = "",
  light = false,
}: Props) {
  const mainColor = light ? "#f1e6cf" : "var(--charcoal)";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 222 58"
      width={width}
      fill="none"
      className={className}
      aria-label="Diamond Loft"
      role="img"
    >
      <path
        d="M24 2 L16 13 L2 24 L24 54 L46 24 L32 13 Z"
        stroke="#9c7c4a"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line
        x1="16"
        y1="13"
        x2="32"
        y2="13"
        stroke="#9c7c4a"
        strokeWidth="1"
        opacity="0.65"
      />
      <line
        x1="2"
        y1="24"
        x2="46"
        y2="24"
        stroke="#9c7c4a"
        strokeWidth="0.7"
        opacity="0.45"
      />
      <line
        x1="24"
        y1="24"
        x2="24"
        y2="54"
        stroke="#9c7c4a"
        strokeWidth="0.7"
        opacity="0.35"
      />
      <line
        x1="16"
        y1="13"
        x2="24"
        y2="24"
        stroke="#9c7c4a"
        strokeWidth="0.7"
        opacity="0.35"
      />
      <line
        x1="32"
        y1="13"
        x2="24"
        y2="24"
        stroke="#9c7c4a"
        strokeWidth="0.7"
        opacity="0.35"
      />
      <path d="M24 2 L32 13 L16 13 Z" fill="#9c7c4a" fillOpacity="0.25" />
      <path d="M24 2 L16 13 L2 24 Z" fill="#9c7c4a" fillOpacity="0.09" />
      <path d="M24 2 L32 13 L46 24 Z" fill="#9c7c4a" fillOpacity="0.17" />
      <path d="M2 24 L24 24 L24 54 Z" fill="#9c7c4a" fillOpacity="0.09" />
      <path d="M46 24 L24 24 L24 54 Z" fill="#9c7c4a" fillOpacity="0.14" />
      <text
        x="62"
        y="27"
        fontFamily="var(--font-serif)"
        fontSize="21"
        fontWeight="400"
        fill={mainColor}
        letterSpacing="1.2"
      >
        Diamond
      </text>
      <text
        x="65"
        y="46"
        fontFamily="var(--font-serif)"
        fontSize="12"
        fontWeight="500"
        fill="#9c7c4a"
        letterSpacing="7"
      >
        LOFT
      </text>
    </svg>
  );
}
