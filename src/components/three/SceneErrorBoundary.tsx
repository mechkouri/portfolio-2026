import { Component, type ReactNode } from 'react';

/**
 * Keeps a failed 3D load (a chunk 404 after a redeploy, or a WebGL context error) from unmounting
 * the whole page: the section just shows its static fallback instead.
 */
export class SceneErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
