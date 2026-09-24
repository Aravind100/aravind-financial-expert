"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const BOOKMARK_KEY =
  "nism_va_bookmarked_questions";

const WRONG_KEY =
  "nism_va_wrong_questions";

type SavedQuestion = {
  questionId: string;
  unitNumber: number;
  unitTitle: string;
  questionText: string;
  date: string;
};

export default function NismReviewPage() {
  const [bookmarks, setBookmarks] =
    useState<SavedQuestion[]>([]);

  const [wrongQuestions, setWrongQuestions] =
    useState<SavedQuestion[]>([]);

  const [activeTab, setActiveTab] =
    useState<"bookmarks" | "wrong">(
      "bookmarks"
    );

  useEffect(() => {
    try {
      const bookmarkData =
        localStorage.getItem(BOOKMARK_KEY);

      const wrongData =
        localStorage.getItem(WRONG_KEY);

      if (bookmarkData) {
        const parsed = JSON.parse(
          bookmarkData
        );

        if (Array.isArray(parsed)) {
          setBookmarks(parsed);
        }
      }

      if (wrongData) {
        const parsed = JSON.parse(
          wrongData
        );

        if (Array.isArray(parsed)) {
          setWrongQuestions(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load review questions:",
        error
      );
    }
  }, []);

  const removeBookmark = (
    questionId: string
  ) => {
    const updated = bookmarks.filter(
      (item) =>
        item.questionId !== questionId
    );

    setBookmarks(updated);

    localStorage.setItem(
      BOOKMARK_KEY,
      JSON.stringify(updated)
    );
  };

  const removeWrongQuestion = (
    questionId: string
  ) => {
    const updated = wrongQuestions.filter(
      (item) =>
        item.questionId !== questionId
    );

    setWrongQuestions(updated);

    localStorage.setItem(
      WRONG_KEY,
      JSON.stringify(updated)
    );
  };

  const activeQuestions =
    activeTab === "bookmarks"
      ? bookmarks
      : wrongQuestions;

  return (
    <main className="nism-review-page">

      <section className="nism-review-hero">
        <div className="nism-container">

          <div className="nism-small-title">
            NISM SERIES V-A
          </div>

          <h1>Review & Improve</h1>

          <p>
            Review questions you bookmarked and
            questions you previously answered
            incorrectly.
          </p>

          <div className="nism-hero-buttons">

            <Link
              href="/nism/v-a/practice"
              className="nism-primary-btn"
            >
              Unit Practice
            </Link>

            <Link
              href="/nism/v-a/dashboard"
              className="nism-secondary-btn"
            >
              My Dashboard
            </Link>

          </div>

        </div>
      </section>

      <section className="nism-review-section">
        <div className="nism-container">

          <div className="nism-review-tabs">

            <button
              type="button"
              className={
                activeTab === "bookmarks"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("bookmarks")
              }
            >
              ⭐ Bookmarked
              <span>
                {bookmarks.length}
              </span>
            </button>

            <button
              type="button"
              className={
                activeTab === "wrong"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveTab("wrong")
              }
            >
              ❌ Wrong Answers
              <span>
                {wrongQuestions.length}
              </span>
            </button>

          </div>

          {activeQuestions.length === 0 ? (
            <div className="nism-review-empty">

              <div className="nism-small-title">
                NOTHING TO REVIEW
              </div>

              <h2>
                {activeTab === "bookmarks"
                  ? "No bookmarked questions yet."
                  : "No wrong answers saved yet."}
              </h2>

              <p>
                {activeTab === "bookmarks"
                  ? "Bookmark questions while practicing so you can revisit important concepts later."
                  : "Incorrect answers from Practice Mode will automatically appear here."}
              </p>

              <Link
                href="/nism/v-a/practice"
                className="nism-primary-btn"
              >
                Start Practice
              </Link>

            </div>
          ) : (
            <div className="nism-review-list">

              {activeQuestions.map(
                (question, index) => (
                  <div
                    key={question.questionId}
                    className="nism-review-card"
                  >

                    <div className="nism-review-card-top">

                      <span>
                        Unit{" "}
                        {question.unitNumber}
                      </span>

                      <span>
                        {question.unitTitle}
                      </span>

                    </div>

                    <div className="nism-review-number">
                      Question {index + 1}
                    </div>

                    <h2>
                      {question.questionText}
                    </h2>

                    <div className="nism-review-actions">

                      <Link
                        href="/nism/v-a/practice"
                        className="nism-primary-btn"
                      >
                        Practice Again
                      </Link>

                      {activeTab ===
                        "bookmarks" && (
                        <button
                          type="button"
                          className="nism-review-remove"
                          onClick={() =>
                            removeBookmark(
                              question.questionId
                            )
                          }
                        >
                          Remove Bookmark
                        </button>
                      )}

                      {activeTab ===
                        "wrong" && (
                        <button
                          type="button"
                          className="nism-review-remove"
                          onClick={() =>
                            removeWrongQuestion(
                              question.questionId
                            )
                          }
                        >
                          Remove
                        </button>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>
      </section>

      <section className="nism-review-info">
        <div className="nism-container">

          <div className="nism-info-card">

            <h2>
              Use Review Mode Effectively
            </h2>

            <div className="nism-info-grid">

              <div>
                <strong>
                  ⭐ Bookmark
                </strong>

                <p>
                  Save questions that you
                  want to revisit.
                </p>
              </div>

              <div>
                <strong>
                  ❌ Wrong Answers
                </strong>

                <p>
                  Questions answered
                  incorrectly are saved
                  automatically.
                </p>
              </div>

              <div>
                <strong>
                  📚 Revisit
                </strong>

                <p>
                  Return to these questions
                  during your revision.
                </p>
              </div>

              <div>
                <strong>
                  🎯 Improve
                </strong>

                <p>
                  Focus your preparation on
                  concepts that need more
                  practice.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      <section className="nism-review-disclaimer">
        <div className="nism-container">

          <p>
            Practice questions are independently
            prepared for educational purposes and
            are not official NISM examination
            questions.
          </p>

        </div>
      </section>

    </main>
  );
}
