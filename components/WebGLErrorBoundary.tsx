"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback: ReactNode };
type State = { hasError: boolean };

/**
 * Catches render-phase errors from Three.js children. useEffect failures are
 * handled via `createWebGLRendererSafely` in each visual.
 */
export class WebGLErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: unknown, info: ErrorInfo) {
    if (process.env.NODE_ENV === "development") {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn("[WebGLErrorBoundary]", msg, info.componentStack);
    }
  }

  override render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
