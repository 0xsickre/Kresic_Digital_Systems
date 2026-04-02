"use client";

import React, { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
} from "three";

import {
  createWebGLRendererSafely,
  isRendererContextUsable,
} from "@/lib/webgl";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
const PARTICLE_COUNT = IS_MOBILE ? 800 : 1800;
const ANTIALIAS =
  typeof navigator !== "undefined" && navigator.hardwareConcurrency > 4;

type DataFlowVisualProps = { className?: string };

export default function DataFlowVisual({ className }: DataFlowVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let alive = true;

    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 50;

    const renderer = createWebGLRendererSafely({
      antialias: ANTIALIAS,
      alpha: true,
      powerPreference: "low-power",
      precision: "mediump",
    });
    if (!renderer) return;

    renderer.setSize(1, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const canvas = renderer.domElement;
    Object.assign(canvas.style, {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      zIndex: "0",
      display: "block",
    });
    container.appendChild(canvas);

    const geometry = new BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
      velocities[i] = 0.1 + Math.random() * 0.25;
    }

    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("color", new BufferAttribute(colors, 3));

    const material = new PointsMaterial({
      size: 0.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: AdditiveBlending,
    });

    scene.add(new Points(geometry, material));

    let animId: number | undefined;
    const clock = new Clock();

    const animate = () => {
      if (!alive || !isRendererContextUsable(renderer)) return;

      const time = clock.getElapsedTime();
      const posArr = geometry.attributes.position.array as Float32Array;
      const colArr = geometry.attributes.color.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        posArr[ix] += velocities[i];
        if (posArr[ix] > 60) {
          posArr[ix] = -60;
          posArr[iy] = (Math.random() - 0.5) * 60;
          posArr[iz] = (Math.random() - 0.5) * 30;
        }
        const progress = (posArr[ix] + 60) / 120;
        if (progress < 0.4) {
          posArr[iy] += Math.sin(time * 2 + i) * 0.05;
          posArr[iz] += Math.cos(time * 2 + i) * 0.05;
          colArr[ix] = 0.9; colArr[iy] = 0.3; colArr[iz] = 0.2;
        } else if (progress < 0.7) {
          const tY = Math.round(posArr[iy] / 8) * 8;
          posArr[iy] += (tY - posArr[iy]) * 0.05;
          posArr[iz] *= 0.95;
          colArr[ix] = 0.2; colArr[iy] = 0.5; colArr[iz] = 0.9;
        } else {
          const tY = Math.round(posArr[iy] / 10) * 10;
          posArr[iy] += (tY - posArr[iy]) * 0.1;
          posArr[iz] = 0;
          colArr[ix] = 0.1; colArr[iy] = 0.9; colArr[iz] = 0.5;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;

      try {
        renderer.render(scene, camera);
      } catch {
        return;
      }

      animId = requestAnimationFrame(animate);
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
    let resizeDebounceT = 0;
    const scheduleResize = () => {
      window.clearTimeout(resizeDebounceT);
      resizeDebounceT = window.setTimeout(() => {
        if (!alive) return;
        applySize(pendingW, pendingH);
      }, 120) as unknown as number;
    };
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
      scheduleResize();
    });
    ro.observe(container, { box: "border-box" });

    return () => {
      alive = false;
      window.clearTimeout(resizeDebounceT);
      ro.disconnect();
      if (animId !== undefined) cancelAnimationFrame(animId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={[
        "relative isolate w-full min-h-[12rem] h-48 overflow-hidden rounded-lg border border-white/5 bg-[#050505]",
        className ?? "",
      ].filter(Boolean).join(" ")}
    >
      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
        <div className="font-mono text-[10px] tracking-widest text-white/40 uppercase">Data.Ingestion_v1.0</div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <div className="font-mono text-[9px] text-white/40 uppercase tracking-tighter">Status: Processing_Stream</div>
        </div>
      </div>
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] pointer-events-none" />
    </div>
  );
}
