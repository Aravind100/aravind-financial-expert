"use client";

import { useEffect } from "react";

const STORAGE_KEY = "nism_va_attempt_history";

type Props = {
  attemptId: string;
  testNumber: number;
  score: number;
  percentage: number;
  correct: number;
  wrong: number;
  unanswered: number;
  passed: boolean;
};

export default function NismResultTracker({
  attemptId,
  testNumber,
  score,
  percentage,
  correct,
  wrong,
  unanswered,
  passed,
}: Props) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      const history = stored
        ? JSON.parse(stored)
        : [];

      const existingHistory = Array.isArray(history)
        ? history
        : [];

      const newResult = {
        attemptId,
        testNumber,
        score,
        percentage,
        correct,
        wrong,
        unanswered,
        passed,
        date: new Date().toISOString(),
      };

      const updatedHistory = [
        newResult,
        ...existingHistory.filter(
          (item: { attemptId?: string }) =>
            item.attemptId !== attemptId
        ),
      ].slice(0, 20);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error(
        "Unable to save NISM result:",
        error
      );
    }
  }, [
    attemptId,
    testNumber,
    score,
    percentage,
    correct,
    wrong,
    unanswered,
    passed,
  ]);

  return null;
}
