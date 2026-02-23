import React from 'react';

const Field = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '10px',
      color: 'var(--text3)', letterSpacing: '0.12em', textTransform: 'uppercase'
    }}>{label}</span>
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: '14px',
      color: 'var(--accent)', fontWeight: '700', wordBreak: 'break-all'
    }}>{value || '—'}</span>
  </div>
);

export default function GeoCard({ data }) {
  if (!data) return null;
  const { ip, city, region, country, org, timezone, loc } = data;

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '24px',
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '16px', animation: 'fadeIn 0.4s ease both', boxShadow: 'var(--shadow-glow)'
    }}>
      <div style={{
        gridColumn: '1 / -1', display: 'flex', alignItems: 'center',
        gap: '12px', marginBottom: '8px', paddingBottom: '16px',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent)', position: 'relative', flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            border: '2px solid var(--accent)',
            animation: 'pulse-ring 1.5s ease-out infinite'
          }} />
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '22px',
          fontWeight: '700', color: 'var(--text)', letterSpacing: '0.04em'
        }}>{ip}</span>
      </div>
      <Field label="City" value={city} />
      <Field label="Region" value={region} />
      <Field label="Country" value={country} />
      <Field label="Organization" value={org} />
      <Field label="Timezone" value={timezone} />
      <Field label="Coordinates" value={loc} />
    </div>
  );
}