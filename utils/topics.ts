export interface Topic {
  label: string;
  prompt: string;
}

export interface TopicCategory {
  id: string;
  emoji: string;
  name: string;
  topics: Topic[];
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: "cs",
    emoji: "📚",
    name: "Computer Science",
    topics: [
      { label: "DSA",  prompt: "Flashcards for Data Structures and Algorithms — arrays, linked lists, trees, graphs, sorting" },
      { label: "DBMS", prompt: "Quiz on Database Management Systems — normalization, transactions, indexing, SQL" },
      { label: "OS",   prompt: "Flashcards for Operating Systems — process scheduling, memory management, deadlocks, file systems" },
      { label: "CN",   prompt: "Quiz on Computer Networks — OSI model, TCP/IP, DNS, HTTP, routing protocols" },
    ],
  },
  {
    id: "aiml",
    emoji: "🤖",
    name: "AI / ML",
    topics: [
      { label: "Neural Networks",   prompt: "Flashcards for Neural Networks — perceptrons, backpropagation, activation functions, CNN, RNN" },
      { label: "Linear Regression", prompt: "Quiz on Linear Regression — cost function, gradient descent, regularization, evaluation metrics" },
    ],
  },
  {
    id: "programming",
    emoji: "💻",
    name: "Programming",
    topics: [
      { label: "Java",   prompt: "Flashcards for Java programming — OOP concepts, collections, generics, multithreading, JVM" },
      { label: "Python", prompt: "Quiz on Python programming — data types, comprehensions, decorators, generators, standard library" },
      { label: "React",  prompt: "Flashcards for React — hooks, component lifecycle, state management, context, performance optimisation" },
    ],
  },
];
