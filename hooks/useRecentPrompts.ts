"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "asa_recent_prompts";
const MAX_ITEMS = 5;

/**
 * Persists the user's last N successful prompts in localStorage.
 * Returns the list and a function to push a new entry.
 *
 * - Newest first
 * - Deduped: re-submitting the same prompt moves it to the top
 * - Capped at MAX_ITEMS
 * - Safe: reads from localStorage lazily to avoid SSR hydration mismatch
 */
export function useRecentPrompts() {
  const [recents, setRecents] = useState<string[]>([]);

  // Read from localStorage after mount (client-only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecents(JSON.parse(raw) as string[]);
    } catch {
      // localStorage unavailable or corrupt — start fresh
    }
  }, []);

  const addRecent = useCallback((prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setRecents((prev) => {
      // Remove duplicates then prepend, cap at MAX_ITEMS
      const deduped = prev.filter((p) => p !== trimmed);
      const next = [trimmed, ...deduped].slice(0, MAX_ITEMS);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage full or blocked — update state anyway
      }

      return next;
    });
  }, []);

  return { recents, addRecent };
}
