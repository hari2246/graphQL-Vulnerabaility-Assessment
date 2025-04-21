import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../Login.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    department: "",
    phoneNumber: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              register(
                username: "${form.username}",
                email: "${form.email}",
                password: "${form.password}",
                fullName: "${form.fullName}",
                department: "${form.department}",
                phoneNumber: "${form.phoneNumber}"
              ) {
                token
                user {
                  id
                  username
                }
              }
            }
          `,
        }),
      });

      const result = await res.json();
      if (result.data?.register?.token) {
        localStorage.setItem("token", result.data.register.token);
        alert("Registered successfully!");
        navigate("/login");
      } else {
        alert(result.errors?.[0]?.message || "Registration failed!");
      }
    } catch (error) {
      alert("Error during registration!");
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Username"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            placeholder="Full Name"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
          />
          <input
            placeholder="Department"
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}