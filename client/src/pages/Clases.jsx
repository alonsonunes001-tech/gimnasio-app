import { useState, useEffect } from 'react';
import api from '../api';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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
      <h2 style={{ marginBottom: 16 }}>Gestión de Clases</h2>

      {/* Filtro por día */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <label>Filtrar por día:</label>
        <select value={filtroDia} onChange={e => setFiltroDia(e.target.value)} style={{ padding: 8 }}>
          <option value="">Todos</option>
          {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Formulario */}
      <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 24, border: '1px solid #e5e7eb' }}>
        <h3 style={{ marginBottom: 12 }}>{editId ? 'Editar clase' : 'Agregar clase'}</h3>
        {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>Nombre</label><br />
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={{ width: '100%', padding: 8 }} required />
          </div>
          <div>
            <label>Instructor</label><br />
            <input value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} style={{ width: '100%', padding: 8 }} required />
          </div>
          <div>
            <label>Horario</label><br />
            <input value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })} style={{ width: '100%', padding: 8 }} required placeholder="08:00 - 09:00" />
          </div>
          <div>
            <label>Capacidad máxima</label><br />
            <input type="number" value={form.capacidad} onChange={e => setForm({ ...form, capacidad: e.target.value })} style={{ width: '100%', padding: 8 }} required min="1" />
          </div>
          <div>
            <label>Día</label><br />
            <select value={form.dia} onChange={e => setForm({ ...form, dia: e.target.value })} style={{ width: '100%', padding: 8 }}>
              {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: 8 }}>
            <button type="submit" style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6 }}>
              {editId ? 'Actualizar' : 'Agregar'}
            </button>
            {editId && (
              <button type="button" onClick={() => { setEditId(null); setForm({ nombre: '', instructor: '', horario: '', capacidad: '', dia: 'Lunes' }); }}
                style={{ padding: '10px 24px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6 }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla */}
      <h3 style={{ marginBottom: 12 }}>Clases registradas ({clases.length})</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={th}>Nombre</th>
            <th style={th}>Instructor</th>
            <th style={th}>Día</th>
            <th style={th}>Horario</th>
            <th style={th}>Inscritos/Cap.</th>
            <th style={th}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clases.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: '#6b7280' }}>No hay clases registradas</td></tr>
          )}
          {clases.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
              <td style={td}>{c.nombre}</td>
              <td style={td}>{c.instructor}</td>
              <td style={td}>{c.dia}</td>
              <td style={td}>{c.horario}</td>
              <td style={td}>
                <span style={{ color: c.inscritos >= c.capacidad ? '#ef4444' : '#16a34a', fontWeight: 500 }}>
                  {c.inscritos}/{c.capacidad}
                </span>
              </td>
              <td style={td}>
                <button onClick={() => handleEdit(c)} style={{ marginRight: 8, padding: '4px 12px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: 4 }}>Editar</button>
                <button onClick={() => handleDelete(c.id)} style={{ padding: '4px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 4 }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: '10px 12px', textAlign: 'left', fontWeight: 600, fontSize: 14 };
const td = { padding: '10px 12px', fontSize: 14 };

export default Clases;