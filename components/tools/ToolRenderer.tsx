import QuizTool from "./QuizTool";
import FlashcardTool from "./FlashcardTool";
import type { InteractiveTool } from "@/types/tool";

interface Props {
  tool: InteractiveTool;
}

/**
 * Dispatches a validated InteractiveTool to the correct UI component.
 * Each child receives the full tool object — no prop spreading — so adding a
 * field to the schema never requires touching this file.
 */
export default function ToolRenderer({ tool }: Props) {
  switch (tool.toolType) {
    case "quiz":
      return <QuizTool tool={tool} />;

    case "flashcards":
      return <FlashcardTool tool={tool} />;

    default:
      // Compile-time exhaustiveness check: TypeScript will error here if a new
      // toolType is added to the discriminated union but not handled above.
      tool satisfies never;
      return (
        <div
          role="alert"
          className="mt-8 rounded-xl border border-destructive/40 p-6 text-sm text-destructive"
        >
          Unsupported tool type received from the API.
        </div>
      );
  }
}
