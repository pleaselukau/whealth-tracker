import type { CSSProperties, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export function Card({ children, style }: CardProps) {
  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-card)",
        boxShadow: "var(--shadow-sm)",
        padding: "var(--space-5)",
        border: "1px solid var(--color-border)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}