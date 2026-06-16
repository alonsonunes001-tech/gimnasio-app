import { useState, useEffect } from 'react';
import api from '../api';

const s = {
  card: { background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 12, padding: 20 },
  input: { width: '100%', padding: '9px 12px', background: '#0f1117', border: '1px solid #2d3148', borderRadius: 8, color: '#f1f5f9', fontSize: 13, outline: 'none' },
  label: { display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 500 },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '12px 14px', fontSize: 13, color: '#cbd5e1' },
};

function Inscripciones() {
  const [socios, setSocios] = useState([]);
  const [clases, setClases] = useState([]);
  const [socioId, setSocioId] = useState('');
  const [vigencia, setVigencia] = useState(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    api.get('/socios').then(r => setSocios(r.data));
    api.get('/clases').then(r => setClases(r.data));
  }, []);

  const verificar = async (id) => {
    if (!id) return;
    try {
      const res = await api.get(`/membresias/verificar/${id}`);
      setVigencia({ vigente: true, vencimiento: res.data.vencimiento });
    } catch (err) {
      setVigencia({ vigente: false, mensaje: err.response?.data?.error });
    }
  };

  const handleSocioChange = (e) => {
    setSocioId(e.target.value);
    setError(''); setExito('');
    verificar(e.target.value);
  };

  const inscribir = async (claseId) => {
    setError(''); setExito('');
    if (!socioId) return setError('Selecciona un socio primero');
    if (!vigencia?.vigente) return setError('El socio no tiene membresía vigente');
    try {
      await api.post(`/clases/${claseId}/inscribir`, { socioId });
      setExito('✅ Inscripción exitosa');
      const res = await api.get('/clases');
      setClases(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al inscribir');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={s.card}>
        <label style={{ ...s.label, fontSize: 13, marginBottom: 8 }}>Seleccionar socio</label>
        <select value={socioId} onChange={handleSocioChange} style={{ ...s.input, maxWidth: 320 }}>
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

        {error && <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13 }}>{error}</div>}
        {exito && <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', fontSize: 13 }}>{exito}</div>}
      </div>

      <div style={s.card}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>🏃 Clases disponibles</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3148' }}>
                <th style={s.th}>Nombre</th><th style={s.th}>Instructor</th><th style={s.th}>Día</th><th style={s.th}>Horario</th><th style={s.th}>Inscritos/Cap.</th><th style={s.th}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {clases.map(c => {
                const lleno = c.inscritos >= c.capacidad;
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #1e2135' }}>
                    <td style={{ ...s.td, color: '#f1f5f9', fontWeight: 500 }}>{c.nombre}</td>
                    <td style={s.td}>{c.instructor}</td>
                    <td style={s.td}><span style={{ background: '#1e2135', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{c.dia}</span></td>
                    <td style={s.td}>{c.horario}</td>
                    <td style={s.td}><span style={{ color: lleno ? '#f87171' : '#4ade80', fontWeight: 600 }}>{c.inscritos}/{c.capacidad}</span></td>
                    <td style={s.td}>
                      <button onClick={() => inscribir(c.id)} disabled={lleno} style={{
                        padding: '5px 14px', border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: lleno ? 'not-allowed' : 'pointer',
                        background: lleno ? '#1e2135' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                        color: lleno ? '#475569' : '#fff'
                      }}>
                        {lleno ? 'Cupo lleno' : 'Inscribir'}
                      </button>
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

export default Inscripciones;