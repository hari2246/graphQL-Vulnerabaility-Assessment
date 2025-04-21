import React, { useState } from "react";
import "./ReportBug.css";

export default function ReportBug() {
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        query: `
          mutation {
            reportBug(description: "${description}") {
              id
              description
              status
            }
          }
        `,
      }),
    });

    alert("Bug reported!");
    setDescription("");
  };

  return (
    <div className="bug-container">
      <div className="bug-box">
        <h2>Report Bug</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe the bug"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
