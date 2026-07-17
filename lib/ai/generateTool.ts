import OpenAI from "openai";
import { toolSchema } from "@/lib/schemas/toolSchema";
import type { InteractiveTool } from "@/types/tool";
import { SYSTEM_PROMPT } from "./systemPrompt";
import { REQUEST_TIMEOUT_MS } from "@/utils/constants";

// ── Startup validation ────────────────────────────────────────────────────────
// Fail loudly at module load time rather than silently at runtime with a
// non-null assertion. The API key is read once; if it is missing the server
// will refuse to start, which is the correct behaviour.
const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  throw new Error("Missing OPENROUTER_API_KEY");
}

const client = new OpenAI({
  apiKey,
  baseURL: "https://openrouter.ai/api/v1",
});

/**
 * Sends `prompt` to Gemini, strips any accidental markdown fences from the
 * response, parses it as JSON, and validates it against the Zod toolSchema.
 *
 * Throws a descriptive Error on every failure path so the API route can map
 * it to the right HTTP status code without inspecting message strings.
 */
export async function generateTool(prompt: string): Promise<InteractiveTool> {
  // ── 1. Call Gemini with a timeout ───────────────────────────────────────────
  // AbortController lets us cancel the underlying fetch if Gemini takes too
  // long, so the user sees a clean error instead of an indefinite spinner.
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  let rawText: string;

  try {
  const response = await client.chat.completions.create({
  model: "google/gemini-2.5-flash",
  messages: [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.4,
  max_tokens: 2048,
});

rawText = response.choices[0]?.message?.content ?? "";
} catch (err) {
  // Print the complete error to the terminal
  console.error("=== GEMINI ERROR ===");
  console.error(err);

  const rawMessage = err instanceof Error ? err.message : String(err);
  console.error("=== RAW MESSAGE ===");
  console.error(rawMessage);

  // Distinguish a timeout
  if (controller.signal.aborted) {
    throw new GeminiApiError(
      `The request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds. Please try again.`
    );
  }

  // Show the parsed user-friendly error
  const humanMessage = parseGeminiError(rawMessage);
  console.error("=== PARSED MESSAGE ===");
  console.error(humanMessage);

  throw new GeminiApiError(humanMessage);
} finally {
  clearTimeout(timeoutId);
}
  // ── 2. Guard against empty response ────────────────────────────────────────
  if (!rawText.trim()) {
    throw new ValidationError(
      "The AI returned an empty response. Please try again."
    );
  }

  // ── 3. Strip accidental markdown fences ─────────────────────────────────────
  // Gemini occasionally wraps output in ```json … ``` despite instructions.
  const stripped = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  // ── 4. Parse JSON ───────────────────────────────────────────────────────────
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    throw new ValidationError(
      "The AI returned malformed JSON. Please retry — the model occasionally makes formatting mistakes."
    );
  }

  // ── 5. Validate with Zod ────────────────────────────────────────────────────
  const validation = toolSchema.safeParse(parsed);

  if (!validation.success) {
    const issues = validation.error.issues
      .map((issue) => `${issue.path.join(".")} — ${issue.message}`)
      .join("; ");
    throw new ValidationError(`AI response failed validation: ${issues}`);
  }

  return validation.data;
}

// ── Gemini error parser ───────────────────────────────────────────────────────
// The SDK throws with the raw API JSON body as the error message string.
// This helper extracts a clean, user-facing sentence from it.
function parseGeminiError(raw: string): string {
  try {
    // The SDK sometimes wraps the JSON after a prefix like "Got error: {...}"
    const jsonStart = raw.indexOf("{");
    const jsonEnd = raw.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) return `Gemini API error: ${raw}`;

    const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1)) as {
      error?: {
        code?: number;
        message?: string;
        status?: string;
        details?: Array<{ "@type"?: string; retryDelay?: string }>;
      };
    };

    const code = parsed.error?.code;
    const status = parsed.error?.status;

    if (code === 429 || status === "RESOURCE_EXHAUSTED") {
      // Try to surface the retry delay if the API provided one.
      const retryInfo = parsed.error?.details?.find(
        (d) => d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
      );
      const delay = retryInfo?.retryDelay
        ? ` Please try again in ${retryInfo.retryDelay}.`
        : " Please try again in a moment.";
      return `Gemini API quota exceeded.${delay}`;
    }

    if (code === 400) return "The request was rejected by Gemini (invalid input). Please rephrase your prompt.";
    if (code === 401 || code === 403) return "Gemini API key is invalid or lacks permission. Check your .env.local file.";
    if (code === 503) return "Gemini is temporarily unavailable. Please try again shortly.";

    // Fall back to the message field if present, otherwise the raw string.
    return parsed.error?.message ?? `Gemini API error: ${raw}`;
  } catch {
    // JSON.parse failed — just surface the raw message.
    return `Gemini API error: ${raw}`;
  }
}

// ── Typed error classes ───────────────────────────────────────────────────────
// Using distinct error classes lets the API route classify errors structurally
// rather than by fragile string matching.

export class GeminiApiError extends Error {
  readonly type = "gemini_api_error" as const;
  constructor(message: string) {
    super(message);
    this.name = "GeminiApiError";
  }
}

export class ValidationError extends Error {
  readonly type = "validation_error" as const;
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
