import type { Metadata } from "next";
import type { ReactNode } from "react";

import { BRAND_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Market Analytics Demo",
  description: `Interactive market analytics UI demo — ${BRAND_NAME}. Mock data only; not live trading or execution.`,
  // Prevent search engines from indexing demo routes containing mock financial data,
  // which could be misread as live trading signals or real financial advice.
  robots: {
    index: false,
    follow: false,
  },
};

export default function MarketAnalyticsDemoLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return children;
}
