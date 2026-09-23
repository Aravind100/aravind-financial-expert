"use client";

import Link from "next/link";
import { useState } from "react";
import NismPracticeTracker from "@/components/NismPracticeTracker";

type Unit = {
  number: number;
  title: string;
};

type Question = {
  questionNumber: number;
  id: string;
  unitNumber: number;
  unitTitle: string;
  topic: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  difficulty: string;
};

const units: Unit[] = [
  {
    number: 1,
    title: "Investment Landscape",
  },
  {
    number: 2,
    title: "Concept & Role of a Mutual Fund",
  },
  {
    number: 3,
    title: "Legal Structure of Mutual Funds in India",
  },
  {
    number: 4,
    title: "Legal and Regulatory Framework",
  },
  {
    number: 5,
    title: "Scheme Related Information",
  },
  {
    number: 6,
    title: "Fund Distribution and Channel Management Practices",
  },
  {
    number: 7,
    title: "NAV, Returns and Performance",
  },
  {
    number: 8,
    title: "Taxation",
  },
  {
    number: 9,
    title: "Investor Services",
  },
  {
    number: 10,
    title: "Financial Planning",
  },
  {
    number: 11,
    title: "Investment Products and Related Concepts",
  },
  {
    number: 12,
    title: "Mutual Fund Scheme Selection",
  },
];

const answerOptions = [
  { key: "A", label: "A" },
  { key: "B", label: "B" },
  { key: "C", label: "C" },
  { key: "D", label: "D" },
];

