import { useState } from 'react';
import api from '../api';
import Registro from './Registro';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  if (mostrarRegistro) return <Registro onVolver={() => setMostrarRegistro(false)} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data.token);
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Gimnasio — Iniciar sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8 }} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Password</label><br />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8 }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6 }}>
          Ingresar
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        ¿No tienes cuenta?{' '}
        <button onClick={() => setMostrarRegistro(true)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>
          Regístrate
        </button>
      </p>
    </div>
  );
}

export default Login;