"use client";

import { useEffect, useState } from "react";

const BOOKMARK_KEY = "nism_va_bookmarked_questions";
const WRONG_KEY = "nism_va_wrong_questions";

type Props = {
  questionId: string;
  unitNumber: number;
  unitTitle: string;
  questionText: string;
  correct: boolean;
};

export default function NismQuestionTracker({
  questionId,
  unitNumber,
  unitTitle,
  questionText,
  correct,
}: Props) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(BOOKMARK_KEY);

      const bookmarks = stored
        ? JSON.parse(stored)
        : [];

      setBookmarked(
        Array.isArray(bookmarks) &&
          bookmarks.some(
            (item: { questionId?: string }) =>
              item.questionId === questionId
          )
      );
    } catch {
      setBookmarked(false);
    }
  }, [questionId]);

  useEffect(() => {
    if (!correct) {
      try {
        const stored =
          localStorage.getItem(WRONG_KEY);

        const wrongQuestions = stored
          ? JSON.parse(stored)
          : [];

        const existing = Array.isArray(
          wrongQuestions
        )
          ? wrongQuestions
          : [];

        const alreadyExists = existing.some(
          (item: { questionId?: string }) =>
            item.questionId === questionId
        );

        if (!alreadyExists) {
          existing.unshift({
            questionId,
            unitNumber,
            unitTitle,
            questionText,
            date: new Date().toISOString(),
          });

          localStorage.setItem(
            WRONG_KEY,
            JSON.stringify(
              existing.slice(0, 200)
            )
          );
        }
      } catch (error) {
        console.error(
          "Unable to save wrong question:",
          error
        );
      }
    }
  }, [
    questionId,
    unitNumber,
    unitTitle,
    questionText,
    correct,
  ]);

  const toggleBookmark = () => {
    try {
      const stored =
        localStorage.getItem(BOOKMARK_KEY);

      const bookmarks = stored
        ? JSON.parse(stored)
        : [];

      const existing = Array.isArray(bookmarks)
        ? bookmarks
        : [];

      if (bookmarked) {
        const updated = existing.filter(
          (item: { questionId?: string }) =>
            item.questionId !== questionId
        );

        localStorage.setItem(
          BOOKMARK_KEY,
          JSON.stringify(updated)
        );

        setBookmarked(false);
      } else {
        existing.unshift({
          questionId,
          unitNumber,
          unitTitle,
          questionText,
          date: new Date().toISOString(),
        });

        localStorage.setItem(
          BOOKMARK_KEY,
          JSON.stringify(
            existing.slice(0, 200)
          )
        );

        setBookmarked(true);
      }
    } catch (error) {
      console.error(
        "Unable to update bookmark:",
        error
      );
    }
  };

  return (
    <button
      type="button"
      className={`nism-bookmark-button ${
        bookmarked ? "bookmarked" : ""
      }`}
      onClick={toggleBookmark}
    >
      {bookmarked
        ? "★ Bookmarked"
        : "☆ Bookmark Question"}
    </button>
  );
}
