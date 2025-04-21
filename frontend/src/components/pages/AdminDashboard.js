import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './../Login.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch("http://localhost:4000/graphql", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            query: `
              query {
                bugs {
                  id
                  description
                  status
                  createdBy {
                    username
                    fullName
                    department
                  }
                }
              }
            `
          }),
        });
        const result = await res.json();
        if (result.data?.bugs) {
          setBugs(result.data.bugs);
        }
      } catch (error) {
        setMessage('Error fetching bugs');
      }
    };
    fetchBugs();
  }, []);

  return (
    <div className="auth-container">
      <div className="admin-box">
        <h2>Admin Dashboard - Bug Reports</h2>
        {message && <div className="alert">{message}</div>}
        <div className="bug-list">
          {bugs.map(bug => (
            <div key={bug.id} className="bug-item">
              <h3>Bug #{bug.id}</h3>
              <p><strong>Description:</strong> {bug.description}</p>
              <p><strong>Status:</strong> {bug.status}</p>
              <p><strong>Reported By:</strong> {bug.createdBy.fullName}</p>
              <p><strong>Department:</strong> {bug.createdBy.department}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;