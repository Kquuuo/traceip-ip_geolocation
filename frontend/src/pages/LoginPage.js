import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password.'); return; }
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login(data.user, data.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '12px 14px',
    fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text)', outline: 'none'
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Background effects */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,212,255,0.08) 0%, transparent 60%)'
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(30,45,74,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,45,74,0.4) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 70%)'
      }} />

      <div style={{
        position: 'relative', width: '100%', maxWidth: '420px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '40px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)', animation: 'fadeIn 0.5s ease both'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <div style={{
            width: '36px', height: '36px', background: 'var(--accent)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
          }}>🌐</div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px' }}>GeoTrace</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '26px', marginBottom: '6px' }}>Sign in</h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text3)', marginBottom: '32px' }}>
          {`// Access the IP intelligence dashboard`}
        </p>

        {error && (
          <div style={{
            background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)',
            borderRadius: 'var(--radius)', padding: '12px 14px',
            fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--error)', marginBottom: '20px'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px' }}>Email</label>
            <input type="email" style={inputStyle} value={email}
              onChange={e => setEmail(e.target.value)} placeholder="admin@example.com"
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px' }}>Password</label>
            <input type="password" style={inputStyle} value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: 'var(--accent)', color: '#0a0e1a',
            border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-display)',
            fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text3)' }}>
          Demo: admin@example.com / password123
        </p>
      </div>
    </div>
  );
}