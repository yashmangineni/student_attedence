const API_BASE_URL = 'http://localhost:5124/api';

export async function saveStudent(studentData) {
  const response = await fetch(`${API_BASE_URL}/Students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Failed to save student.');
  }

  return data;
}
