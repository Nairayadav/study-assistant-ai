"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Connecting to AI…",
  "Understanding your topic…",
  "Creating study content…",
  "Structuring the output…",
  "Almost finished…",
];

const STEP_DURATION_MS = 2200;

export default function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible]     = useState(true); // drives the fade

  useEffect(() => {
    if (stepIndex >= STEPS.length - 1) return; // hold on last step

    const timer = setTimeout(() => {
      // Fade out → advance → fade in
      setVisible(false);
      setTimeout(() => {
        setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
        setVisible(true);
      }, 200);
    }, STEP_DURATION_MS);

    return () => clearTimeout(timer);
  }, [stepIndex]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={STEPS[stepIndex]}
      className="animate-fade-up mt-10 w-full"
    >
      {/* ── Step indicator ──────────────────────────────────────────────── */}
      <div className="mb-8 flex flex-col items-center gap-4">

        {/* Animated dots */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="animate-bounce-dot-1 h-2 w-2 rounded-full bg-violet-500" />
          <span className="animate-bounce-dot-2 h-2 w-2 rounded-full bg-indigo-500" />
          <span className="animate-bounce-dot-3 h-2 w-2 rounded-full bg-blue-500" />
        </div>

        {/* Fading step message */}
        <p
          className="text-sm font-medium text-muted-foreground transition-opacity duration-200"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {STEPS[stepIndex]}
        </p>

        {/* Step progress pills */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width:      i === stepIndex ? "20px" : "6px",
                background: i <= stepIndex
                  ? "linear-gradient(90deg,#7c3aed,#6366f1)"
                  : "rgba(255,255,255,0.08)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Skeleton cards ──────────────────────────────────────────────── */}
      <div className="space-y-3" aria-hidden="true">
        <SkeletonBlock height="h-48" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SkeletonBlock height="h-14" />
          <SkeletonBlock height="h-14" />
          <SkeletonBlock height="h-14" />
          <SkeletonBlock height="h-14" />
        </div>
      </div>
    </div>
  );
}

function SkeletonBlock({ height }: { height: string }) {
  return (
    <div
      className={`animate-shimmer ${height} rounded-2xl`}
      style={{
        background: "rgba(139,92,246,0.04)",
        border:     "1px solid rgba(255,255,255,0.05)",
      }}
    />
  );
}
