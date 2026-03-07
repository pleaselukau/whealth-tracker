import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { createSymptom, deleteSymptom, listSymptoms, updateSymptom } from "../api/symptoms";
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

type EditState = {
  id: string;
  date_time: string;
  category: SymptomCategory;
  severity: number;
  notes: string;
  tags: string;
} | null;

function toDatetimeLocalValue(dateTime: string): string {
  const date = new Date(dateTime);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function DashboardPage() {
  const { token, user, logout } = useAuth();

  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editState, setEditState] = useState<EditState>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [dateTime, setDateTime] = useState("");
  const [category, setCategory] = useState<SymptomCategory>("cramps");
  const [severity, setSeverity] = useState(5);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState("");

  async function loadSymptoms() {
    if (!token) return;

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
        tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(Boolean) : undefined,
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

  function startEdit(symptom: Symptom) {
    setEditState({
      id: symptom.id,
      date_time: toDatetimeLocalValue(symptom.date_time),
      category: symptom.category,
      severity: symptom.severity,
      notes: symptom.notes ?? "",
      tags: symptom.tags?.join(", ") ?? "",
    });
    setError("");
    setSuccess("");
  }

  function cancelEdit() {
    setEditState(null);
  }

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !editState) {
      return;
    }

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      await updateSymptom(token, editState.id, {
        date_time: editState.date_time,
        category: editState.category,
        severity: editState.severity,
        notes: editState.notes || undefined,
        tags: editState.tags
          ? editState.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : undefined,
      });

      setSuccess("Symptom entry updated");
      setEditState(null);
      await loadSymptoms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update symptom");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete(symptomId: string) {
    if (!token) return;

    const confirmed = window.confirm("Delete this symptom entry?");
    if (!confirmed) return;

    setIsDeletingId(symptomId);
    setError("");
    setSuccess("");

    try {
      await deleteSymptom(token, symptomId);
      setSuccess("Symptom entry deleted");
      await loadSymptoms();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete symptom");
    } finally {
      setIsDeletingId(null);
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

      {editState && (
        <section style={{ marginBottom: "2rem" }}>
          <h2>Edit Symptom Entry</h2>

          <form
            onSubmit={handleUpdate}
            style={{
              display: "grid",
              gap: "1rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fafafa",
            }}
          >
            <label>
              Date and time
              <input
                type="datetime-local"
                value={editState.date_time}
                onChange={(event) =>
                  setEditState((prev) => (prev ? { ...prev, date_time: event.target.value } : prev))
                }
                required
                style={{ display: "block", width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
              />
            </label>

            <label>
              Category
              <select
                value={editState.category}
                onChange={(event) =>
                  setEditState((prev) =>
                    prev ? { ...prev, category: event.target.value as SymptomCategory } : prev,
                  )
                }
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
                value={editState.severity}
                onChange={(event) =>
                  setEditState((prev) =>
                    prev ? { ...prev, severity: Number(event.target.value) } : prev,
                  )
                }
                required
                style={{ display: "block", width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
              />
            </label>

            <label>
              Notes
              <textarea
                value={editState.notes}
                onChange={(event) =>
                  setEditState((prev) => (prev ? { ...prev, notes: event.target.value } : prev))
                }
                rows={3}
                style={{ display: "block", width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
              />
            </label>

            <label>
              Tags (comma separated)
              <input
                type="text"
                value={editState.tags}
                onChange={(event) =>
                  setEditState((prev) => (prev ? { ...prev, tags: event.target.value } : prev))
                }
                style={{ display: "block", width: "100%", marginTop: "0.25rem", padding: "0.5rem" }}
              />
            </label>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="submit" disabled={isUpdating}>
                {isUpdating ? "Updating..." : "Save Changes"}
              </button>
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

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

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
                  <button onClick={() => startEdit(symptom)}>Edit</button>
                  <button
                    onClick={() => void handleDelete(symptom.id)}
                    disabled={isDeletingId === symptom.id}
                  >
                    {isDeletingId === symptom.id ? "Deleting..." : "Delete"}
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