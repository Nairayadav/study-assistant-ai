"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizTool as QuizToolType } from "@/types/tool";

interface Props {
  tool: QuizToolType;
}

type AnswerState = { selected: string; submitted: boolean };

/** Animates from 0 to `target` over `duration` ms. */
function useCountUp(target: number, duration = 900, active = false) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;

    function tick(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const pct = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - pct, 3);
      setValue(Math.round(eased * target));
      if (pct < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration, active]);

  return value;
}

export default function QuizTool({ tool }: Props) {
  const { questions } = tool.data;
  const total = questions.length;

  const [answers,     setAnswers]     = useState<Record<number, AnswerState>>({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [finished,    setFinished]    = useState(false);

  const currentAnswer = answers[activeIndex];
  const isSubmitted   = currentAnswer?.submitted ?? false;

  const score = useMemo(
    () => questions.reduce((acc, q, i) => {
      const a = answers[i];
      return a?.submitted && a.selected === q.correctAnswer ? acc + 1 : acc;
    }, 0),
    [answers, questions]
  );

  const progressPct = Math.round(((activeIndex + 1) / total) * 100);

  function handleSelect(option: string) {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [activeIndex]: { selected: option, submitted: false } }));
  }

  function handleSubmit() {
    if (!currentAnswer?.selected || isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [activeIndex]: { ...prev[activeIndex], submitted: true } }));
  }

  function handleNext() {
    if (activeIndex < total - 1) setActiveIndex((i) => i + 1);
    else setFinished(true);
  }

  function handleReset() {
    setAnswers({});
    setActiveIndex(0);
    setFinished(false);
  }

  /* ── Results screen ──────────────────────────────────────────────────────── */
  if (finished) {
    const pct        = Math.round((score / total) * 100);
    const passed     = pct >= 60;
    const wrongCount = total - score;

    return (
      <ResultsScreen
        tool={tool}
        score={score}
        total={total}
        pct={pct}
        passed={passed}
        wrongCount={wrongCount}
        answers={answers}
        onReset={handleReset}
      />
    );
  }

  /* ── Active question ─────────────────────────────────────────────────────── */
  const question  = questions[activeIndex];
  const isCorrect = isSubmitted && currentAnswer?.selected === question.correctAnswer;

  return (
    <section className="animate-fade-up mt-8 w-full" aria-label="Quiz">

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{tool.title}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{tool.description}</p>
          </div>
          <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {activeIndex + 1} / {total}
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`Question ${activeIndex + 1} of ${total}`}
          aria-label="Quiz progress"
          className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]"
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%`, background: "linear-gradient(90deg,#7c3aed,#6366f1,#3b82f6)" }}
          />
        </div>
      </div>

      {/* Question */}
      <p id="question-text" className="text-base font-semibold leading-snug sm:text-lg">
        {question.question}
      </p>

      {/* Options */}
      <div role="radiogroup" aria-labelledby="question-text" className="mt-4 space-y-2.5">
        {question.options.map((option) => {
          const isSelected = currentAnswer?.selected === option;
          const isRight    = option === question.correctAnswer;

          let bg     = "rgba(255,255,255,0.02)";
          let border = "rgba(255,255,255,0.08)";
          let textCls = "text-foreground";

          if (!isSubmitted && isSelected) {
            bg = "rgba(124,58,237,0.1)"; border = "rgba(124,58,237,0.4)";
          } else if (isSubmitted) {
            if (isRight)         { bg = "rgba(34,197,94,0.08)";  border = "rgba(34,197,94,0.35)";  textCls = "text-green-300"; }
            else if (isSelected) { bg = "rgba(239,68,68,0.08)";  border = "rgba(239,68,68,0.35)";  textCls = "text-red-300";   }
            else                 { textCls = "text-muted-foreground"; }
          }

          return (
            <button
              key={option}
              role="radio"
              aria-checked={isSelected}
              disabled={isSubmitted}
              onClick={() => handleSelect(option)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-sm font-medium transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSubmitted ? "cursor-default" : "cursor-pointer hover:-translate-y-px",
                !isSubmitted && !isSelected && "hover:border-white/20 hover:bg-white/[0.05]",
                textCls
              )}
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <span>{option}</span>
              {isSubmitted && isRight    && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" aria-hidden="true" />}
              {isSubmitted && isSelected && !isRight && <XCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {isSubmitted && (
        <div
          role="status"
          aria-live="polite"
          className="animate-scale-in mt-4 rounded-xl p-4 text-sm"
          style={{
            background: isCorrect ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
            border:     isCorrect ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <p className={cn("mb-1 font-semibold", isCorrect ? "text-green-400" : "text-red-400")}>
            {isCorrect ? "Correct!" : `Correct answer: ${question.correctAnswer}`}
          </p>
          <p className="text-muted-foreground">{question.explanation}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex gap-2.5">
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!currentAnswer?.selected}
            className="flex-1 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
            style={{
              background:  !currentAnswer?.selected ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#6366f1)",
              boxShadow:   currentAnswer?.selected ? "0 0 20px rgba(124,58,237,0.25)" : "none",
            }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 active:scale-95"
            style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)", boxShadow: "0 0 20px rgba(124,58,237,0.25)" }}
          >
            {activeIndex < total - 1 ? "Next Question →" : "See Results"}
          </button>
        )}

        <button
          onClick={handleReset}
          aria-label="Restart quiz"
          className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-muted-foreground transition-all duration-150 hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

/* ── Results screen (extracted for clarity) ──────────────────────────────── */

function ResultsScreen({
  tool, score, total, pct, passed, wrongCount, answers, onReset,
}: {
  tool: QuizToolType;
  score: number; total: number; pct: number; passed: boolean;
  wrongCount: number;
  answers: Record<number, AnswerState>;
  onReset: () => void;
}) {
  const { questions } = tool.data;

  // Count-up animation — starts as soon as this screen mounts
  const animatedScore = useCountUp(score, 900, true);
  const animatedPct   = useCountUp(pct,   900, true);

  return (
    <section className="animate-fade-up mt-8 w-full" aria-label="Quiz results">

      <h2 className="text-lg font-semibold">{tool.title}</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{tool.description}</p>

      {/* ── Score hero ──────────────────────────────────────────────────── */}
      <div
        className="mt-6 overflow-hidden rounded-2xl p-8 text-center"
        style={{
          background: passed ? "linear-gradient(135deg,rgba(34,197,94,0.08),rgba(16,185,129,0.06))" : "linear-gradient(135deg,rgba(239,68,68,0.08),rgba(220,38,38,0.06))",
          border:     passed ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(239,68,68,0.2)",
        }}
        role="status"
        aria-label={`You scored ${score} out of ${total}, ${pct} percent`}
      >
        <p className="text-sm font-medium text-muted-foreground" aria-hidden="true">
          {passed ? "🎉 Congratulations!" : "Keep practising!"}
        </p>

        {/* Animated score */}
        <p className="mt-2 text-6xl font-bold tracking-tight tabular-nums" aria-hidden="true">
          {animatedScore}
          <span className="text-3xl text-muted-foreground">/{total}</span>
        </p>
        <p className="mt-2 text-3xl font-semibold tabular-nums" aria-hidden="true">
          {animatedPct}%
        </p>

        {/* Quick stats row */}
        <div className="mt-5 flex items-center justify-center gap-6 text-sm">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-green-400">{score}</span>
            <span className="text-xs text-muted-foreground">Correct</span>
          </div>
          <div className="h-8 w-px bg-white/10" aria-hidden="true" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-red-400">{wrongCount}</span>
            <span className="text-xs text-muted-foreground">Wrong</span>
          </div>
          <div className="h-8 w-px bg-white/10" aria-hidden="true" />
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-lg font-bold text-muted-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>
      </div>

      {/* ── Per-question review ─────────────────────────────────────────── */}
      <ol className="mt-6 space-y-3" aria-label="Question review">
        {questions.map((q, i) => {
          const a           = answers[i];
          const wasAnswered = Boolean(a?.submitted);
          const correct     = wasAnswered && a.selected === q.correctAnswer;

          return (
            <li
              key={i}
              className="rounded-xl p-4 text-sm"
              style={{
                background: correct ? "rgba(34,197,94,0.05)"  : "rgba(239,68,68,0.05)",
                border:     correct ? "1px solid rgba(34,197,94,0.15)" : "1px solid rgba(239,68,68,0.15)",
              }}
            >
              <p className="font-medium">{i + 1}. {q.question}</p>
              {wasAnswered ? (
                <p className="mt-1 text-muted-foreground">
                  Your answer:{" "}
                  <span className={cn("font-semibold", correct ? "text-green-400" : "text-red-400")}>
                    {a.selected}
                  </span>
                </p>
              ) : (
                <p className="mt-1 italic text-muted-foreground">Not answered</p>
              )}
              {!correct && (
                <p className="mt-0.5 text-muted-foreground">
                  Correct: <span className="font-semibold text-green-400">{q.correctAnswer}</span>
                </p>
              )}
              <p className="mt-1 italic text-muted-foreground/70">{q.explanation}</p>
            </li>
          );
        })}
      </ol>

      {/* Restart */}
      <button
        onClick={onReset}
        className="mt-6 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-150 hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        Try Again
      </button>
    </section>
  );
}
