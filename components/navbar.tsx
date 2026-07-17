import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/utils/constants";
import { ModeToggle } from "./theme-toggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {/* Icon mark */}
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6366f1, #3b82f6)",
              boxShadow: "0 0 16px rgba(124, 58, 237, 0.4)",
            }}
          >
            <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden="true" />
          </div>

          {/* Wordmark */}
          <span className="text-gradient-brand text-base font-bold tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        {/* ── Right side ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2.5">
          {/* Gemini badge — desktop only */}
          <div className="hidden items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-3 py-1 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" aria-hidden="true" />
            <span className="text-xs font-medium text-violet-300">
              Powered by Gemini AI
            </span>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
