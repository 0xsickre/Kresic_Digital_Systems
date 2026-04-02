"use client";

import { motion } from "framer-motion";
import { ArrowLeft, LineChart } from "lucide-react";
import Link from "next/link";

import { BRAND_NAME } from "@/lib/site";

// Inlined to avoid bundling the entire dictionary tree into this client chunk.
const LEGAL_EN =
  "Important notice: Our financial solutions are for analysis and information purposes only. We do not build systems for automated trade execution (trading bots).";
const LEGAL_DE =
  "Wichtiger Hinweis: Unsere Finanzlösungen dienen ausschließlich Analyse- und Informationszwecken. Wir entwickeln keine Systeme für die automatische Handelsausführung (Trading Bots).";

const ASSETS = [
  { symbol: "EUR/USD", pit: "T-3" },
  { symbol: "GBP/USD", pit: "T-3" },
  { symbol: "USD/JPY", pit: "T-3" },
  { symbol: "XAU/USD", pit: "T-2" },
  { symbol: "HG", pit: "T-2" },
  { symbol: "CL", pit: "T-2" },
  { symbol: "SPX", pit: "T-1" },
];

const MATRIX_LABELS = ["EUR", "USD", "JPY", "HG", "CL", "SPX"];

/** Deterministic mock only — not production methodology. */
function seeded01(label: string, salt: number): number {
  let h = salt >>> 0;
  for (let i = 0; i < label.length; i++) {
    h = Math.imul(h, 31) + label.charCodeAt(i);
    h >>>= 0;
  }
  return (h % 1000) / 1000;
}

function mockComposite(symbol: string): number {
  const base = 4.2 + seeded01(symbol, 11) * 3.6;
  return Math.round(base * 10) / 10;
}

function mockZ(symbol: string): string {
  const z = (seeded01(symbol, 3) - 0.5) * 4;
  return (z >= 0 ? "+" : "") + z.toFixed(2);
}

function mockMacroPulse(symbol: string): string {
  const v = seeded01(symbol, 7);
  if (v > 0.66) return "Risk-on lean";
  if (v > 0.33) return "Neutral";
  return "Defensive";
}

function buildMockCorrelations(): number[][] {
  const n = MATRIX_LABELS.length;
  const raw: number[][] = [];
  for (let i = 0; i < n; i++) {
    raw[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) raw[i][j] = 1;
      else {
        const a = MATRIX_LABELS[i];
        const b = MATRIX_LABELS[j];
        const v = seeded01(`${a}|${b}`, 19) * 2 - 1;
        raw[i][j] = v;
      }
    }
  }
  const sym: number[][] = raw.map((row, i) =>
    row.map((_, j) => (i === j ? 1 : (raw[i][j] + raw[j][i]) / 2)),
  );
  return sym;
}

