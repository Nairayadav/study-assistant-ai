"use client";

import { useState } from "react";
import { Download, FileText, Code2, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { InteractiveTool } from "@/types/tool";

interface ExportMenuProps {
  tool: InteractiveTool;
}

type Format = "md" | "txt" | "json";

// ── Formatters ────────────────────────────────────────────────────────────────

function toMarkdown(tool: InteractiveTool): string {
  const lines: string[] = [
    `# ${tool.title}`,
    ``,
    `> ${tool.description}`,
    ``,
  ];

  if (tool.toolType === "flashcards") {
    lines.push(`## Flashcards (${tool.data.cards.length})`);
    tool.data.cards.forEach((c, i) => {
      lines.push(``, `### Card ${i + 1}`, `**Front:** ${c.front}`, `**Back:** ${c.back}`);
    });
  } else {
    lines.push(`## Quiz Questions (${tool.data.questions.length})`);
    tool.data.questions.forEach((q, i) => {
      lines.push(
        ``,
        `### Question ${i + 1}`,
        `${q.question}`,
        ``,
        ...q.options.map((o) => `- ${o === q.correctAnswer ? `✅ ${o}` : o}`),
        ``,
        `**Explanation:** ${q.explanation}`
      );
    });
  }

  return lines.join("\n");
}

function toPlainText(tool: InteractiveTool): string {
  const lines: string[] = [
    tool.title.toUpperCase(),
    tool.description,
    "=".repeat(60),
    "",
  ];

  if (tool.toolType === "flashcards") {
    tool.data.cards.forEach((c, i) => {
      lines.push(`[${i + 1}] Q: ${c.front}`, `    A: ${c.back}`, "");
    });
  } else {
    tool.data.questions.forEach((q, i) => {
      lines.push(
        `[${i + 1}] ${q.question}`,
        ...q.options.map((o) => `    ${o === q.correctAnswer ? "✓" : " "} ${o}`),
        `    Explanation: ${q.explanation}`,
        ""
      );
    });
  }

  return lines.join("\n");
}

// ── Download helper ───────────────────────────────────────────────────────────

function download(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ── Component ─────────────────────────────────────────────────────────────────

const FORMATS: { value: Format; label: string; icon: React.ReactNode; mime: string }[] = [
  { value: "md",   label: "Markdown",  icon: <Hash className="h-3.5 w-3.5" />,   mime: "text/markdown" },
  { value: "txt",  label: "Text",      icon: <FileText className="h-3.5 w-3.5" />, mime: "text/plain" },
  { value: "json", label: "JSON",      icon: <Code2 className="h-3.5 w-3.5" />,   mime: "application/json" },
];

export default function ExportMenu({ tool }: ExportMenuProps) {
  const [open, setOpen] = useState(false);

  function handleExport(fmt: Format) {
    const slug = tool.title.toLowerCase().replace(/\s+/g, "-").slice(0, 40);
    let content: string;

    if (fmt === "md")   content = toMarkdown(tool);
    else if (fmt === "txt") content = toPlainText(tool);
    else content = JSON.stringify(tool, null, 2);

    const chosen = FORMATS.find((f) => f.value === fmt)!;
    download(content, `${slug}.${fmt}`, chosen.mime);
    toast.success(`Exported as ${chosen.label}`);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-muted-foreground transition-all duration-150 hover:border-white/20 hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95"
      >
        <Download className="h-3.5 w-3.5" aria-hidden="true" />
        Export
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Menu */}
          <div
            className="animate-scale-in absolute right-0 z-40 mt-1.5 w-40 overflow-hidden rounded-xl py-1"
            style={{
              background: "hsl(var(--popover))",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
            }}
          >
            {FORMATS.map((f) => (
              <button
                key={f.value}
                onClick={() => handleExport(f.value)}
                className={cn(
                  "flex w-full items-center gap-2.5 px-3.5 py-2 text-xs text-muted-foreground",
                  "transition-colors hover:bg-white/[0.05] hover:text-foreground",
                  "focus-visible:outline-none focus-visible:bg-white/[0.05]"
                )}
              >
                <span className="text-violet-400">{f.icon}</span>
                {f.label}
                <span className="ml-auto font-mono text-[10px] text-muted-foreground/40">
                  .{f.value}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
