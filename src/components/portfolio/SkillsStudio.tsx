import { Component, Suspense, lazy, useCallback, useEffect, useState, type ReactNode } from "react";
import { studioAsset } from "./studioScene";
import type { StudioPose } from "./studioScene";
const StudioModel = lazy(() => import("./StudioModel"));
const SoftwareStudio = lazy(() => import("./SoftwareStudio"));
export type StudioProps = {
  selected: number;
  onSelect: (index: number) => void;
  onInspect: (tool: string, room: number) => void;
  pose: StudioPose;
  active: boolean;
};
class StudioBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function SkillsStudio({
  render3D,
  onModeChange,
  ...props
}: StudioProps & { render3D: boolean; onModeChange: (live: boolean) => void }) {
  const [mode, setMode] = useState<"pending" | "webgl" | "software" | "image">("pending"),
    [ready, setReady] = useState(false),
    [attempt, setAttempt] = useState(0);
  const onReady = useCallback(() => setReady(true), []);
  const gpuFailed = useCallback(() => {
    setReady(false);
    setMode("software");
  }, []);
  const softwareFailed = useCallback(() => {
    setReady(false);
    setMode("image");
  }, []);
  useEffect(() => onModeChange(ready), [ready, onModeChange]);
  useEffect(() => {
    if (!render3D || mode !== "pending") return;
    try {
      // Never deliberately lose a context during capability detection.
      const context = document
        .createElement("canvas")
        .getContext("webgl2", { failIfMajorPerformanceCaveat: false, powerPreference: "default" });
      setMode(context ? "webgl" : "software");
    } catch {
      setMode("software");
    }
  }, [render3D, mode, attempt]);
  useEffect(() => {
    if (mode !== "webgl" || ready) return;
    const timer = setTimeout(gpuFailed, 45000);
    return () => clearTimeout(timer);
  }, [mode, ready, gpuFailed]);
  return (
    <div
      className="studio-renderer"
      data-renderer={ready ? mode : "loading"}
      role="group"
      aria-label="Interactive twelve-room architectural skills studio"
    >
      {!ready && (
        <div className="studio-rendered-preview">
          <img
            className="studio-loading-image"
            src={studioAsset + "overview.webp"}
            alt="Architectural skills studio with twelve furnished rooms."
            draggable={false}
          />
          <p className="studio-preview-status">
            {mode === "image"
              ? "Interactive view could not start."
              : "Opening your interactive 3D studio…"}
          </p>
          {mode === "image" && (
            <button
              className="studio-retry"
              onClick={() => {
                setAttempt((v) => v + 1);
                setMode("pending");
              }}
            >
              Retry interactive 3D
            </button>
          )}
        </div>
      )}
      {mode === "webgl" && (
        <div className="studio-live-model" inert={!ready}>
          <StudioBoundary key={"gpu" + attempt} onFailure={gpuFailed}>
            <Suspense fallback={null}>
              <StudioModel {...props} onReady={onReady} onUnavailable={gpuFailed} />
            </Suspense>
          </StudioBoundary>
        </div>
      )}
      {mode === "software" && (
        <div className="studio-live-model" inert={!ready}>
          <StudioBoundary key={"cpu" + attempt} onFailure={softwareFailed}>
            <Suspense fallback={null}>
              <SoftwareStudio {...props} onReady={onReady} onUnavailable={softwareFailed} />
            </Suspense>
          </StudioBoundary>
        </div>
      )}
    </div>
  );
}
