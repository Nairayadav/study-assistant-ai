import { NextRequest, NextResponse } from "next/server";
import { generateTool, GeminiApiError, ValidationError } from "@/lib/ai/generateTool";
import { PROMPT_MAX_LENGTH } from "@/utils/constants";

// ── Shared error response helper ──────────────────────────────────────────────
function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  // ── 1. Parse request body ───────────────────────────────────────────────────
  let prompt: string;

  try {
    const body = await req.json();
    prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  } catch {
    return errorResponse(
      'Invalid request body. Expected JSON with a "prompt" field.',
      400
    );
  }

  // ── 2. Validate prompt ──────────────────────────────────────────────────────
  if (!prompt) {
    return errorResponse(
      "Prompt is required and must be a non-empty string.",
      400
    );
  }

  if (prompt.length > PROMPT_MAX_LENGTH) {
    return errorResponse(
      `Prompt is too long. Please keep it under ${PROMPT_MAX_LENGTH} characters.`,
      400
    );
  }

  // ── 3. Generate & validate tool ─────────────────────────────────────────────
  try {
    const tool = await generateTool(prompt);
    return NextResponse.json(tool, { status: 200 });
  } catch (err) {
    // Classify errors structurally using the typed error classes —
    // no fragile string matching required.
    if (err instanceof ValidationError) {
      return errorResponse(err.message, 422);
    }
    if (err instanceof GeminiApiError) {
      return errorResponse(err.message, 502);
    }
    // Unexpected errors (e.g. programming mistakes) — log server-side for
    // debugging while sending a safe generic message to the client.
    console.error("[/api/generate] Unexpected error:", err);
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    return errorResponse(message, 500);
  }
}
