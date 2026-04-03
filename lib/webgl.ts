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
 *
 * Three.js r183 internally calls `console.error("THREE.WebGLRenderer: …")` inside
 * the constructor's catch block **before** re-throwing. Since we already handle the
 * failure gracefully (return null), the console noise is purely cosmetic but costs
 * 4 Best-Practices points in Lighthouse / DebugBear. We mute it for the duration
 * of the constructor call and restore immediately in `finally`.
 */
export function createWebGLRendererSafely(
  params: WebGLRendererParameters,
): WebGLRenderer | null {
  const origError = console.error;
  try {
    // eslint-disable-next-line no-console -- intentional mute of Three.js noise
    console.error = () => {};
    const renderer = new WebGLRenderer(params);
    console.error = origError;

    const gl = renderer.getContext();
    if (!gl || gl.isContextLost()) {
      renderer.dispose();
      return null;
    }
    return renderer;
  } catch {
    return null;
  } finally {
    console.error = origError;
  }
}

/** Use inside rAF loops before `render` to stop after context loss or GPU reset. */
export function isRendererContextUsable(renderer: WebGLRenderer): boolean {
  const gl = renderer.getContext();
  return Boolean(gl && !gl.isContextLost());
}
