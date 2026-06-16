import { useState, useEffect } from 'react';
import api from '../api';

const s = {
  card: { background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 12, padding: 20 },
  input: { width: '100%', padding: '9px 12px', background: '#0f1117', border: '1px solid #2d3148', borderRadius: 8, color: '#f1f5f9', fontSize: 13, outline: 'none' },
  label: { display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 },
  btnPrimary: { padding: '9px 20px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '12px 14px', fontSize: 13, color: '#cbd5e1' },
};

function Membresias() {
  const [socios, setSocios] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [socioSeleccionado, setSocioSeleccionado] = useState('');
  const [vigencia, setVigencia] = useState(null);
  const [form, setForm] = useState({ socioId: '', tipo: 'Mensual', fechaInicio: '', fechaVencimiento: '', precio: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => { api.get('/socios').then(r => setSocios(r.data)); }, []);

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
    setError(''); setExito('');
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Selector socio */}
      <div style={s.card}>
        <label style={{ ...s.label, fontSize: 13, marginBottom: 8 }}>Seleccionar socio</label>
        <select value={socioSeleccionado} onChange={handleSocioChange} style={{ ...s.input, maxWidth: 320 }}>
          <option value="">-- Selecciona un socio --</option>
          {socios.map(sc => <option key={sc.id} value={sc.id}>{sc.nombre} ({sc.rut})</option>)}
        </select>

        {vigencia && (
          <div style={{
            marginTop: 14, padding: '10px 14px', borderRadius: 8, fontSize: 13,
            background: vigencia.vigente ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${vigencia.vigente ? 'rgba(74,222,128,0.3)' : 'rgba(239,68,68,0.3)'}`,
            color: vigencia.vigente ? '#4ade80' : '#f87171'
          }}>
            {vigencia.vigente ? `✅ Membresía vigente hasta: ${vigencia.vencimiento}` : `❌ ${vigencia.mensaje}`}
          </div>
        )}
      </div>

      {/* Formulario */}
      {socioSeleccionado && (
        <div style={s.card}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>💳 Renovar / Nueva membresía</h2>
          {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#f87171', fontSize: 13 }}>{error}</div>}
          {exito && <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#4ade80', fontSize: 13 }}>{exito}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={s.label}>Tipo</label>
              <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} style={s.input}>
                <option>Mensual</option><option>Trimestral</option><option>Semestral</option><option>Anual</option>
              </select>
            </div>
            <div><label style={s.label}>Precio</label><input type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} style={s.input} required /></div>
            <div><label style={s.label}>Fecha inicio</label><input type="date" value={form.fechaInicio} onChange={e => setForm({ ...form, fechaInicio: e.target.value })} style={s.input} required /></div>
            <div><label style={s.label}>Fecha vencimiento</label><input type="date" value={form.fechaVencimiento} onChange={e => setForm({ ...form, fechaVencimiento: e.target.value })} style={s.input} required /></div>
            <div style={{ gridColumn: 'span 2' }}>
              <button type="submit" style={s.btnPrimary}>Registrar membresía</button>
            </div>
          </form>
        </div>
      )}

      {/* Historial */}
      {membresias.length > 0 && (
        <div style={s.card}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>📋 Historial de membresías</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3148' }}>
                <th style={s.th}>Tipo</th><th style={s.th}>Inicio</th><th style={s.th}>Vencimiento</th><th style={s.th}>Precio</th><th style={s.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {membresias.map(m => {
                const hoy = new Date().toISOString().split('T')[0];
                const vigente = m.fechaVencimiento >= hoy;
                return (
                  <tr key={m.id} style={{ borderBottom: '1px solid #1e2135' }}>
                    <td style={s.td}>{m.tipo}</td>
                    <td style={s.td}>{m.fechaInicio}</td>
                    <td style={s.td}>{m.fechaVencimiento}</td>
                    <td style={s.td}>${Number(m.precio).toLocaleString()}</td>
                    <td style={s.td}>
                      <span style={{ background: vigente ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)', color: vigente ? '#4ade80' : '#f87171', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                        {vigente ? 'Vigente' : 'Vencida'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Membresias;