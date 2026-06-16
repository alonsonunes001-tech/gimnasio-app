import { useState, useEffect } from 'react';
import api from '../api';

function Membresias() {
  const [socios, setSocios] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState('');
  const [vigencia, setVigencia] = useState(null);
  const [form, setForm] = useState({ socioId: '', tipo: 'Mensual', fechaInicio: '', fechaVencimiento: '', precio: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    api.get('/socios').then(r => setSocios(r.data));
  }, []);

  const verificar = async (socioId) => {
    if (!socioId) return;
    try {
      const res = await api.get(`/membresias/verificar/${socioId}`);
      setVigencia({ vigente: true, vencimiento: res.data.vencimiento });
    } catch (err) {
      setVigencia({ vigente: false, mensaje: err.response?.data?.error });
    }
  };

  const cargarMembresias = async (socioId) => {
    if (!socioId) return;
    const res = await api.get(`/membresias/socio/${socioId}`);
    setMembresias(res.data);
  };

  const handleSocioChange = (e) => {
    const id = e.target.value;
    setSocioSeleccionado(id);
    setForm({ ...form, socioId: id });
    verificar(id);
    cargarMembresias(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    try {
      await api.post('/membresias', { ...form, precio: Number(form.precio) });
      setExito('Membresía registrada correctamente');
      setForm({ ...form, tipo: 'Mensual', fechaInicio: '', fechaVencimiento: '', precio: '' });
      verificar(socioSeleccionado);
      cargarMembresias(socioSeleccionado);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar membresía');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Gestión de Membresías</h2>

      {/* Selector de socio */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: 500 }}>Seleccionar socio:</label><br />
        <select value={socioSeleccionado} onChange={handleSocioChange} style={{ padding: 8, marginTop: 6, minWidth: 250 }}>
          <option value="">-- Selecciona un socio --</option>
          {socios.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.rut})</option>)}
        </select>
      </div>

      {/* Estado de vigencia */}
      {vigencia && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 20,
          background: vigencia.vigente ? '#dcfce7' : '#fee2e2',
          border: `1px solid ${vigencia.vigente ? '#16a34a' : '#ef4444'}`,
          color: vigencia.vigente ? '#15803d' : '#b91c1c'
        }}>
          {vigencia.vigente
            ? `✅ Membresía vigente hasta: ${vigencia.vencimiento}`
            : `❌ ${vigencia.mensaje}`}
        </div>
      )}

      {/* Formulario nueva membresía */}
      {socioSeleccionado && (
        <div style={{ background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 24, border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginBottom: 12 }}>Renovar / Nueva membresía</h3>
          {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
          {exito && <p style={{ color: 'green', marginBottom: 12 }}>{exito}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>Tipo</label><br />
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} style={{ width: '100%', padding: 8 }}>
                <option>Mensual</option>
                <option>Trimestral</option>
                <option>Semestral</option>
                <option>Anual</option>
              </select>
            </div>
            <div>
              <label>Precio</label><br />
              <input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} style={{ width: '100%', padding: 8 }} required />
            </div>
            <div>
              <label>Fecha inicio</label><br />
              <input type="date" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })} style={{ width: '100%', padding: 8 }} required />
            </div>
            <div>
              <label>Fecha vencimiento</label><br />
              <input type="date" value={form.fechaVencimiento} onChange={e => setForm({ ...form, fechaVencimiento: e.target.value })} style={{ width: '100%', padding: 8 }} required />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" style={{ padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6 }}>
                Registrar membresía
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historial */}
      {membresias.length > 0 && (
        <>
          <h3 style={{ marginBottom: 12 }}>Historial de membresías</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={th}>Tipo</th>
                <th style={th}>Inicio</th>
                <th style={th}>Vencimiento</th>
                <th style={th}>Precio</th>
                <th style={th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {membresias.map(m => {
                const hoy = new Date().toISOString().split('T')[0];
                const vigente = m.fechaVencimiento >= hoy;
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={td}>{m.tipo}</td>
                    <td style={td}>{m.fechaInicio}</td>
                    <td style={td}>{m.fechaVencimiento}</td>
                    <td style={td}>${Number(m.precio).toLocaleString()}</td>
                    <td style={td}>
                      <span style={{ color: vigente ? '#16a34a' : '#ef4444', fontWeight: 500 }}>
                        {vigente ? 'Vigente' : 'Vencida'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

const th = { padding: '10px 12px', textAlign: 'left', fontWeight: 600, fontSize: 14 };
const td = { padding: '10px 12px', fontSize: 14 };

export default Membresias;