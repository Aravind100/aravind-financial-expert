"use client";

import { useEffect, useState } from "react";

type Question = {
  id: string;
  module_code: string;
  unit_number: number;
  unit_title: string;
  topic: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "A" | "B" | "C" | "D";
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
  source_type: string;
  source_reference: string;
  language: string;
  is_active: boolean;
};

const units = [
  { number: 1, title: "Investment Landscape" },
  { number: 2, title: "Concept and Role of Mutual Fund" },
  { number: 3, title: "Legal Structure" },
  { number: 4, title: "Legal and Regulatory Framework" },
  { number: 5, title: "Scheme Related Information" },
  { number: 6, title: "Fund Distribution and Channel Management" },
  {
    number: 7,
    title:
      "Net Asset Value, Total Expense Ratio and Investment Valuation",
  },
  { number: 8, title: "Taxation" },
  { number: 9, title: "Investor Services" },
  { number: 10, title: "Risk, Return and Performance" },
  { number: 11, title: "Mutual Fund Scheme Selection" },
  { number: 12, title: "Financial Planning" },
];

const emptyForm = {
  unit_number: 1,
  topic: "",
  question_text: "",
  option_a: "",
  option_b: "",
  option_c: "",
  option_d: "",
  correct_option: "A" as "A" | "B" | "C" | "D",
  explanation: "",
  difficulty: "Medium" as "Easy" | "Medium" | "Hard",
};

