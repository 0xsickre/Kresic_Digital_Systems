import type { Metadata } from "next";

import { ImpressumPageClient } from "@/components/ImpressumPageClient";
import { BRAND_NAME, OWNER_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Impressum",
  description: `Impressum — ${BRAND_NAME}, ${OWNER_NAME}.`,
};

export default function ImpressumPage() {
  return <ImpressumPageClient />;
}
