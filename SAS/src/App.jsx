import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TeacherLogin from './components/TeacherLogin';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AdminPanel from './components/AdminPanel';
import Student from './components/Student';

function App() {
  return (
    <BrowserRouter>
      <div className="ambient-glows">
        <div className="glow-1"></div>
        <div className="glow-2"></div>
      </div>

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<TeacherLogin view="login" />} />
        <Route path="/signup" element={<TeacherLogin view="signup" />} />
        <Route path="/dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/studentadd" element={<Student />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
