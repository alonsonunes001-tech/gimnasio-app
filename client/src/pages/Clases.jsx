import { useState, useEffect } from 'react';
import api from '../api';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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

function Clases() {
  const [clases, setClases] = useState([]);
  const [form, setForm] = useState({ nombre: '', instructor: '', horario: '', capacidad: '', dia: 'Lunes' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [filtroDia, setFiltroDia] = useState('');

  const cargar = async () => {
    const res = await api.get('/clases' + (filtroDia ? `?dia=${filtroDia}` : ''));
    setClases(res.data);
  };

  useEffect(() => { cargar(); }, [filtroDia]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.put(`/clases/${editId}`, form);
      } else {
        await api.post('/clases', { ...form, capacidad: Number(form.capacidad) });
      }
      setForm({ nombre: '', instructor: '', horario: '', capacidad: '', dia: 'Lunes' });
      setEditId(null);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleEdit = (c) => {
    setEditId(c.id);
    setForm({ nombre: c.nombre, instructor: c.instructor, horario: c.horario, capacidad: c.capacidad, dia: c.dia });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar clase?')) return;
    await api.delete(`/clases/${id}`);
    cargar();
  };

  return (
    <div>
      {/* Filtro */}
      <div style={{ ...s.card, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label style={{ ...s.label, margin: 0 }}>Filtrar por día:</label>
        <select value={filtroDia} onChange={e => setFiltroDia(e.target.value)} style={{ ...s.input, width: 'auto', minWidth: 160 }}>
          <option value="">Todos los días</option>
          {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Formulario */}
      <div style={{ ...s.card, marginBottom: 24 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>
          {editId ? '✏️ Editar clase' : '➕ Agregar clase'}
        </h2>
        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div><label style={s.label}>Nombre</label><input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={s.input} required /></div>
          <div><label style={s.label}>Instructor</label><input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} style={s.input} required /></div>
          <div><label style={s.label}>Horario</label><input value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })} style={s.input} required placeholder="08:00 - 09:00" /></div>
          <div><label style={s.label}>Capacidad máxima</label><input type="number" value={form.capacidad} onChange={e => setForm({ ...form, capacidad: e.target.value })} style={s.input} required min="1" /></div>
          <div>
            <label style={s.label}>Día</label>
            <select value={form.dia} onChange={e => setForm({ ...form, dia: e.target.value })} style={s.input}>
              {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8, marginTop: 4 }}>
            <button type="submit" style={s.btnPrimary}>{editId ? 'Actualizar' : 'Agregar'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', instructor: '', horario: '', capacidad: '', dia: 'Lunes' }); }} style={s.btnGray}>Cancelar</button>}
          </div>
        </form>
      </div>

      {/* Tabla */}
      <div style={s.card}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>🏃 Clases registradas ({clases.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3148' }}>
                <th style={s.th}>Nombre</th><th style={s.th}>Instructor</th><th style={s.th}>Día</th><th style={s.th}>Horario</th><th style={s.th}>Inscritos/Cap.</th><th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clases.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: '#475569' }}>No hay clases registradas</td></tr>}
              {clases.map(c => {
                const lleno = c.inscritos >= c.capacidad;
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #1e2135' }}>
                    <td style={{ ...s.td, color: '#f1f5f9', fontWeight: 500 }}>{c.nombre}</td>
                    <td style={s.td}>{c.instructor}</td>
                    <td style={s.td}><span style={{ background: '#1e2135', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{c.dia}</span></td>
                    <td style={s.td}>{c.horario}</td>
                    <td style={s.td}>
                      <span style={{ color: lleno ? '#f87171' : '#4ade80', fontWeight: 600 }}>{c.inscritos}/{c.capacidad}</span>
                      {lleno && <span style={{ marginLeft: 6, fontSize: 11, color: '#f87171' }}>LLENO</span>}
                    </td>
                    <td style={s.td}>
                      <button onClick={() => handleEdit(c)} style={{ ...s.btnWarn, marginRight: 6 }}>Editar</button>
                      <button onClick={() => handleDelete(c.id)} style={s.btnDanger}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Clases;