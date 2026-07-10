import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentAdd from './StudentAdd';

const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

const IconCalendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
);

const IconBookOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);

const IconDelete = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const IconDashboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
);

const IconClass = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);

const IconSettings = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);

const IconLogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);

const IconClose = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

function TeacherDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('teacher_session')) || null;
    } catch {
      return null;
    }
  });
  const [students, setStudents] = useState([
    { id: 1, name: 'Alice Vance', subject: 'Algebra', grade: 92, status: 'excellent' },
    { id: 2, name: 'Bob Miller', subject: 'Physics', grade: 78, status: 'good' },
    { id: 3, name: 'Charlie Davis', subject: 'Chemistry', grade: 85, status: 'good' },
    { id: 4, name: 'Diana Prince', subject: 'Algebra', grade: 95, status: 'excellent' },
    { id: 5, name: 'Evan Wright', subject: 'History', grade: 64, status: 'average' }
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentSubject, setNewStudentSubject] = useState('Algebra');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const [activeMenu, setActiveMenu] = useState("dashboard");

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

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentGrade) {
      alert('Please fill out all fields.');
      return;
    }

    const gradeVal = parseInt(newStudentGrade, 10);
    if (isNaN(gradeVal) || gradeVal < 0 || gradeVal > 100) {
      alert('Grade must be a number between 0 and 100.');
      return;
    }

    let status = 'average';
    if (gradeVal >= 90) status = 'excellent';
    else if (gradeVal >= 75) status = 'good';

    const newStudent = {
      id: Date.now(),
      name: newStudentName,
      subject: newStudentSubject,
      grade: gradeVal,
      status: status
    };

    setStudents([...students, newStudent]);
    setShowAddModal(false);
    setNewStudentName('');
    setNewStudentSubject('Algebra');
    setNewStudentGrade('');
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      setStudents(students.filter(student => student.id !== id));
    }
  };

  const totalStudents = students.length;
  const averageGrade = totalStudents > 0
    ? Math.round(students.reduce((acc, curr) => acc + curr.grade, 0) / totalStudents)
    : 0;

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-icon">S</span>
          <span className="sidebar-logo-text">Attendance Management</span>
        </div>

        <ul className="sidebar-menu">
          <button
            className="sidebar-item-btn"
            onClick={() => setActiveMenu('dashboard')}
          >
            <IconDashboard />
            Dashboard
          </button>
          
          <button
            className="sidebar-item-btn"
            onClick={() => setActiveMenu('studentAdd')}
          >
            <IconClass />
            Student Add
          </button>
          <li><button className="sidebar-item-btn"><IconClass />Attendance</button></li>
        </ul>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-name" title={user.name}>{user.name}</div>
            <div className="user-role">Logout</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Log Out"><IconLogOut /></button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-title-area">
            <h1>{activeMenu === 'studentAdd' ? 'Add Student' : 'Class Overview'}</h1>
            <p>
              {activeMenu === 'studentAdd'
                ? 'Fill in student details on the right side panel.'
                : `Welcome back, ${user.name}. Here is what's happening with your students today.`}
            </p>
          </div>
        </header>

        {activeMenu === 'studentAdd' ? (
          <StudentAdd />
        ) : (
          <></>
        )}
      </main>

      
    
    </div>
  );
}

export default TeacherDashboard;
