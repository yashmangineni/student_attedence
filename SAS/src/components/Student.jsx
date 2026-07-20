import React, { useEffect, useState } from 'react';
import { saveStudent, getStudents,deleteStudent,updateStudent,getStudent } from '../services/studentService';
import './Student.css';

function Student({ onSave }) {
 const [formData, setFormData] = useState({
  id: 0,
  studentName: '',
  email: '',
  rollNumber: '',
  department: '',
  phoneNumber: ''
});
  const [activeTab, setActiveTab] = useState("add");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState(null);
const [showCredentials, setShowCredentials] = useState(false);
const showSuccessMessage = (msg) => {
  setMessage(msg);

  setTimeout(() => {
    setMessage("");
  }, 3000);
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //load students when the component mounts or when activeTab changes to "view"
useEffect(() => {
  if (activeTab === "view") {
    loadStudents();
  }

}, [activeTab]);


const loadStudents = async () => {
  try {
    const data = await getStudents();
    setStudents(data);
  } catch (err) {
    setError(err.message || "Failed to load students.");
  }
};


// Function to handle form submission

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setError('');

  try {

    if (isEditing) {
      await updateStudent(formData);
      showSuccessMessage("Student updated successfully.");
setActiveTab("add");
      setIsEditing(false);
    } else {
      const result = await saveStudent(formData);

showSuccessMessage(result.message);

setCredentials({
    username: result.username,
    password: result.password
});

setShowCredentials(true);
     showSuccessMessage("Student details saved successfully.");
    }

    await loadStudents();

    if (onSave) {
      onSave(formData);
    }

    setFormData({
      id: 0,
      studentName: '',
      email: '',
      rollNumber: '',
      department: '',
      phoneNumber: ''
    });

  } catch (err) {
    setError(err.message || 'Operation failed.');
  }
};

//delete student function
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this student?"
  );

  if (!confirmDelete) return;

  try {
    const result = await deleteStudent(id);

    showSuccessMessage(result.message);
    setError("");

    await loadStudents();
  } catch (err) {
    setError(err.message || "Failed to delete student.");
  }
};

// Function to handle editing a student
const handleEdit = (student) => {
  setFormData({
    id: student.id,
    studentName: student.studentName,
    email: student.email,
    rollNumber: student.rollNumber,
    department: student.department,
    phoneNumber: student.phoneNumber
  });

  setIsEditing(true);
  setActiveTab("add");
};

// Function to handle viewing a student's details

const handleView = async (id) => {
  try {
    const student = await getStudent(id);
    setSelectedStudent(student);
  } catch (err) {
    setError(err.message || "Failed to fetch student details.");
  }
};



  return (
<div className="student-container">
      
     <div className="student-tabs">
  <button
type="button"
className={activeTab === "add" ? "active" : ""}
onClick={() => setActiveTab("add")}
>
    Add Student
  </button>

  <button
type="button"
className={activeTab === "view" ? "active" : ""}
onClick={() => setActiveTab("view")}
>
    View Students
  </button>
</div>
      {activeTab === "add" && (
  <form className="student-form" onSubmit={handleSubmit}>
    <div style={{ display: "grid", gap: 12 }}>
      <div className="form-group">
  <label>Student Name</label>
  <input
    type="text"
    name="studentName"
    value={formData.studentName}
    onChange={handleChange}
    placeholder="Enter Student Name"
    required
    className="student-input"
  />
</div>

<div className="form-group">
  <label>Email Address</label>
  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="Enter Email Address"
    required
    className="student-input"
  />
</div>

<div className="form-group">
  <label>Roll Number</label>
  <input
    type="text"
    name="rollNumber"
    value={formData.rollNumber}
    onChange={handleChange}
    placeholder="Enter Roll Number"
    required
    className="student-input"
  />
</div>

<div className="form-group">
  <label>Department</label>
  <input
    type="text"
    name="department"
    value={formData.department}
    onChange={handleChange}
    placeholder="Enter Department"
    required
    className="student-input"
  />
</div>

<div className="form-group">
  <label>Phone Number</label>
  <input
    type="tel"
    name="phoneNumber"
    value={formData.phoneNumber}
    onChange={handleChange}
    placeholder="Enter Phone Number"
    required
    className="student-input"
  />
</div>

   <button type="submit" className="save-btn">
  {isEditing ? "Update Student" : "Save Student"}
</button>
    </div>
  </form>
  
)}
{activeTab === "view" && (
<div className="student-table-container">
    <table className="student-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Roll No</th>
          <th>Department</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
              No students found.
            </td>
          </tr>
        ) : (
          students.map((student) => (
            <tr key={student.id}>
              <td>{student.studentName}</td>
              <td>{student.email}</td>
              <td>{student.rollNumber}</td>
              <td>{student.department}</td>
              <td>{student.phoneNumber}</td>

              <td>
    <div className="action-buttons">
        <button className="view-btn" onClick={() => handleView(student.id)}>
            View
        </button>

        <button className="edit-btn" onClick={() => handleEdit(student)}>
            Edit
        </button>

        <button className="delete-btn" onClick={() => handleDelete(student.id)}>
            Delete
        </button>
    </div>
</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)}
{selectedStudent && (
  <div className="modal-overlay">
    <div className="modal-content">

      <div className="modal-header">
        <h2>Student Details</h2>

        <button
          className="close-icon"
          onClick={() => setSelectedStudent(null)}
        >
          ×
        </button>
      </div>

      <div className="details-grid">

        <div>
          <label>Name</label>
          <p>{selectedStudent.studentName}</p>
        </div>

        <div>
          <label>Email</label>
          <p>{selectedStudent.email}</p>
        </div>

        <div>
          <label>Roll Number</label>
          <p>{selectedStudent.rollNumber}</p>
        </div>

        <div>
          <label>Department</label>
          <p>{selectedStudent.department}</p>
        </div>

        <div>
          <label>Phone Number</label>
          <p>{selectedStudent.phoneNumber}</p>
        </div>

      </div>

      <div className="modal-footer">
        <button
          className="close-btn"
          onClick={() => setSelectedStudent(null)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}
{showCredentials && credentials && (
    <div className="modal-overlay">
        <div className="modal-content">

            <div className="modal-header">
                <h2>Student Login Credentials</h2>

                <button
                    className="close-icon"
                    onClick={() => setShowCredentials(false)}
                >
                    ×
                </button>
            </div>

            <div className="details-grid">

                <div>
                    <label>Username</label>
                    <p>{credentials.username}</p>
                </div>

                <div>
                    <label>Temporary Password</label>
                    <p>{credentials.password}</p>
                </div>

            </div>

            <div className="modal-footer">

                <button
                    className="save-btn"
                    onClick={() =>
                        navigator.clipboard.writeText(
                            `Username: ${credentials.username}\nPassword: ${credentials.password}`
                        )
                    }
                >
                    Copy
                </button>

                <button
                    className="close-btn"
                    onClick={() => setShowCredentials(false)}
                >
                    Close
                </button>

            </div>

        </div>
    </div>
)}
      {message && (
    <p className="success-message">
        {message}
    </p>
)}
      {error && (
    <p className="error-message">
        {error}
    </p>
)}
    </div>
  );
}



export default Student