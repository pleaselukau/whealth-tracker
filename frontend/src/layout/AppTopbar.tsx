import { NavLink } from "react-router-dom";

const links = [
  { to: "/app/today", label: "Today" },
  { to: "/app/calendar", label: "Calendar" },
  { to: "/app/log", label: "Log" },
  { to: "/app/insights", label: "Insights" },
];

export function AppTopbar() {
  return (
    <header
      style={{
        padding: "1rem",
        borderBottom: "1px solid var(--color-border)",
        background: "rgba(255,255,255,0.9)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(10px)",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              padding: "0.65rem 0.95rem",
              borderRadius: "999px",
              background: isActive ? "var(--gradient-primary)" : "var(--color-purple-3)",
              color: isActive ? "white" : "var(--color-text)",
              textDecoration: "none",
              fontWeight: 600,
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </header>
  );
}