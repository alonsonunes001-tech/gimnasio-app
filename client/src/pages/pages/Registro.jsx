import { useState } from 'react';
import api from '../api';

function Registro({ onVolver }) {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', confirmar: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    if (form.password !== form.confirmar)
      return setError('Las contraseñas no coinciden');
    if (form.password.length < 6)
      return setError('La contraseña debe tener al menos 6 caracteres');
    try {
      await api.post('/auth/register', {
        nombre: form.nombre,
        email: form.email,
        password: form.password
      });
      setExito('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      setForm({ nombre: '', email: '', password: '', confirmar: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>Gimnasio — Registro</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {exito && <p style={{ color: 'green' }}>{exito}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nombre</label><br />
          <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
            style={{ width: '100%', padding: 8 }} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label><br />
          <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            style={{ width: '100%', padding: 8 }} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Contraseña</label><br />
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            style={{ width: '100%', padding: 8 }} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Confirmar contraseña</label><br />
          <input type="password" value={form.confirmar} onChange={e => setForm({ ...form, confirmar: e.target.value })}
            style={{ width: '100%', padding: 8 }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6 }}>
          Registrarse
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16 }}>
        ¿Ya tienes cuenta?{' '}
        <button onClick={onVolver} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}>
          Iniciar sesión
        </button>
      </p>
    </div>
  );
}

export default Registro;