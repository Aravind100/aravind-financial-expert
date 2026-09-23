import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function NISMResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  const supabase = supabaseAdmin();

  const { data: attempt, error } = await supabase
    .from("nism_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (error || !attempt) {
    return (
      <main className="nism-result-page">
        <section className="nism-result-card">
          <h1>Result Not Found</h1>

          <p>
            We could not find this test attempt.
          </p>

          <Link
            href="/nism/v-a"
            className="nism-primary-btn"
          >
            Back to NISM V-A
          </Link>
        </section>
      </main>
    );
  }

  const percentage = Number(
    attempt.percentage || 0
  );

  const passed = Boolean(attempt.passed);

  const minutes = Math.floor(
    (attempt.time_taken_seconds || 0) / 60
  );

  const seconds =
    (attempt.time_taken_seconds || 0) % 60;

  return (
    <main className="nism-result-page">

      <section className="nism-result-card">

        <div className="nism-result-label">
          NISM SERIES V-A
        </div>

        <h1>
          Mock Test Result
        </h1>

        <div
          className={`nism-result-status ${
            passed ? "passed" : "not-passed"
          }`}
        >
          {passed
            ? "Practice Target Achieved"
            : "Keep Practicing"}
        </div>


        <div className="nism-result-score">

          <strong>
            {percentage}%
          </strong>

          <span>
            {attempt.score} /{" "}
            {attempt.total_questions}
          </span>

        </div>


        <div className="nism-result-grid">

          <div>
            <strong>
              {attempt.attempted_questions}
            </strong>
            <span>Attempted</span>
          </div>

          <div>
            <strong>
              {attempt.correct_answers}
            </strong>
            <span>Correct</span>
          </div>

          <div>
            <strong>
              {attempt.wrong_answers}
            </strong>
            <span>Wrong</span>
          </div>

          <div>
            <strong>
              {attempt.unanswered_questions}
            </strong>
            <span>Unanswered</span>
          </div>

          <div>
            <strong>
              {minutes}m {seconds}s
            </strong>
            <span>Time Used</span>
          </div>

        </div>


        <div className="nism-result-note">

          <strong>
            Practice result
          </strong>

          <p>
            This is an independent practice test.
            The official NISM certification
            examination should be treated as a
            separate examination.
          </p>

        </div>


        <div className="nism-result-actions">

          <Link
            href="/nism/v-a/mock-tests"
            className="nism-primary-btn"
          >
            Take Another Mock Test
          </Link>

          <Link
            href="/nism/v-a"
            className="nism-secondary-btn"
          >
            Back to Preparation
          </Link>

        </div>

      </section>

    </main>
  );
}
