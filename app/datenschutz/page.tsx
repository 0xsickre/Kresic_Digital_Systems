import type { Metadata } from "next";

import { DatenschutzPageClient } from "@/components/DatenschutzPageClient";
import { BRAND_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: `Datenschutzerklärung — ${BRAND_NAME}.`,
};

export default function DatenschutzPage() {
  return <DatenschutzPageClient />;
}
