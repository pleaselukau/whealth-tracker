import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { Card } from "../components/Card";
import { HeroBanner } from "../components/HeroBanner";
import { SectionHeader } from "../components/SectionHeader";

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const formattedDate = selectedDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <HeroBanner
        title="Your cycle calendar"
        subtitle="Look back at your days and understand how your body has been feeling over time."
      >
        <div
          style={{
            padding: "0.8rem 1rem",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.2)",
            fontWeight: 600,
            width: "fit-content",
          }}
        >
          Track patterns over time
        </div>
      </HeroBanner>

      <Card>
        <SectionHeader
          title="Month view"
          subtitle="Select any day to see what was logged."
        />

        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
        />
      </Card>

      <Card>
        <SectionHeader
          title="Selected day"
          subtitle="Details for the day currently highlighted."
        />

        <div
          style={{
            padding: "1rem",
            borderRadius: "20px",
            background: "var(--color-surface-soft)",
            border: "1px solid var(--color-border)",
          }}
        >
          <strong>{formattedDate}</strong>

          <p
            style={{
              marginTop: "0.5rem",
              color: "var(--color-text-muted)",
            }}
          >
            No entries yet for this day.
          </p>
        </div>
      </Card>
    </div>
  );
}