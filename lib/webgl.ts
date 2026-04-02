import type { WebGLRendererParameters } from "three";
import { WebGLRenderer } from "three";

/**
 * Probes WebGL1 availability (matches typical Three.js WebGLRenderer).
 * Uses a throwaway canvas and releases the context via WEBGL_lose_context.
 */
export function isWebGLAvailable(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: true,
        stencil: false,
        failIfMajorPerformanceCaveat: false,
        powerPreference: "low-power",
      }) ??
      (canvas.getContext(
        "experimental-webgl",
      ) as WebGLRenderingContext | null);
    if (!gl) return false;
    const lose = gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates a WebGLRenderer only when a context can be obtained; disposes on failure.
 * Does not call `isWebGLAvailable()` first — that would create a throwaway GL context
 * on every mount (double allocation, some GPUs cap concurrent contexts).
 */
export function createWebGLRendererSafely(
  params: WebGLRendererParameters,
): WebGLRenderer | null {
  try {
    const renderer = new WebGLRenderer(params);
    const gl = renderer.getContext();
    if (!gl || gl.isContextLost()) {
      renderer.dispose();
      return null;
    }
    return renderer;
  } catch {
    return null;
  }
}

/** Use inside rAF loops before `render` to stop after context loss or GPU reset. */
export function isRendererContextUsable(renderer: WebGLRenderer): boolean {
  const gl = renderer.getContext();
  return Boolean(gl && !gl.isContextLost());
}
