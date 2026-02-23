import React, { useState } from 'react';
import { formatDate } from '../utils/ipUtils';

export default function HistoryList({ history, onSelect, onDelete }) {
  const [selected, setSelected] = useState(new Set());

  const toggleOne = (e, id) => {
    e.stopPropagation();
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(selected.size === history.length ? new Set() : new Set(history.map(h => h.id)));
  };

  const handleDelete = () => {
    if (selected.size === 0) return;
    onDelete(Array.from(selected));
    setSelected(new Set());
  };

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {history.length > 0 && (
            <input type="checkbox" style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
              checked={selected.size === history.length && history.length > 0}
              onChange={toggleAll} />
          )}
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '13px', letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text2)'
          }}>Search History</span>
          <span style={{
            background: 'var(--border)', color: 'var(--text2)',
            borderRadius: '20px', padding: '2px 8px',
            fontSize: '11px', fontFamily: 'var(--font-mono)'
          }}>{history.length}</span>
        </div>
        {selected.size > 0 && (
          <button onClick={handleDelete} style={{
            background: 'rgba(244,63,94,0.12)', color: 'var(--error)',
            border: '1px solid rgba(244,63,94,0.3)', borderRadius: 'var(--radius)',
            padding: '6px 14px', fontSize: '12px', fontFamily: 'var(--font-mono)', cursor: 'pointer'
          }}>
            Delete {selected.size} selected
          </button>
        )}
      </div>

      {/* Rows */}
      {history.length === 0 ? (
        <div style={{
          padding: '32px', textAlign: 'center',
          color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: '13px'
        }}>
          No searches yet. Try looking up an IP address above.
        </div>
      ) : (
        history.map(item => (
          <div key={item.id}
            onClick={() => onSelect(item)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 20px', borderBottom: '1px solid var(--border)',
              cursor: 'pointer', transition: 'background 0.15s',
              background: selected.has(item.id) ? 'rgba(0,212,255,0.05)' : 'transparent'
            }}
            onMouseEnter={e => { if (!selected.has(item.id)) e.currentTarget.style.background = 'var(--surface2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = selected.has(item.id) ? 'rgba(0,212,255,0.05)' : 'transparent'; }}
          >
            <input type="checkbox"
              style={{ accentColor: 'var(--accent)', cursor: 'pointer', flexShrink: 0 }}
              checked={selected.has(item.id)}
              onClick={e => toggleOne(e, item.id)}
              onChange={() => {}}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--accent)', flex: 1 }}>
              {item.ip_address}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text2)', flex: 2 }}>
              {[item.city, item.region, item.country].filter(Boolean).join(', ') || '—'}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text3)', flexShrink: 0 }}>
              {formatDate(item.created_at)}
            </span>
          </div>
        ))
      )}
    </div>
  );
}