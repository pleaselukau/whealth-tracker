type SectionHeaderProps = {
  title: string;
  subtitle?: string;
};

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2 style={{ marginBottom: "0.35rem", fontSize: "1.5rem" }}>{title}</h2>
      {subtitle ? (
        <p style={{ margin: 0, color: "var(--color-text-muted)" }}>{subtitle}</p>
      ) : null}
    </div>
  );
}