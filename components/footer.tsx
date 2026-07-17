import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/utils/constants";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/[0.05]">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 px-4 py-8 sm:flex-row sm:justify-between sm:px-6">

        {/* Brand */}
        <div className="flex items-center gap-2">
          <div
            className="flex h-5 w-5 items-center justify-center rounded-md"
            style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}
          >
            <Sparkles className="h-2.5 w-2.5 text-white" aria-hidden="true" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {APP_NAME}
          </span>
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground/60">
          &copy; {year} &middot; Built with Next.js &amp; Gemini AI
        </p>
      </div>
    </footer>
  );
}
