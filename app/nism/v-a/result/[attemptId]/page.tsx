import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import NismResultTracker from "@/components/NismResultTracker";

type ResultPageProps = {
  params: Promise<{
    attemptId: string;
  }>;
};

type AnswerRow = {
  question_id: string;
  selected_option: string | null;
  is_correct: boolean;
};

type QuestionRow = {
  id: string;
  unit_number: number;
  unit_title: string | null;
  topic: string | null;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string | null;
  difficulty: "Easy" | "Medium" | "Hard";
};

export const dynamic = "force-dynamic";

export default async function NismResultPage({
  params,
}: ResultPageProps) {
  const { attemptId } = await params;

  const admin = supabaseAdmin();

  const { data: attempt, error: attemptError } = await admin
    .from("nism_attempts")
    .select("*")
    .eq("id", attemptId)
    .maybeSingle();

  if (attemptError || !attempt) {
    notFound();
  }

  const { data: attemptAnswers, error: answersError } = await admin
    .from("nism_attempt_answers")
    .select("question_id, selected_option, is_correct")
    .eq("attempt_id", attemptId);

  if (answersError) {
    throw answersError;
  }

  const { data: attemptQuestions, error: attemptQuestionsError } =
    await admin
      .from("nism_attempt_questions")
      .select("question_id, question_number")
      .eq("attempt_id", attemptId)
      .order("question_number", {
        ascending: true,
      });

  if (attemptQuestionsError) {
    throw attemptQuestionsError;
  }

  const questionIds =
    attemptQuestions?.map((item) => item.question_id) || [];

  const { data: questions, error: questionsError } = await admin
    .from("nism_questions")
    .select(`
      id,
      unit_number,
      unit_title,
      topic,
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      explanation,
      difficulty
    `)
    .in("id", questionIds);

  if (questionsError) {
    throw questionsError;
  }

  const questionMap = new Map<string, QuestionRow>();

  for (const question of (questions || []) as QuestionRow[]) {
    questionMap.set(question.id, question);
  }

  const answerMap = new Map<string, AnswerRow>();

  for (const answer of (attemptAnswers || []) as AnswerRow[]) {
    answerMap.set(answer.question_id, answer);
  }

  const correct = Number(attempt.correct_answers || 0);
  const wrong = Number(attempt.wrong_answers || 0);
  const unanswered = Number(attempt.unanswered || 0);
  const score = Number(attempt.score || correct);
  const percentage = Number(
    attempt.percentage ?? score
  );

  const passed =
    typeof attempt.passed === "boolean"
      ? attempt.passed
      : percentage >= 50;

  /*
    Unit-wise performance
  */
  const unitStats = new Map<
    number,
    {
      unit: number;
      title: string;
      total: number;
      correct: number;
    }
  >();

  /*
    Difficulty-wise performance
  */
  const difficultyStats = new Map<
    string,
    {
      difficulty: string;
      total: number;
      correct: number;
    }
  >();

  for (const item of attemptQuestions || []) {
    const question = questionMap.get(item.question_id);

    if (!question) continue;

    const answer = answerMap.get(item.question_id);

    /*
      Unit stats
    */
    const existingUnit = unitStats.get(question.unit_number);

    if (existingUnit) {
      existingUnit.total += 1;

      if (answer?.is_correct) {
        existingUnit.correct += 1;
      }
    } else {
      unitStats.set(question.unit_number, {
        unit: question.unit_number,
        title:
          question.unit_title ||
          `Unit ${question.unit_number}`,
        total: 1,
        correct: answer?.is_correct ? 1 : 0,
      });
    }

    /*
      Difficulty stats
    */
    const existingDifficulty = difficultyStats.get(
      question.difficulty
    );

    if (existingDifficulty) {
      existingDifficulty.total += 1;

      if (answer?.is_correct) {
        existingDifficulty.correct += 1;
      }
    } else {
      difficultyStats.set(question.difficulty, {
        difficulty: question.difficulty,
        total: 1,
        correct: answer?.is_correct ? 1 : 0,
      });
    }
  }

  const sortedUnits = Array.from(unitStats.values()).sort(
    (a, b) => a.unit - b.unit
  );

  const difficultyOrder = ["Easy", "Medium", "Hard"];

  const sortedDifficulty = difficultyOrder
    .map((difficulty) => difficultyStats.get(difficulty))
    .filter(Boolean);

  function optionText(
    question: QuestionRow,
    option: string | null
  ) {
    if (!option) {
      return "Not answered";
    }

    switch (option.toUpperCase()) {
      case "A":
        return `A. ${question.option_a}`;
      case "B":
        return `B. ${question.option_b}`;
      case "C":
        return `C. ${question.option_c}`;
      case "D":
        return `D. ${question.option_d}`;
      default:
        return option;
    }
  }

return (
  <main className="nism-result-page">

    <NismResultTracker
      attemptId={attemptId}
      testNumber={Number(attempt.test_number || 1)}
      score={score}
      percentage={percentage}
      correct={correct}
      wrong={wrong}
      unanswered={unanswered}
      passed={passed}
    />

    <section className="nism-result-hero">
        <div className="nism-result-container">
          <div className="nism-result-eyebrow">
            NISM SERIES V-A
          </div>

          <h1>Mock Test Result</h1>

          <p>
            Review your performance, identify knowledge gaps
            and continue your NISM V-A preparation.
          </p>
        </div>
      </section>

      <section className="nism-result-summary-section">
        <div className="nism-result-container">
          <div
            className={`nism-result-status ${
              passed ? "passed" : "not-passed"
            }`}
          >
            <div className="nism-result-status-label">
              {passed ? "PASS" : "NOT PASSED"}
            </div>

            <div className="nism-result-score">
              {score} / 100
            </div>

            <div className="nism-result-percentage">
              {percentage.toFixed(1)}%
            </div>

            <p>
              {passed
                ? "You reached the 50% practice-test passing threshold."
                : "Your practice score is below the 50% passing threshold. Review the explanations and try again."}
            </p>
          </div>

          <div className="nism-result-stat-grid">
            <div className="nism-result-stat">
              <span>Correct</span>
              <strong>{correct}</strong>
            </div>

            <div className="nism-result-stat">
              <span>Wrong</span>
              <strong>{wrong}</strong>
            </div>

            <div className="nism-result-stat">
              <span>Unanswered</span>
              <strong>{unanswered}</strong>
            </div>

            <div className="nism-result-stat">
              <span>Total Questions</span>
              <strong>100</strong>
            </div>
          </div>

          <div className="nism-result-actions">
            <Link
              href={`/nism/v-a/mock-test?test=${
                attempt.test_number || 1
              }`}
              className="nism-result-primary"
            >
              🔄 Retake Test
            </Link>

            <Link
              href="/nism/v-a/mock-tests"
              className="nism-result-secondary"
            >
              📚 All Mock Tests
            </Link>

            <Link
              href="/nism/v-a"
              className="nism-result-secondary"
            >
              ← NISM Preparation
            </Link>
          </div>
        </div>
      </section>

      <section className="nism-result-analysis-section">
        <div className="nism-result-container">
          <div className="nism-result-section-heading">
            <span>PERFORMANCE ANALYSIS</span>
            <h2>Where did you perform?</h2>
            <p>
              Use this analysis to identify the topics that
              deserve more revision.
            </p>
          </div>

          <div className="nism-result-analysis-grid">
            <div className="nism-result-card">
              <h3>📚 Unit-wise Performance</h3>

              <div className="nism-result-table-wrap">
                <table className="nism-result-table">
                  <thead>
                    <tr>
                      <th>Unit</th>
                      <th>Questions</th>
                      <th>Correct</th>
                      <th>Accuracy</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedUnits.map((item) => {
                      const accuracy =
                        item.total > 0
                          ? (item.correct / item.total) * 100
                          : 0;

                      return (
                        <tr key={item.unit}>
                          <td>
                            <strong>
                              Unit {item.unit}
                            </strong>
                            <small>
                              {item.title}
                            </small>
                          </td>

                          <td>{item.total}</td>

                          <td>{item.correct}</td>

                          <td>
                            <div className="nism-result-progress">
                              <span
                                style={{
                                  width: `${accuracy}%`,
                                }}
                              />
                            </div>

                            {accuracy.toFixed(0)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="nism-result-card">
              <h3>🎯 Difficulty Performance</h3>

              <div className="nism-difficulty-list">
                {sortedDifficulty.map((item) => {
                  if (!item) return null;

                  const accuracy =
                    item.total > 0
                      ? (item.correct / item.total) * 100
                      : 0;

                  return (
                    <div
                      className="nism-difficulty-item"
                      key={item.difficulty}
                    >
                      <div className="nism-difficulty-header">
                        <strong>
                          {item.difficulty}
                        </strong>

                        <span>
                          {item.correct}/{item.total}
                        </span>
                      </div>

                      <div className="nism-result-progress">
                        <span
                          style={{
                            width: `${accuracy}%`,
                          }}
                        />
                      </div>

                      <small>
                        {accuracy.toFixed(0)}% accuracy
                      </small>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="nism-answer-review-section">
        <div className="nism-result-container">
          <div className="nism-result-section-heading">
            <span>ANSWER REVIEW</span>
            <h2>Review every question</h2>
            <p>
              Compare your answer with the correct answer and
              read the explanation.
            </p>
          </div>

          <div className="nism-answer-list">
            {(attemptQuestions || []).map((item) => {
              const question = questionMap.get(
                item.question_id
              );

              if (!question) return null;

              const answer = answerMap.get(
                item.question_id
              );

              const isCorrect = answer?.is_correct;
              const selected =
                answer?.selected_option || null;

              return (
                <article
                  className={`nism-answer-card ${
                    isCorrect
                      ? "answer-correct"
                      : selected
                      ? "answer-wrong"
                      : "answer-unanswered"
                  }`}
                  key={item.question_id}
                >
                  <div className="nism-answer-top">
                    <span>
                      Question {item.question_number}
                    </span>

                    <span>
                      Unit {question.unit_number}
                    </span>

                    <span>
                      {question.difficulty}
                    </span>
                  </div>

                  <h3>{question.question_text}</h3>

                  <div className="nism-answer-details">
                    <div>
                      <label>Your Answer</label>

                      <p
                        className={
                          isCorrect
                            ? "answer-good"
                            : selected
                            ? "answer-bad"
                            : "answer-empty"
                        }
                      >
                        {optionText(
                          question,
                          selected
                        )}
                      </p>
                    </div>

                    <div>
                      <label>Correct Answer</label>

                      <p className="answer-good">
                        {optionText(
                          question,
                          question.correct_option
                        )}
                      </p>
                    </div>
                  </div>

                  {question.explanation && (
                    <div className="nism-answer-explanation">
                      <strong>
                        💡 Explanation
                      </strong>

                      <p>
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="nism-result-bottom-cta">
        <div className="nism-result-container">
          <h2>Keep Practising. Keep Improving.</h2>

          <p>
            Use your result to focus your revision and take
            another mock test when you are ready.
          </p>

          <Link
            href="/nism/v-a/mock-tests"
            className="nism-result-primary"
          >
            Start Another Mock Test →
          </Link>
        </div>
      </section>

      <section className="nism-result-disclaimer">
        <div className="nism-result-container">
          <p>
            <strong>Important:</strong> These are independent
            practice tests created for educational purposes.
            They are not official NISM examination papers
            and are not endorsed by NISM.
          </p>
        </div>
      </section>
    </main>
  );
}
