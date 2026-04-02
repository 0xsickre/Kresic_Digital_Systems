"use client";

import React, { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  Clock,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Raycaster,
  Scene,
  Vector2,
  Vector3,
} from "three";

import {
  createWebGLRendererSafely,
  isRendererContextUsable,
} from "@/lib/webgl";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
const SEGMENTS = IS_MOBILE ? 30 : 60;
const ANTIALIAS =
  typeof navigator !== "undefined" && navigator.hardwareConcurrency > 4;

type Props = { className?: string };

export default function InfrastructureGrid({ className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let alive = true;

    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, -25, 12);
    camera.lookAt(0, 0, 0);

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
    Object.assign(canvas.style, { position: "absolute", left: "0", top: "0", width: "100%", height: "100%", zIndex: "0", display: "block" });
    container.appendChild(canvas);

    const geometry = new PlaneGeometry(100, 100, SEGMENTS, SEGMENTS);
    const originalPositions = new Float32Array(geometry.attributes.position.array);
    const material = new MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15, wireframe: true, blending: AdditiveBlending });
    scene.add(new Mesh(geometry, material));

    const raycaster = new Raycaster();
    const mouse = new Vector2();
    let intersectPoint: Vector3 | null = null;
    let isMouseOver = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const target = new Vector3();
      raycaster.ray.intersectPlane(new Plane(new Vector3(0, 0, 1), 0), target);
      if (target) intersectPoint = target;
    };
    const onEnter = () => { isMouseOver = true; };
    const onLeave = () => { isMouseOver = false; };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", onLeave);

    const clock = new Clock();
    let animId: number | undefined;

    const animate = () => {
      if (!alive || !isRendererContextUsable(renderer)) return;

      const time = clock.getElapsedTime();
      const posAttr = geometry.attributes.position;

      for (let i = 0; i < posAttr.count; i++) {
        const vx = originalPositions[i * 3];
        const vy = originalPositions[i * 3 + 1];
        let vz = Math.sin(vx * 0.2 + time) * 0.3 + Math.cos(vy * 0.2 + time * 0.8) * 0.3;

        if (isMouseOver && intersectPoint) {
          const dx = vx - intersectPoint.x;
          const dy = vy - intersectPoint.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 144) vz += Math.exp(-d2 / 24) * 4;
        }
        posAttr.setZ(i, vz);
      }
      posAttr.needsUpdate = true;

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
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", onLeave);
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
      className={["relative isolate w-full min-h-[12rem] h-48 overflow-hidden rounded-md border border-white/5 bg-[#0a0a0a]", className ?? ""].filter(Boolean).join(" ")}
      style={{ cursor: "crosshair" }}
    >
      <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end select-none pointer-events-none">
        <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">System.Arch_v2.0</span>
        <div className="flex items-center gap-2 mt-1 text-slate-500">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-[8px] text-slate-300 font-mono uppercase">Online</span>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
    </div>
  );
}
