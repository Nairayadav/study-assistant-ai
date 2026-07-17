export const APP_NAME = "AI Study Assistant";

/** Maximum characters allowed in the prompt textarea. */
export const PROMPT_MAX_LENGTH = 4000;

/**
 * How long (ms) to wait for the Gemini API before aborting the request.
 * 30 s is generous enough for cold-start quota delays while still giving
 * the user timely feedback instead of an indefinite spinner.
 */
export const REQUEST_TIMEOUT_MS = 30_000;
