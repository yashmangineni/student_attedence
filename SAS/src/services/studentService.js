
const API_BASE_URL = 'http://localhost:5124/api';

// Get all students
export async function getStudents() {
  const response = await fetch(`${API_BASE_URL}/Students`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch students.');
  }

  return data;
}

// Get single student (View)
export async function getStudent(id) {
  const response = await fetch(`${API_BASE_URL}/Students/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch student.');
  }

  return data;
}

// Add student
export async function saveStudent(studentData) {
  const response = await fetch(`${API_BASE_URL}/Students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to save student.');
  }

  return data;
}

// Update student
export async function updateStudent(studentData) {
  const response = await fetch(`${API_BASE_URL}/Students/${studentData.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update student.');
  }

  return data;
}


// Delete student
export async function deleteStudent(id) {
  const response = await fetch(`${API_BASE_URL}/Students/${id}`, {
    method: 'DELETE',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete student.');
  }

  return data;
}