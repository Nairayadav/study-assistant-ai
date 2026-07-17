export interface Suggestion {
  emoji: string;
  label: string;
  prompt: string;
}

export const SUGGESTIONS: Suggestion[] = [
  { emoji: "🧠", label: "Binary Search Trees",    prompt: "Explain Binary Search Trees with examples" },
  { emoji: "💻", label: "Java OOP Concepts",       prompt: "Flashcards for Java Object-Oriented Programming concepts" },
  { emoji: "🌐", label: "TCP vs UDP",              prompt: "Quiz on TCP vs UDP networking protocols" },
  { emoji: "🔐", label: "SQL Injection",           prompt: "Explain SQL Injection attacks and prevention techniques" },
  { emoji: "📚", label: "OS Scheduling",           prompt: "Flashcards for Operating System CPU scheduling algorithms" },
  { emoji: "🤖", label: "Machine Learning",        prompt: "Quiz on fundamental Machine Learning concepts" },
  { emoji: "🧮", label: "Dynamic Programming",     prompt: "Explain Dynamic Programming with common patterns and examples" },
  { emoji: "⚛️",  label: "React Hooks",             prompt: "Flashcards for React Hooks — useState useEffect useCallback" },
  { emoji: "🐍", label: "Python Decorators",       prompt: "Explain Python decorators with practical examples" },
  { emoji: "☁️",  label: "Cloud Computing",         prompt: "Quiz on Cloud Computing fundamentals and service models" },
];
