"use client";

import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type ToolType   = "Auto" | "Flashcards" | "Quiz";

interface GeneratorControlsProps {
  difficulty: Difficulty;
  toolType: ToolType;
  onDifficultyChange: (d: Difficulty) => void;
  onToolTypeChange: (t: ToolType) => void;
  disabled: boolean;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const DIFFICULTIES: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];
const TOOL_TYPES: { value: ToolType; emoji: string }[] = [
  { value: "Auto",       emoji: "✨" },
  { value: "Flashcards", emoji: "📚" },
  { value: "Quiz",       emoji: "❓" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function GeneratorControls({
  difficulty,
  toolType,
  onDifficultyChange,
  onToolTypeChange,
  disabled,
}: GeneratorControlsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">

      {/* ── Difficulty ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Difficulty
        </span>
        <div
          className="flex rounded-xl p-0.5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          role="group"
          aria-label="Select difficulty"
        >
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => onDifficultyChange(d)}
              disabled={disabled}
              aria-pressed={difficulty === d}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-40",
                difficulty === d
                  ? "text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={
                difficulty === d
                  ? { background: "linear-gradient(135deg, #7c3aed, #6366f1)" }
                  : {}
              }
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tool type ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
          Generate
        </span>
        <div
          className="flex rounded-xl p-0.5"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          role="group"
          aria-label="Select output type"
        >
          {TOOL_TYPES.map(({ value, emoji }) => (
            <button
              key={value}
              onClick={() => onToolTypeChange(value)}
              disabled={disabled}
              aria-pressed={toolType === value}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-40",
                toolType === value
                  ? "text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              style={
                toolType === value
                  ? { background: "linear-gradient(135deg, #7c3aed, #6366f1)" }
                  : {}
              }
            >
              <span aria-hidden="true">{emoji}</span>
              {value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Prompt builder ────────────────────────────────────────────────────────────

/**
 * Wraps the user's raw prompt with difficulty + tool-type context.
 * This is the ONLY place the prompt is modified — the API and Gemini
 * integration are completely untouched.
 */
export function buildPrompt(
  rawPrompt: string,
  difficulty: Difficulty,
  toolType: ToolType
): string {
  const parts: string[] = [rawPrompt.trim()];

  if (toolType === "Flashcards") {
    parts.push("Generate only Flashcards for this topic.");
  } else if (toolType === "Quiz") {
    parts.push("Generate only Quiz questions for this topic.");
  }
  // "Auto" → no instruction; Gemini decides

  parts.push(`Target this for a ${difficulty} level learner.`);

  return parts.join(" ");
}
