"use client";

import { Clock, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "asa_recent_prompts";

interface RecentPromptsProps {
  recents: string[];
  onSelect: (prompt: string) => void;
}

export default function RecentPrompts({ recents, onSelect }: RecentPromptsProps) {
  const [items, setItems] = useState(recents);

  // Sync if parent updates (e.g. new item added after generation)
  useEffect(() => {
    setItems(recents);
  }, [recents]);

  const remove = useCallback((prompt: string, e: React.MouseEvent) => {
    e.stopPropagation(); // don't trigger onSelect
    setItems((prev) => {
      const next = prev.filter((p) => p !== prompt);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <div>
      {/* Label */}
      <div className="mb-3 flex items-center gap-1.5">
        <Clock className="h-3 w-3 text-muted-foreground/50" aria-hidden="true" />
        <span className="text-xs text-muted-foreground/60">Recent</span>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2">
        {items.map((p) => {
          // Truncate long prompts for display
          const display = p.length > 48 ? p.slice(0, 46) + "…" : p;

          return (
            <div key={p} className="group relative flex">
              <button
                onClick={() => onSelect(p)}
                title={p}
                className="
                  flex items-center gap-1.5 rounded-full pr-7
                  border border-white/[0.07] bg-white/[0.02]
                  pl-3 py-1.5 text-xs text-muted-foreground/70
                  transition-all duration-150
                  hover:-translate-y-px hover:border-violet-500/25
                  hover:bg-violet-500/[0.06] hover:text-violet-300/80
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                  active:scale-95
                "
              >
                {display}
              </button>

              {/* Remove button — floats inside the chip on the right */}
              <button
                onClick={(e) => remove(p, e)}
                aria-label={`Remove "${display}" from recent`}
                className="
                  absolute right-1.5 top-1/2 -translate-y-1/2
                  flex h-4 w-4 items-center justify-center rounded-full
                  text-muted-foreground/30
                  opacity-0 transition-opacity duration-100
                  group-hover:opacity-100
                  hover:bg-white/10 hover:text-muted-foreground
                  focus-visible:opacity-100 focus-visible:outline-none
                "
              >
                <X className="h-2.5 w-2.5" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
