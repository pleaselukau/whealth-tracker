import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { createSymptom, listSymptoms } from "../api/symptoms";
import { useAuth } from "../context/AuthContext";
import type { Symptom, SymptomCategory } from "../types/symptom";

const categories: SymptomCategory[] = [
  "cramps",
  "headache",
  "mood",
  "fatigue",
  "sleep",
  "bloating",
  "nausea",
  "other",
];

export function DashboardPage() {
  const { token, user, logout } = useAuth();

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dateTime, setDateTime] = useState("");
  const [category, setCategory] = useState<SymptomCategory>("cramps");
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  async function loadSymptoms() {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const data = await listSymptoms({ token });
      setSymptoms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load symptoms");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadSymptoms();
  }, [token]);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setError("You must be logged in");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await createSymptom(token, {
        date_time: dateTime,
        category,
        severity,
        notes: notes || undefined,
        tags: tags
          ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : undefined,
      });

      setDateTime("");
      setCategory("cramps");
      setSeverity(5);
      setNotes("");
      setTags("");
      setSuccess("Symptom entry created");
      await loadSymptoms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create symptom");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          gap: "1rem",
        }}
      >
        <div>
          <h1>Dashboard</h1>
          <p>Welcome{user ? `, ${user.email}` : ""}</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/insights">View Insights</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <section style={{ marginBottom: "2rem" }}>
        <h2>Add Symptom Entry</h2>

        <form
          onSubmit={handleCreate}
          style={{
            display: "grid",
            gap: "1rem",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <label>
            Date and time
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(event) => setDateTime(event.target.value)}
              required
              style={{ display: "block", width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as SymptomCategory)}
              style={{ display: "block", width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label>
            Severity (1–10)
            <input
              type="number"
              min={1}
              max={10}
              value={severity}
              onChange={(event) => setSeverity(Number(event.target.value))}
              required
              style={{ display: "block", width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
            />
          </label>

          <label>
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
              style={{ display: "block", width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
            />
          </label>

          <label>
            Tags (comma separated)
            <input
              type="text"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="period day 2, workday"
              style={{ display: "block", width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
            />
          </label>

          {error && <p style={{ color: "crimson" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Create Entry"}
          </button>
        </form>
      </section>

      <section>
        <h2>Your Symptoms</h2>

        {isLoading ? (
          <p>Loading symptoms...</p>
        ) : symptoms.length === 0 ? (
          <p>No symptom entries yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {symptoms.map((symptom) => (
              <div
                key={symptom.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                }}
              >
                <p><strong>Category:</strong> {symptom.category}</p>
                <p><strong>Severity:</strong> {symptom.severity}</p>
                <p><strong>Date:</strong> {new Date(symptom.date_time).toLocaleString()}</p>
                <p><strong>Notes:</strong> {symptom.notes || "—"}</p>
                <p>
                  <strong>Tags:</strong>{" "}
                  {symptom.tags && symptom.tags.length > 0 ? symptom.tags.join(", ") : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}