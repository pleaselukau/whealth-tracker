import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getInsightsSummary, getInsightsTimeline } from "../api/insights";
import { useAuth } from "../context/AuthContext";
import type { InsightsSummary, TimelineResponse } from "../types/insight";
import type { SymptomCategory } from "../types/symptom";

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

export function InsightsPage() {
  const { token, user, logout } = useAuth();

  const [summary, setSummary] = useState<InsightsSummary | null>(null);
  const [timeline, setTimeline] = useState<TimelineResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SymptomCategory>("cramps");
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSummary() {
      if (!token) return;

      setIsLoadingSummary(true);
      setError("");

      try {
        const data = await getInsightsSummary({ token });
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load summary insights");
      } finally {
        setIsLoadingSummary(false);
      }
    }

    void loadSummary();
  }, [token]);

  useEffect(() => {
    async function loadTimeline() {
      if (!token) return;

      setIsLoadingTimeline(true);
      setError("");

      try {
        const data = await getInsightsTimeline({
          token,
          category: selectedCategory,
        });
        setTimeline(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load timeline insights");
      } finally {
        setIsLoadingTimeline(false);
      }
    }

    void loadTimeline();
  }, [token, selectedCategory]);

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
          <h1>Insights</h1>
          <p>View summary trends for{user ? ` ${user.email}` : " your account"}.</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/dashboard">Back to Dashboard</Link>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <section style={{ marginBottom: "2rem" }}>
        <h2>Summary</h2>

        {isLoadingSummary ? (
          <p>Loading summary...</p>
        ) : !summary ? (
          <p>No summary data available.</p>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
                <h3>Total Entries</h3>
                <p style={{ fontSize: "1.5rem", margin: 0 }}>{summary.total_entries}</p>
              </div>

              <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
                <h3>Days Tracked</h3>
                <p style={{ fontSize: "1.5rem", margin: 0 }}>{summary.days_tracked}</p>
              </div>
            </div>

            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
              <h3>Average Severity by Category</h3>

              {summary.average_severity_per_category.length === 0 ? (
                <p>No category insight data yet.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {summary.average_severity_per_category.map((item) => (
                    <li key={item.category}>
                      <strong>{item.category}</strong>: {item.average_severity.toFixed(1)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>

      <section>
        <h2>Timeline</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            Category
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value as SymptomCategory)}
              style={{ display: "block", marginTop: "0.25rem", padding: "0.5rem", minWidth: "220px" }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoadingTimeline ? (
          <p>Loading timeline...</p>
        ) : !timeline || timeline.points.length === 0 ? (
          <p>No timeline data for this category yet.</p>
        ) : (
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <h3>{timeline.category} timeline</h3>
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              {timeline.points.map((point) => (
                <li key={point.date}>
                  <strong>{point.date}</strong>: {point.average_severity.toFixed(1)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}