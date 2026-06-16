import { useState } from 'react';
import api from '../api';

function CambiarPassword() {
  const [form, setForm] = useState({ email: '', passwordActual: '', passwordNueva: '', confirmar: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (form.passwordNueva !== form.confirmar)
      return setError('Las contraseñas nuevas no coinciden');

    if (form.passwordNueva.length < 6)
      return setError('La nueva contraseña debe tener al menos 6 caracteres');

    try {
      await api.post('/auth/cambiar-password', {
        email: form.email,
        passwordActual: form.passwordActual,
        passwordNueva: form.passwordNueva
      });
      setExito('Contraseña actualizada correctamente');
      setForm({ email: '', passwordActual: '', passwordNueva: '', confirmar: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>🔒 Cambiar Contraseña</h2>
      <div style={{ maxWidth: 480, background: '#f9fafb', padding: 24, borderRadius: 8, border: '1px solid #e5e7eb' }}>
        {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
        {exito && <p style={{ color: 'green', marginBottom: 12 }}>{exito}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label>Email</label><br />
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: 8 }} required />
          </div>
          <div>
            <label>Contraseña actual</label><br />
            <input type="password" value={form.passwordActual} onChange={e => setForm({ ...form, passwordActual: e.target.value })} style={{ width: '100%', padding: 8 }} required />
          </div>
          <div>
            <label>Nueva contraseña</label><br />
            <input type="password" value={form.passwordNueva} onChange={e => setForm({ ...form, passwordNueva: e.target.value })} style={{ width: '100%', padding: 8 }} required />
          </div>
          <div>
            <label>Confirmar nueva contraseña</label><br />
            <input type="password" value={form.confirmar} onChange={e => setForm({ ...form, confirmar: e.target.value })} style={{ width: '100%', padding: 8 }} required />
          </div>
          <button type="submit" style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6 }}>
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}

export default CambiarPassword;