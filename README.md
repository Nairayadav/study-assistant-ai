# AI Study Assistant

An AI-powered study assistant that transforms natural language prompts into interactive learning tools. Simply describe what you want to study, and the application generates structured educational content with a clean, responsive interface.

## Live Demo

(Add your deployed URL here)

## Features

### AI-Powered Study Tool Generation
- Generate interactive study tools from plain English prompts.
- Supports quizzes, flashcards, summaries, timelines, concept maps, and more.
- Powered by OpenRouter AI for reliable content generation.

### Smart Prompt Assistance
- Ready-to-use suggestion chips.
- Recent prompt history.
- Topic browser for quick exploration.
- Prompt validation before generation.

### Interactive Learning Dashboard
- Clean and modern dashboard.
- Continue Learning section.
- Personalized study tips.
- Organized study experience.

### Robust User Experience
- Loading indicators during AI generation.
- Error handling with recovery options.
- Empty states for better usability.
- Generation status updates.

### Export & Recovery
- Export generated study tools.
- Recover previous generation attempts.
- Better handling of interrupted AI responses.

### Modern UI
- Responsive design.
- Dark mode support.
- Clean typography.
- Smooth animations.
- Mobile-friendly interface.

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

### AI
- OpenRouter API
- OpenAI SDK
- Structured JSON Output

### Validation
- Zod Schema Validation

### Development Tools
- ESLint
- PostCSS
- npm

## Project Structure

```
app/
 ├── api/
 │    └── generate/
 ├── components/
 ├── hooks/
 ├── lib/
 │    ├── ai/
 │    ├── recovery/
 │    └── schemas/
 ├── types/
 └── utils/
```

## Installation

Clone the repository

```bash
git clone https://github.com/Nairayadav/study-assistant-ai.git
```

Go to the project folder

```bash
cd study-assistant-ai
```

Install dependencies

```bash
npm install
```

Create a `.env.local` file

```env
OPENROUTER_API_KEY=your_api_key
```

Run the development server

```bash
npm run dev
```

Open

```
http://localhost:3000
```

## Build

```bash
npm run build
```

## Future Improvements

- User authentication
- Save study history
- PDF export
- Voice input
- AI chat tutor
- Spaced repetition
- Progress analytics
- Collaborative study sessions

## Screenshots

Add screenshots of:
- Home Page
- AI Tool Generation
- Dashboard
- Generated Study Tool

## Author

**Naira Yadav**

- GitHub: https://github.com/Nairayadav
- LinkedIn: https://www.linkedin.com/in/naira-yadav-0141802a8

---

Built as part of the **FLAM Frontend Internship Assignment** using Next.js, TypeScript, Tailwind CSS, and OpenRouter AI.