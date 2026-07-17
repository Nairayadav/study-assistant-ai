"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, RotateCcw, Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { FlashcardTool as FlashcardToolType } from "@/types/tool";

interface Props {
  tool: FlashcardToolType;
}

export default function FlashcardTool({ tool }: Props) {
  const { cards } = tool.data;
  const total     = cards.length;

  const [index,   setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen,    setSeen]    = useState<Set<number>>(new Set([0]));

  const card      = cards[index];
  const seenCount = seen.size;
  const progress  = Math.round((seenCount / total) * 100);
  const allSeen   = seenCount === total;

  function goTo(next: number) {
    setIndex(next);
    setFlipped(false);
    setSeen((prev) => new Set(prev).add(next));
  }

  function prev()  { goTo(Math.max(0, index - 1)); }
  function next()  { goTo(Math.min(total - 1, index + 1)); }
  function reset() { setIndex(0); setFlipped(false); setSeen(new Set([0])); }

  // ── Copy helpers ────────────────────────────────────────────────────────────
  async function copyText(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied!`);
    } catch {
      toast.error("Could not copy — please copy manually.");
    }
  }

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "TEXTAREA" || tag === "INPUT") return;
      if (e.key === "ArrowLeft")                  prev();
      else if (e.key === "ArrowRight")            next();
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <section className="animate-fade-up mt-8 w-full" aria-label="Flashcard viewer">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold leading-tight">{tool.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{tool.description}</p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {index + 1} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${seenCount} of ${total} cards reviewed`}
          aria-label="Cards reviewed"
          className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]"
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg,#7c3aed,#6366f1,#3b82f6)" }}
          />
        </div>
      </div>

      {/* ── Flip card ───────────────────────────────────────────────────── */}
      <div
        className="relative h-56 w-full cursor-pointer select-none sm:h-64"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") { e.preventDefault(); setFlipped((f) => !f); }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? `Card ${index + 1} back: ${card.back}. Press Space to flip.`
            : `Card ${index + 1} front: ${card.front}. Press Space to flip.`
        }
      >
        <div
          className="relative h-full w-full transition-transform duration-500"
          style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-8 text-center"
            style={{ backfaceVisibility: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">Front</p>
            <p className="text-xl font-semibold leading-snug">{card.front}</p>
            <p className="mt-6 text-xs text-muted-foreground/40">
              Click or press <kbd className="rounded border border-white/10 bg-white/5 px-1 font-mono">Space</kbd> to reveal
            </p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl p-8 text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(99,102,241,0.08))", border: "1px solid rgba(124,58,237,0.2)", backdropFilter: "blur(12px)" }}
          >
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#a78bfa" }}>Back</p>
            <p className="text-xl font-semibold leading-snug">{card.back}</p>
          </div>
        </div>
      </div>

      {/* ── Copy row ────────────────────────────────────────────────────── */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); copyText(card.front, "Front"); }}
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 text-[11px] text-muted-foreground/60 transition-all duration-150 hover:border-white/20 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          aria-label="Copy front text"
        >
          <Copy className="h-3 w-3" aria-hidden="true" />
          Copy front
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); copyText(card.back, "Back"); }}
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1.5 text-[11px] text-muted-foreground/60 transition-all duration-150 hover:border-white/20 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
          aria-label="Copy back text"
        >
          <Copy className="h-3 w-3" aria-hidden="true" />
          Copy back
        </button>
      </div>

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className="mt-4 flex items-center justify-between gap-2">
        <NavButton onClick={prev} disabled={index === 0} aria-label="Previous card">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Prev</span>
        </NavButton>

        <div className="flex gap-1.5">
          <GhostButton onClick={() => setFlipped((f) => !f)} aria-label="Flip card">
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline text-xs">Flip</span>
          </GhostButton>
          <GhostButton onClick={reset} aria-label="Restart deck">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline text-xs">Restart</span>
          </GhostButton>
        </div>

        <NavButton onClick={next} disabled={index === total - 1} aria-label="Next card">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </NavButton>
      </div>

      {/* Keyboard hint */}
      <p className="mt-4 text-center text-xs text-muted-foreground/40">
        ← → to navigate · Space to flip
      </p>

      {/* ── Completion banner ───────────────────────────────────────────── */}
      {allSeen && (
        <div
          role="status"
          aria-live="polite"
          className="animate-scale-in mt-5 rounded-2xl p-4 text-center text-sm font-medium"
          style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(99,102,241,0.08))", border: "1px solid rgba(124,58,237,0.2)" }}
        >
          <span className="text-violet-300">✨ You&apos;ve reviewed all {total} cards! </span>
          <button
            onClick={reset}
            className="text-violet-400 underline underline-offset-2 hover:text-violet-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start over
          </button>
        </div>
      )}
    </section>
  );
}

/* ── Shared button primitives ────────────────────────────────────────────── */

function NavButton({ children, onClick, disabled, "aria-label": ariaLabel }: {
  children: React.ReactNode; onClick: () => void; disabled: boolean; "aria-label": string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95",
        disabled
          ? "cursor-not-allowed border-white/[0.04] text-muted-foreground/30"
          : "border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, "aria-label": ariaLabel }: {
  children: React.ReactNode; onClick: () => void; "aria-label": string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-150 hover:bg-white/[0.05] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
    >
      {children}
    </button>
  );
}
