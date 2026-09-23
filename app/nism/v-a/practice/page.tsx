"use client";

import Link from "next/link";
import { useState } from "react";

type Question = {
  questionNumber: number;
  id: string;
  unitNumber: number;
  unitTitle: string | null;
  topic: string | null;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  difficulty: "Easy" | "Medium" | "Hard";
  explanation: string | null;
};

const units = [
  {
    number: 1,
    title: "Investment Landscape",
    description:
      "Financial goals, savings and investments, asset classes, investment risks, risk profiling and asset allocation.",
  },
  {
    number: 2,
    title: "Concept and Role of a Mutual Fund",
    description:
      "Understand mutual funds, their role, classification and development of the mutual fund industry.",
  },
  {
    number: 3,
    title: "Legal Structure of Mutual Funds in India",
    description:
      "Learn about mutual fund structure, key constituents, AMCs and service providers.",
  },
  {
    number: 4,
    title: "Legal and Regulatory Framework",
    description:
      "Study regulators, regulatory requirements and distributor-related practices.",
  },
  {
    number: 5,
    title: "Scheme Related Information",
    description:
      "Understand important scheme documents and scheme-related disclosures.",
  },
  {
    number: 6,
    title: "Fund Distribution and Channel Management",
    description:
      "Learn distribution channels, distributor roles and distributor-related practices.",
  },
  {
    number: 7,
    title: "NAV, TER and Pricing of Units",
    description:
      "Understand NAV, valuation, expenses and pricing-related concepts.",
  },
  {
    number: 8,
    title: "Taxation",
    description:
      "Practice concepts related to taxation of mutual fund investments.",
  },
  {
    number: 9,
    title: "Investor Services",
    description:
      "Understand investor transactions, services and servicing-related concepts.",
  },
  {
    number: 10,
    title: "Risk, Return and Performance",
    description:
      "Study risk, returns, performance measurement and related concepts.",
  },
  {
    number: 11,
    title: "Mutual Fund Scheme Performance",
    description:
      "Understand benchmarks, performance measurement and scheme performance.",
  },
  {
    number: 12,
    title: "Mutual Fund Scheme Selection",
    description:
      "Practice scheme selection based on investor needs, preferences and risk profile.",
  },
];

