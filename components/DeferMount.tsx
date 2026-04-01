"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Schedules work after React hydration has committed and the browser has
 * painted, then waits for an idle slice (or `timeout`) before running `fn`.
 * Reduces TBT by keeping Three.js off the critical post-hydration long tasks.
 */
export function scheduleAfterHydrationIdle(
  fn: () => void,
  options: { delayMs: number; idleTimeoutMs?: number },
): () => void {
  const idleTimeoutMs = options.idleTimeoutMs ?? 2800;
  let cancelled = false;
  let idleId: number | undefined;
  /** Browser timer handles (avoid NodeJS.Timeout vs number mismatch in Next types). */
  let timer: number | undefined;
  let innerTimer: number | undefined;
  let raf1 = 0;
  let raf2 = 0;

  const runIdle = () => {
    if (cancelled) return;
    const go = () => {
      if (!cancelled) fn();
    };
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(go, { timeout: idleTimeoutMs });
    } else {
      innerTimer = window.setTimeout(go, 280) as unknown as number;
    }
  };

  raf1 = window.requestAnimationFrame(() => {
    raf2 = window.requestAnimationFrame(() => {
      timer = window.setTimeout(runIdle, options.delayMs) as unknown as number;
    });
  });

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(raf1);
    if (raf2) window.cancelAnimationFrame(raf2);
    if (timer !== undefined) window.clearTimeout(timer);
    if (innerTimer !== undefined) window.clearTimeout(innerTimer);
    if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
      window.cancelIdleCallback(idleId);
    }
  };
}

/**
 * Delays mounting children until after hydration, two animation frames, an
 * optional minimum delay (higher on narrow viewports), then `requestIdleCallback`.
 * Keeps FCP/LCP and hydration long tasks ahead of WebGL instantiation.
 */
export function DeferHeavyChild({
  children,
  fallback,
  delayMs = 650,
}: {
  children: ReactNode;
  fallback: ReactNode;
  /** Base delay after rAF×2 (~500ms+ goal); bumped on narrow viewports for lower mobile TBT. */
  delayMs?: number;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let mounted = true;
    const isNarrow =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 767px)").matches;
    const effectiveDelay = isNarrow ? Math.max(delayMs, 1280) : delayMs;

    const cancelSchedule = scheduleAfterHydrationIdle(
      () => {
        if (mounted) setShow(true);
      },
      { delayMs: effectiveDelay, idleTimeoutMs: 3000 },
    );
    return () => {
      mounted = false;
      cancelSchedule();
    };
  }, [delayMs]);

  return show ? children : fallback;
}

/**
 * Mounts children only when the wrapper intersects the viewport (or rootMargin).
 * Defers below-the-fold Three.js and code-split chunks until needed.
 */
export function MountWhenVisible({
  children,
  fallback,
  rootMargin = "120px",
  className,
}: {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
