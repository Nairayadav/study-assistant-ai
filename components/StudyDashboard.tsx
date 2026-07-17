"use client";

import { useMemo } from "react";
import { BookOpen, HelpCircle, Clock, Target, Brain } from "lucide-react";
import type { InteractiveTool } from "@/types/tool";
import type { Difficulty } from "./GeneratorControls";

interface StudyDashboardProps {
  tool: InteractiveTool;
  difficulty: Difficulty;
}

interface StatCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}

export default function StudyDashboard({ tool, difficulty }: StudyDashboardProps) {
  const stats = useMemo<StatCard[]>(() => {
    const isFlashcards = tool.toolType === "flashcards";
    const isQuiz = tool.toolType === "quiz";

    // Count items
    const flashcardCount = isFlashcards ? tool.data.cards.length : 0;
    const quizCount      = isQuiz       ? tool.data.questions.length : 0;

    // Word count across all content
    let wordCount = 0;
    if (isFlashcards) {
      tool.data.cards.forEach((c) => {
        wordCount += c.front.split(/\s+/).length + c.back.split(/\s+/).length;
      });
    } else if (isQuiz) {
      tool.data.questions.forEach((q) => {
        wordCount +=
          q.question.split(/\s+/).length +
          q.explanation.split(/\s+/).length +
          q.options.reduce((s, o) => s + o.split(/\s+/).length, 0);
      });
    }

    // Reading time: ~200 wpm
    const readingMins = Math.max(1, Math.round(wordCount / 200));

    // Key concepts: title words as a rough proxy, capped at 5
    const concepts = tool.title
      .split(/\s+/)
      .filter((w) => w.length > 3)
      .slice(0, 5);

    return [
      isFlashcards && {
        icon: <BookOpen className="h-4 w-4" />,
        label: "Flashcards",
        value: flashcardCount,
        sub: "cards to review",
      },
      isQuiz && {
        icon: <HelpCircle className="h-4 w-4" />,
        label: "Questions",
        value: quizCount,
        sub: "quiz questions",
      },
      {
        icon: <Clock className="h-4 w-4" />,
        label: "Est. Study Time",
        value: `${readingMins} min`,
        sub: `~${wordCount} words`,
      },
      {
        icon: <Target className="h-4 w-4" />,
        label: "Difficulty",
        value: difficulty,
        sub: "selected level",
      },
      {
        icon: <Brain className="h-4 w-4" />,
        label: "Key Concepts",
        value: concepts.length,
        sub: concepts.join(", ") || tool.title,
      },
    ].filter(Boolean) as StatCard[];
  }, [tool, difficulty]);

  return (
    <div className="animate-fade-up mb-6 mt-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/50">
        Study Overview
      </p>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <div
            key={i}
            className="animate-scale-in flex flex-col gap-2 rounded-xl p-3.5"
            style={{
              animationDelay: `${i * 60}ms`,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-1.5 text-violet-400">
              {s.icon}
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                {s.label}
              </span>
            </div>
            <p className="text-lg font-bold leading-none text-foreground">{s.value}</p>
            {s.sub && (
              <p className="truncate text-[10px] text-muted-foreground/50" title={s.sub}>
                {s.sub}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
