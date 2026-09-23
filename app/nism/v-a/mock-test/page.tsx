"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  questionNumber: number;
  id: string;
  unitNumber: number;
  unitTitle: string;
  topic: string | null;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  difficulty: string;
};

export default function NISMMockTestPage() {
  const router = useRouter();

  const [testNumber, setTestNumber] = useState(1);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<
    Record<string, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(120 * 60);

  /*
   * Get ?test=1 from the browser only.
   *
   * This avoids useSearchParams() during the
   * production build.
   */
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const value = Number(
      params.get("test") || "1"
    );

    if (
      Number.isInteger(value) &&
      value >= 1 &&
      value <= 10
    ) {
      setTestNumber(value);
    }
  }, []);


  /*
   * Start the test after testNumber is known.
   */
  useEffect(() => {
    async function startTest() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/nism/start",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              testNumber,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to start test."
          );
        }

        setQuestions(data.questions);
        setAttemptId(data.attemptId);

        setTimeLeft(
          data.durationMinutes * 60
        );

      } catch (err: any) {
        setError(
          err.message ||
            "Unable to start mock test."
        );
      } finally {
        setLoading(false);
      }
    }

    startTest();
  }, [testNumber]);


  /*
   * Timer
   */
  useEffect(() => {
    if (
      loading ||
      submitting ||
      questions.length === 0
    ) {
      return;
    }

    if (timeLeft <= 0) {
      submitTest(true);
      return;
    }

    const timer = window.setInterval(() => {
      setTimeLeft(
        (previous) =>
          previous > 0
            ? previous - 1
            : 0
      );
    }, 1000);

    return () =>
      window.clearInterval(timer);

  }, [
    loading,
    submitting,
    questions.length,
    timeLeft,
  ]);


  const current = questions[currentQuestion];


  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);


  function formatTime(seconds: number) {
    const hours = Math.floor(
      seconds / 3600
    );

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return `${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(
      2,
      "0"
    )}`;
  }


  function selectAnswer(option: string) {
    if (!current) return;

    setAnswers((previous) => ({
      ...previous,
      [current.id]: option,
    }));
  }


  function goNext() {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );
    }
  }


  function goPrevious() {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        (previous) => previous - 1
      );
    }
  }


  function goToQuestion(index: number) {
    setCurrentQuestion(index);
  }


  async function submitTest(
    automatic = false
  ) {
    if (
      submitting ||
      !attemptId
    ) {
      return;
    }

    if (!automatic) {
      const confirmed =
        window.confirm(
          "Are you sure you want to submit this mock test?"
        );

      if (!confirmed) {
        return;
      }
    }

    try {
      setSubmitting(true);

      const answerList =
        questions.map((question) => ({
          questionId: question.id,
          selectedOption:
            answers[question.id] ||
            null,
        }));

      const totalDuration =
        120 * 60;

      const timeTaken =
        totalDuration - timeLeft;

      const response =
        await fetch(
          "/api/nism/submit",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              attemptId,
              answers: answerList,
              timeTakenSeconds:
                Math.max(
                  0,
                  timeTaken
                ),
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to submit test."
        );
      }

      router.push(
        `/nism/v-a/result/${data.attemptId}`
      );

    } catch (err: any) {
      setSubmitting(false);

      window.alert(
        err.message ||
          "Unable to submit test."
      );
    }
  }


  if (loading) {
    return (
      <main className="nism-test-page">
        <section className="nism-test-loading">
          <div className="nism-test-loader">
            Loading Mock Test...
          </div>
        </section>
      </main>
    );
  }


  if (error) {
    return (
      <main className="nism-test-page">
        <section className="nism-test-loading">

          <h2>
            Unable to start test
          </h2>

          <p>{error}</p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/nism/v-a"
              )
            }
            className="nism-primary-btn"
          >
            Back to NISM V-A
          </button>

        </section>
      </main>
    );
  }


  if (!current) {
    return null;
  }


  return (
    <main className="nism-test-page">

      <header className="nism-test-header">

        <div>
          <div className="nism-test-label">
            NISM SERIES V-A
          </div>

          <h1>
            Mock Test {testNumber}
          </h1>
        </div>


        <div className="nism-test-progress">

          <span>
            {answeredCount}/
            {questions.length}
          </span>

          <small>
            Answered
          </small>

        </div>


        <div
          className={`nism-test-timer ${
            timeLeft <= 300
              ? "danger"
              : ""
          }`}
        >
          <span>⏱</span>{" "}
          {formatTime(timeLeft)}
        </div>

      </header>


      <section className="nism-test-layout">

        <div className="nism-question-area">

          <div className="nism-question-top">

            <span>
              Question{" "}
              {current.questionNumber}{" "}
              of{" "}
              {questions.length}
            </span>

            <span>
              {current.unitTitle}
            </span>

          </div>


          <div className="nism-question-card">

            <div className="nism-question-number">
              Q{current.questionNumber}
            </div>


            <h2>
              {current.questionText}
            </h2>


            <div className="nism-options">

              {(
                [
                  "A",
                  "B",
                  "C",
                  "D",
                ] as const
              ).map((option) => {

                const selected =
                  answers[
                    current.id
                  ] === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`nism-option ${
                      selected
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      selectAnswer(
                        option
                      )
                    }
                  >

                    <span className="nism-option-letter">
                      {option}
                    </span>

                    <span>
                      {
                        current.options[
                          option
                        ]
                      }
                    </span>

                  </button>
                );
              })}

            </div>

          </div>


          <div className="nism-test-navigation">

            <button
              type="button"
              onClick={
                goPrevious
              }
              disabled={
                currentQuestion === 0
              }
              className="nism-nav-btn secondary"
            >
              ← Previous
            </button>


            {currentQuestion <
            questions.length - 1 ? (

              <button
                type="button"
                onClick={goNext}
                className="nism-nav-btn primary"
              >
                Next →
              </button>

            ) : (

              <button
                type="button"
                onClick={() =>
                  submitTest(false)
                }
                disabled={
                  submitting
                }
                className="nism-nav-btn submit"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Test"}
              </button>

            )}

          </div>

        </div>


        <aside className="nism-question-sidebar">

          <div className="nism-sidebar-heading">

            <strong>
              Questions
            </strong>

            <span>
              {answeredCount}/
              {questions.length}
            </span>

          </div>


          <div className="nism-question-grid">

            {questions.map(
              (
                question,
                index
              ) => {

                const answered =
                  Boolean(
                    answers[
                      question.id
                    ]
                  );

                const active =
                  index ===
                  currentQuestion;

                return (
                  <button
                    key={
                      question.id
                    }
                    type="button"
                    onClick={() =>
                      goToQuestion(
                        index
                      )
                    }
                    className={`
                      nism-question-number-btn
                      ${
                        answered
                          ? "answered"
                          : ""
                      }
                      ${
                        active
                          ? "active"
                          : ""
                      }
                    `}
                  >
                    {index + 1}
                  </button>
                );
              }
            )}

          </div>


          <div className="nism-sidebar-legend">

            <div>
              <span className="legend-current" />
              Current
            </div>

            <div>
              <span className="legend-answered" />
              Answered
            </div>

            <div>
              <span className="legend-unanswered" />
              Unanswered
            </div>

          </div>

        </aside>

      </section>

    </main>
  );
}
