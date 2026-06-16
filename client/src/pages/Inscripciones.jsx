import { useState, useEffect } from 'react';
import api from '../api';

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
    setError('');
    setExito('');
    verificar(e.target.value);
  };

  const inscribir = async (claseId) => {
    setError('');
    setExito('');

    if (!socioId) return setError('Selecciona un socio primero');
    if (!vigencia?.vigente) return setError('El socio no tiene membresía vigente');

    try {
      await api.post(`/clases/${claseId}/inscribir`, { socioId });
      setExito('Inscripción exitosa');
      const res = await api.get('/clases');
      setClases(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al inscribir');
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Inscripción a Clases</h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ fontWeight: 500 }}>Seleccionar socio:</label><br />
        <select value={socioId} onChange={handleSocioChange} style={{ padding: 8, marginTop: 6, minWidth: 250 }}>
          <option value="">-- Selecciona un socio --</option>
          {socios.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.rut})</option>)}
        </select>
      </div>

      {vigencia && (
        <div style={{
          padding: '12px 16px', borderRadius: 8, marginBottom: 20,
          background: vigencia.vigente ? '#dcfce7' : '#fee2e2',
          border: `1px solid ${vigencia.vigente ? '#16a34a' : '#ef4444'}`,
          color: vigencia.vigente ? '#15803d' : '#b91c1c'
        }}>
          {vigencia.vigente ? `✅ Membresía vigente hasta: ${vigencia.vencimiento}` : `❌ ${vigencia.mensaje}`}
        </div>
      )}

      {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
      {exito && <p style={{ color: 'green', marginBottom: 12 }}>{exito}</p>}

      <h3 style={{ marginBottom: 12 }}>Clases disponibles</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={th}>Nombre</th>
            <th style={th}>Instructor</th>
            <th style={th}>Día</th>
            <th style={th}>Horario</th>
            <th style={th}>Inscritos/Cap.</th>
            <th style={th}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {clases.map(c => {
            const lleno = c.inscritos >= c.capacidad;
            return (
              <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={td}>{c.nombre}</td>
                <td style={td}>{c.instructor}</td>
                <td style={td}>{c.dia}</td>
                <td style={td}>{c.horario}</td>
                <td style={td}>
                  <span style={{ color: lleno ? '#ef4444' : '#16a34a', fontWeight: 500 }}>
                    {c.inscritos}/{c.capacidad}
                  </span>
                </td>
                <td style={td}>
                  <button
                    onClick={() => inscribir(c.id)}
                    disabled={lleno}
                    style={{
                      padding: '4px 12px', border: 'none', borderRadius: 4, cursor: lleno ? 'not-allowed' : 'pointer',
                      background: lleno ? '#d1d5db' : '#2563eb', color: lleno ? '#6b7280' : '#fff'
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
  );
}

const th = { padding: '10px 12px', textAlign: 'left', fontWeight: 600, fontSize: 14 };
const td = { padding: '10px 12px', fontSize: 14 };

export default Inscripciones;