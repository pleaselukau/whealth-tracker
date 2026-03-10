import { HeroBanner } from "../components/HeroBanner";
import { SectionHeader } from "../components/SectionHeader";
import { StatCard } from "../components/StatCard";

export function TodayPage() {
  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <HeroBanner
        title="Today"
        subtitle="This will become the emotional center of the product."
      >
        <div
          style={{
            display: "inline-flex",
            padding: "0.75rem 1rem",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.18)",
            width: "fit-content",
          }}
        >
          Today’s check-in
        </div>
      </HeroBanner>

      <section>
        <SectionHeader
          title="Featured insight"
          subtitle="Temporary placeholder until Today page implementation begins."
        />
        <StatCard label="Entries this week" value="—" />
      </section>
    </div>
  );
}