export default function NismQuestionBank() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [unit, setUnit] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadQuestions() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (unit) {
        params.set("unit", unit);
      }

      if (difficulty) {
        params.set("difficulty", difficulty);
      }

      const response = await fetch(
        `/api/admin/nism/questions?${params.toString()}`,
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to load questions"
        );
      }

      setQuestions(data.questions || []);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load questions"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions();
  }, [search, unit, difficulty]);

  function updateForm(
    field: keyof typeof emptyForm,
    value: string | number
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function startEdit(question: Question) {
    setEditingId(question.id);

    setForm({
      unit_number: question.unit_number,
      topic: question.topic || "",
      question_text: question.question_text || "",
      option_a: question.option_a || "",
      option_b: question.option_b || "",
      option_c: question.option_c || "",
      option_d: question.option_d || "",
      correct_option: question.correct_option,
      explanation: question.explanation || "",
      difficulty: question.difficulty,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveQuestion() {
    if (!form.question_text.trim()) {
      setMessage("Please enter the question.");
      return;
    }

    if (!form.option_a.trim()) {
      setMessage("Please enter Option A.");
      return;
    }

    if (!form.option_b.trim()) {
      setMessage("Please enter Option B.");
      return;
    }

    if (!form.option_c.trim()) {
      setMessage("Please enter Option C.");
      return;
    }

    if (!form.option_d.trim()) {
      setMessage("Please enter Option D.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        unit_title:
          units.find(
            (item) =>
              item.number === Number(form.unit_number)
          )?.title || "Investment Landscape",
      };

      const response = await fetch(
        editingId
          ? `/api/admin/nism/questions/${editingId}`
          : "/api/admin/nism/questions",
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to save question"
        );
      }

      setMessage(
        editingId
          ? "Question updated successfully."
          : "Question added successfully."
      );

      resetForm();
      await loadQuestions();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save question"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deactivateQuestion(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this question?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/nism/questions/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to deactivate question"
        );
      }

      setMessage(
        "Question deactivated successfully."
      );

      await loadQuestions();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to deactivate question"
      );
    }
  }

  /* =========================
     BULK CSV UPLOAD
     ========================= */

  async function uploadCSV(file: File) {
    setSaving(true);
    setMessage("");

    try {
      const csvText = await file.text();

      if (!csvText.trim()) {
        throw new Error(
          "The CSV file is empty."
        );
      }

      const response = await fetch(
        "/api/admin/nism/questions/bulk",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            csvText,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Bulk upload failed."
        );
      }

      const invalidCount =
        data.invalidRows?.length || 0;

      setMessage(
        `Upload complete: ${data.imported || 0} imported, ${
          data.skipped || 0
        } duplicates skipped, ${invalidCount} invalid rows.`
      );

      await loadQuestions();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Bulk upload failed."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="nism-admin-page">

      {/* =========================
          HEADER
          ========================= */}

      <div className="nism-admin-header">

        <div>

          <div className="nism-admin-eyebrow">
            NISM SERIES V-A
          </div>

          <h1>NISM Question Bank</h1>

          <p>
            Create, edit, search and manage original
            NISM V-A practice questions for your
            mock tests.
          </p>

        </div>

        <div className="nism-admin-count">

          <strong>
            {questions.length}
          </strong>

          <span>
            Questions
          </span>

        </div>

      </div>


      {/* GENERAL MESSAGE */}

      {message && (
        <div className="nism-admin-message">
          {message}
        </div>
      )}


      {/* =========================
          ADD / EDIT QUESTION
          ========================= */}

      <section className="nism-admin-card">

        <div className="nism-admin-card-header">

          <div>

            <h2>
              {editingId
                ? "Edit Question"
                : "Add New Question"}
            </h2>

            <p>
              Add original practice questions based
              on the published NISM Series V-A
              objectives.
            </p>

          </div>

          {editingId && (
            <button
              type="button"
              className="nism-admin-secondary"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}

        </div>


        <div className="nism-admin-form-grid">

          <label>
            Unit

            <select
              value={form.unit_number}
              onChange={(event) =>
                updateForm(
                  "unit_number",
                  Number(event.target.value)
                )
              }
            >

              {units.map((item) => (
                <option
                  key={item.number}
                  value={item.number}
                >
                  Unit {item.number} — {item.title}
                </option>
              ))}

            </select>

          </label>


          <label>
            Topic

            <input
              value={form.topic}
              onChange={(event) =>
                updateForm(
                  "topic",
                  event.target.value
                )
              }
              placeholder="Example: Risk Profiling"
            />

          </label>


          <label>
            Difficulty

            <select
              value={form.difficulty}
              onChange={(event) =>
                updateForm(
                  "difficulty",
                  event.target.value
                )
              }
            >

              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>

            </select>

          </label>


          <label>
            Correct Answer

            <select
              value={form.correct_option}
              onChange={(event) =>
                updateForm(
                  "correct_option",
                  event.target.value
                )
              }
            >

              <option value="A">
                A
              </option>

              <option value="B">
                B
              </option>

              <option value="C">
                C
              </option>

              <option value="D">
                D
              </option>

            </select>

          </label>

        </div>


        <label className="nism-admin-full-field">

          Question

          <textarea
            rows={4}
            value={form.question_text}
            onChange={(event) =>
              updateForm(
                "question_text",
                event.target.value
              )
            }
            placeholder="Enter the question..."
          />

        </label>


        <div className="nism-admin-options-grid">

          <label>

            Option A

            <input
              value={form.option_a}
              onChange={(event) =>
                updateForm(
                  "option_a",
                  event.target.value
                )
              }
            />

          </label>


          <label>

            Option B

            <input
              value={form.option_b}
              onChange={(event) =>
                updateForm(
                  "option_b",
                  event.target.value
                )
              }
            />

          </label>


          <label>

            Option C

            <input
              value={form.option_c}
              onChange={(event) =>
                updateForm(
                  "option_c",
                  event.target.value
                )
              }
            />

          </label>


          <label>

            Option D

            <input
              value={form.option_d}
              onChange={(event) =>
                updateForm(
                  "option_d",
                  event.target.value
                )
              }
            />

          </label>

        </div>


        <label className="nism-admin-full-field">

          Explanation

          <textarea
            rows={4}
            value={form.explanation}
            onChange={(event) =>
              updateForm(
                "explanation",
                event.target.value
              )
            }
            placeholder="Explain why the correct answer is correct..."
          />

        </label>


        <div className="nism-admin-form-actions">

          <button
            type="button"
            className="nism-admin-primary"
            onClick={saveQuestion}
            disabled={saving}
          >

            {saving
              ? "Saving..."
              : editingId
              ? "Update Question"
              : "Add Question"}

          </button>


          <button
            type="button"
            className="nism-admin-secondary"
            onClick={resetForm}
          >
            Clear
          </button>

        </div>

      </section>


      {/* =========================
          BULK CSV UPLOAD
          ========================= */}

      <section className="nism-admin-card nism-bulk-upload-card">

        <div className="nism-admin-card-header">

          <div>

            <h2>
              📥 Bulk Upload Questions
            </h2>

            <p>
              Upload multiple original NISM V-A
              practice questions using a CSV file.
            </p>

          </div>

        </div>


        <div className="nism-bulk-upload-box">

          <div className="nism-bulk-upload-info">

            <strong>
              CSV format
            </strong>

            <p>
              Your CSV must contain these columns:
            </p>

            <code>
              unit_number, topic, question_text,
              option_a, option_b, option_c,
              option_d, correct_option, explanation,
              difficulty
            </code>

            <p>
              Correct answer must be A, B, C or D.
              Difficulty must be Easy, Medium or Hard.
            </p>

          </div>


          <label className="nism-upload-button">

            {saving
              ? "Uploading..."
              : "Choose CSV File"}

            <input
              type="file"
              accept=".csv,text/csv"
              disabled={saving}
              onChange={(event) => {

                const file =
                  event.target.files?.[0];

                if (file) {
                  uploadCSV(file);
                }

                event.currentTarget.value = "";

              }}
            />

          </label>


          {/* =========================
              BULK UPLOAD RESULT
              ========================= */}

          {message && (
            <div className="nism-bulk-upload-message">
              {message}
            </div>
          )}

        </div>

      </section>


      {/* =========================
          QUESTION LIBRARY
          ========================= */}

      <section className="nism-admin-card">

        <div className="nism-admin-card-header">

          <div>

            <h2>
              Question Library
            </h2>

            <p>
              Search and manage your active
              practice questions.
            </p>

          </div>

        </div>


        <div className="nism-admin-filters">

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search questions, topics or units..."
          />


          <select
            value={unit}
            onChange={(event) =>
              setUnit(event.target.value)
            }
          >

            <option value="">
              All Units
            </option>

            {units.map((item) => (
              <option
                key={item.number}
                value={item.number}
              >
                Unit {item.number}
              </option>
            ))}

          </select>


          <select
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value)
            }
          >

            <option value="">
              All Difficulties
            </option>

            <option value="Easy">
              Easy
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="Hard">
              Hard
            </option>

          </select>

        </div>


        {loading ? (

          <div className="nism-admin-empty">
            Loading questions...
          </div>

        ) : questions.length === 0 ? (

          <div className="nism-admin-empty">
            No questions found.
          </div>

        ) : (

          <div className="nism-admin-question-list">

            {questions.map(
              (question, index) => (

                <article
                  key={question.id}
                  className="nism-admin-question"
                >

                  <div className="nism-admin-question-top">

                    <span>
                      #{index + 1}
                    </span>

                    <span>
                      Unit {question.unit_number}
                    </span>

                    <span>
                      {question.difficulty}
                    </span>

                    <span>
                      Answer:{" "}
                      {question.correct_option}
                    </span>

                  </div>


                  <h3>
                    {question.question_text}
                  </h3>


                  <div className="nism-admin-option-preview">

                    <div>
                      <b>A.</b>{" "}
                      {question.option_a}
                    </div>

                    <div>
                      <b>B.</b>{" "}
                      {question.option_b}
                    </div>

                    <div>
                      <b>C.</b>{" "}
                      {question.option_c}
                    </div>

                    <div>
                      <b>D.</b>{" "}
                      {question.option_d}
                    </div>

                  </div>


                  {question.explanation && (
                    <p className="nism-admin-explanation">

                      <strong>
                        Explanation:
                      </strong>{" "}

                      {question.explanation}

                    </p>
                  )}


                  <div className="nism-admin-question-actions">

                    <button
                      type="button"
                      className="nism-admin-secondary"
                      onClick={() =>
                        startEdit(question)
                      }
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="nism-admin-danger"
                      onClick={() =>
                        deactivateQuestion(
                          question.id
                        )
                      }
                    >
                      Deactivate
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}