export default function NismPracticePage() {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [questionCount, setQuestionCount] = useState(10);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerChecked, setAnswerChecked] = useState(false);

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctOption, setCorrectOption] = useState("");

  const [explanation, setExplanation] = useState("");

  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const [error, setError] = useState("");

  const currentQuestion = questions[currentIndex];

  const startPractice = (unitNumber: number) => {
    setSelectedUnit(unitNumber);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setAnswerChecked(false);
    setIsCorrect(null);
    setCorrectOption("");
    setExplanation("");
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    setError("");
  };

  const loadQuestions = async () => {
    if (!selectedUnit) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/nism/practice/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          unitNumber: selectedUnit,
          questionCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to start practice.");
      }

      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setSelectedAnswer("");
      setAnswerChecked(false);
      setIsCorrect(null);
      setCorrectOption("");
      setExplanation("");
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
  };

  const selectAnswer = (option: string) => {
    if (answerChecked || checking) return;

    setSelectedAnswer(option);
  };

  const checkAnswer = async () => {
    if (!currentQuestion || !selectedAnswer || answerChecked) {
      return;
    }

    setChecking(true);
    setError("");

    try {
      const response = await fetch("/api/nism/practice/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedOption: selectedAnswer,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to check answer."
        );
      }

      setIsCorrect(Boolean(data.correct));
      setCorrectOption(data.correctOption || "");
      setExplanation(data.explanation || "");
      setAnswerChecked(true);

      setAnsweredQuestions((previous) => previous + 1);

      if (data.correct) {
        setCorrectAnswers((previous) => previous + 1);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to check answer."
      );
    } finally {
      setChecking(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
      setSelectedAnswer("");
      setAnswerChecked(false);
      setIsCorrect(null);
      setCorrectOption("");
      setExplanation("");
      return;
    }

    setCurrentIndex(questions.length);
  };

  const backToUnits = () => {
    setSelectedUnit(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setAnswerChecked(false);
    setIsCorrect(null);
    setCorrectOption("");
    setExplanation("");
    setCorrectAnswers(0);
    setAnsweredQuestions(0);
    setError("");
  };

  const practiceCompleted =
    questions.length > 0 &&
    currentIndex >= questions.length;

  const percentage =
    answeredQuestions > 0
      ? Math.round((correctAnswers / answeredQuestions) * 100)
      : 0;

  return (
    <main className="nism-practice-page">
      <section className="nism-practice-hero">
        <div className="nism-container">
          <div className="nism-small-title">
            NISM SERIES V-A
          </div>

          <h1>Unit-wise Practice</h1>

          <p>
            Practice Mutual Fund Distributor concepts unit by unit
            with randomly selected questions from your question
            bank.
          </p>

          <div className="nism-hero-buttons">
            <Link
              href="/nism/v-a"
              className="nism-secondary-btn"
            >
              ← Back to Preparation
            </Link>

            <Link
              href="/nism/v-a/mock-tests"
              className="nism-primary-btn"
            >
              Full Mock Tests
            </Link>
          </div>
        </div>
      </section>

      <section className="nism-practice-section">
        <div className="nism-container">

          {!selectedUnit && (
            <>
              <div className="nism-section-heading">
                <div className="nism-small-title">
                  SELECT A UNIT
                </div>

                <h2>
                  Choose a unit to start practicing.
                </h2>

                <p>
                  Select any of the 12 units from the current
                  NISM-Series-V-A test objectives.
                </p>
              </div>

              <div className="nism-practice-grid">
                {units.map((unit) => (
                  <button
                    key={unit.number}
                    type="button"
                    className="nism-practice-card-button active"
                    onClick={() =>
                      startPractice(unit.number)
                    }
                  >
                    <span className="nism-practice-number">
                      Unit {unit.number}
                    </span>

                    <strong>{unit.title}</strong>

                    <span className="nism-practice-start">
                      Start Practice →
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedUnit && questions.length === 0 && (
            <div className="nism-practice-setup">
              <button
                type="button"
                className="nism-practice-back"
                onClick={backToUnits}
              >
                ← Choose Another Unit
              </button>

              <div className="nism-section-heading">
                <div className="nism-small-title">
                  UNIT {selectedUnit}
                </div>

                <h2>
                  {units.find(
                    (unit) => unit.number === selectedUnit
                  )?.title}
                </h2>

                <p>
                  Choose how many questions you want to
                  practice.
                </p>
              </div>

              <div className="nism-question-count-grid">
                {[10, 20, 25].map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`nism-question-count ${
                      questionCount === count
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      setQuestionCount(count)
                    }
                  >
                    <strong>{count}</strong>
                    <span>Questions</span>
                  </button>
                ))}
              </div>

              {error && (
                <div className="nism-practice-error">
                  {error}
                </div>
              )}

              <button
                type="button"
                className="nism-primary-btn nism-practice-start-button"
                onClick={loadQuestions}
                disabled={loading}
              >
                {loading
                  ? "Loading Questions..."
                  : `Start ${questionCount}-Question Practice`}
              </button>

              <p className="nism-practice-note">
                Questions are randomly selected from the active
                question bank.
              </p>
            </div>
          )}

          {questions.length > 0 &&
            !practiceCompleted && (
              <div className="nism-question-practice">

                <div className="nism-question-practice-top">
                  <button
                    type="button"
                    className="nism-practice-back"
                    onClick={backToUnits}
                  >
                    ← Exit Practice
                  </button>

                  <div className="nism-question-progress">
                    Question{" "}
                    <strong>
                      {currentIndex + 1}
                    </strong>{" "}
                    of {questions.length}
                  </div>
                </div>

                <div className="nism-question-practice-card">

                  <div className="nism-question-meta">
                    <span>
                      Unit {currentQuestion.unitNumber}
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

                  <h2>
                    {currentQuestion.questionText}
                  </h2>

                  <div className="nism-practice-options">
                    {answerOptions.map((option) => {
                      const text =
                        option.key === "A"
                          ? currentQuestion.optionA
                          : option.key === "B"
                          ? currentQuestion.optionB
                          : option.key === "C"
                          ? currentQuestion.optionC
                          : currentQuestion.optionD;

                      const selected =
                        selectedAnswer === option.key;

                      const correct =
                        answerChecked &&
                        correctOption === option.key;

                      const wrong =
                        answerChecked &&
                        selected &&
                        !isCorrect;

                      return (
                        <button
                          key={option.key}
                          type="button"
                          className={[
                            "nism-practice-option",
                            selected
                              ? "selected"
                              : "",
                            correct
                              ? "correct"
                              : "",
                            wrong
                              ? "wrong"
                              : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                          onClick={() =>
                            selectAnswer(option.key)
                          }
                          disabled={
                            answerChecked || checking
                          }
                        >
                          <span className="nism-option-letter">
                            {option.label}
                          </span>

                          <span>{text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {error && (
                    <div className="nism-practice-error">
                      {error}
                    </div>
                  )}

                  {!answerChecked && (
                    <button
                      type="button"
                      className="nism-primary-btn nism-check-answer"
                      onClick={checkAnswer}
                      disabled={
                        !selectedAnswer || checking
                      }
                    >
                      {checking
                        ? "Checking..."
                        : "Check Answer"}
                    </button>
                  )}

                  {answerChecked && (
                    <div
                      className={`nism-practice-feedback ${
                        isCorrect
                          ? "is-correct"
                          : "is-wrong"
                      }`}
                    >
                      <strong>
                        {isCorrect
                          ? "✓ Correct Answer"
                          : "✕ Incorrect Answer"}
                      </strong>

                      {!isCorrect && (
                        <p>
                          Correct answer:{" "}
                          <strong>
                            {correctOption}
                          </strong>
                        </p>
                      )}

                      {explanation && (
                        <div className="nism-practice-explanation">
                          <strong>
                            Explanation
                          </strong>

                          <p>
                            {explanation}
                          </p>
                        </div>
                      )}

                      <button
                        type="button"
                        className="nism-primary-btn"
                        onClick={nextQuestion}
                      >
                        {currentIndex <
                        questions.length - 1
                          ? "Next Question →"
                          : "Finish Practice"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

          {practiceCompleted && (
            <div className="nism-practice-complete">

              <NismPracticeTracker
  unitNumber={selectedUnit || 0}
  unitTitle={
    units.find(
      (unit) => unit.number === selectedUnit
    )?.title || ""
  }
  questionCount={questions.length}
  correct={correctAnswers}
/>
              <div className="nism-small-title">
                PRACTICE COMPLETE
              </div>

              <h2>
                Unit {selectedUnit} Practice Finished
              </h2>

              <div className="nism-practice-score">
                <strong>{correctAnswers}</strong>
                <span>
                  / {questions.length} Correct
                </span>
              </div>

              <p>
                Your practice accuracy is{" "}
                <strong>{percentage}%</strong>.
              </p>

              <div className="nism-hero-buttons">
                <button
                  type="button"
                  className="nism-primary-btn"
                  onClick={() => {
                    setQuestions([]);
                    setCurrentIndex(0);
                    setSelectedAnswer("");
                    setAnswerChecked(false);
                    setIsCorrect(null);
                    setCorrectOption("");
                    setExplanation("");
                    setCorrectAnswers(0);
                    setAnsweredQuestions(0);
                  }}
                >
                  Practice Again
                </button>

                <button
                  type="button"
                  className="nism-secondary-btn"
                  onClick={backToUnits}
                >
                  Choose Another Unit
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="nism-practice-info">
        <div className="nism-container">
          <div className="nism-info-card">
            <h2>How Practice Mode Works</h2>

            <div className="nism-info-grid">
              <div>
                <strong>1. Select Unit</strong>
                <p>
                  Choose one of the 12 NISM Series V-A units.
                </p>
              </div>

              <div>
                <strong>2. Choose Questions</strong>
                <p>
                  Practice 10, 20 or 25 questions.
                </p>
              </div>

              <div>
                <strong>3. Answer</strong>
                <p>
                  Select your answer and check it instantly.
                </p>
              </div>

              <div>
                <strong>4. Learn</strong>
                <p>
                  Read the explanation after answering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nism-practice-disclaimer">
        <div className="nism-container">
          <p>
            <strong>Important:</strong> These practice questions
            are independently prepared for educational and
            preparation purposes. They are not official NISM
            examination questions and this practice platform is
            not endorsed by NISM.
          </p>

          <p>
            Always refer to the latest official NISM curriculum
            and test objectives for examination preparation.
          </p>
        </div>
      </section>
    </main>
  );
}
