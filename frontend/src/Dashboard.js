import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function Dashboard() {
  const [buddies, setBuddies] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = '/';
    const decoded = jwtDecode(token);
    setUser(decoded);

    axios.get('http://localhost:3001/api/sip_buddies', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => setBuddies(res.data));
  }, []);

  return (
    <div>
      <h2>Dashboard - {user?.role}</h2>
      <table border="1">
        <thead>
          <tr><th>Name</th><th>CallerID</th><th>Context</th></tr>
        </thead>
        <tbody>
          {buddies.map(b => (
            <tr key={b.id}>
              <td>{b.name}</td>
              <td>{b.callerid}</td>
              <td>{b.context}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
