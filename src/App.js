import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import MySessions from './pages/MySessions'; // NEW: Added for Alumni specific view

// Import your colorful CSS
import './assets/style.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default page is Login */}
          <Route path="/" element={<Login />} />
          
          {/* Main system pages */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/feedback" element={<Feedback />} />

          {/* STUDENT VIEW: List of Alumni to book */}
          <Route path="/sessions" element={<Sessions />} />

          {/* ALUMNI VIEW: Management of booked/past sessions */}
          <Route path="/my-sessions" element={<MySessions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;