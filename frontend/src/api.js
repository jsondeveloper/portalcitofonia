const API_URL = 'http://localhost:4000/api';

export const login = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
};

export const getExtensions = async (token) => {
  const res = await fetch(`${API_URL}/extensions`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const createExtension = async (ext, token) => {
  const res = await fetch(`${API_URL}/extensions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ext)
  });
  return res.json();
};

export const updateExtension = async (name, ext, token) => {
  const res = await fetch(`${API_URL}/extensions/${name}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(ext)
  });
  return res.json();
};

export const deleteExtension = async (name, token) => {
  const res = await fetch(`${API_URL}/extensions/${name}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};