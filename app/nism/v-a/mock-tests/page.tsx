import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function NISMMockTestsPage() {
  const supabase = supabaseAdmin();

  const { data: tests } = await supabase
    .from("nism_mock_tests")
    .select("*")
    .eq("module_code", "V-A")
    .eq("is_active", true)
    .order("test_number", {
      ascending: true,
    });

  return (
    <main className="nism-page">

      <section className="nism-hero">
        <div className="nism-hero-inner">

          <div className="nism-eyebrow">
            NISM SERIES V-A
          </div>

          <h1>
            10 Mock Tests
            <span>Practice • Test • Improve</span>
          </h1>

          <p>
            Each new attempt is generated from the
            question bank. The question combination
            can change every time you start a test.
          </p>

        </div>
      </section>


      <section className="nism-section">

        <div className="nism-container">

          <div className="nism-section-heading">

            <div className="nism-small-title">
              FULL-LENGTH PRACTICE
            </div>

            <h2>
              Select a mock test
            </h2>

            <p>
              Each practice test is configured for
              100 questions and 120 minutes.
            </p>

          </div>


          <div className="nism-card-grid">

            {tests?.map((test) => (

              <div
                className="nism-feature-card"
                key={test.id}
              >

                <div className="nism-card-icon">
                  🎯
                </div>

                <h3>
                  Mock Test {test.test_number}
                </h3>

                <p>
                  {test.question_count} questions
                  <br />
                  {test.duration_minutes} minutes
                  <br />
                  Passing reference:{" "}
                  {test.passing_percentage}%
                </p>

                <Link
                  href={`/nism/v-a/mock-test?test=${test.test_number}`}
                  className="nism-mock-test-btn"
                >
                  Start Test →
                </Link>

              </div>

            ))}

          </div>

        </div>

      </section>


      <section className="nism-disclaimer">

        <div className="nism-container">

          <p>
            These are independent practice tests and
            are not official NISM examination papers.
            Refer to NISM for the latest official
            examination information.
          </p>

        </div>

      </section>

    </main>
  );
}
