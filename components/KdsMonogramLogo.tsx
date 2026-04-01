import React, { type SVGProps } from "react";

type KdsMonogramLogoProps = SVGProps<SVGSVGElement> & {
  /** Header: kompaktan; footer: veći sa blagim okvirom */
  variant?: "header" | "footer";
};

/**
 * KDS tesseract monogram — neural linije + emerald čvorovi.
 * Boje se prilagođavaju svetloj/tamnoj temi sajta.
 */
export function KdsMonogramLogo({
  variant = "header",
  className = "",
  ...svgProps
}: KdsMonogramLogoProps) {
  const svg = (
    <svg
      viewBox="0 0 240 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={
        variant === "header"
          ? `h-8 w-auto shrink-0 sm:h-9 ${className}`
          : `h-12 w-auto md:h-14 ${className}`
      }
      aria-hidden
      {...svgProps}
    >
      {/* K */}
      <path
        className="fill-zinc-900 dark:fill-white"
        d="M20 20H32V80H20V20Z"
      />
      <path
        className="fill-zinc-600 dark:fill-zinc-200"
        d="M32 50L60 20H72L42 50H32Z"
      />
      <path
        className="fill-zinc-500 dark:fill-zinc-300"
        d="M32 50L65 80H53L32 60V50Z"
      />
      {/* D */}
      <path
        className="fill-zinc-100 stroke-zinc-900 dark:fill-zinc-950 dark:stroke-white"
        strokeWidth={2}
        d="M85 20H110C125 20 135 30 135 50C135 70 125 80 110 80H85V20Z"
      />
      <path
        className="fill-zinc-900 dark:fill-white"
        d="M97 32H108C115 32 120 37 120 50C120 63 115 68 108 68H97V32Z"
      />
      {/* S */}
      <path
        className="fill-zinc-200 stroke-zinc-700 dark:fill-zinc-800 dark:stroke-zinc-300"
        strokeWidth={1}
        d="M150 20H185V32H150V50H185V80H150V68H185V58H150V20Z"
      />
      <path
        className="fill-zinc-900 dark:fill-white"
        d="M150 20H185V30H162V40H185V80H150V70H173V60H150V20Z"
      />
      {/* Nodes */}
      <circle
        className="fill-emerald-500 dark:fill-emerald-400"
        cx={20}
        cy={20}
        r={1.5}
        style={{ filter: "drop-shadow(0 0 4px rgb(16 185 129 / 0.65))" }}
      />
      <circle
        className="fill-emerald-500 dark:fill-emerald-400"
        cx={72}
        cy={20}
        r={1.5}
        style={{ filter: "drop-shadow(0 0 4px rgb(16 185 129 / 0.65))" }}
      />
      <circle
        className="fill-emerald-500 dark:fill-emerald-400"
        cx={65}
        cy={80}
        r={1.5}
        style={{ filter: "drop-shadow(0 0 4px rgb(16 185 129 / 0.65))" }}
      />
      <circle
        className="fill-emerald-500 dark:fill-emerald-400"
        cx={135}
        cy={50}
        r={1.8}
        style={{ filter: "drop-shadow(0 0 6px rgb(16 185 129 / 0.7))" }}
      />
      <circle
        className="fill-emerald-500 dark:fill-emerald-400"
        cx={185}
        cy={20}
        r={1.5}
        style={{ filter: "drop-shadow(0 0 4px rgb(16 185 129 / 0.65))" }}
      />
      <circle
        className="fill-emerald-500 dark:fill-emerald-400"
        cx={150}
        cy={80}
        r={1.5}
        style={{ filter: "drop-shadow(0 0 4px rgb(16 185 129 / 0.65))" }}
      />
      <circle
        className="fill-emerald-500 dark:fill-emerald-400"
        cx={185}
        cy={80}
        r={1.5}
        style={{ filter: "drop-shadow(0 0 4px rgb(16 185 129 / 0.65))" }}
      />
      {/* Neural lines */}
      <line
        className="kds-neural-line stroke-emerald-500 opacity-[0.45] dark:stroke-emerald-400"
        x1={20}
        y1={20}
        x2={185}
        y2={20}
        strokeWidth={0.35}
      />
      <line
        className="kds-neural-line stroke-emerald-500 opacity-[0.45] dark:stroke-emerald-400"
        x1={135}
        y1={50}
        x2={65}
        y2={80}
        strokeWidth={0.35}
      />
      <line
        className="kds-neural-line stroke-emerald-500 opacity-[0.45] dark:stroke-emerald-400"
        x1={185}
        y1={20}
        x2={135}
        y2={50}
        strokeWidth={0.35}
      />
    </svg>
  );

  if (variant === "footer") {
    return (
      <div className="flex justify-center">
        <div className="rounded-lg border border-emerald-500/15 bg-zinc-950/[0.03] px-5 py-3 shadow-[inset_0_0_40px_rgba(16,185,129,0.04)] dark:border-emerald-500/20 dark:bg-black/25">
          <div className="drop-shadow-[0_0_12px_rgba(16,185,129,0.18)]">
            {svg}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="drop-shadow-[0_0_10px_rgba(16,185,129,0.15)]">{svg}</div>
  );
}
