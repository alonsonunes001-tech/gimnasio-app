import { useState } from 'react';
import api from '../api';

const s = {
  card: { background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 12, padding: 24 },
  input: { width: '100%', padding: '9px 12px', background: '#0f1117', border: '1px solid #2d3148', borderRadius: 8, color: '#f1f5f9', fontSize: 13, outline: 'none' },
  label: { display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 },
  btnPrimary: { padding: '10px 24px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};

function CambiarPassword() {
  const [form, setForm] = useState({ email: '', passwordActual: '', passwordNueva: '', confirmar: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setExito('');
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
      setExito('✅ Contraseña actualizada correctamente');
      setForm({ email: '', passwordActual: '', passwordNueva: '', confirmar: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña');
    }
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={s.card}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 20 }}>🔒 Cambiar Contraseña</h2>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>{error}</div>}
        {exito && <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#4ade80', fontSize: 13 }}>{exito}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={s.label}>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={s.input} required /></div>
          <div><label style={s.label}>Contraseña actual</label><input type="password" value={form.passwordActual} onChange={e => setForm({ ...form, passwordActual: e.target.value })} style={s.input} required /></div>
          <div><label style={s.label}>Nueva contraseña</label><input type="password" value={form.passwordNueva} onChange={e => setForm({ ...form, passwordNueva: e.target.value })} style={s.input} required /></div>
          <div><label style={s.label}>Confirmar nueva contraseña</label><input type="password" value={form.confirmar} onChange={e => setForm({ ...form, confirmar: e.target.value })} style={s.input} required /></div>
          <button type="submit" style={s.btnPrimary}>Actualizar contraseña</button>
        </form>
      </div>
    </div>
  );
}

export default CambiarPassword;