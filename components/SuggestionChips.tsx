"use client";

import { useState, useCallback } from "react";
import { Shuffle } from "lucide-react";
import { SUGGESTIONS } from "@/utils/suggestions";

interface SuggestionChipsProps {
  onSelect: (prompt: string) => void;
  /** How many chips to show at once */
  count?: number;
  showLabel?: boolean;
}

export default function SuggestionChips({
  onSelect,
  count = 6,
  showLabel = true,
}: SuggestionChipsProps) {
  const [offset, setOffset] = useState(0);

  const visible = SUGGESTIONS.slice(offset, offset + count);

  const shuffle = useCallback(() => {
    setOffset((prev) => (prev + count) % SUGGESTIONS.length);
  }, [count]);

  return (
    <div>
      {showLabel && (
        <div className="mb-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">✨ Try one of these</span>
          <button
            onClick={shuffle}
            aria-label="Shuffle suggestions"
            className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted-foreground/60 transition-colors hover:bg-white/5 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Shuffle className="h-3 w-3" aria-hidden="true" />
            Shuffle
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {visible.map((s) => (
          <button
            key={s.label}
            onClick={() => onSelect(s.prompt)}
            className="
              animate-scale-in
              flex items-center gap-1.5
              rounded-full border border-white/[0.08] bg-white/[0.03]
              px-3 py-1.5 text-xs font-medium text-muted-foreground
              transition-all duration-150
              hover:-translate-y-px hover:border-violet-500/30
              hover:bg-violet-500/[0.08] hover:text-violet-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
              active:scale-95
            "
          >
            <span aria-hidden="true">{s.emoji}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