export default function NismPracticePage() {
  const [selectedUnit, setSelectedUnit] =
    useState<number | null>(null);

  const [questionCount, setQuestionCount] =
    useState(10);

  const [questions, setQuestions] =
    useState<Question[]>([]);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<string | null>(null);

  const [answerChecked, setAnswerChecked] =
    useState(false);

  const [correctAnswers, setCorrectAnswers] =
    useState(0);

  const [answeredQuestions, setAnsweredQuestions] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const currentQuestion =
    questions[currentIndex];

  async function startPractice(
    unitNumber: number
  ) {
    setSelectedUnit(unitNumber);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    setError("");
  }

  async function loadQuestions() {
    if (!selectedUnit) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/nism/practice/start",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            unitNumber: selectedUnit,
            questionCount,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to start practice."
        );
      }

      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setAnswerChecked(false);
      setCorrectAnswers(0);
      setAnsweredQuestions(0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start practice."
      );
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(answer: string) {
    if (answerChecked) return;

    setSelectedAnswer(answer);
  }

  function checkAnswer() {
    if (!selectedAnswer || !currentQuestion) {
      return;
    }

    setAnswerChecked(true);
    setAnsweredQuestions(
      (value) => value + 1
    );

    /*
      The practice API currently does not send
      correct_option to the browser.

      We will connect server-side answer checking
      in the next sub-step.
    */
  }

  function nextQuestion() {
    if (
      currentIndex <
      questions.length - 1
    ) {
      setCurrentIndex(
        (value) => value + 1
      );

      setSelectedAnswer(null);
      setAnswerChecked(false);
    }
  }

  function backToUnits() {
    setQuestions([]);
    setSelectedUnit(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    setError("");
  }

  const selectedUnitData =
    units.find(
      (unit) =>
        unit.number === selectedUnit
    );

  return (
    <main className="nism-practice-page">

      {!selectedUnit && (
        <>
          <section className="nism-practice-hero">
            <div className="nism-practice-container">

              <div className="nism-practice-eyebrow">
                NISM SERIES V-A
              </div>

              <h1>
                Practice by Unit
              </h1>

              <p>
                Strengthen your NISM V-A preparation
                by practicing questions from individual
                curriculum units.
              </p>

              <div className="nism-practice-buttons">

                <Link
                  href="/nism/v-a/mock-tests"
                  className="nism-primary-btn"
                >
                  📝 Full Mock Tests
                </Link>

                <Link
                  href="/nism/v-a"
                  className="nism-secondary-btn"
                >
                  ← Back to Preparation
                </Link>

              </div>

            </div>
          </section>

          <section className="nism-practice-section">
            <div className="nism-practice-container">

              <div className="nism-practice-heading">

                <div className="nism-small-title">
                  SELECT A UNIT
                </div>

                <h2>
                  Choose what you want to practice
                </h2>

                <p>
                  Select a unit to begin focused
                  question practice.
                </p>

              </div>

              <div className="nism-practice-grid">

                {units.map((unit) => (

                  <div
                    className="nism-practice-card"
                    key={unit.number}
                  >

                    <div className="nism-practice-card-top">

                      <span className="nism-practice-number">
                        {String(
                          unit.number
                        ).padStart(2, "0")}
                      </span>

                      <span className="nism-practice-status">
                        Practice
                      </span>

                    </div>

                    <h3>
                      {unit.title}
                    </h3>

                    <p>
                      {unit.description}
                    </p>

                    <button
                      type="button"
                      className="nism-practice-card-button active"
                      onClick={() =>
                        startPractice(
                          unit.number
                        )
                      }
                    >
                      Start Practice →
                    </button>

                  </div>

                ))}

              </div>

            </div>
          </section>
        </>
      )}


      {selectedUnit &&
        questions.length === 0 && (
          <section className="nism-practice-setup">

            <div className="nism-practice-container">

              <button
                type="button"
                className="nism-practice-back"
                onClick={backToUnits}
              >
                ← Back to Units
              </button>

              <div className="nism-practice-setup-card">

                <div className="nism-practice-eyebrow">
                  UNIT {selectedUnit}
                </div>

                <h1>
                  {selectedUnitData?.title}
                </h1>

                <p>
                  Choose how many questions you
                  want to practice.
                </p>

                <div className="nism-question-count-options">

                  {[10, 20, 25].map(
                    (count) => (

                      <button
                        type="button"
                        key={count}
                        className={
                          questionCount ===
                          count
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          setQuestionCount(
                            count
                          )
                        }
                      >
                        <strong>
                          {count}
                        </strong>

                        <span>
                          Questions
                        </span>
                      </button>

                    )
                  )}

                </div>

                {error && (
                  <div className="nism-practice-error">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  className="nism-start-practice-button"
                  onClick={loadQuestions}
                  disabled={loading}
                >
                  {loading
                    ? "Loading Questions..."
                    : `Start ${questionCount} Questions →`}
                </button>

              </div>

            </div>

          </section>
        )}


      {questions.length > 0 &&
        currentQuestion && (
          <section className="nism-question-practice">

            <div className="nism-practice-container">

              <div className="nism-practice-question-header">

                <button
                  type="button"
                  className="nism-practice-back"
                  onClick={backToUnits}
                >
                  ← Exit Practice
                </button>

                <div>
                  Question{" "}
                  {currentIndex + 1} of{" "}
                  {questions.length}
                </div>

              </div>


              <div className="nism-practice-question-card">

                <div className="nism-question-meta">

                  <span>
                    Unit{" "}
                    {currentQuestion.unitNumber}
                  </span>

                  <span>
                    {currentQuestion.difficulty}
                  </span>

                  {currentQuestion.topic && (
                    <span>
                      {currentQuestion.topic}
                    </span>
                  )}

                </div>


                <h1>
                  {currentQuestion.questionText}
                </h1>


                <div className="nism-practice-options">

                  {[
                    [
                      "A",
                      currentQuestion.optionA,
                    ],
                    [
                      "B",
                      currentQuestion.optionB,
                    ],
                    [
                      "C",
                      currentQuestion.optionC,
                    ],
                    [
                      "D",
                      currentQuestion.optionD,
                    ],
                  ].map(
                    ([letter, text]) => (

                      <button
                        type="button"
                        key={letter}
                        className={
                          selectedAnswer ===
                          letter
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          selectAnswer(
                            letter
                          )
                        }
                        disabled={
                          answerChecked
                        }
                      >

                        <strong>
                          {letter}
                        </strong>

                        <span>
                          {text}
                        </span>

                      </button>

                    )
                  )}

                </div>


                {!answerChecked && (
                  <button
                    type="button"
                    className="nism-check-answer"
                    onClick={checkAnswer}
                    disabled={
                      !selectedAnswer
                    }
                  >
                    Check Answer
                  </button>
                )}


                {answerChecked && (
                  <div className="nism-practice-feedback">

                    <div className="nism-feedback-result">
                      Answer checked
                    </div>

                    {currentQuestion.explanation && (
                      <div className="nism-feedback-explanation">

                        <strong>
                          💡 Explanation
                        </strong>

                        <p>
                          {
                            currentQuestion.explanation
                          }
                        </p>

                      </div>
                    )}

                    {currentIndex <
                    questions.length - 1 ? (
                      <button
                        type="button"
                        className="nism-next-question"
                        onClick={
                          nextQuestion
                        }
                      >
                        Next Question →
                      </button>
                    ) : (
                      <div className="nism-practice-complete">

                        <h2>
                          Practice Complete 🎉
                        </h2>

                        <p>
                          You completed{" "}
                          {questions.length}{" "}
                          questions.
                        </p>

                        <button
                          type="button"
                          className="nism-next-question"
                          onClick={
                            backToUnits
                          }
                        >
                          Practice Another Unit
                        </button>

                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>

          </section>
        )}

    </main>
  );
}
