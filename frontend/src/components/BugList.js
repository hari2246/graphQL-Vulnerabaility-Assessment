import React, { useEffect, useState } from "react";
import "./BugList.css";

export default function BugList() {
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    const fetchBugs = async () => {
      const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            {
              bugs {
                id
                description
                status
                createdBy {
                  username
                }
              }
            }
          `,
        }),
      });

      const result = await res.json();
      setBugs(result.data?.bugs || []);
    };

    fetchBugs();
  }, []);

  return (
    <div className="buglist-container">
      <h2>All Reported Bugs</h2>
      <ul className="buglist">
        {bugs.map((bug) => (
          <li key={bug.id}>
            <span className="bug-description">{bug.description}</span>
            <span className="bug-status">- {bug.status}</span>
            <span className="bug-reporter">Reported by: {bug.createdBy?.username}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
