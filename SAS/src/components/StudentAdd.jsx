import React, { useState } from 'react';
import { saveStudent } from '../services/studentService';

function StudentAdd({ onSave }) {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    rollNumber: '',
    department: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await saveStudent(formData);
      setMessage('Student details saved successfully.');
      if (onSave) {
        onSave(formData);
      }
      setFormData({
        studentName: '',
        email: '',
        rollNumber: '',
        department: '',
        phoneNumber: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to save student.');
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '40px auto', padding: 24, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 12 }}>
          <input name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Student Name" required style={inputStyle} />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required style={inputStyle} />
          <input name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Roll Number" required style={inputStyle} />
          <input name="department" value={formData.department} onChange={handleChange} placeholder="Department" required style={inputStyle} />
          <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" required style={inputStyle} />
          <button type="submit" style={buttonStyle}>Save Student</button>
        </div>
      </form>
      {message ? <p style={{ color: 'green', marginTop: 12 }}>{message}</p> : null}
      {error ? <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p> : null}
    </div>
  );
}

const inputStyle = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #ccc'
};

const buttonStyle = {
  padding: '10px 14px',
  borderRadius: 8,
  border: 'none',
  backgroundColor: '#2563eb',
  color: '#fff',
  cursor: 'pointer'
};

export default StudentAdd