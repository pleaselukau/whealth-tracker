import { NavLink } from "react-router-dom";

const links = [
  { to: "/app/today", label: "Today" },
  { to: "/app/calendar", label: "Calendar" },
  { to: "/app/log", label: "Log / Check-In" },
  { to: "/app/insights", label: "Insights" },
];

export function AppSidebar() {
  return (
    <aside
      style={{
        width: 260,
        minHeight: "100vh",
        padding: "1.5rem 1rem",
        background: "rgba(255,255,255,0.85)",
        borderRight: "1px solid var(--color-border)",
        position: "sticky",
        top: 0,
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-text-muted)" }}>
          Women’s Health
        </p>
        <h2 style={{ margin: "0.25rem 0 0", fontSize: "1.5rem" }}>WHealth</h2>
      </div>

      <nav style={{ display: "grid", gap: "0.5rem" }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              padding: "0.85rem 1rem",
              borderRadius: "16px",
              background: isActive ? "var(--gradient-primary)" : "transparent",
              color: isActive ? "white" : "var(--color-text)",
              textDecoration: "none",
              fontWeight: 600,
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}