function corrColor(r: number): string {
  if (r >= 0.85) return "bg-emerald-500/35";
  if (r >= 0.35) return "bg-emerald-500/20";
  if (r >= -0.35) return "bg-slate-600/25";
  if (r >= -0.85) return "bg-rose-500/20";
  return "bg-rose-500/35";
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export default function MarketAnalyticsDemoPage() {
  const corr = buildMockCorrelations();
  const regime = "Calibrated / Mock";
  const shockLabel = "No live shock detector";
  const vixMock = (18 + seeded01("VIX", 2) * 14).toFixed(1);
  const yieldSpreadMock = (seeded01("10s2s", 5) * 0.8 - 0.15).toFixed(2);

  return (
    <div className="min-h-screen bg-terminal-bg font-mono text-[13px] text-slate-200">
      <div className="border-b border-terminal-border bg-terminal-panel/80 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-start gap-4">
            <Link
              href="/en#hero"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-terminal-border bg-terminal-bg px-2.5 py-1.5 text-[11px] font-medium text-terminal-muted transition hover:border-slate-500 hover:text-slate-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              {BRAND_NAME}
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <LineChart
                  className="h-4 w-4 shrink-0 text-terminal-accent"
                  aria-hidden
                />
                <h1 className="text-base font-semibold tracking-tight text-white">
                  Market Analytics Terminal
                </h1>
              </div>
              <p className="text-[11px] text-terminal-muted">
                Macro-Economic Data Parsing · Cross-Asset Correlation ·
                Proprietary Fundamental Weighting (visual demo)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="rounded border border-terminal-border bg-terminal-bg px-2 py-1 text-terminal-muted">
              Demo mode
            </span>
            <span className="rounded border border-terminal-border bg-terminal-bg px-2 py-1">
              Regime: <span className="text-slate-300">{regime}</span>
            </span>
          </div>
        </div>
      </div>

      <motion.main
        className="mx-auto max-w-7xl space-y-4 p-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.section variants={item} className="grid gap-3 md:grid-cols-4">
          {[
            { k: "Vol proxy (mock)", v: vixMock, sub: "Yahoo-class placeholder" },
            {
              k: "Curve stub (mock)",
              v: `${yieldSpreadMock}%`,
              sub: "Not live FRED",
            },
            { k: "Shock lane", v: shockLabel, sub: "Simplified UI only" },
            {
              k: "Composite (mock)",
              v: mockComposite("PORTFOLIO").toFixed(1),
              sub: "Not calculateProprietaryScore",
            },
          ].map((card) => (
            <div
              key={card.k}
              className="rounded-lg border border-terminal-border bg-terminal-panel p-3 shadow-sm"
            >
              <div className="text-[10px] uppercase tracking-wider text-terminal-muted">
                {card.k}
              </div>
              <div className="mt-1 text-lg font-semibold text-white">{card.v}</div>
              <div className="text-[10px] text-slate-500">{card.sub}</div>
            </div>
          ))}
        </motion.section>

        <motion.section
          variants={item}
          className="rounded-lg border border-terminal-border bg-terminal-panel p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Cross-Asset Correlation (mock 21d)
            </h2>
            <span className="text-[10px] text-terminal-muted">
              Heatmap — illustrative only
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="border-collapse text-[11px]">
              <thead>
                <tr>
                  <th className="p-1" />
                  {MATRIX_LABELS.map((l) => (
                    <th
                      key={l}
                      className="p-1 text-center text-[10px] font-normal text-terminal-muted"
                    >
                      {l}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX_LABELS.map((row, i) => (
                  <tr key={row}>
                    <td className="pr-2 text-[10px] text-terminal-muted">{row}</td>
                    {MATRIX_LABELS.map((_, j) => {
                      const r = corr[i][j];
                      return (
                        <td key={`${i}-${j}`} className="p-0.5">
                          <div
                            className={`flex h-8 w-10 items-center justify-center rounded ${corrColor(
                              r,
                            )} border border-terminal-border/50 text-[10px] text-slate-200`}
                            title={r.toFixed(2)}
                          >
                            {r.toFixed(1)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section
          variants={item}
          className="rounded-lg border border-terminal-border bg-terminal-panel p-4"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Scanner — Proprietary Fundamental Weighting (mock)
            </h2>
            <span className="text-[10px] text-terminal-muted">
              PIT tags shown for workflow parity
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-terminal-border text-[10px] uppercase text-terminal-muted">
                  <th className="pb-2 pr-3 font-medium">Instrument</th>
                  <th className="pb-2 pr-3 font-medium">PIT</th>
                  <th className="pb-2 pr-3 font-medium">COT Z (mock)</th>
                  <th className="pb-2 pr-3 font-medium">Macro pulse</th>
                  <th className="pb-2 font-medium">Composite</th>
                  <th className="pb-2 pl-3 font-medium">Tape</th>
                </tr>
              </thead>
              <tbody>
                {ASSETS.map((a, idx) => {
                  const score = mockComposite(a.symbol);
                  const barW = `${Math.min(100, Math.max(8, (score / 10) * 100))}%`;
                  return (
                    <motion.tr
                      key={a.symbol}
                      variants={item}
                      custom={idx}
                      className="border-b border-terminal-border/60 last:border-0"
                    >
                      <td className="py-2 pr-3 font-medium text-white">{a.symbol}</td>
                      <td className="py-2 pr-3 text-terminal-muted">{a.pit}</td>
                      <td className="py-2 pr-3 tabular-nums">{mockZ(a.symbol)}</td>
                      <td className="py-2 pr-3 text-slate-300">
                        {mockMacroPulse(a.symbol)}
                      </td>
                      <td className="py-2 pr-3 tabular-nums text-terminal-accent">
                        {score.toFixed(1)}
                      </td>
                      <td className="py-2 pl-3">
                        <div className="h-1.5 w-28 overflow-hidden rounded bg-terminal-bg">
                          <motion.div
                            className="h-full rounded-sm bg-gradient-to-r from-blue-600 to-cyan-400"
                            initial={{ width: 0 }}
                            animate={{ width: barW }}
                            transition={{ duration: 0.5, delay: 0.15 + idx * 0.04 }}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.section>

        <motion.section
          variants={item}
          className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90">
            Legal — analysis only / no automated execution
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
            {LEGAL_EN}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-terminal-muted">
            {LEGAL_DE}
          </p>
        </motion.section>

        <motion.footer
          variants={item}
          className="flex flex-col items-center gap-2 border-t border-dashed border-terminal-border pb-10 pt-6 text-center"
        >
          <p className="text-[11px] font-medium tracking-wide text-amber-200/90">
            Proprietary Algorithm — Visual Demo Only
          </p>
          <p className="max-w-xl text-[10px] leading-relaxed text-terminal-muted">
            No live CFTC, Yahoo, FRED, or EIA connections in this route. Numbers are
            deterministic mocks for layout and motion only. Production scoring runs in a
            separate audited Python engine.
          </p>
        </motion.footer>
      </motion.main>
    </div>
  );
}
