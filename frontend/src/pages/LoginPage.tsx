import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/app/today");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "4rem auto", padding: "1rem" }}>
      <h1>Login</h1>
      <p>Sign in to access your symptom dashboard.</p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button type="submit" disabled={isSubmitting} style={{ padding: "0.75rem" }}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}