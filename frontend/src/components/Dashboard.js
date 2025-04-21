import React, { useEffect, useState } from "react";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUserData = async () => {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            {
              me {
                username
                bugsReported {
                  id
                  description
                  status
                }
              }
            }
          `,
        }),
      });

      const result = await res.json();
      setUser(result.data?.me);
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <p>Loading your dashboard...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user.username}!</h2>
      <p>Your reported bugs:</p>
      <ul className="bug-list">
        {user.bugsReported.map((bug) => (
          <li key={bug.id}>
            <strong>{bug.description}</strong> - {bug.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
