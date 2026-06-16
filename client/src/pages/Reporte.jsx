import { useState, useEffect } from 'react';
import api from '../api';

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
    <div>
      <h2 style={{ marginBottom: 20 }}>📊 Reporte de Ocupación</h2>

      {/* Resumen general */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#2563eb' }}>{socios.length}</div>
          <div style={{ color: '#1e40af', marginTop: 4 }}>Socios registrados</div>
        </div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#16a34a' }}>{clases.length}</div>
          <div style={{ color: '#15803d', marginTop: 4 }}>Clases activas</div>
        </div>
        <div style={{ background: ocupacion >= 80 ? '#fef2f2' : '#fefce8', border: `1px solid ${ocupacion >= 80 ? '#fecaca' : '#fef08a'}`, borderRadius: 8, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: ocupacion >= 80 ? '#ef4444' : '#ca8a04' }}>{ocupacion}%</div>
          <div style={{ color: ocupacion >= 80 ? '#b91c1c' : '#a16207', marginTop: 4 }}>Ocupación total</div>
        </div>
      </div>

      {/* Tabla por clase */}
      <h3 style={{ marginBottom: 12 }}>Ocupación por clase</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={th}>Clase</th>
            <th style={th}>Instructor</th>
            <th style={th}>Día</th>
            <th style={th}>Horario</th>
            <th style={th}>Inscritos</th>
            <th style={th}>Capacidad</th>
            <th style={th}>Ocupación</th>
          </tr>
        </thead>
        <tbody>
          {clases.length === 0 && (
            <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: '#6b7280' }}>No hay clases</td></tr>
          )}
          {clases.map(c => {
            const pct = c.capacidad > 0 ? Math.round((c.inscritos / c.capacidad) * 100) : 0;
            return (
              <tr key={c.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={td}>{c.nombre}</td>
                <td style={td}>{c.instructor}</td>
                <td style={td}>{c.dia}</td>
                <td style={td}>{c.horario}</td>
                <td style={td}>{c.inscritos}</td>
                <td style={td}>{c.capacidad}</td>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: pct >= 100 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#16a34a', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 500, color: pct >= 100 ? '#ef4444' : '#374151' }}>{pct}%</span>
                  </div>
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

export default Reporte;