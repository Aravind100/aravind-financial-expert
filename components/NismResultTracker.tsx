"use client";

import { useEffect } from "react";

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

const STORAGE_KEY = "nism_va_attempt_history";

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
      const existing =
        localStorage.getItem(STORAGE_KEY);

      const history = existing
        ? JSON.parse(existing)
        : [];

      const safeHistory = Array.isArray(history)
        ? history
        : [];

      const newAttempt = {
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

      const withoutDuplicate =
        safeHistory.filter(
          (item: { attemptId?: string }) =>
            item.attemptId !== attemptId
        );

      const updated = [
        newAttempt,
        ...withoutDuplicate,
      ].slice(0, 20);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated)
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
