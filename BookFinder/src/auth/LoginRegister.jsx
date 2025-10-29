// src/auth/LoginRegister.jsx
import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import "../components/LoginRegister.css";

export default function LoginRegister({ onClose }) {
  const { register, login } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    try {
      if (mode === "register") {
        const res = register(form.username.trim(), form.password, form.name.trim());
        if (!res.ok) {
          setError(res.message || "Unable to register");
          return;
        }
        // after register -> switch to login mode
        setMode("login");
        setError("Registration complete — please login.");
        return;
      }

      // login
      const res = login(form.username.trim(), form.password);
      if (!res.ok) {
        setError(res.message || "Invalid credentials");
        return;
      }

      onClose && onClose();
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modal loginBox">
        <button className="closeBtn" onClick={() => onClose && onClose()}>×</button>
        <h2>{mode === "login" ? "Sign In" : "Register"}</h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <input
              className="field"
              type="text"
              placeholder="Full name (optional)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            className="field"
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <input
            className="field"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && <div className="message">{error}</div>}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn primary" type="submit">
              {mode === "login" ? "Login" : "Register"}
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => {
                setMode((m) => (m === "login" ? "register" : "login"));
                setForm({ username: "", password: "", name: "" });
                setError("");
              }}
            >
              {mode === "login" ? "New user? Register" : "Already registered? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
