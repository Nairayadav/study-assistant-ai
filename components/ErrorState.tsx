"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="animate-fade-up relative mt-10 overflow-hidden rounded-2xl p-6"
      style={{
        background: "rgba(239,68,68,0.05)",
        border: "1px solid rgba(239,68,68,0.18)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertTriangle className="h-4.5 w-4.5 text-red-400" aria-hidden="true" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-red-400">Something went wrong</p>
          <p className="mt-1 break-words text-sm leading-relaxed text-muted-foreground">
            {message}
          </p>
        </div>
      </div>

      {/* Retry */}
      <button
        onClick={onRetry}
        className="
          mt-5 flex items-center gap-2 rounded-xl px-4 py-2
          text-sm font-medium text-red-400
          transition-all duration-150
          hover:bg-red-500/10
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50
          active:scale-95
        "
        style={{ border: "1px solid rgba(239,68,68,0.2)" }}
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
        Try Again
      </button>
    </div>
  );
}
