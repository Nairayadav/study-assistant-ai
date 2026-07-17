import { z } from "zod";

// ─── Sub-schemas ─────────────────────────────────────────────────────────────

const quizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).min(2).max(6),
  correctAnswer: z.string().min(1),
  explanation: z.string().min(1),
});

const flashcardSchema = z.object({
  front: z.string().min(1),
  back: z.string().min(1),
});

// ─── Tool schemas ─────────────────────────────────────────────────────────────

const quizToolSchema = z.object({
  version: z.literal("1.0"),
  toolType: z.literal("quiz"),
  title: z.string().min(1),
  description: z.string().min(1),
  data: z.object({
    questions: z.array(quizQuestionSchema).min(1),
  }),
});

const flashcardsToolSchema = z.object({
  version: z.literal("1.0"),
  toolType: z.literal("flashcards"),
  title: z.string().min(1),
  description: z.string().min(1),
  data: z.object({
    cards: z.array(flashcardSchema).min(1),
  }),
});

// ─── Discriminated union ──────────────────────────────────────────────────────

export const toolSchema = z.discriminatedUnion("toolType", [
  quizToolSchema,
  flashcardsToolSchema,
]);
