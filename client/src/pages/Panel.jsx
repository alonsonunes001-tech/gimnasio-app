import { useState, useEffect } from 'react';
import api from '../api';
import Clases from './Clases';
import Membresias from './Membresias';
import Inscripciones from './Inscripciones';
import Reporte from './Reporte';
import CambiarPassword from './CambiarPassword';

const s = {
  card: { background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 12, padding: 20 },
  input: { width: '100%', padding: '9px 12px', background: '#0f1117', border: '1px solid #2d3148', borderRadius: 8, color: '#f1f5f9', fontSize: 13, outline: 'none' },
  label: { display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 },
  btnPrimary: { padding: '9px 20px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnDanger: { padding: '5px 12px', background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
  btnWarn: { padding: '5px 12px', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
  btnGray: { padding: '9px 20px', background: '#2d3148', color: '#94a3b8', border: 'none', borderRadius: 7, fontSize: 13, cursor: 'pointer' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '12px 14px', fontSize: 13, color: '#cbd5e1' },
};

function Panel({ onLogout }) {
  const [vista, setVista] = useState('inicio');
  const [socios, setSocios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [form, setForm] = useState({ nombre: '', rut: '', email: '', telefono: '', planId: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    const [sc, p] = await Promise.all([api.get('/socios'), api.get('/planes')]);
    setSocios(sc.data);
    setPlanes(p.data);
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.put(`/socios/${editId}`, { ...form, planId: form.planId || null });
      } else {
        await api.post('/socios', { ...form, planId: form.planId || null });
      }
      setForm({ nombre: '', rut: '', email: '', telefono: '', planId: '' });
      setEditId(null);
      cargarDatos();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleEdit = (sc) => {
    setEditId(sc.id);
    setForm({ nombre: sc.nombre, rut: sc.rut, email: sc.email, telefono: sc.telefono || '', planId: sc.planId || '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar socio?')) return;
    await api.delete(`/socios/${id}`);
    cargarDatos();
  };

  const navItems = [
    { id: 'inicio', label: '🏠 Inicio' },
    { id: 'socios', label: '👥 Socios' },
    { id: 'clases', label: '🏃 Clases' },
    { id: 'membresias', label: '💳 Membresías' },
    { id: 'inscripciones', label: '📋 Inscripciones' },
    { id: 'reporte', label: '📊 Reporte' },
    { id: 'password', label: '🔒 Contraseña' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117' }}>
      {/* Navbar */}
      <div style={{ background: '#1a1d2e', borderBottom: '1px solid #2d3148', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🏋️</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9' }}>Gimnasio App</span>
          </div>
          <button onClick={onLogout} style={{ padding: '6px 14px', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 7, fontSize: 13, cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#13161f', borderBottom: '1px solid #2d3148', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {navItems.map(({ id, label }) => (
            <button key={id} onClick={() => setVista(id)} style={{
              padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
              color: vista === id ? '#818cf8' : '#64748b',
              borderBottom: vista === id ? '2px solid #818cf8' : '2px solid transparent',
              transition: 'all 0.2s'
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* Vista Inicio */}
        {vista === 'inicio' && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🏋️</div>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f1f5f9', marginBottom: 12 }}>
              Bienvenido a Gimnasio App
            </h1>
            <p style={{ color: '#64748b', fontSize: 16, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
              Gestiona socios, clases, membresías y más desde un solo lugar.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 700, margin: '0 auto' }}>
              {[
                { icon: '👥', label: 'Socios', desc: 'Administra los socios del gimnasio', id: 'socios' },
                { icon: '🏃', label: 'Clases', desc: 'Gestiona las clases y horarios', id: 'clases' },
                { icon: '💳', label: 'Membresías', desc: 'Controla las membresías activas', id: 'membresias' },
                { icon: '📋', label: 'Inscripciones', desc: 'Inscribe socios a clases', id: 'inscripciones' },
                { icon: '📊', label: 'Reporte', desc: 'Revisa la ocupación del gimnasio', id: 'reporte' },
                { icon: '🔒', label: 'Contraseña', desc: 'Cambia tu contraseña', id: 'password' },
              ].map(({ icon, label, desc, id }) => (
                <div key={id} onClick={() => setVista(id)} style={{
                  background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 12,
                  padding: '24px 16px', cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#818cf8'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2d3148'}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vista === 'clases' && <Clases />}
        {vista === 'membresias' && <Membresias />}
        {vista === 'inscripciones' && <Inscripciones />}
        {vista === 'reporte' && <Reporte />}
        {vista === 'password' && <CambiarPassword />}

        {vista === 'socios' && (
          <>
            <div style={{ ...s.card, marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
                {editId ? '✏️ Editar socio' : '➕ Agregar socio'}
              </h2>
              {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>{error}</div>}
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><label style={s.label}>Nombre</label><input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={s.input} required /></div>
                <div><label style={s.label}>RUT</label><input value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })} style={s.input} required placeholder="12345678-9" /></div>
                <div><label style={s.label}>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={s.input} required /></div>
                <div><label style={s.label}>Teléfono</label><input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} style={s.input} /></div>
                <div>
                  <label style={s.label}>Plan</label>
                  <select value={form.planId} onChange={e => setForm({ ...form, planId: e.target.value })} style={s.input}>
                    <option value="">Sin plan</option>
                    {planes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8, marginTop: 4 }}>
                  <button type="submit" style={s.btnPrimary}>{editId ? 'Actualizar' : 'Agregar'}</button>
                  {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', rut: '', email: '', telefono: '', planId: '' }); }} style={s.btnGray}>Cancelar</button>}
                </div>
              </form>
            </div>

            <div style={s.card}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>👥 Socios registrados ({socios.length})</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #2d3148' }}>
                      <th style={s.th}>Nombre</th><th style={s.th}>RUT</th><th style={s.th}>Email</th><th style={s.th}>Teléfono</th><th style={s.th}>Plan</th><th style={s.th}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {socios.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#475569' }}>No hay socios registrados</td></tr>}
                    {socios.map(sc => (
                      <tr key={sc.id} style={{ borderBottom: '1px solid #1e2135' }}>
                        <td style={{ ...s.td, color: '#f1f5f9', fontWeight: 500 }}>{sc.nombre}</td>
                        <td style={s.td}>{sc.rut}</td>
                        <td style={s.td}>{sc.email}</td>
                        <td style={s.td}>{sc.telefono || '—'}</td>
                        <td style={s.td}>{sc.plan ? <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{sc.plan.nombre}</span> : '—'}</td>
                        <td style={s.td}>
                          <button onClick={() => handleEdit(sc)} style={{ ...s.btnWarn, marginRight: 6 }}>Editar</button>
                          <button onClick={() => handleDelete(sc.id)} style={s.btnDanger}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Panel;