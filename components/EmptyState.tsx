import { BookOpen } from "lucide-react";
import SuggestionChips from "./SuggestionChips";
import TopicBrowser from "./TopicBrowser";

interface EmptyStateProps {
  onSuggestionSelect: (prompt: string) => void;
}

export default function EmptyState({ onSuggestionSelect }: EmptyStateProps) {
  return (
    <div className="animate-fade-up mt-12 flex flex-col items-center text-center">

      {/* Icon */}
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(99,102,241,0.12))",
          border: "1px solid rgba(124,58,237,0.15)",
          boxShadow: "0 8px 32px rgba(124,58,237,0.08)",
        }}
      >
        <BookOpen className="h-7 w-7 text-violet-400" aria-hidden="true" />
      </div>

      {/* Copy */}
      <h2 className="mt-5 text-xl font-semibold tracking-tight">
        Ready to Learn?
      </h2>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Enter any topic above or pick one below to get started instantly.
      </p>

      {/* Quick chips */}
      <div className="mt-8 w-full max-w-2xl">
        <SuggestionChips onSelect={onSuggestionSelect} count={8} />
      </div>

      {/* Divider */}
      <div className="my-6 flex w-full max-w-2xl items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.05]" />
        <span className="text-xs text-muted-foreground/40">or browse by subject</span>
        <div className="h-px flex-1 bg-white/[0.05]" />
      </div>

      {/* Categorised topic browser */}
      <div className="w-full max-w-2xl text-left">
        <TopicBrowser onSelect={onSuggestionSelect} />
      </div>
    </div>
  );
}
