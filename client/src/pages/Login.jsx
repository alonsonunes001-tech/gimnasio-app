import { useState } from 'react';
import api from '../api';

function Login({ onLogin }) {
  const [vista, setVista] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formPass, setFormPass] = useState({ email: '', passwordActual: '', passwordNueva: '', confirmar: '' });
  const [errorPass, setErrorPass] = useState('');
  const [exitoPass, setExitoPass] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data.token);
    } catch {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setErrorPass(''); setExitoPass('');
    if (formPass.passwordNueva !== formPass.confirmar)
      return setErrorPass('Las contraseñas nuevas no coinciden');
    if (formPass.passwordNueva.length < 6)
      return setErrorPass('La nueva contraseña debe tener al menos 6 caracteres');
    try {
      await api.post('/auth/cambiar-password', {
        email: formPass.email,
        passwordActual: formPass.passwordActual,
        passwordNueva: formPass.passwordNueva
      });
      setExitoPass('✅ Contraseña actualizada. Ya puedes iniciar sesión.');
      setFormPass({ email: '', passwordActual: '', passwordNueva: '', confirmar: '' });
    } catch (err) {
      setErrorPass(err.response?.data?.error || 'Error al cambiar contraseña');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', background: '#0f1117',
    border: '1px solid #2d3148', borderRadius: 8, color: '#f1f5f9',
    fontSize: 14, outline: 'none'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1117 0%, #1a1d2e 100%)'
    }}>
      <div style={{
        width: 420, background: '#1a1d2e', borderRadius: 16,
        border: '1px solid #2d3148', padding: '40px 36px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏋️</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Gimnasio App</h1>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: 24, background: '#0f1117', borderRadius: 8, padding: 4 }}>
          <button onClick={() => { setVista('login'); setError(''); }} style={{
            flex: 1, padding: '8px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: vista === 'login' ? '#2d3148' : 'transparent',
            color: vista === 'login' ? '#f1f5f9' : '#64748b'
          }}>Iniciar sesión</button>
          <button onClick={() => { setVista('password'); setErrorPass(''); setExitoPass(''); }} style={{
            flex: 1, padding: '8px', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: vista === 'password' ? '#2d3148' : 'transparent',
            color: vista === 'password' ? '#f1f5f9' : '#64748b'
          }}>Cambiar contraseña</button>
        </div>

        {/* Vista Login */}
        {vista === 'login' && (
          <>
            {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#f87171', fontSize: 14 }}>{error}</div>}
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} required />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '12px', marginTop: 8,
                background: loading ? '#3730a3' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer'
              }}>
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </form>
          </>
        )}

        {/* Vista Cambiar Password */}
        {vista === 'password' && (
          <>
            {errorPass && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>{errorPass}</div>}
            {exitoPass && <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#4ade80', fontSize: 13 }}>{exitoPass}</div>}
            <form onSubmit={handleCambiarPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Email</label>
                <input type="email" value={formPass.email} onChange={e => setFormPass({ ...formPass, email: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Contraseña actual</label>
                <input type="password" value={formPass.passwordActual} onChange={e => setFormPass({ ...formPass, passwordActual: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Nueva contraseña</label>
                <input type="password" value={formPass.passwordNueva} onChange={e => setFormPass({ ...formPass, passwordNueva: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>Confirmar nueva contraseña</label>
                <input type="password" value={formPass.confirmar} onChange={e => setFormPass({ ...formPass, confirmar: e.target.value })} style={inputStyle} required />
              </div>
              <button type="submit" style={{
                width: '100%', padding: '12px', marginTop: 4,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 600, cursor: 'pointer'
              }}>
                Actualizar contraseña
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;