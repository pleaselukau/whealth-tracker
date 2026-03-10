import { Card } from "../components/Card";
import { SectionHeader } from "../components/SectionHeader";

export function CalendarPage() {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <SectionHeader
        title="Calendar"
        subtitle="Month view and selected-day summary will be implemented next."
      />

      <Card>
        <p style={{ margin: 0 }}>Calendar MVP placeholder</p>
      </Card>
    </div>
  );
}