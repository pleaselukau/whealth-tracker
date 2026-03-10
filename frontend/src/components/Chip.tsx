type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "0.6rem 1rem",
        borderRadius: "var(--radius-chip)",
        background: selected ? "var(--gradient-primary)" : "var(--color-purple-3)",
        color: selected ? "white" : "var(--color-text)",
        boxShadow: "none",
        border: selected ? "none" : "1px solid var(--color-border)",
      }}
    >
      {label}
    </button>
  );
}