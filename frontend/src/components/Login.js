import React, { useState } from "react";
import "./Login.css"; // Reuse same CSS as Register

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation {
            login(username: "${form.username}", password: "${form.password}") {
              token
            }
          }
        `,
      }),
    });

    const result = await res.json();
    if (result.data?.login?.token) {
      localStorage.setItem("token", result.data.login.token);
      alert("Logged in successfully!");
    } else {
      alert("Invalid credentials!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
