import { Card } from "./Card";

type StatCardProps = {
  label: string;
  value: string | number;
  accent?: string;
};

export function StatCard({ label, value, accent = "var(--color-purple-1)" }: StatCardProps) {
  return (
    <Card>
      <p style={{ marginBottom: "0.5rem", color: "var(--color-text-muted)" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "2rem", fontWeight: 700, color: accent }}>{value}</p>
    </Card>
  );
}