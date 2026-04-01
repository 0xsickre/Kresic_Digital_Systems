import React, { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";

const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
/** 4 000 on mobile (up from 2 400): still a single Points draw call, single BufferGeometry. */
const PARTICLE_COUNT = IS_MOBILE ? 4000 : 6000;
const LINE_LINK_COUNT = IS_MOBILE ? 100 : 180;
const RADIUS = 280;

/** True on devices that can afford MSAA (>4 logical cores ≈ mid/high-end phone). */
const ANTIALIAS =
  typeof navigator !== "undefined" && navigator.hardwareConcurrency > 4;

function makeDebounce(fn: () => void, ms: number) {
  let t = 0;
  return () => {
    window.clearTimeout(t);
    t = window.setTimeout(fn, ms);
  };
}

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sessionUid, setSessionUid] = useState<string | null>(null);

  useEffect(() => {
    setSessionUid(crypto.randomUUID().slice(0, 8));
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scene = new Scene();

    const getSize = () => {
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      return { w, h };
    };

    const { w: iw, h: ih } = getSize();
    const camera = new PerspectiveCamera(75, iw / ih, 0.1, 2000);
    camera.position.z = 450;

    const applyCameraForWidth = (w: number) => {
      if (w < 400) { camera.position.z = 640; camera.fov = 78; }
      else if (w < 640) { camera.position.z = 560; camera.fov = 76; }
      else if (w < 900) { camera.position.z = 500; camera.fov = 75; }
      else { camera.position.z = 450; camera.fov = 75; }
    };

    const renderer = new WebGLRenderer({
      antialias: ANTIALIAS,
      alpha: true,
      powerPreference: "low-power",
      precision: "mediump",
    });
    renderer.setSize(iw, ih);
    /** Use real dPR but cap at 2 — sharp on Retina/AMOLED without killing fill rate. */
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // ── Particles (single Points / single BufferGeometry = 1 draw call) ──────
    const particlesGeom = new BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = RADIUS * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;

      const isAccent = Math.random() > 0.97;
      if (isAccent) {
        colors[i * 3] = 0.06;
        colors[i * 3 + 1] = 0.72;
        colors[i * 3 + 2] = 0.50;
      } else {
        const b = 0.3 + Math.random() * 0.4;
        colors[i * 3] = b;
        colors[i * 3 + 1] = b;
        colors[i * 3 + 2] = b + 0.1;
      }
    }

    particlesGeom.setAttribute("position", new BufferAttribute(positions, 3));
    particlesGeom.setAttribute("color", new BufferAttribute(colors, 3));

    const particlesMat = new PointsMaterial({
      size: IS_MOBILE ? 1.35 : 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: AdditiveBlending,
      sizeAttenuation: true,
    });

    const pointCloud = new Points(particlesGeom, particlesMat);
    scene.add(pointCloud);

    // ── Lines ─────────────────────────────────────────────────────────────────
    const lineMaxDistance = 40;
    const linesGeom = new BufferGeometry();
    const linePositions = new Float32Array(1500 * 6);
    linesGeom.setAttribute("position", new BufferAttribute(linePositions, 3));

    const linesMat = new LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.12,
      blending: AdditiveBlending,
    });
    const lineSegments = new LineSegments(linesGeom, linesMat);
    scene.add(lineSegments);

    const mouse = new Vector2();
    let targetRotationX = 0;
    let targetRotationY = 0;
    let implodeFactor = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / (rect.height || 1)) * 2 + 1;
      targetRotationY = mouse.x * 0.35;
      targetRotationX = -mouse.y * 0.35;
    };
    const onClick = () => { implodeFactor = 1.1; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);

    const applySize = () => {
      const { w, h } = getSize();
      camera.aspect = w / h;
      applyCameraForWidth(w);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      particlesMat.size = w < 640 ? 1.35 : 1.8;
    };

    /** Debounce resize so orientation-change on mobile fires only once per gesture. */
    const debouncedApplySize = makeDebounce(applySize, 120);
    const resizeObserver = new ResizeObserver(debouncedApplySize);
    resizeObserver.observe(container);
    applySize();

    let animationFrameId: number;
    const clock = new Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      pointCloud.rotation.y += (targetRotationY - pointCloud.rotation.y) * 0.04;
      pointCloud.rotation.x += (targetRotationX - pointCloud.rotation.x) * 0.04;
      lineSegments.rotation.copy(pointCloud.rotation);

      const posAttr = particlesGeom.attributes.position;
      const linePosArray = linesGeom.attributes.position.array;
      let lineIdx = 0;

      implodeFactor *= 0.95;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
        const pulse = 1 + Math.sin(elapsed * 0.6 + i * 0.05) * 0.012;
        const cx = originalPositions[ix] * pulse;
        const cy = originalPositions[iy] * pulse;
        const cz = originalPositions[iz] * pulse;
        const f = 1 - implodeFactor * 0.55;
        posAttr.array[ix] = cx * f;
        posAttr.array[iy] = cy * f;
        posAttr.array[iz] = cz * f;

        if (i < LINE_LINK_COUNT && lineIdx < linePosArray.length - 6) {
          for (let j = i + 1; j < LINE_LINK_COUNT; j++) {
            const jx = j * 3;
            const dx = posAttr.array[ix] - posAttr.array[jx];
            const dy = posAttr.array[iy] - posAttr.array[jx + 1];
            const dz = posAttr.array[iz] - posAttr.array[jx + 2];
            if (dx * dx + dy * dy + dz * dz < lineMaxDistance * lineMaxDistance) {
              linePosArray[lineIdx++] = posAttr.array[ix];
              linePosArray[lineIdx++] = posAttr.array[iy];
              linePosArray[lineIdx++] = posAttr.array[iz];
              linePosArray[lineIdx++] = posAttr.array[jx];
              linePosArray[lineIdx++] = posAttr.array[jx + 1];
              linePosArray[lineIdx++] = posAttr.array[jx + 2];
            }
          }
        }
      }

      for (let k = lineIdx; k < linePosArray.length; k++) linePosArray[k] = 0;

      posAttr.needsUpdate = true;
      linesGeom.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", onClick);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      particlesGeom.dispose();
      particlesMat.dispose();
      linesGeom.dispose();
      linesMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 min-h-full w-full bg-terminal-bg overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.04)_0%,transparent_75%)] pointer-events-none" />
      <div className="absolute bottom-10 right-10 pointer-events-none select-none text-right hidden sm:block">
        <div className="flex items-center justify-end gap-3 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
          <span className="font-mono text-[10px] text-white/40 tracking-[0.3em] uppercase">
            System_Core.Online
          </span>
        </div>
        <div className="font-mono text-[8px] text-white/20 uppercase tracking-widest">
          UID: {sessionUid ?? "--------"} · Protocol: Neural_Sync
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
    </div>
  );
}
