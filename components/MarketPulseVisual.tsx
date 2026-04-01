"use client";

import React, { useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Clock,
  Line,
  LineBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
const SEGMENT_COUNT = IS_MOBILE ? 100 : 200;
const ANTIALIAS =
  typeof navigator !== "undefined" && navigator.hardwareConcurrency > 4;

function makeDebounce(fn: () => void, ms: number) {
  let t = 0;
  return () => {
    window.clearTimeout(t);
    t = window.setTimeout(fn, ms);
  };
}

type Props = { className?: string };

export default function MarketPulseVisual({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new Scene();
    const camera = new PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new WebGLRenderer({ antialias: ANTIALIAS, alpha: true, powerPreference: "low-power", precision: "mediump" });
    renderer.setSize(1, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const canvas = renderer.domElement;
    Object.assign(canvas.style, { position: "absolute", left: "0", top: "0", width: "100%", height: "100%", zIndex: "0", display: "block" });
    container.appendChild(canvas);

    const waveData = [
      { color: 0x10b981, amplitude: 6, frequency: 0.15, speed: 1.5, opacity: 0.8 },
      { color: 0x94a3b8, amplitude: 4, frequency: 0.1, speed: 0.8, opacity: 0.4 },
      { color: 0x3b82f6, amplitude: 8, frequency: 0.05, speed: 0.5, opacity: 0.3 },
      { color: 0xf8fafc, amplitude: 3, frequency: 0.2, speed: 2.0, opacity: 0.2 },
    ];

    const waves: Line[] = [];
    const geometries: BufferGeometry[] = [];

    for (const cfg of waveData) {
      const geo = new BufferGeometry();
      geo.setAttribute("position", new BufferAttribute(new Float32Array((SEGMENT_COUNT + 1) * 3), 3));
      const mat = new LineBasicMaterial({ color: cfg.color, transparent: true, opacity: cfg.opacity });
      const line = new Line(geo, mat);
      scene.add(line);
      waves.push(line);
      geometries.push(geo);
    }

    let animId: number;
    const clock = new Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      waves.forEach((line, idx) => {
        const cfg = waveData[idx];
        const pos = line.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i <= SEGMENT_COUNT; i++) {
          const x = (i - SEGMENT_COUNT / 2) * 0.8;
          const noise = idx === 0 ? Math.sin(elapsed * 5 + x) * 0.5 : 0;
          pos[i * 3] = x;
          pos[i * 3 + 1] = Math.sin(x * cfg.frequency + elapsed * cfg.speed) * cfg.amplitude + noise;
          pos[i * 3 + 2] = 0;
        }
        line.geometry.attributes.position.needsUpdate = true;
      });
      renderer.render(scene, camera);
    };
    animate();

    let pendingW = 1;
    let pendingH = 1;
    const applySize = (w: number, h: number) => {
      const hh = Math.max(h, 1);
      if (w <= 0) return;
      camera.aspect = w / hh;
      camera.updateProjectionMatrix();
      renderer.setSize(w, hh);
    };
    const debouncedResize = makeDebounce(() => applySize(pendingW, pendingH), 120);
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const box = entry.contentBoxSize?.[0];
      if (box) {
        pendingW = box.inlineSize;
        pendingH = Math.max(box.blockSize, 1);
      } else {
        pendingW = entry.contentRect.width;
        pendingH = Math.max(entry.contentRect.height, 1);
      }
      debouncedResize();
    });
    ro.observe(container, { box: "border-box" });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(animId);
      geometries.forEach((g) => g.dispose());
      waves.forEach((w) => {
        if (Array.isArray(w.material)) w.material.forEach((m) => m.dispose());
        else w.material.dispose();
      });
      renderer.dispose();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={["relative isolate w-full min-h-[12rem] h-48 overflow-hidden rounded-xl border border-white/20 bg-[#020617]", className ?? ""].filter(Boolean).join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-20" style={{ backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px", backgroundPosition: "center" }} />
      <div className="absolute top-4 left-5 pointer-events-none select-none z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981] animate-pulse" />
          <span className="font-mono text-[11px] text-white font-bold tracking-[0.2em] uppercase">
            Signal_Quality: <span className="text-emerald-400">High</span>
          </span>
        </div>
      </div>
      <div className="absolute bottom-4 right-5 pointer-events-none select-none text-right z-10">
        <div className="font-mono text-[10px] text-slate-300 uppercase tracking-widest font-semibold">Volatility_Index</div>
        <div className="font-mono text-[14px] text-white mt-0.5 drop-shadow-md">
          0.42 <span className="text-[10px] text-emerald-400 font-bold">RMS</span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(255,255,255,0.05)_50%)] bg-[length:100%_4px] opacity-30" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_20%,#020617_100%)]" />
    </div>
  );
}
