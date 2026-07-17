"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOPIC_CATEGORIES } from "@/utils/topics";

interface TopicBrowserProps {
  onSelect: (prompt: string) => void;
}

export default function TopicBrowser({ onSelect }: TopicBrowserProps) {
  // Keep track of which category accordion is open. null = all collapsed.
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="w-full">
      {/* Section label */}
      <p className="mb-3 text-xs text-muted-foreground">📂 Browse by topic</p>

      <div className="flex flex-col gap-2">
        {TOPIC_CATEGORIES.map((cat) => {
          const isOpen = openId === cat.id;

          return (
            <div
              key={cat.id}
              className="overflow-hidden rounded-xl transition-all duration-200"
              style={{
                border: isOpen
                  ? "1px solid rgba(124,58,237,0.25)"
                  : "1px solid rgba(255,255,255,0.07)",
                background: isOpen
                  ? "rgba(124,58,237,0.05)"
                  : "rgba(255,255,255,0.02)",
              }}
            >
              {/* Category header / toggle */}
              <button
                onClick={() => toggle(cat.id)}
                aria-expanded={isOpen}
                aria-controls={`topics-${cat.id}`}
                className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-150 hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base" aria-hidden="true">
                    {cat.emoji}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {cat.name}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] tabular-nums text-muted-foreground/60">
                    {cat.topics.length}
                  </span>
                </div>

                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Topic list — slides open */}
              {isOpen && (
                <div
                  id={`topics-${cat.id}`}
                  role="list"
                  className="animate-fade-up flex flex-wrap gap-2 border-t border-white/[0.05] px-4 pb-4 pt-3"
                >
                  {cat.topics.map((topic) => (
                    <button
                      key={topic.label}
                      role="listitem"
                      onClick={() => onSelect(topic.prompt)}
                      className="
                        rounded-full border border-white/[0.08] bg-white/[0.03]
                        px-3 py-1.5 text-xs font-medium text-muted-foreground
                        transition-all duration-150
                        hover:-translate-y-px hover:border-violet-500/30
                        hover:bg-violet-500/[0.08] hover:text-violet-300
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                        active:scale-95
                      "
                    >
                      {topic.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
