import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./../Login.css";

const UpdateProfile = () => {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    department: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
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
                me {
                  fullName
                  email
                  department
                  phoneNumber
                }
              }
            `
          }),
        });
        const result = await res.json();
        if (result.data?.me) {
          setProfile(result.data.me);
        }
      } catch (error) {
        setMessage('Error fetching profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            mutation UpdateProfile($targetId: Int, $fullName: String!, $email: String!, $department: String, $phoneNumber: String) {
              updateProfile(
                targetId: $targetId,
                fullName: $fullName,
                email: $email,
                department: $department,
                phoneNumber: $phoneNumber
              ) {
                id
                fullName
                email
                department
                phoneNumber
              }
            }
          `,
          variables: {
            Id: 1,  // Can specify any user ID to update
            fullName: profile.fullName,
            email: profile.email,
            department: profile.department,
            phoneNumber: profile.phoneNumber
          }
        }),
      });

      const result = await res.json();
      if (result.data?.updateProfile) {
        setMessage('Profile updated successfully!');
        navigate("/dashboard");
      } else {
        setMessage(result.errors?.[0]?.message || 'Error updating profile');
      }
    } catch (error) {
      setMessage('Error updating profile');
      console.error('Update error:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Update Profile</h2>
        {message && <div className="alert">{message}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            value={profile.fullName || ''}
            placeholder="Full Name"
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            value={profile.email || ''}
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="text"
            name="department"
            value={profile.department || ''}
            placeholder="Department"
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phoneNumber"
            value={profile.phoneNumber || ''}
            placeholder="Phone Number"
            onChange={handleChange}
          />
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;