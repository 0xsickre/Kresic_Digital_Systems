"use client";

import { useCallback, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Seconds; use for staggered grid reveals (e.g. `index * 0.1`). */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

/**
 * Single shared observer for every FadeIn on the page.
 * Avoids N×IntersectionObserver + N×useEffect during hydration.
 */
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, () => void>();

function getSharedObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            callbacks.get(entry.target)?.();
            callbacks.delete(entry.target);
            sharedObserver!.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "-100px", threshold: 0 },
    );
  }
  return sharedObserver;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  style,
  ...divProps
}: FadeInProps) {
  const [inView, setInView] = useState(false);

  const refCb = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = getSharedObserver();
    callbacks.set(el, () => setInView(true));
    io.observe(el);
  }, []);

  return (
    <div
      ref={refCb}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
        ...style,
      }}
      {...divProps}
    >
      {children}
    </div>
  );
}
