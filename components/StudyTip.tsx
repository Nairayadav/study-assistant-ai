"use client";

import { useEffect, useState } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";
import { STUDY_TIPS } from "@/utils/studyTips";

/** Picks a random index that differs from the current one. */
function nextIndex(current: number, total: number): number {
  if (total <= 1) return 0;
  let next = Math.floor(Math.random() * total);
  if (next === current) next = (next + 1) % total;
  return next;
}

export default function StudyTip() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  // Pick a random tip on mount (client-only to avoid hydration mismatch).
  useEffect(() => {
    setIdx(Math.floor(Math.random() * STUDY_TIPS.length));
  }, []);

  function rotate() {
    // Fade out → change → fade in
    setVisible(false);
    setTimeout(() => {
      setIdx((i) => nextIndex(i, STUDY_TIPS.length));
      setVisible(true);
    }, 200);
  }

  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3"
      style={{
        background: "rgba(124,58,237,0.04)",
        border: "1px solid rgba(124,58,237,0.1)",
      }}
    >
      <Lightbulb
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400"
        aria-hidden="true"
      />

      <p
        className="flex-1 text-xs leading-relaxed text-muted-foreground transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <span className="font-medium text-violet-400">Study tip: </span>
        {STUDY_TIPS[idx]}
      </p>

      <button
        onClick={rotate}
        aria-label="Show another study tip"
        className="shrink-0 rounded p-0.5 text-muted-foreground/40 transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RefreshCw className="h-3 w-3" aria-hidden="true" />
      </button>
    </div>
  );
}
