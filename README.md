# 🧠 AI Study Assistant

A full-stack web application that converts any topic or notes into interactive learning tools — flashcards and quizzes — powered by the Gemini AI API. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

- **AI-Powered Tool Generation** — Paste any topic or notes; the AI decides whether to produce a flashcard deck or a multiple-choice quiz.
- **Flashcard Viewer** — 3-D flip animation, keyboard navigation (← → Space), progress tracking, and a completion banner.
- **Interactive Quiz** — Single-question flow with option selection, answer submission, instant explanations, and a final score screen with per-question review.
- **Stale-Response Protection** — Incrementing request IDs ensure a slow response never overwrites a newer one.
- **Request Timeout** — Gemini requests abort after 30 seconds so the UI never hangs indefinitely.
- **Zod Validation** — Every AI response is validated against a strict schema on both the server and client before it reaches the UI.
- **Error Handling** — Friendly messages for malformed JSON, schema failures, API errors, timeouts, and empty responses — all with a retry button.
- **Dark / Light Mode** — System-preference aware theme toggle.
- **Fully Responsive** — Works on mobile, tablet, and desktop.

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| AI | Google Gemini 2.0 Flash (`@google/genai`) |
| Validation | Zod |
| Icons | Lucide React |
| Theming | next-themes |
| Notifications | Sonner |

## 📦 Setup

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone the repository

```bash
git clone <repository-url>
cd ai-study-assistant
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp env.sample .env.local
```

Open `.env.local` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> The API key is only ever read on the server (`app/api/generate/route.ts`) and is never exposed to the browser.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🗂️ Project Structure

```
ai-study-assistant/
├── app/
│   ├── api/generate/route.ts   # POST /api/generate — calls Gemini, validates response
│   ├── layout.tsx              # Root layout (Navbar, Footer, ThemeProvider)
│   ├── page.tsx                # Homepage — prompt input + tool output
│   └── globals.css
├── components/
│   ├── PromptInput.tsx         # Textarea + submit form
│   ├── LoadingState.tsx        # Spinner shown while waiting for Gemini
│   ├── ErrorState.tsx          # Error banner with retry button
│   ├── EmptyState.tsx          # Placeholder before first generation
│   └── tools/
│       ├── ToolRenderer.tsx    # Dispatches to the correct tool component
│       ├── FlashcardTool.tsx   # Flip-card UI
│       └── QuizTool.tsx        # Multiple-choice quiz UI
├── lib/
│   ├── ai/
│   │   ├── generateTool.ts     # Gemini call, JSON parsing, Zod validation
│   │   └── systemPrompt.ts     # LLM system instruction
│   └── schemas/
│       └── toolSchema.ts       # Zod discriminated-union schema
├── types/
│   └── tool.ts                 # TypeScript types derived from Zod schema
└── utils/
    └── constants.ts            # APP_NAME, PROMPT_MAX_LENGTH, REQUEST_TIMEOUT_MS
```

## 🔄 Data Flow

```
User enters topic or notes
        ↓
POST /api/generate  { prompt }
        ↓
Gemini 2.0 Flash
        ↓
Strip markdown fences → JSON.parse()
        ↓
Zod validation (toolSchema)
        ↓
Return { toolType, title, description, data }
        ↓
Client-side Zod re-validation
        ↓
ToolRenderer → FlashcardTool | QuizTool
```

## 📸 Screenshots

| Homepage | Flashcards | Quiz |
|---|---|---|
| ![Homepage](public/homepage.png) | _(flashcard screenshot)_ | _(quiz screenshot)_ |

## 🚀 Deployment

### Vercel (recommended)

1. Push to GitHub.
2. Import the repository on [vercel.com](https://vercel.com).
3. Add `GEMINI_API_KEY` in **Settings → Environment Variables**.
4. Deploy.

### Manual

```bash
npm run build
npm start
```

## 📄 License

MIT

---

**Made with ❤️ by Ankit Ydv**
