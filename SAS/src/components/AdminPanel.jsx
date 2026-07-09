import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('teacher_session')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('teacher_session');
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="glass-container">
      <div className="glass-card">
        <div className="auth-header">
          <h2 className="auth-title">Admin Panel</h2>
          <p className="auth-subtitle">Teacher login access for administration</p>
        </div>

        <div className="alert alert-success">
          <span>Welcome, {user?.name || 'Teacher'}!</span>
        </div>

        <button className="btn-primary" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminPanel;
