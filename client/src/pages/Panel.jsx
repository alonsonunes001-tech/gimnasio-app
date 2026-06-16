import { useState, useEffect } from 'react';
import api from '../api';
import Clases from './Clases';
import Membresias from './Membresias';
import Inscripciones from './Inscripciones';
import Reporte from './Reporte';
import CambiarPassword from './CambiarPassword';

function Panel({ onLogout }) {
  const [vista, setVista] = useState('socios');
  const [socios, setSocios] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [form, setForm] = useState({ nombre: '', rut: '', email: '', telefono: '', planId: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    const [s, p] = await Promise.all([api.get('/socios'), api.get('/planes')]);
    setSocios(s.data);
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

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({ nombre: s.nombre, rut: s.rut, email: s.email, telefono: s.telefono || '', planId: s.planId || '' });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar socio?')) return;
    await api.delete(`/socios/${id}`);
    cargarDatos();
  };

  const navBtn = (v, label) => (
    <button onClick={() => setVista(v)} style={{
      padding: '8px 20px', border: 'none', borderRadius: 6, cursor: 'pointer',
      background: vista === v ? '#2563eb' : '#e5e7eb',
      color: vista === v ? '#fff' : '#374151', fontWeight: 500
    }}>{label}</button>
  );

  return (
    <div style={{ maxWidth: 960, margin: '40px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>🏋️ Gimnasio App</h1>
        <button onClick={onLogout} style={{ padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6 }}>Cerrar sesión</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {navBtn('socios', '👥 Socios')}
        {navBtn('clases', '🏃 Clases')}
        {navBtn('membresias', '💳 Membresías')}
        {navBtn('inscripciones', '📋 Inscripciones')}
        {navBtn('reporte', '📊 Reporte')}
        {navBtn('password', '🔒 Contraseña')}
      </div>

      {vista === 'clases' && <Clases />}
      {vista === 'membresias' && <Membresias />}
      {vista === 'inscripciones' && <Inscripciones />}
      {vista === 'reporte' && <Reporte />}
      {vista === 'password' && <CambiarPassword />}

      {vista === 'socios' && (
        <>
          <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 32, border: '1px solid #e5e7eb' }}>
            <h2 style={{ marginBottom: 16 }}>{editId ? 'Editar socio' : 'Agregar socio'}</h2>
            {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label>Nombre</label><br />
                <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={{ width: '100%', padding: 8 }} required />
              </div>
              <div>
                <label>RUT</label><br />
                <input value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })} style={{ width: '100%', padding: 8 }} required placeholder="12345678-9" />
              </div>
              <div>
                <label>Email</label><br />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: 8 }} required />
              </div>
              <div>
                <label>Teléfono</label><br />
                <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} style={{ width: '100%', padding: 8 }} />
              </div>
              <div>
                <label>Plan</label><br />
                <select value={form.planId} onChange={e => setForm({ ...form, planId: e.target.value })} style={{ width: '100%', padding: 8 }}>
                  <option value="">Sin plan</option>
                  {planes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8 }}>
                <button type="submit" style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6 }}>
                  {editId ? 'Actualizar' : 'Agregar'}
                </button>
                {editId && (
                  <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', rut: '', email: '', telefono: '', planId: '' }); }}
                    style={{ padding: '10px 24px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6 }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <h2 style={{ marginBottom: 12 }}>Socios registrados ({socios.length})</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={th}>Nombre</th>
                <th style={th}>RUT</th>
                <th style={th}>Email</th>
                <th style={th}>Teléfono</th>
                <th style={th}>Plan</th>
                <th style={th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {socios.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#6b7280' }}>No hay socios registrados</td></tr>
              )}
              {socios.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={td}>{s.nombre}</td>
                  <td style={td}>{s.rut}</td>
                  <td style={td}>{s.email}</td>
                  <td style={td}>{s.telefono || '—'}</td>
                  <td style={td}>{s.plan?.nombre || '—'}</td>
                  <td style={td}>
                    <button onClick={() => handleEdit(s)} style={{ marginRight: 8, padding: '4px 12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4 }}>Editar</button>
                    <button onClick={() => handleDelete(s.id)} style={{ padding: '4px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4 }}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const th = { padding: '10px 12px', textAlign: 'left', fontWeight: 600, fontSize: 14 };
const td = { padding: '10px 12px', fontSize: 14 };

export default Panel;