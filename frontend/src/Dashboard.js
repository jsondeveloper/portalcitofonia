import React, { useEffect, useState } from 'react';
import { getExtensions, createExtension, updateExtension, deleteExtension } from './api';
import { jwtDecode } from 'jwt-decode';


function Dashboard({ token }) {
  const [extensions, setExtensions] = useState([]);
  const [form, setForm] = useState({ name: '', secret: '', context: '' });
  const user = jwtDecode(token);


  const fetchData = async () => {
    const data = await getExtensions(token);
    setExtensions(data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    await createExtension(form, token);
    setForm({ name: '', secret: '', context: '' });
    fetchData();
  };

  const handleDelete = async (name) => {
    await deleteExtension(name, token);
    fetchData();
  };

  const handleEdit = async (name) => {
    const updated = prompt("Nuevo nombre:", name);
    if (updated) {
      const newData = { ...form, name: updated };
      await updateExtension(name, newData, token);
      fetchData();
    }
  };

  return (
    <div>
      <h2>Bienvenido, {user.username} ({user.role})</h2>
      {user.role === 'admin' && (
        <div>
          <h3>Crear extensión</h3>
          <input placeholder="name" onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="secret" onChange={e => setForm({ ...form, secret: e.target.value })} />
          <input placeholder="context" onChange={e => setForm({ ...form, context: e.target.value })} />
          <button onClick={handleCreate}>Crear</button>
        </div>
      )}
      <h3>Extensiones</h3>
      <table border="1">
        <thead>
          <tr><th>Nombre</th><th>Secreto</th><th>Contexto</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {extensions.map(ext => (
            <tr key={ext.name}>
              <td>{ext.name}</td>
              <td>{ext.secret}</td>
              <td>{ext.context}</td>
              <td>
                {user.role === 'admin' && (
                  <>
                    <button onClick={() => handleEdit(ext.name)}>Editar</button>
                    <button onClick={() => handleDelete(ext.name)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;