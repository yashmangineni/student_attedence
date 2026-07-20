import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthAlerts from './AuthAlerts';

const API_BASE_URL = `${import.meta.env.VITE_API_BACKEND_URL || 'http://localhost:5124'}/api`;

function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('teacher_session')) || null;
    } catch {
      return null;
    }
  });
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'Student') {
      navigate('/dashboard');
      return;
    }

    const fetchStudent = async () => {
      setLoading(true);
      setErrorMsg('');

      try {
        const response = await fetch(`${API_BASE_URL}/Students/by-username/${encodeURIComponent(user.username)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load student details.');
        }

        setStudent(data.student);
        setAttendance(data.attendance ?? 88);
        setPercentage(data.percentage ?? 90);
      } catch (err) {
        setErrorMsg(err.message || 'Failed to load student details.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem('teacher_session');
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!user || user.role !== 'Student') {
    return null;
  }

  return (
    <div className="student-dashboard-page">
      <div className="glass-container">
        <div className="glass-card student-dashboard-card">
          <div className="auth-header">
            <h2 className="auth-title">Student Dashboard</h2>
            <p className="auth-subtitle">Attendance and percentage details for {user.studentName || user.username}</p>
          </div>

          <AuthAlerts errorMsg={errorMsg} successMsg={successMsg} />

          <div className="student-summary">
            {loading ? (
              <p>Loading student details...</p>
            ) : student ? (
              <>
                <div className="summary-row">
                  <span className="label">Name</span>
                  <span className="value">{student.studentName}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Email</span>
                  <span className="value">{student.email}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Roll Number</span>
                  <span className="value">{student.rollNumber}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Department</span>
                  <span className="value">{student.department}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Attendance</span>
                  <span className="value">{attendance}%</span>
                </div>
                <div className="summary-row">
                  <span className="label">Percentage</span>
                  <span className="value">{percentage}%</span>
                </div>
              </>
            ) : (
              <p>No student data available.</p>
            )}
          </div>

          <div className="auth-footer">
            <button type="button" className="btn-primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
