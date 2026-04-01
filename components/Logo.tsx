import { useId } from "react";
import type { SVGProps } from "react";

type KDSLogoProps = SVGProps<SVGSVGElement>;

/** KDS lockup: zagrade + tekst + jedna gradijent crta ispod. */
export function KDSLogo({ className, ...props }: KDSLogoProps) {
  const raw = useId().replace(/:/g, "");
  const gradId = `kds-grad-${raw}`;
  const glowId = `kds-glow-${raw}`;

  return (
    <svg
      viewBox="0 0 168 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="55%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        <filter
          id={glowId}
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
        >
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="1.4"
            floodColor="#34d399"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      {/* Leva kvadratna zagrada */}
      <g
        filter={`url(#${glowId})`}
        stroke={`url(#${gradId})`}
        strokeWidth={2.75}
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path d="M 10 14 V 38 M 10 14 H 22 M 10 38 H 22" />
        {/* Desna kvadratna zagrada */}
        <path d="M 158 14 V 38 M 158 14 H 146 M 158 38 H 146" />
      </g>

      {/* Wordmark */}
      <text
        x={84}
        y={31}
        textAnchor="middle"
        fill="currentColor"
        style={{
          fontWeight: 700,
          fontSize: 22,
          fontFamily:
            "var(--font-kds-logo-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          letterSpacing: "0.2em",
        }}
      >
        KDS
      </text>

      <rect
        x={52}
        y={36}
        width={64}
        height={3}
        fill={`url(#${gradId})`}
        opacity={0.92}
      />
    </svg>
  );
}
