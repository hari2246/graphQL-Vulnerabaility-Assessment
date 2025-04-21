import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/pages/Register";
import UpdateProfile from "./components/pages/UpdateProfile";
import Login from "./components/Login";
import ReportBug from "./components/ReportBug";
// import BugList from "./components/BugList";
import Dashboard from "./components/Dashboard";
import AdminDashboard from './components/pages/AdminDashboard';

import Home from "./components/Home"; // <-- import Home
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link> |{" "}
          <Link to="/register">Register</Link> |{" "}
          <Link to="/login">Login</Link> |{" "}
          <Link to="/report">Report Bug</Link> |{" "}
          {/* <Link to="/bugs">All Bugs</Link> |{" "} */}
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile/update">UpdateProfile</Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home route */}
          <Route path="/register" element={<Register />} />
          <Route path="/profile/update" element={<UpdateProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report" element={<ReportBug />} />
          {/* <Route path="/bugs" element={<BugList />} /> */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
