import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card } from "../components/Card";
import { HeroBanner } from "../components/HeroBanner";
import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";

type Summary = {
  total_entries: number;
  days_tracked: number;
  entries_last_7_days: number;
  most_frequent_category: string;
  highest_avg_severity_category: string;
};

type TrendPoint = {
  date: string;
  severity: number;
};

export function InsightsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);

  async function loadSummary() {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8000/insights/summary", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setSummary(data);
  }

  // temporary demo data for chart
  function loadDemoTrend() {
    setTrendData([
      { date: "Mar 5", severity: 7 },
      { date: "Mar 6", severity: 5 },
      { date: "Mar 7", severity: 5 },
      { date: "Mar 10", severity: 7 },
      { date: "Mar 11", severity: 5 },
      { date: "Mar 12", severity: 9 },
    ]);
  }

  useEffect(() => {
    loadSummary();
    loadDemoTrend();
  }, []);

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <HeroBanner
        title="Your health insights"
        subtitle="Over time, patterns begin to emerge. These summaries help you understand your body better."
      >
        <div
          style={{
            padding: "0.8rem 1rem",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.2)",
            fontWeight: 600,
          }}
        >
          Trends and patterns from your logs
        </div>
      </HeroBanner>

      {summary && (
        <section>
          <SectionHeader
            title="At a glance"
            subtitle="Key signals extracted from your recent check-ins."
          />

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <StatCard label="Entries last 7 days" value={summary.entries_last_7_days} />
            <StatCard label="Most frequent category" value={summary.most_frequent_category} />
            <StatCard
              label="Highest severity category"
              value={summary.highest_avg_severity_category}
            />
            <StatCard label="Total entries" value={summary.total_entries} />
          </div>
        </section>
      )}

      <Card>
        <SectionHeader
          title="Symptom trend"
          subtitle="A simple view of how severity has evolved across recent logs."
        />

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={trendData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="severity"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}