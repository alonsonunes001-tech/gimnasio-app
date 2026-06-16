import { useState, useEffect } from 'react';
import api from '../api';

const s = {
  card: { background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 12, padding: 20 },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  td: { padding: '12px 14px', fontSize: 13, color: '#cbd5e1' },
};

function Reporte() {
  const [clases, setClases] = useState([]);
  const [socios, setSocios] = useState([]);

  useEffect(() => {
    api.get('/clases').then(r => setClases(r.data));
    api.get('/socios').then(r => setSocios(r.data));
  }, []);

  const totalInscritos = clases.reduce((sum, c) => sum + c.inscritos, 0);
  const totalCapacidad = clases.reduce((sum, c) => sum + c.capacidad, 0);
  const ocupacion = totalCapacidad > 0 ? Math.round((totalInscritos / totalCapacidad) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Tarjetas resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#818cf8' }}>{socios.length}</div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Socios registrados</div>
        </div>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#4ade80' }}>{clases.length}</div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Clases activas</div>
        </div>
        <div style={{ ...s.card, textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: ocupacion >= 80 ? '#f87171' : '#fbbf24' }}>{ocupacion}%</div>
          <div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Ocupación total</div>
        </div>
      </div>

      {/* Tabla */}
      <div style={s.card}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f1f5f9', marginBottom: 16 }}>📊 Ocupación por clase</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3148' }}>
                <th style={s.th}>Clase</th><th style={s.th}>Instructor</th><th style={s.th}>Día</th><th style={s.th}>Horario</th><th style={s.th}>Inscritos</th><th style={s.th}>Capacidad</th><th style={s.th}>Ocupación</th>
              </tr>
            </thead>
            <tbody>
              {clases.length === 0 && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#475569' }}>No hay clases</td></tr>}
              {clases.map(c => {
                const pct = c.capacidad > 0 ? Math.round((c.inscritos / c.capacidad) * 100) : 0;
                const color = pct >= 100 ? '#f87171' : pct >= 70 ? '#fbbf24' : '#4ade80';
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid #1e2135' }}>
                    <td style={{ ...s.td, color: '#f1f5f9', fontWeight: 500 }}>{c.nombre}</td>
                    <td style={s.td}>{c.instructor}</td>
                    <td style={s.td}><span style={{ background: '#1e2135', padding: '2px 8px', borderRadius: 4, fontSize: 12 }}>{c.dia}</span></td>
                    <td style={s.td}>{c.horario}</td>
                    <td style={s.td}>{c.inscritos}</td>
                    <td style={s.td}>{c.capacidad}</td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: '#0f1117', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color, minWidth: 36 }}>{pct}%</span>
                      </div>
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

export default Reporte;