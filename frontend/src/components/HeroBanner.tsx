import type { ReactNode } from "react";

import { Card } from "./Card";

type HeroBannerProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function HeroBanner({ title, subtitle, children }: HeroBannerProps) {
  return (
    <Card
      style={{
        background: "var(--gradient-hero)",
        color: "white",
        border: "none",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <div style={{ display: "grid", gap: "0.75rem" }}>
        <div>
          <h1 style={{ marginBottom: "0.5rem", fontSize: "2.25rem", lineHeight: 1.05 }}>
            {title}
          </h1>
          {subtitle ? (
            <p style={{ margin: 0, color: "rgba(255,255,255,0.92)", fontSize: "1.05rem" }}>
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </Card>
  );
}