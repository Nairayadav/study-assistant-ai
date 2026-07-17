/**
 * All runtime types are derived directly from the Zod schema.
 * There is intentionally no manual interface duplication — the schema
 * IS the source of truth and TypeScript types follow from it.
 */
import type { z } from "zod";
import type { toolSchema } from "@/lib/schemas/toolSchema";

// ─── Top-level tool union ─────────────────────────────────────────────────────

export type InteractiveTool = z.infer<typeof toolSchema>;

// ─── Narrowed per-tool types ──────────────────────────────────────────────────

export type QuizTool = Extract<InteractiveTool, { toolType: "quiz" }>;
export type FlashcardTool = Extract<InteractiveTool, { toolType: "flashcards" }>;

// ─── Convenience item types ───────────────────────────────────────────────────

export type QuizQuestion = QuizTool["data"]["questions"][number];
export type Flashcard = FlashcardTool["data"]["cards"][number];
