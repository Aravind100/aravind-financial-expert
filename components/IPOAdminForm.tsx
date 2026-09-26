"use client";

import { FormEvent, useState } from "react";

type IPO = {
  id?: string;
  company_name: string;
  slug: string;
  status: string;
  issue_type: string;
  price_band_min: number | null;
  price_band_max: number | null;
  face_value: number | null;
  issue_size: number | null;
  fresh_issue: number | null;
  offer_for_sale: number | null;
  lot_size: number | null;
  minimum_investment: number | null;
  open_date: string | null;
  close_date: string | null;
  allotment_date: string | null;
  listing_date: string | null;
  registrar: string | null;
  lead_managers: string | null;
  company_overview: string | null;
  business_description: string | null;
  business_model: string | null;
  industry: string | null;
  competitive_strengths: string | null;
  risks: string | null;
  objects_of_issue: string | null;
  management: string | null;
  eps: number | null;
  pe_ratio: number | null;
  pb_ratio: number | null;
  roe: number | null;
  roce: number | null;
  debt_equity: number | null;
  retail_quota: number | null;
  nii_quota: number | null;
  qib_quota: number | null;
  employee_quota: number | null;
  other_quota: number | null;
  retail_lot_size: number | null;
  nii_lot_size: number | null;
  subscription_data: string | null;
  listing_information: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_published: boolean;
};

type QuarterlyResult = {
  id?: string;
  ipo_id?: string;
  financial_year: string;
  quarter: string;
  revenue: number | null;
  ebitda: number | null;
  pat: number | null;
  eps: number | null;
};

type ManagementMember = {
  id?: string;
  ipo_id?: string;
  name: string;
  designation: string | null;
  role: string | null;
  profile: string | null;
};

type SubscriptionRecord = {
  id?: string;
  ipo_id?: string;
  category: string;
  subscription_times: number | null;
  updated_on: string | null;
};

type Props = {
  initialIPOs: IPO[];
};

const emptyIPO: IPO = {
  company_name: "",
  slug: "",
  status: "upcoming",
  issue_type: "Mainboard",

  price_band_min: null,
  price_band_max: null,
  face_value: null,

  issue_size: null,
  fresh_issue: null,
  offer_for_sale: null,

  lot_size: null,
  minimum_investment: null,

  open_date: null,
  close_date: null,
  allotment_date: null,
  listing_date: null,

  registrar: "",
  lead_managers: "",

  company_overview: "",
  business_description: "",
  business_model: "",
  industry: "",
  competitive_strengths: "",
  risks: "",
  objects_of_issue: "",
  management: "",

  eps: null,
  pe_ratio: null,
  pb_ratio: null,
  roe: null,
  roce: null,
  debt_equity: null,

  retail_quota: null,
  nii_quota: null,
  qib_quota: null,
  employee_quota: null,
  other_quota: null,

  retail_lot_size: null,
  nii_lot_size: null,

  subscription_data: "",
  listing_information: "",

  logo_url: "",
  banner_url: "",

  is_published: false,
};

