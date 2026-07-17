"use client";

import { forwardRef, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { PROMPT_MAX_LENGTH } from "@/utils/constants";
import SuggestionChips from "./SuggestionChips";
import TopicBrowser from "./TopicBrowser";
import RecentPrompts from "./RecentPrompts";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSuggestionSelect: (prompt: string) => void;
  loading: boolean;
  validationMessage: string | null;
  recents: string[];
}

/**
 * Forward the textarea ref to the parent so page.tsx can focus it
 * with the Ctrl+K keyboard shortcut without drilling an extra prop.
 */
const PromptInput = forwardRef<HTMLTextAreaElement, PromptInputProps>(
  function PromptInput(
    { value, onChange, onSubmit, onSuggestionSelect, loading, validationMessage, recents },
    ref
  ) {
    const remaining  = PROMPT_MAX_LENGTH - value.length;
    const isOverLimit = remaining < 0;

    /** Auto-resize textarea height to fit content */
    useEffect(() => {
      const el = (ref as React.RefObject<HTMLTextAreaElement>)?.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
    }, [value, ref]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
    }

    function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      onSubmit();
    }

    return (
      <form
        onSubmit={handleSubmit}
        aria-label="Generate a learning tool"
        noValidate
        className="flex flex-col gap-4"
      >
        {/* ── Glass card ────────────────────────────────────────────────── */}
        <div
          className="focus-glow glass overflow-hidden rounded-2xl transition-all duration-200"
          style={{ border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <textarea
            ref={ref}
            id="prompt-input"
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={PROMPT_MAX_LENGTH}
            aria-label="Topic or notes"
            aria-describedby="prompt-hint prompt-counter"
            aria-invalid={validationMessage !== null ? true : undefined}
            aria-errormessage={validationMessage !== null ? "prompt-error" : undefined}
            placeholder={
              "Describe any topic or paste your notes...\n\nExamples:\n• Explain Binary Search Trees\n• Flashcards for Operating Systems\n• Quiz on DBMS Normalization"
            }
            className="
              w-full resize-none bg-transparent px-5 pt-5
              pb-3 text-sm leading-relaxed text-foreground
              placeholder:text-muted-foreground/40
              focus:outline-none
              disabled:cursor-not-allowed disabled:opacity-50
            "
            style={{ minHeight: "140px" }}
          />

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/[0.05] px-4 py-3">
            <div className="flex items-center gap-3">
              <span
                id="prompt-hint"
                className="hidden select-none text-xs text-muted-foreground/50 sm:block"
              >
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">Ctrl</kbd>
                {" + "}
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>
                {" to generate · "}
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">Ctrl</kbd>
                {" + "}
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">K</kbd>
                {" to focus · "}
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
                {" to clear"}
              </span>
              <span
                id="prompt-counter"
                aria-live="polite"
                className={`select-none text-xs tabular-nums ${
                  isOverLimit ? "font-semibold text-red-400" : "text-muted-foreground/40"
                }`}
              >
                {remaining.toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading || isOverLimit}
              className="
                flex items-center gap-2 rounded-xl px-5 py-2.5
                text-sm font-semibold text-white
                transition-all duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                disabled:cursor-not-allowed disabled:opacity-40
                active:scale-95
              "
              style={{
                background:  loading || isOverLimit ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg,#7c3aed,#6366f1)",
                boxShadow:   loading || isOverLimit ? "none" : "0 0 20px rgba(124,58,237,0.35)",
              }}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /><span>Generating…</span></>
              ) : (
                <><Sparkles className="h-4 w-4" aria-hidden="true" /><span>Generate</span></>
              )}
            </button>
          </div>
        </div>

        {/* Validation */}
        {validationMessage && (
          <p id="prompt-error" role="alert" className="animate-fade-up text-sm text-red-400">
            {validationMessage}
          </p>
        )}

        {/* Recent */}
        {!loading && recents.length > 0 && (
          <RecentPrompts recents={recents} onSelect={onSuggestionSelect} />
        )}

        {/* Chips */}
        {!loading && <SuggestionChips onSelect={onSuggestionSelect} count={6} />}

        {/* Topic browser */}
        {!loading && (
          <div className="mt-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="text-xs text-muted-foreground/40">or browse by subject</span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>
            <TopicBrowser onSelect={onSuggestionSelect} />
          </div>
        )}
      </form>
    );
  }
);

export default PromptInput;
