import { Card } from "../components/Card";
import { Chip } from "../components/Chip";
import { SectionHeader } from "../components/SectionHeader";

export function LogPage() {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <SectionHeader
        title="Log / Daily Check-In"
        subtitle="Categorized chip-based logging will be implemented here."
      />

      <Card>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Chip label="Calm" />
          <Chip label="Cramps" selected />
          <Chip label="Fatigue" />
          <Chip label="Plan B" />
        </div>
      </Card>
    </div>
  );
}