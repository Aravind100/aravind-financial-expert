"use client";

import { useEffect } from "react";

const STORAGE_KEY = "nism_va_practice_history";

type PracticeResult = {
  id: string;
  unitNumber: number;
  unitTitle: string;
  questionCount: number;
  correct: number;
  accuracy: number;
  date: string;
};

type Props = {
  unitNumber: number;
  unitTitle: string;
  questionCount: number;
  correct: number;
};

export default function NismPracticeTracker({
  unitNumber,
  unitTitle,
  questionCount,
  correct,
}: Props) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      const history = stored ? JSON.parse(stored) : [];

      const existingHistory: PracticeResult[] =
        Array.isArray(history) ? history : [];

      const accuracy =
        questionCount > 0
          ? Math.round((correct / questionCount) * 100)
          : 0;

      const result: PracticeResult = {
        id: `${Date.now()}-${unitNumber}`,
        unitNumber,
        unitTitle,
        questionCount,
        correct,
        accuracy,
        date: new Date().toISOString(),
      };

      const updatedHistory = [
        result,
        ...existingHistory,
      ].slice(0, 50);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error(
        "Unable to save NISM practice history:",
        error
      );
    }
  }, [
    unitNumber,
    unitTitle,
    questionCount,
    correct,
  ]);

  return null;
}
