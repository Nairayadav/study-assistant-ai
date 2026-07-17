"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import PromptInput from "@/components/PromptInput";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import ToolRenderer from "@/components/tools/ToolRenderer";
import StudyDashboard from "@/components/StudyDashboard";
import ExportMenu from "@/components/ExportMenu";
import GeneratorControls, { buildPrompt } from "@/components/GeneratorControls";
import type { Difficulty, ToolType } from "@/components/GeneratorControls";
import StudyTip from "@/components/StudyTip";
import type { InteractiveTool } from "@/types/tool";
import { toolSchema } from "@/lib/schemas/toolSchema";
import { useRecentPrompts } from "@/hooks/useRecentPrompts";

export default function Home() {
  const [prompt,            setPrompt]            = useState("");
  const [loading,           setLoading]           = useState(false);
  const [tool,              setTool]              = useState<InteractiveTool | null>(null);
  const [error,             setError]             = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [difficulty,        setDifficulty]        = useState<Difficulty>("Intermediate");
  const [toolType,          setToolType]          = useState<ToolType>("Auto");

  const { recents, addRecent } = useRecentPrompts();

  // Stale-response guard — incrementing integer, never Date.now()
  const latestRequestId = useRef<number>(0);
  // Textarea ref for Ctrl+K focus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Global keyboard shortcuts ──────────────────────────────────────────────
  useEffect(() => {
    function handleGlobal(e: KeyboardEvent) {
      // Ctrl/Cmd + K → focus textarea
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        textareaRef.current?.focus();
        return;
      }

      // Esc → clear input (only when textarea is focused)
      if (e.key === "Escape" && document.activeElement === textareaRef.current) {
        setPrompt("");
        setValidationMessage(null);
      }
    }

    window.addEventListener("keydown", handleGlobal);
    return () => window.removeEventListener("keydown", handleGlobal);
  }, []);

  // ── Core fetch logic (extracted so both handlers share it) ─────────────────
  const runGenerate = useCallback(
    async (rawPrompt: string, requestId: number) => {
      const finalPrompt = buildPrompt(rawPrompt, difficulty, toolType);

      try {
        const res = await fetch("/api/generate", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ prompt: finalPrompt }),
        });

        if (latestRequestId.current !== requestId) return;

        const data: unknown = await res.json();

        if (!res.ok) {
          const message =
            data !== null && typeof data === "object" && "error" in data &&
            typeof (data as { error: unknown }).error === "string"
              ? (data as { error: string }).error
              : "Failed to generate tool. Please try again.";
          throw new Error(message);
        }

        if (latestRequestId.current !== requestId) return;

        const parsed = toolSchema.safeParse(data);
        if (!parsed.success) throw new Error("Unexpected response format. Please try again.");

        setTool(parsed.data);
        addRecent(rawPrompt);
        toast.success("Generated successfully!");
      } catch (err) {
        if (latestRequestId.current !== requestId) return;
        const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(msg);
      } finally {
        if (latestRequestId.current === requestId) setLoading(false);
      }
    },
    [difficulty, toolType, addRecent]
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setValidationMessage("Please enter a topic or paste your notes first.");
      return;
    }
    setValidationMessage(null);

    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);
    setTool(null);

    await runGenerate(trimmed, requestId);
  }, [prompt, runGenerate]);

  const handleSuggestionSelect = useCallback(
    (suggestion: string) => {
      setPrompt(suggestion);
      setValidationMessage(null);

      const requestId = ++latestRequestId.current;
      setLoading(true);
      setError(null);
      setTool(null);

      runGenerate(suggestion, requestId);
    },
    [runGenerate]
  );

  return (
    <main className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden">

      {/* ── Decorative layer ────────────────────────────────────────────── */}
      <AnimatedGridPattern
        className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        numSquares={60}
        maxOpacity={0.3}
        duration={3}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow  absolute -left-32 -top-32 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle,#7c3aed,transparent 70%)" }} />
        <div className="animate-float-slower absolute -right-32 top-1/3 h-96 w-96 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle,#6366f1,transparent 70%)" }} />
        <div className="animate-float-slow  absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle,#3b82f6,transparent 70%)" }} />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(124,58,237,0.06) 0%,transparent 70%)" }} />
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col px-4 pb-24 pt-16 sm:px-6">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center">
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-4 py-1.5">
            <Sparkles className="h-3 w-3 text-violet-400" aria-hidden="true" />
            <span className="text-xs font-medium text-violet-300">Powered by Gemini AI</span>
          </div>

          <h1 className="animate-fade-up-delay-1 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-gradient">AI Study</span>
            <br />
            <span className="text-foreground">Assistant</span>
          </h1>

          <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Turn any topic into interactive flashcards and quizzes using AI.
          </p>
        </div>

        {/* ── Generator controls (difficulty + tool type) ────────────────── */}
        <div className="animate-fade-up-delay-3 mt-10 flex justify-center">
          <GeneratorControls
            difficulty={difficulty}
            toolType={toolType}
            onDifficultyChange={setDifficulty}
            onToolTypeChange={setToolType}
            disabled={loading}
          />
        </div>

        {/* ── Prompt input ──────────────────────────────────────────────── */}
        <div className="animate-fade-up-delay-3 mt-6">
          <PromptInput
            ref={textareaRef}
            value={prompt}
            onChange={(v) => {
              setPrompt(v);
              if (validationMessage) setValidationMessage(null);
            }}
            onSubmit={handleGenerate}
            onSuggestionSelect={handleSuggestionSelect}
            loading={loading}
            validationMessage={validationMessage}
            recents={recents}
          />
        </div>

        {/* ── Study tip ─────────────────────────────────────────────────── */}
        {!loading && (
          <div className="mt-4">
            <StudyTip />
          </div>
        )}

        {/* ── Output area ───────────────────────────────────────────────── */}
        <div className="mt-6">
          {loading && <LoadingState />}

          {!loading && error && (
            <ErrorState message={error} onRetry={handleGenerate} />
          )}

          {!loading && !error && !tool && (
            <EmptyState onSuggestionSelect={handleSuggestionSelect} />
          )}

          {!loading && !error && tool && (
            <>
              {/* Dashboard + export toolbar */}
              <StudyDashboard tool={tool} difficulty={difficulty} />

              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground/50">
                  {tool.toolType === "flashcards"
                    ? `${tool.data.cards.length} flashcards`
                    : `${tool.data.questions.length} questions`}
                  {" · "}
                  {difficulty}
                </p>
                <ExportMenu tool={tool} />
              </div>

              <ToolRenderer tool={tool} />
            </>
          )}
        </div>

      </div>
    </main>
  );
}
