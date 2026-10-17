import { NextRequest } from "next/server";
import { afterEach, describe, expect, it } from "vitest";

import { middleware } from "@/middleware";

const request = (path: string) =>
  new NextRequest(`https://kresicds.com${path}`, {
    headers: { cookie: "NEXT_LOCALE=en; other=1" },
  });

describe("maintenance mode", () => {
  afterEach(() => {
    delete process.env.MAINTENANCE_MODE;
  });

  it.each([["/"], ["/de"], ["/en/impressum"], ["/api/anything"]])(
    "answers %s with a 503 and clears cookies",
    async (path) => {
      const res = middleware(request(path));
      expect(res.status).toBe(503);
      expect(res.headers.get("retry-after")).toBe("3600");
      expect(res.headers.get("clear-site-data")).toBe('"cookies"');
      const cleared = res.cookies.getAll();
      expect(cleared.map((c) => c.name).sort()).toEqual(["NEXT_LOCALE", "other"]);
      expect(cleared.every((c) => c.value === "")).toBe(true);
      expect(await res.text()).toContain("Wartungsarbeiten");
    },
  );

  it("serves the site again with MAINTENANCE_MODE=off", () => {
    process.env.MAINTENANCE_MODE = "off";
    expect(middleware(request("/de")).status).toBe(200);
  });
});