function numberValue(value: string) {
  if (value === "") return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function IPOAdminForm({ initialIPOs }: Props) {
  const [ipos, setIPOs] = useState<IPO[]>(initialIPOs);
  const [form, setForm] = useState<IPO>(emptyIPO);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [quarterlyResults, setQuarterlyResults] = useState<QuarterlyResult[]>([]);
  const [quarterlyLoading, setQuarterlyLoading] = useState(false);
  const [quarterlySaving, setQuarterlySaving] = useState(false);
  const [quarterlyEditingId, setQuarterlyEditingId] = useState<string | null>(null);
  const [quarterlyForm, setQuarterlyForm] = useState<QuarterlyResult>({
    financial_year: "",
    quarter: "Q4",
    revenue: null,
    ebitda: null,
    pat: null,
    eps: null,
  });

  const [managementMembers, setManagementMembers] = useState<ManagementMember[]>([]);
  const [managementLoading, setManagementLoading] = useState(false);
  const [managementSaving, setManagementSaving] = useState(false);
  const [managementEditingId, setManagementEditingId] = useState<string | null>(null);
  const [managementForm, setManagementForm] = useState<ManagementMember>({
    name: "", designation: "", role: "", profile: "",
  });

  const [subscriptionRecords, setSubscriptionRecords] = useState<SubscriptionRecord[]>([]);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionSaving, setSubscriptionSaving] = useState(false);
  const [subscriptionEditingId, setSubscriptionEditingId] = useState<string | null>(null);
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionRecord>({
    category: "Retail",
    subscription_times: null,
    updated_on: new Date().toISOString().slice(0, 10),
  });

  function updateField(
    field: keyof IPO,
    value: string | number | boolean | null
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateText(field: keyof IPO, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleCompanyNameChange(value: string) {
    setForm((current) => ({
      ...current,
      company_name: value,
      slug: editingId ? current.slug : createSlug(value),
    }));
  }

  function resetQuarterlyForm() {
    setQuarterlyEditingId(null);
    setQuarterlyForm({
      financial_year: "",
      quarter: "Q4",
      revenue: null,
      ebitda: null,
      pat: null,
      eps: null,
    });
  }

  function updateQuarterlyField(
    field: keyof QuarterlyResult,
    value: string | number | null
  ) {
    setQuarterlyForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetManagementForm() {
    setManagementEditingId(null);
    setManagementForm({ name: "", designation: "", role: "", profile: "" });
  }

  function updateManagementField(field: keyof ManagementMember, value: string | null) {
    setManagementForm((current) => ({ ...current, [field]: value }));
  }

  async function loadManagementMembers(ipoId: string) {
    setManagementLoading(true);
    try {
      const response = await fetch(`/api/admin/ipo/${ipoId}/management`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to load management information.");
      setManagementMembers(data.management || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load management information.");
    } finally { setManagementLoading(false); }
  }

  async function saveManagementMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) { setError("Please save the IPO first before adding management members."); return; }
    if (!managementForm.name.trim()) { setError("Management member name is required."); return; }
    setManagementSaving(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/admin/ipo/${editingId}/management`, {
        method: managementEditingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...managementForm, management_id: managementEditingId || undefined }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to save management member.");
      if (managementEditingId) {
        setManagementMembers((current) => current.map((item) => item.id === managementEditingId ? data.management : item));
        setMessage("Management member updated successfully.");
      } else {
        setManagementMembers((current) => [...current, data.management]);
        setMessage("Management member added successfully.");
      }
      resetManagementForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save management member.");
    } finally { setManagementSaving(false); }
  }

  function editManagementMember(member: ManagementMember) {
    setManagementEditingId(member.id || null);
    setManagementForm({ name: member.name || "", designation: member.designation || "", role: member.role || "", profile: member.profile || "" });
  }

  async function deleteManagementMember(memberId: string) {
    if (!editingId) return;
    if (!window.confirm("Are you sure you want to delete this management member?")) return;
    try {
      const response = await fetch(`/api/admin/ipo/${editingId}/management`, {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ management_id: memberId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to delete management member.");
      setManagementMembers((current) => current.filter((item) => item.id !== memberId));
      if (managementEditingId === memberId) resetManagementForm();
      setMessage("Management member deleted successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete management member.");
    }
  }

  async function loadQuarterlyResults(ipoId: string) {
    setQuarterlyLoading(true);

    try {
      const response = await fetch(
        `/api/admin/ipo/${ipoId}/quarterly`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to load quarterly results.");
      }

      setQuarterlyResults(data.results || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load quarterly results."
      );
    } finally {
      setQuarterlyLoading(false);
    }
  }

  async function saveQuarterlyResult(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingId) {
      setError("Please save the IPO first before adding quarterly results.");
      return;
    }

    if (!quarterlyForm.financial_year.trim()) {
      setError("Financial year is required.");
      return;
    }

    if (!quarterlyEditingId && quarterlyResults.length >= 4) {
      setError("Only 4 quarterly results can be managed here.");
      return;
    }

    setQuarterlySaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/ipo/${editingId}/quarterly`,
        {
          method: quarterlyEditingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...quarterlyForm,
            result_id: quarterlyEditingId || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to save quarterly result."
        );
      }

      if (quarterlyEditingId) {
        setQuarterlyResults((current) =>
          current.map((item) =>
            item.id === quarterlyEditingId ? data.result : item
          )
        );
        setMessage("Quarterly result updated successfully.");
      } else {
        setQuarterlyResults((current) => [data.result, ...current]);
        setMessage("Quarterly result added successfully.");
      }

      resetQuarterlyForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save quarterly result."
      );
    } finally {
      setQuarterlySaving(false);
    }
  }

  function editQuarterlyResult(result: QuarterlyResult) {
    setQuarterlyEditingId(result.id || null);
    setQuarterlyForm({
      financial_year: result.financial_year || "",
      quarter: result.quarter || "Q4",
      revenue: result.revenue ?? null,
      ebitda: result.ebitda ?? null,
      pat: result.pat ?? null,
      eps: result.eps ?? null,
    });
  }

  async function deleteQuarterlyResult(resultId: string) {
    if (!editingId) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this quarterly result?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/ipo/${editingId}/quarterly`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ result_id: resultId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to delete quarterly result."
        );
      }

      setQuarterlyResults((current) =>
        current.filter((item) => item.id !== resultId)
      );

      if (quarterlyEditingId === resultId) {
        resetQuarterlyForm();
      }

      setMessage("Quarterly result deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete quarterly result."
      );
    }
  }

  function resetSubscriptionForm() {
    setSubscriptionEditingId(null);
    setSubscriptionForm({
      category: "Retail",
      subscription_times: null,
      updated_on: new Date().toISOString().slice(0, 10),
    });
  }

  function updateSubscriptionField(
    field: keyof SubscriptionRecord,
    value: string | number | null
  ) {
    setSubscriptionForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function loadSubscriptionRecords(ipoId: string) {
    setSubscriptionLoading(true);

    try {
      const response = await fetch(
        `/api/admin/ipo/${ipoId}/subscription`,
        { cache: "no-store" }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to load subscription information."
        );
      }

      setSubscriptionRecords(data.subscriptions || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load subscription information."
      );
    } finally {
      setSubscriptionLoading(false);
    }
  }

  async function saveSubscriptionRecord(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingId) {
      setError("Please save the IPO first before adding subscription data.");
      return;
    }

    if (!subscriptionForm.category.trim()) {
      setError("Subscription category is required.");
      return;
    }

    if (
      subscriptionForm.subscription_times === null ||
      subscriptionForm.subscription_times === undefined
    ) {
      setError("Subscription times is required.");
      return;
    }

    setSubscriptionSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/ipo/${editingId}/subscription`,
        {
          method: subscriptionEditingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...subscriptionForm,
            subscription_id: subscriptionEditingId || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to save subscription information."
        );
      }

      if (subscriptionEditingId) {
        setSubscriptionRecords((current) =>
          current.map((item) =>
            item.id === subscriptionEditingId
              ? data.subscription
              : item
          )
        );
        setMessage("Subscription data updated successfully.");
      } else {
        setSubscriptionRecords((current) => [
          ...current,
          data.subscription,
        ]);
        setMessage("Subscription data added successfully.");
      }

      resetSubscriptionForm();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save subscription information."
      );
    } finally {
      setSubscriptionSaving(false);
    }
  }

  function editSubscriptionRecord(record: SubscriptionRecord) {
    setSubscriptionEditingId(record.id || null);
    setSubscriptionForm({
      category: record.category || "Retail",
      subscription_times: record.subscription_times ?? null,
      updated_on:
        record.updated_on ||
        new Date().toISOString().slice(0, 10),
    });
  }

  async function deleteSubscriptionRecord(recordId: string) {
    if (!editingId) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this subscription record?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/ipo/${editingId}/subscription`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription_id: recordId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to delete subscription record."
        );
      }

      setSubscriptionRecords((current) =>
        current.filter((item) => item.id !== recordId)
      );

      if (subscriptionEditingId === recordId) {
        resetSubscriptionForm();
      }

      setMessage("Subscription data deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete subscription record."
      );
    }
  }

  function resetForm() {
    setForm(emptyIPO);
    setEditingId(null);
    setQuarterlyResults([]);
    resetQuarterlyForm();
    setManagementMembers([]);
    resetManagementForm();
    setSubscriptionRecords([]);
    resetSubscriptionForm();
    setMessage("");
    setError("");
  }

  function editIPO(ipo: IPO) {
    setForm({
      ...emptyIPO,
      ...ipo,
    });

    setEditingId(ipo.id || null);

    if (ipo.id) {
      loadQuarterlyResults(ipo.id);
      loadManagementMembers(ipo.id);
      loadSubscriptionRecords(ipo.id);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteIPO(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this IPO?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/ipo/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to delete IPO.");
        return;
      }

      setIPOs((current) =>
        current.filter((ipo) => ipo.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setMessage("IPO deleted successfully.");
    } catch {
      setError("Unable to connect to the server.");
    }
  }

  async function togglePublish(ipo: IPO) {
    if (!ipo.id) return;

    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/ipo/${ipo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_published: !ipo.is_published,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to update IPO.");
        return;
      }

      setIPOs((current) =>
        current.map((item) =>
          item.id === ipo.id
            ? {
                ...item,
                is_published: !ipo.is_published,
              }
            : item
        )
      );

      setMessage(
        ipo.is_published
          ? "IPO unpublished."
          : "IPO published."
      );
    } catch {
      setError("Unable to connect to the server.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    if (!form.company_name.trim()) {
      setError("Company name is required.");
      setSaving(false);
      return;
    }

    if (!form.slug.trim()) {
      setError("Slug is required.");
      setSaving(false);
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/ipo/${editingId}`
        : "/api/admin/ipo";

      const method = editingId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to save IPO.");
        setSaving(false);
        return;
      }

      const savedIPO = data.ipo;

      if (editingId) {
        setIPOs((current) =>
          current.map((ipo) =>
            ipo.id === editingId ? savedIPO : ipo
          )
        );

        setMessage("IPO updated successfully.");
      } else {
        setIPOs((current) => [
          savedIPO,
          ...current,
        ]);

        setMessage("IPO added successfully.");
      }

      setForm({
        ...emptyIPO,
        ...savedIPO,
      });

      setEditingId(savedIPO.id);
    } catch {
      setError("Unable to connect to the server.");
    }

    setSaving(false);
  }

  return (
    <div className="ipo-admin-page">

      {/* ================================= */}
      {/* FORM HEADER */}
      {/* ================================= */}

      <section className="ipo-admin-card">

        <div className="ipo-admin-card-header">
          <div>
            <span className="ipo-admin-label">
              {editingId ? "EDIT IPO" : "ADD NEW IPO"}
            </span>

            <h2>
              {editingId
                ? "Update IPO Information"
                : "Create IPO Listing"}
            </h2>

            <p>
              Enter the factual information exactly as disclosed
              in the relevant IPO documents.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              className="ipo-secondary-button"
              onClick={resetForm}
            >
              + Add New IPO
            </button>
          )}
        </div>

        {message && (
          <div className="ipo-success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="ipo-error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* ================================= */}
          {/* BASIC INFORMATION */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>01</span>
              <div>
                <h3>Basic IPO Information</h3>
                <p>Core issue details</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group ipo-full">
                <label>Company Name *</label>

                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) =>
                    handleCompanyNameChange(e.target.value)
                  }
                  placeholder="Example: ABC Technologies Limited"
                  required
                />
              </div>

              <div className="ipo-form-group">
                <label>URL Slug *</label>

                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    updateText(
                      "slug",
                      createSlug(e.target.value)
                    )
                  }
                  placeholder="abc-technologies"
                  required
                />
              </div>

              <div className="ipo-form-group">
                <label>IPO Status</label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    updateText("status", e.target.value)
                  }
                >
                  <option value="upcoming">
                    Upcoming
                  </option>

                  <option value="open">
                    Open
                  </option>

                  <option value="closed">
                    Closed
                  </option>

                  <option value="listed">
                    Listed
                  </option>
                </select>
              </div>

              <div className="ipo-form-group">
                <label>Issue Type</label>

                <select
                  value={form.issue_type}
                  onChange={(e) =>
                    updateText(
                      "issue_type",
                      e.target.value
                    )
                  }
                >
                  <option value="Mainboard">
                    Mainboard
                  </option>

                  <option value="SME">
                    SME
                  </option>
                </select>
              </div>

              <div className="ipo-form-group">
                <label>Face Value (₹)</label>

                <input
                  type="number"
                  value={form.face_value ?? ""}
                  onChange={(e) =>
                    updateField(
                      "face_value",
                      numberValue(e.target.value)
                    )
                  }
                  placeholder="10"
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* PRICE & ISSUE */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>02</span>

              <div>
                <h3>Price & Issue Details</h3>
                <p>Pricing and issue size</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group">
                <label>Price Band — Minimum (₹)</label>

                <input
                  type="number"
                  value={form.price_band_min ?? ""}
                  onChange={(e) =>
                    updateField(
                      "price_band_min",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Price Band — Maximum (₹)</label>

                <input
                  type="number"
                  value={form.price_band_max ?? ""}
                  onChange={(e) =>
                    updateField(
                      "price_band_max",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Issue Size (₹ Crore)</label>

                <input
                  type="number"
                  value={form.issue_size ?? ""}
                  onChange={(e) =>
                    updateField(
                      "issue_size",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Fresh Issue (₹ Crore)</label>

                <input
                  type="number"
                  value={form.fresh_issue ?? ""}
                  onChange={(e) =>
                    updateField(
                      "fresh_issue",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Offer for Sale (₹ Crore)</label>

                <input
                  type="number"
                  value={form.offer_for_sale ?? ""}
                  onChange={(e) =>
                    updateField(
                      "offer_for_sale",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Lot Size (Shares)</label>

                <input
                  type="number"
                  value={form.lot_size ?? ""}
                  onChange={(e) =>
                    updateField(
                      "lot_size",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Minimum Investment (₹)</label>

                <input
                  type="number"
                  value={form.minimum_investment ?? ""}
                  onChange={(e) =>
                    updateField(
                      "minimum_investment",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* IMPORTANT DATES */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>03</span>

              <div>
                <h3>IPO Timeline</h3>
                <p>Important issue dates</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group">
                <label>Issue Open Date</label>

                <input
                  type="date"
                  value={form.open_date || ""}
                  onChange={(e) =>
                    updateText(
                      "open_date",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Issue Close Date</label>

                <input
                  type="date"
                  value={form.close_date || ""}
                  onChange={(e) =>
                    updateText(
                      "close_date",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Allotment Date</label>

                <input
                  type="date"
                  value={form.allotment_date || ""}
                  onChange={(e) =>
                    updateText(
                      "allotment_date",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Listing Date</label>

                <input
                  type="date"
                  value={form.listing_date || ""}
                  onChange={(e) =>
                    updateText(
                      "listing_date",
                      e.target.value
                    )
                  }
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* COMPANY */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>04</span>

              <div>
                <h3>Company Information</h3>
                <p>Business and company profile</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group ipo-full">
                <label>Company Overview</label>

                <textarea
                  rows={5}
                  value={form.company_overview || ""}
                  onChange={(e) =>
                    updateText(
                      "company_overview",
                      e.target.value
                    )
                  }
                  placeholder="Write a concise company overview..."
                />
              </div>

              <div className="ipo-form-group">
                <label>Industry</label>

                <input
                  type="text"
                  value={form.industry || ""}
                  onChange={(e) =>
                    updateText(
                      "industry",
                      e.target.value
                    )
                  }
                  placeholder="Example: Financial Services"
                />
              </div>

              <div className="ipo-form-group">
                <label>Registrar</label>

                <input
                  type="text"
                  value={form.registrar || ""}
                  onChange={(e) =>
                    updateText(
                      "registrar",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="ipo-form-group ipo-full">
                <label>Business Description</label>

                <textarea
                  rows={6}
                  value={form.business_description || ""}
                  onChange={(e) =>
                    updateText(
                      "business_description",
                      e.target.value
                    )
                  }
                  placeholder="Describe the company's business..."
                />
              </div>

              <div className="ipo-form-group ipo-full">
                <label>Business Model</label>

                <textarea
                  rows={5}
                  value={form.business_model || ""}
                  onChange={(e) =>
                    updateText(
                      "business_model",
                      e.target.value
                    )
                  }
                  placeholder="Explain how the company generates revenue..."
                />
              </div>

              <div className="ipo-form-group ipo-full">
                <label>Objects of the Issue</label>

                <textarea
                  rows={5}
                  value={form.objects_of_issue || ""}
                  onChange={(e) =>
                    updateText(
                      "objects_of_issue",
                      e.target.value
                    )
                  }
                  placeholder="How the IPO proceeds are proposed to be used..."
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* STRENGTHS & RISKS */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>05</span>

              <div>
                <h3>Strengths & Risks</h3>
                <p>Key information for investors</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group">
                <label>Competitive Strengths</label>

                <textarea
                  rows={7}
                  value={form.competitive_strengths || ""}
                  onChange={(e) =>
                    updateText(
                      "competitive_strengths",
                      e.target.value
                    )
                  }
                  placeholder="Enter key strengths..."
                />
              </div>

              <div className="ipo-form-group">
                <label>Risks</label>

                <textarea
                  rows={7}
                  value={form.risks || ""}
                  onChange={(e) =>
                    updateText(
                      "risks",
                      e.target.value
                    )
                  }
                  placeholder="Enter key risks..."
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* MANAGEMENT */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>06</span>

              <div>
                <h3>Management</h3>
                <p>Management and leadership information</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group">
                <label>Management / Promoters</label>

                <textarea
                  rows={6}
                  value={form.management || ""}
                  onChange={(e) =>
                    updateText(
                      "management",
                      e.target.value
                    )
                  }
                  placeholder="Enter management/promoter information..."
                />
              </div>

              <div className="ipo-form-group">
                <label>Lead Managers</label>

                <textarea
                  rows={6}
                  value={form.lead_managers || ""}
                  onChange={(e) =>
                    updateText(
                      "lead_managers",
                      e.target.value
                    )
                  }
                  placeholder="Enter book running lead managers..."
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* VALUATION */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>07</span>

              <div>
                <h3>Valuation & Financial Metrics</h3>
                <p>Reported metrics</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group">
                <label>EPS</label>

                <input
                  type="number"
                  step="any"
                  value={form.eps ?? ""}
                  onChange={(e) =>
                    updateField(
                      "eps",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>P/E Ratio</label>

                <input
                  type="number"
                  step="any"
                  value={form.pe_ratio ?? ""}
                  onChange={(e) =>
                    updateField(
                      "pe_ratio",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>P/B Ratio</label>

                <input
                  type="number"
                  step="any"
                  value={form.pb_ratio ?? ""}
                  onChange={(e) =>
                    updateField(
                      "pb_ratio",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>ROE (%)</label>

                <input
                  type="number"
                  step="any"
                  value={form.roe ?? ""}
                  onChange={(e) =>
                    updateField(
                      "roe",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>ROCE (%)</label>

                <input
                  type="number"
                  step="any"
                  value={form.roce ?? ""}
                  onChange={(e) =>
                    updateField(
                      "roce",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Debt / Equity</label>

                <input
                  type="number"
                  step="any"
                  value={form.debt_equity ?? ""}
                  onChange={(e) =>
                    updateField(
                      "debt_equity",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* RESERVATION */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>08</span>

              <div>
                <h3>IPO Reservation</h3>
                <p>Enter the reservation disclosed for this issue</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group">
                <label>QIB Quota (%)</label>

                <input
                  type="number"
                  step="any"
                  value={form.qib_quota ?? ""}
                  onChange={(e) =>
                    updateField(
                      "qib_quota",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>NII / HNI Quota (%)</label>

                <input
                  type="number"
                  step="any"
                  value={form.nii_quota ?? ""}
                  onChange={(e) =>
                    updateField(
                      "nii_quota",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Retail Quota (%)</label>

                <input
                  type="number"
                  step="any"
                  value={form.retail_quota ?? ""}
                  onChange={(e) =>
                    updateField(
                      "retail_quota",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Employee Quota (%)</label>

                <input
                  type="number"
                  step="any"
                  value={form.employee_quota ?? ""}
                  onChange={(e) =>
                    updateField(
                      "employee_quota",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Other Quota (%)</label>

                <input
                  type="number"
                  step="any"
                  value={form.other_quota ?? ""}
                  onChange={(e) =>
                    updateField(
                      "other_quota",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>Retail Lot Size</label>

                <input
                  type="number"
                  value={form.retail_lot_size ?? ""}
                  onChange={(e) =>
                    updateField(
                      "retail_lot_size",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

              <div className="ipo-form-group">
                <label>NII / HNI Lot Size</label>

                <input
                  type="number"
                  value={form.nii_lot_size ?? ""}
                  onChange={(e) =>
                    updateField(
                      "nii_lot_size",
                      numberValue(e.target.value)
                    )
                  }
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* QUARTERLY RESULTS */}
          {/* ================================= */}

          <div className="ipo-form-section">
            <div className="ipo-form-section-title">
              <span>09</span>
              <div>
                <h3>Last 4 Quarterly Results</h3>
                <p>Add the latest four reported quarters.</p>
              </div>
            </div>

            {!editingId ? (
              <div className="ipo-empty-state">
                Save the IPO first. Then add quarterly results.
              </div>
            ) : (
              <>
                <form onSubmit={saveQuarterlyResult}>
                  <div className="ipo-form-grid">
                    <div className="ipo-form-group">
                      <label>Financial Year *</label>
                      <input
                        type="text"
                        value={quarterlyForm.financial_year}
                        onChange={(e) =>
                          updateQuarterlyField(
                            "financial_year",
                            e.target.value
                          )
                        }
                        placeholder="FY2026"
                        required
                      />
                    </div>

                    <div className="ipo-form-group">
                      <label>Quarter *</label>
                      <select
                        value={quarterlyForm.quarter}
                        onChange={(e) =>
                          updateQuarterlyField(
                            "quarter",
                            e.target.value
                          )
                        }
                      >
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                    </div>

                    {(
                      [
                        ["revenue", "Revenue (₹ Crore)"],
                        ["ebitda", "EBITDA (₹ Crore)"],
                        ["pat", "PAT (₹ Crore)"],
                        ["eps", "EPS (₹)"],
                      ] as const
                    ).map(([field, label]) => (
                      <div className="ipo-form-group" key={field}>
                        <label>{label}</label>
                        <input
                          type="number"
                          step="any"
                          value={quarterlyForm[field] ?? ""}
                          onChange={(e) =>
                            updateQuarterlyField(
                              field,
                              numberValue(e.target.value)
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>

                  <div className="ipo-form-actions">
                    <button
                      type="submit"
                      className="ipo-primary-button"
                      disabled={quarterlySaving}
                    >
                      {quarterlySaving
                        ? "Saving..."
                        : quarterlyEditingId
                        ? "💾 Update Quarter"
                        : "➕ Add Quarter"}
                    </button>

                    {quarterlyEditingId && (
                      <button
                        type="button"
                        className="ipo-secondary-button"
                        onClick={resetQuarterlyForm}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>

                <div style={{ marginTop: 24, overflowX: "auto" }}>
                  <h4>Saved Quarterly Results</h4>

                  {quarterlyLoading ? (
                    <div className="ipo-empty-state">
                      Loading quarterly results...
                    </div>
                  ) : quarterlyResults.length === 0 ? (
                    <div className="ipo-empty-state">
                      No quarterly results added yet.
                    </div>
                  ) : (
                    <table
                      style={{
                        width: "100%",
                        minWidth: 720,
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr>
                          <th style={{ textAlign: "left", padding: 10 }}>FY</th>
                          <th style={{ textAlign: "left", padding: 10 }}>Quarter</th>
                          <th style={{ textAlign: "right", padding: 10 }}>Revenue</th>
                          <th style={{ textAlign: "right", padding: 10 }}>EBITDA</th>
                          <th style={{ textAlign: "right", padding: 10 }}>PAT</th>
                          <th style={{ textAlign: "right", padding: 10 }}>EPS</th>
                          <th style={{ textAlign: "right", padding: 10 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quarterlyResults.map((result) => (
                          <tr key={result.id}>
                            <td style={{ padding: 10 }}>{result.financial_year}</td>
                            <td style={{ padding: 10 }}>{result.quarter}</td>
                            <td style={{ textAlign: "right", padding: 10 }}>
                              {result.revenue ?? "—"}
                            </td>
                            <td style={{ textAlign: "right", padding: 10 }}>
                              {result.ebitda ?? "—"}
                            </td>
                            <td style={{ textAlign: "right", padding: 10 }}>
                              {result.pat ?? "—"}
                            </td>
                            <td style={{ textAlign: "right", padding: 10 }}>
                              {result.eps ?? "—"}
                            </td>
                            <td style={{ textAlign: "right", padding: 10 }}>
                              <button
                                type="button"
                                className="ipo-small-button"
                                onClick={() => editQuarterlyResult(result)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                className="ipo-small-button danger"
                                style={{ marginLeft: 8 }}
                                onClick={() =>
                                  result.id &&
                                  deleteQuarterlyResult(result.id)
                                }
                              >
                                🗑 Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ================================= */}
          {/* ================================= */}
          {/* MANAGEMENT MEMBERS */}
          {/* ================================= */}

          <div className="ipo-form-section">
            <div className="ipo-form-section-title">
              <span>10</span>
              <div><h3>Management Team</h3><p>Add individual management members and leadership profiles.</p></div>
            </div>

            {!editingId ? (
              <div className="ipo-empty-state">Save the IPO first. Then add individual management members.</div>
            ) : (
              <>
                <form onSubmit={saveManagementMember}>
                  <div className="ipo-form-grid">
                    <div className="ipo-form-group"><label>Name *</label><input type="text" value={managementForm.name} onChange={(e) => updateManagementField("name", e.target.value)} placeholder="Full name" required /></div>
                    <div className="ipo-form-group"><label>Designation</label><input type="text" value={managementForm.designation || ""} onChange={(e) => updateManagementField("designation", e.target.value)} placeholder="Example: Managing Director" /></div>
                    <div className="ipo-form-group"><label>Role</label><input type="text" value={managementForm.role || ""} onChange={(e) => updateManagementField("role", e.target.value)} placeholder="Example: Promoter / Director" /></div>
                    <div className="ipo-form-group ipo-full"><label>Profile</label><textarea rows={5} value={managementForm.profile || ""} onChange={(e) => updateManagementField("profile", e.target.value)} placeholder="Brief professional profile..." /></div>
                  </div>
                  <div className="ipo-form-actions">
                    <button type="submit" className="ipo-primary-button" disabled={managementSaving}>{managementSaving ? "Saving..." : managementEditingId ? "💾 Update Member" : "➕ Add Member"}</button>
                    {managementEditingId && <button type="button" className="ipo-secondary-button" onClick={resetManagementForm}>Cancel Edit</button>}
                  </div>
                </form>
                <div style={{ marginTop: 24 }}>
                  <h4>Saved Management Members</h4>
                  {managementLoading ? <div className="ipo-empty-state">Loading management information...</div> : managementMembers.length === 0 ? <div className="ipo-empty-state">No management members added yet.</div> : (
                    <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                      {managementMembers.map((member) => (
                        <div key={member.id} style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, padding: 16 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
                            <div>
                              <strong>{member.name}</strong>
                              {member.designation && <div className="muted">{member.designation}</div>}
                              {member.role && <div className="muted">{member.role}</div>}
                              {member.profile && <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{member.profile}</p>}
                            </div>
                            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                              <button type="button" className="ipo-small-button" onClick={() => editManagementMember(member)}>✏ Edit</button>
                              <button type="button" className="ipo-small-button danger" onClick={() => member.id && deleteManagementMember(member.id)}>🗑 Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* ================================= */}
          {/* LISTING & SUBSCRIPTION */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>12</span>

              <div>
                <h3>Subscription & Listing</h3>
                <p>Additional IPO information</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group">
                <label>Subscription Data</label>

                <textarea
                  rows={6}
                  value={form.subscription_data || ""}
                  onChange={(e) =>
                    updateText(
                      "subscription_data",
                      e.target.value
                    )
                  }
                  placeholder="Enter subscription information..."
                />
              </div>

              <div className="ipo-form-group">
                <label>Listing Information</label>

                <textarea
                  rows={6}
                  value={form.listing_information || ""}
                  onChange={(e) =>
                    updateText(
                      "listing_information",
                      e.target.value
                    )
                  }
                  placeholder="Enter listing information..."
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* IMAGES */}
          {/* ================================= */}

          <div className="ipo-form-section">

            <div className="ipo-form-section-title">
              <span>13</span>

              <div>
                <h3>Images</h3>
                <p>Optional company/IPO images</p>
              </div>
            </div>

            <div className="ipo-form-grid">

              <div className="ipo-form-group">
                <label>Company Logo URL</label>

                <input
                  type="url"
                  value={form.logo_url || ""}
                  onChange={(e) =>
                    updateText(
                      "logo_url",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="ipo-form-group">
                <label>IPO Banner URL</label>

                <input
                  type="url"
                  value={form.banner_url || ""}
                  onChange={(e) =>
                    updateText(
                      "banner_url",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </div>

            </div>
          </div>

          {/* ================================= */}
          {/* PUBLISH */}
          {/* ================================= */}

          <div className="ipo-publish-box">

            <div>
              <strong>
                Publish this IPO
              </strong>

              <p>
                Published IPOs will be visible on the
                public IPO section of your website.
              </p>
            </div>

            <label className="ipo-toggle">

              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) =>
                  updateField(
                    "is_published",
                    e.target.checked
                  )
                }
              />

              <span>
                {form.is_published
                  ? "Published"
                  : "Draft"}
              </span>

            </label>

          </div>

          {/* ================================= */}
          {/* SAVE BUTTON */}
          {/* ================================= */}

          <div className="ipo-form-actions">

            <button
              type="submit"
              className="ipo-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "💾 Update IPO"
                : "📈 Save IPO"}
            </button>

            {editingId && (
              <button
                type="button"
                className="ipo-secondary-button"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}

          </div>

        </form>

      </section>

      {/* ================================= */}
      {/* EXISTING IPOs */}
      {/* ================================= */}

      <section className="ipo-admin-card">

        <div className="ipo-admin-card-header">
          <div>
            <span className="ipo-admin-label">
              IPO LIBRARY
            </span>

            <h2>Existing IPOs</h2>

            <p>
              Manage IPOs already added to your website.
            </p>
          </div>
        </div>

        {ipos.length === 0 ? (
          <div className="ipo-empty-state">
            No IPOs have been added yet.
          </div>
        ) : (
          <div className="ipo-admin-list">

            {ipos.map((ipo) => (

              <div
                className="ipo-admin-list-item"
                key={ipo.id}
              >

                <div className="ipo-admin-list-info">

                  <strong>
                    {ipo.company_name}
                  </strong>

                  <span>
                    {ipo.issue_type} •{" "}
                    {ipo.status}
                  </span>

                  {ipo.price_band_min !== null &&
                    ipo.price_band_max !== null && (
                      <small>
                        ₹{ipo.price_band_min} – ₹
                        {ipo.price_band_max}
                      </small>
                    )}

                </div>

                <div className="ipo-admin-list-actions">

                  <button
                    type="button"
                    className="ipo-small-button"
                    onClick={() => editIPO(ipo)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    type="button"
                    className="ipo-small-button"
                    onClick={() =>
                      togglePublish(ipo)
                    }
                  >
                    {ipo.is_published
                      ? "👁 Unpublish"
                      : "🚀 Publish"}
                  </button>

                  <button
                    type="button"
                    className="ipo-small-button danger"
                    onClick={() =>
                      ipo.id &&
                      deleteIPO(ipo.id)
                    }
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </section>

    </div>
  );
}
