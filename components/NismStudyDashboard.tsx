"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Attempt = {
  attemptId: string;
  testNumber: number;
  score: number;
  percentage: number;
  correct: number;
  wrong: number;
  unanswered: number;
  passed: boolean;
  date: string;
};

const STORAGE_KEY = "nism_va_attempt_history";

export default function NismStudyDashboard() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setAttempts(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load NISM study history:",
        error
      );
    }

    setLoaded(true);
  }, []);

  const statistics = useMemo(() => {
    if (!attempts.length) {
      return {
        total: 0,
        average: 0,
        highest: 0,
        passed: 0,
      };
    }

    const total = attempts.length;

    const average =
      attempts.reduce(
        (sum, attempt) => sum + attempt.percentage,
        0
      ) / total;

    const highest = Math.max(
      ...attempts.map((attempt) => attempt.percentage)
    );

    const passed = attempts.filter(
      (attempt) => attempt.passed
    ).length;

    return {
      total,
      average,
      highest,
      passed,
    };
  }, [attempts]);

  function clearHistory() {
    const confirmed = window.confirm(
      "Are you sure you want to clear your NISM study history from this browser?"
    );

    if (!confirmed) return;

    localStorage.removeItem(STORAGE_KEY);
    setAttempts([]);
  }

  if (!loaded) {
    return (
      <main className="nism-dashboard-page">
        <div className="nism-dashboard-container">
          <div className="nism-dashboard-loading">
            Loading your study dashboard...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="nism-dashboard-page">
      <section className="nism-dashboard-hero">
        <div className="nism-dashboard-container">
          <div className="nism-dashboard-eyebrow">
            NISM SERIES V-A
          </div>

          <h1>Your Study Dashboard</h1>

          <p>
            Track your mock-test practice, monitor your scores
            and continue preparing for the NISM Series V-A
            Mutual Fund Distributors examination.
          </p>
        </div>
      </section>

      <section className="nism-dashboard-main">
        <div className="nism-dashboard-container">

          {/* Statistics */}

          <div className="nism-dashboard-stat-grid">

            <div className="nism-dashboard-stat-card">
              <span>Mock Tests</span>
              <strong>{statistics.total}</strong>
              <small>Attempts completed</small>
            </div>

            <div className="nism-dashboard-stat-card">
              <span>Average Score</span>
              <strong>
                {statistics.average.toFixed(1)}%
              </strong>
              <small>Across all attempts</small>
            </div>

            <div className="nism-dashboard-stat-card">
              <span>Highest Score</span>
              <strong>
                {statistics.highest.toFixed(1)}%
              </strong>
              <small>Personal best</small>
            </div>

            <div className="nism-dashboard-stat-card">
              <span>Passed</span>
              <strong>{statistics.passed}</strong>
              <small>50%+ practice score</small>
            </div>

          </div>

          {/* No attempts */}

          {attempts.length === 0 ? (
            <section className="nism-dashboard-empty">
              <div className="nism-dashboard-empty-icon">
                🎓
              </div>

              <h2>Your study history is empty</h2>

              <p>
                Complete your first NISM mock test and your
                result will automatically appear here.
              </p>

              <Link
                href="/nism/v-a/mock-tests"
                className="nism-dashboard-primary"
              >
                Start Mock Test →
              </Link>
            </section>
          ) : (
            <>
              {/* Score Progress */}

              <section className="nism-dashboard-card">
                <div className="nism-dashboard-section-heading">
                  <span>PROGRESS</span>

                  <h2>
                    Your score history
                  </h2>

                  <p>
                    Your recent practice performance at a
                    glance.
                  </p>
                </div>

                <div className="nism-score-history">
                  {attempts
                    .slice(0, 10)
                    .reverse()
                    .map((attempt, index) => (
                      <div
                        className="nism-score-column"
                        key={attempt.attemptId}
                      >
                        <div
                          className={`nism-score-bar ${
                            attempt.passed
                              ? "score-passed"
                              : "score-not-passed"
                          }`}
                          style={{
                            height: `${Math.max(
                              8,
                              Math.min(
                                100,
                                attempt.percentage
                              )
                            )}%`,
                          }}
                        >
                          <span>
                            {attempt.percentage.toFixed(
                              0
                            )}
                            %
                          </span>
                        </div>

                        <small>
                          Test {attempt.testNumber}
                        </small>

                        <em>
                          {index + 1}
                        </em>
                      </div>
                    ))}
                </div>

                <div className="nism-score-legend">
                  <span>
                    <i className="legend-pass" />
                    50% or above
                  </span>

                  <span>
                    <i className="legend-fail" />
                    Below 50%
                  </span>
                </div>
              </section>

              {/* Recent Attempts */}

              <section className="nism-dashboard-card">
                <div className="nism-dashboard-section-heading dashboard-heading-row">
                  <div>
                    <span>HISTORY</span>

                    <h2>
                      Recent mock tests
                    </h2>

                    <p>
                      Review your previous practice
                      attempts.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="nism-dashboard-clear"
                    onClick={clearHistory}
                  >
                    Clear History
                  </button>
                </div>

                <div className="nism-history-list">
                  {attempts.map((attempt) => (
                    <div
                      className="nism-history-row"
                      key={attempt.attemptId}
                    >
                      <div className="nism-history-main">
                        <strong>
                          Mock Test{" "}
                          {attempt.testNumber}
                        </strong>

                        <small>
                          {new Date(
                            attempt.date
                          ).toLocaleString(
                            "en-IN",
                            {
                              dateStyle:
                                "medium",
                              timeStyle:
                                "short",
                            }
                          )}
                        </small>
                      </div>

                      <div className="nism-history-score">
                        <strong>
                          {attempt.score}/100
                        </strong>

                        <span>
                          {attempt.percentage.toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>

                      <div
                        className={`nism-history-status ${
                          attempt.passed
                            ? "history-passed"
                            : "history-failed"
                        }`}
                      >
                        {attempt.passed
                          ? "Passed"
                          : "Review"}
                      </div>

                      <Link
                        href={`/nism/v-a/result/${attempt.attemptId}`}
                        className="nism-history-button"
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Study actions */}

          <section className="nism-dashboard-actions">
            <Link
              href="/nism/v-a/mock-tests"
              className="nism-dashboard-action-card"
            >
              <span>📝</span>
              <strong>Mock Tests</strong>
              <small>
                Take another 100-question practice test.
              </small>
            </Link>

            <Link
              href="/nism/v-a"
              className="nism-dashboard-action-card"
            >
              <span>📚</span>
              <strong>Study Material</strong>
              <small>
                Review the NISM V-A preparation modules.
              </small>
            </Link>

            <Link
              href="/nism"
              className="nism-dashboard-action-card"
            >
              <span>🎓</span>
              <strong>NISM Exam</strong>
              <small>
                Return to the complete NISM preparation
                section.
              </small>
            </Link>
          </section>

          {/* Disclaimer */}

          <div className="nism-dashboard-disclaimer">
            <strong>Note:</strong> Your study history is
            currently stored only in this browser. Clearing
            browser storage or using another device will not
            retain this history.
          </div>

        </div>
      </section>
    </main>
  );
}
