"use client";

import { useRef, useState } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Seconds; use for staggered grid reveals (e.g. `index * 0.1`). */
  delay?: number;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

export function FadeIn({
  children,
  className,
  delay = 0,
  style,
  ...divProps
}: FadeInProps) {
  const [inView, setInView] = useState(false);
  /**
   * Track whether this instance has already triggered so a conditional
   * unmount+remount does not re-animate content the user has already seen.
   */
  const triggeredRef = useRef(false);

  /**
   * Per-instance IntersectionObserver via React 19 ref-callback cleanup.
   * Plain function (not useCallback) because it is only assigned on mount via
   * the ref prop; React only calls it once (on mount) and calls the returned
   * cleanup on unmount. Stable identity is not required here.
   */
  const refCb = (el: HTMLDivElement | null) => {
    if (!el) return;

    /** Guard: if already triggered (e.g. remount after conditional render), skip re-animation. */
    if (triggeredRef.current) {
      setInView(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      triggeredRef.current = true;
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          triggeredRef.current = true;
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "-100px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  };

  return (
    <div
      ref={refCb}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(20px)",
        transition: delay > 0
          ? `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`
          : "opacity 0.6s ease-out, transform 0.6s ease-out",
        ...style,
      }}
      {...divProps}
    >
      {children}
    </div>
  );
}
