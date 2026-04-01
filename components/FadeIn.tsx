"use client";

import { useEffect, useRef, useState } from "react";
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
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-100px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
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
