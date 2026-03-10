import { Link } from "react-router-dom";

import { Chip } from "../components/Chip";
import { HeroBanner } from "../components/HeroBanner";
import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";
import { Card } from "../components/Card";

const todaySelections = ["Cramps", "Fatigue", "Low energy"];
const quickActions = [
  { label: "Log symptoms", to: "/app/log", description: "Record how you feel today." },
  { label: "Open calendar", to: "/app/calendar", description: "Look back at recent days." },
  { label: "View insights", to: "/app/insights", description: "See your patterns and trends." },
];

export function TodayPage() {
  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <HeroBanner
        title="Today"
        subtitle={`${currentDate} • A gentle space to check in with your body.`}
      >
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            alignItems: "start",
          }}
        >
          <div
            style={{
              padding: "1rem 1.1rem",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.95 }}>
              Cycle day
            </p>
            <h2 style={{ margin: "0.25rem 0 0", fontSize: "2rem" }}>14</h2>
          </div>

          <div
            style={{
              padding: "1rem 1.1rem",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.18)",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.95 }}>
              Featured insight
            </p>
            <p style={{ margin: "0.4rem 0 0", fontSize: "1rem", lineHeight: 1.4 }}>
              You logged 3 symptoms this week. Keep checking in so your patterns become
              easier to understand over time.
            </p>
          </div>
        </div>
      </HeroBanner>

      <section>
        <SectionHeader
          title="Today’s check-in"
          subtitle="Start with the action that feels most relevant right now."
        />
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {quickActions.map((action) => (
            <Card key={action.label}>
              <div style={{ display: "grid", gap: "0.9rem" }}>
                <div>
                  <h3 style={{ marginBottom: "0.35rem" }}>{action.label}</h3>
                  <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
                    {action.description}
                  </p>
                </div>

                <Link
                  to={action.to}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.8rem 1rem",
                    borderRadius: "var(--radius-button)",
                    background: "var(--gradient-primary)",
                    color: "white",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Open
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          title="At a glance"
          subtitle="Small daily signals that make the home experience feel useful."
        />
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <StatCard label="Entries this week" value={3} />
          <StatCard label="Most common symptom" value="Cramps" />
          <StatCard label="Last check-in" value="Yesterday" />
        </div>
      </section>

      <section>
        <SectionHeader
          title="What are you feeling today?"
          subtitle="Your recent selected states can live here as a soft daily summary."
        />
        <Card>
          {todaySelections.length === 0 ? (
            <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
              No selections for today yet.
            </p>
          ) : (
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {todaySelections.map((item) => (
                <Chip key={item} label={item} selected />
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}