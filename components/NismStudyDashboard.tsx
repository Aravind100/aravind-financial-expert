"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const MOCK_KEY = "nism_va_attempt_history";
const PRACTICE_KEY = "nism_va_practice_history";

type MockResult = {
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

type PracticeResult = {
  id: string;
  unitNumber: number;
  unitTitle: string;
  questionCount: number;
  correct: number;
  accuracy: number;
  date: string;
};

const units = [
  "Investment Landscape",
  "Concept & Role of a Mutual Fund",
  "Legal Structure of Mutual Funds in India",
  "Legal and Regulatory Framework",
  "Scheme Related Information",
  "Fund Distribution and Channel Management Practices",
  "NAV, Returns and Performance",
  "Taxation",
  "Investor Services",
  "Financial Planning",
  "Investment Products and Related Concepts",
  "Mutual Fund Scheme Selection",
];

export default function NismStudyDashboard() {
  const [mockHistory, setMockHistory] = useState<MockResult[]>([]);
  const [practiceHistory, setPracticeHistory] =
    useState<PracticeResult[]>([]);

  useEffect(() => {
    try {
      const mockStored =
        localStorage.getItem(MOCK_KEY);

      const practiceStored =
        localStorage.getItem(PRACTICE_KEY);

      if (mockStored) {
        const parsed = JSON.parse(mockStored);

        if (Array.isArray(parsed)) {
          setMockHistory(parsed);
        }
      }

      if (practiceStored) {
        const parsed = JSON.parse(practiceStored);

        if (Array.isArray(parsed)) {
          setPracticeHistory(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load NISM dashboard:",
        error
      );
    }
  }, []);

  const mockStats = useMemo(() => {
    if (mockHistory.length === 0) {
      return {
        attempts: 0,
        average: 0,
        highest: 0,
        passed: 0,
      };
    }

    const total = mockHistory.reduce(
      (sum, item) => sum + item.percentage,
      0
    );

    const highest = Math.max(
      ...mockHistory.map(
        (item) => item.percentage
      )
    );

    const passed = mockHistory.filter(
      (item) => item.passed
    ).length;

    return {
      attempts: mockHistory.length,
      average: Math.round(
        total / mockHistory.length
      ),
      highest,
      passed,
    };
  }, [mockHistory]);

  const practiceStats = useMemo(() => {
    const totalQuestions =
      practiceHistory.reduce(
        (sum, item) => sum + item.questionCount,
        0
      );

    const totalCorrect =
      practiceHistory.reduce(
        (sum, item) => sum + item.correct,
        0
      );

    const accuracy =
      totalQuestions > 0
        ? Math.round(
            (totalCorrect / totalQuestions) * 100
          )
        : 0;

    return {
      sessions: practiceHistory.length,
      questions: totalQuestions,
      correct: totalCorrect,
      accuracy,
    };
  }, [practiceHistory]);

  const unitProgress = useMemo(() => {
    return units.map((title, index) => {
      const unitNumber = index + 1;

      const results = practiceHistory.filter(
        (item) =>
          item.unitNumber === unitNumber
      );

      const questions = results.reduce(
        (sum, item) =>
          sum + item.questionCount,
        0
      );

      const correct = results.reduce(
        (sum, item) => sum + item.correct,
        0
      );

      const accuracy =
        questions > 0
          ? Math.round(
              (correct / questions) * 100
            )
          : 0;

      return {
        unitNumber,
        title,
        sessions: results.length,
        questions,
        correct,
        accuracy,
      };
    });
  }, [practiceHistory]);

  const clearHistory = () => {
    const confirmed = window.confirm(
      "Clear all NISM practice and mock test history?"
    );

    if (!confirmed) return;

    localStorage.removeItem(MOCK_KEY);
    localStorage.removeItem(PRACTICE_KEY);

    setMockHistory([]);
    setPracticeHistory([]);
  };

  return (
    <main className="nism-dashboard-page">

      <section className="nism-dashboard-hero">
        <div className="nism-container">

          <div className="nism-small-title">
            NISM SERIES V-A
          </div>

          <h1>My Study Dashboard</h1>

          <p>
            Track your mock tests, practice sessions
            and unit-wise preparation progress.
          </p>

          <div className="nism-hero-buttons">
            <Link
              href="/nism/v-a/mock-tests"
              className="nism-primary-btn"
            >
              Take Mock Test
            </Link>

            <Link
              href="/nism/v-a/practice"
              className="nism-secondary-btn"
            >
              Unit Practice
            </Link>
          </div>

        </div>
      </section>

      <section className="nism-dashboard-section">
        <div className="nism-container">

          <div className="nism-section-heading">
            <div className="nism-small-title">
              MOCK TEST PROGRESS
            </div>

            <h2>Your Mock Test Performance</h2>

            <p>
              Review your previous mock test
              performance and scores.
            </p>
          </div>

          <div className="nism-dashboard-stats">

            <div className="nism-dashboard-stat">
              <span>Total Attempts</span>
              <strong>
                {mockStats.attempts}
              </strong>
            </div>

            <div className="nism-dashboard-stat">
              <span>Average Score</span>
              <strong>
                {mockStats.average}%
              </strong>
            </div>

            <div className="nism-dashboard-stat">
              <span>Highest Score</span>
              <strong>
                {mockStats.highest}%
              </strong>
            </div>

            <div className="nism-dashboard-stat">
              <span>Passed</span>
              <strong>
                {mockStats.passed}
              </strong>
            </div>

          </div>

          <div className="nism-dashboard-table-wrap">

            {mockHistory.length === 0 ? (
              <div className="nism-dashboard-empty">
                <h3>No mock test attempts yet.</h3>

                <p>
                  Take your first mock test to
                  start tracking your performance.
                </p>

                <Link
                  href="/nism/v-a/mock-tests"
                  className="nism-primary-btn"
                >
                  Start Mock Test
                </Link>
              </div>
            ) : (
              <table className="nism-dashboard-table">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Score</th>
                    <th>Correct</th>
                    <th>Wrong</th>
                    <th>Unanswered</th>
                    <th>Result</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {mockHistory.map((item) => (
                    <tr key={item.attemptId}>
                      <td>
                        Mock Test {item.testNumber}
                      </td>

                      <td>
                        <strong>
                          {item.percentage}%
                        </strong>
                      </td>

                      <td>{item.correct}</td>

                      <td>{item.wrong}</td>

                      <td>
                        {item.unanswered}
                      </td>

                      <td>
                        <span
                          className={
                            item.passed
                              ? "nism-dashboard-pass"
                              : "nism-dashboard-fail"
                          }
                        >
                          {item.passed
                            ? "Passed"
                            : "Not Passed"}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          item.date
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </section>

      <section className="nism-dashboard-practice">
        <div className="nism-container">

          <div className="nism-section-heading">
            <div className="nism-small-title">
              PRACTICE PROGRESS
            </div>

            <h2>Unit-wise Practice Progress</h2>

            <p>
              See how much you have practiced and
              how accurately you are answering
              questions from each unit.
            </p>
          </div>

          <div className="nism-dashboard-stats">

            <div className="nism-dashboard-stat">
              <span>Practice Sessions</span>
              <strong>
                {practiceStats.sessions}
              </strong>
            </div>

            <div className="nism-dashboard-stat">
              <span>Questions Practiced</span>
              <strong>
                {practiceStats.questions}
              </strong>
            </div>

            <div className="nism-dashboard-stat">
              <span>Correct Answers</span>
              <strong>
                {practiceStats.correct}
              </strong>
            </div>

            <div className="nism-dashboard-stat">
              <span>Overall Accuracy</span>
              <strong>
                {practiceStats.accuracy}%
              </strong>
            </div>

          </div>

          <div className="nism-unit-progress-grid">

            {unitProgress.map((unit) => (
              <div
                key={unit.unitNumber}
                className="nism-unit-progress-card"
              >

                <div className="nism-unit-progress-top">
                  <span>
                    Unit {unit.unitNumber}
                  </span>

                  <strong>
                    {unit.accuracy}%
                  </strong>
                </div>

                <h3>{unit.title}</h3>

                <div className="nism-progress-bar">
                  <span
                    style={{
                      width: `${unit.accuracy}%`,
                    }}
                  />
                </div>

                <div className="nism-unit-progress-meta">
                  <span>
                    {unit.sessions} sessions
                  </span>

                  <span>
                    {unit.questions} questions
                  </span>

                  <span>
                    {unit.correct} correct
                  </span>
                </div>

                <Link
                  href="/nism/v-a/practice"
                  className="nism-unit-practice-link"
                >
                  Practice Unit →
                </Link>

              </div>
            ))}

          </div>

        </div>
      </section>

      <section className="nism-dashboard-recent">
        <div className="nism-container">

          <div className="nism-dashboard-recent-card">

            <div>
              <div className="nism-small-title">
                KEEP LEARNING
              </div>

              <h2>
                Build your preparation
                consistently.
              </h2>

              <p>
                Practice individual units first,
                then test yourself with complete
                100-question mock tests.
              </p>
            </div>

            <div className="nism-hero-buttons">

              <Link
                href="/nism/v-a/practice"
                className="nism-primary-btn"
              >
                Continue Practice
              </Link>

              <Link
                href="/nism/v-a/mock-tests"
                className="nism-secondary-btn"
              >
                Full Mock Tests
              </Link>

            </div>

          </div>

          <button
            type="button"
            className="nism-dashboard-clear"
            onClick={clearHistory}
          >
            Clear My Study History
          </button>

        </div>
      </section>

      <section className="nism-dashboard-disclaimer">
        <div className="nism-container">

          <p>
            <strong>Important:</strong> This dashboard
            stores study history locally in the
            browser. Clearing browser storage or
            changing device/browser may remove this
            history.
          </p>

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
