"use client";

import type { InteractiveTool } from "@/types/tool";

interface ContinueLearningProps {
  tool: InteractiveTool;
  onSelect: (prompt: string) => void;
}

interface Action {
  emoji: string;
  label: string;
  /** Receives the current tool title so each prompt is topic-aware. */
  buildPrompt: (title: string) => string;
}

const ACTIONS: Action[] = [
  {
    emoji: "📖",
    label: "Explain with Examples",
    buildPrompt: (t) =>
      `Explain "${t}" with clear, concrete real-world examples. Generate flashcards.`,
  },
  {
    emoji: "🎯",
    label: "Interview Questions",
    buildPrompt: (t) =>
      `Generate a quiz of common technical interview questions about "${t}".`,
  },
  {
    emoji: "🧩",
    label: "Practice Problems",
    buildPrompt: (t) =>
      `Create practice problems and exercises for "${t}". Generate a quiz.`,
  },
  {
    emoji: "⚠️",
    label: "Common Mistakes",
    buildPrompt: (t) =>
      `What are the most common mistakes and misconceptions about "${t}"? Generate flashcards.`,
  },
  {
    emoji: "🌍",
    label: "Real-world Applications",
    buildPrompt: (t) =>
      `Explain real-world applications and use-cases of "${t}" with examples. Generate flashcards.`,
  },
  {
    emoji: "🚀",
    label: "Advanced Concepts",
    buildPrompt: (t) =>
      `Cover the advanced and nuanced aspects of "${t}" for an experienced learner. Generate flashcards.`,
  },
];

export default function ContinueLearning({
  tool,
  onSelect,
}: ContinueLearningProps) {
  return (
    <div
      className="animate-fade-up mt-8 overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 border-b px-5 py-4"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md text-sm"
          style={{
            background: "linear-gradient(135deg,#7c3aed,#6366f1)",
          }}
          aria-hidden="true"
        >
          ✦
        </div>
        <p className="text-sm font-semibold">
          Your study material is ready!{" "}
          <span className="font-normal text-muted-foreground">
            Continue Learning
          </span>
        </p>
      </div>

      {/* Action chips */}
      <div className="flex flex-wrap gap-2 p-4">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => onSelect(action.buildPrompt(tool.title))}
            className="
              flex items-center gap-1.5
              rounded-full border border-white/[0.08] bg-white/[0.03]
              px-3.5 py-2 text-xs font-medium text-muted-foreground
              transition-all duration-150
              hover:-translate-y-px hover:border-violet-500/30
              hover:bg-violet-500/[0.08] hover:text-violet-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              active:scale-95
            "
          >
            <span aria-hidden="true">{action.emoji}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
