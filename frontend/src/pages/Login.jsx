import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(user, pass);
      navigate('/dashboard');
    } catch (e) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <input placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={pass} onChange={e => setPass(e.target.value)} />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
