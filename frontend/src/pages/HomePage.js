import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGeoByIp, getHistory, saveHistory, deleteHistory } from '../services/api';
import { isValidIp, parseLatLon } from '../utils/ipUtils';
import GeoCard from '../components/GeoCard';
import MapView from '../components/MapView';
import HistoryList from '../components/HistoryList';

export default function HomePage() {
  const { user, logout } = useAuth();
  const [myGeo, setMyGeo] = useState(null);
  const [displayGeo, setDisplayGeo] = useState(null);
  const [ipInput, setIpInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [history, setHistory] = useState([]);

  const coords = parseLatLon(displayGeo?.loc);

  useEffect(() => {
    (async () => {
      try {
        const [geo, hist] = await Promise.all([getGeoByIp(), getHistory()]);
        setMyGeo(geo);
        setDisplayGeo(geo);
        setHistory(hist);
      } catch (err) {
        console.error('Init error', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const doSearch = useCallback(async (ip) => {
    setInputError('');
    const trimmed = ip.trim();
    if (!trimmed) { setInputError('Please enter an IP address.'); return; }
    if (!isValidIp(trimmed)) { setInputError('Invalid IP address. Please enter a valid IPv4 or IPv6 address.'); return; }

    setSearching(true);
    try {
      const geo = await getGeoByIp(trimmed);
      if (geo.error) { setInputError('Could not find geo information for this IP.'); return; }
      setDisplayGeo(geo);
      const loc = parseLatLon(geo.loc);
      await saveHistory({
        ip_address: geo.ip || trimmed,
        city: geo.city, region: geo.region, country: geo.country,
        org: geo.org, lat: loc?.lat, lon: loc?.lon, timezone: geo.timezone,
      });
      const hist = await getHistory();
      setHistory(hist);
    } catch (err) {
      setInputError('Failed to fetch geolocation. Please try again.');
    } finally {
      setSearching(false);
    }
  }, []);

  const handleClear = () => { setIpInput(''); setInputError(''); setDisplayGeo(myGeo); };

  const handleHistorySelect = (item) => {
    setDisplayGeo({
      ip: item.ip_address, city: item.city, region: item.region,
      country: item.country, org: item.org, timezone: item.timezone,
      loc: item.lat && item.lon ? `${item.lat},${item.lon}` : null,
    });
    setIpInput(item.ip_address);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = async (ids) => {
    try {
      await deleteHistory(ids);
      setHistory(prev => prev.filter(h => !ids.includes(h.id)));
    } catch (err) { console.error(err); }
  };

  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '12px' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '60px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px' }}>
          <span>🌐</span> TraceIP
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text2)' }}>@{user?.name}</span>
          <button onClick={logout} style={{
            background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: '7px 14px', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text2)', cursor: 'pointer'
          }}>Sign out</button>
        </div>
      </nav>

      {/* Main */}
      <main style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Search */}
        <div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input
                type="text"
                value={ipInput}
                onChange={e => { setIpInput(e.target.value); setInputError(''); }}
                onKeyDown={e => e.key === 'Enter' && doSearch(ipInput)}
                placeholder="Enter an IP address (e.g. 8.8.8.8)"
                style={{
                  width: '100%', background: 'var(--surface)', padding: '13px 16px',
                  border: `1px solid ${inputError ? 'var(--error)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)',
                  fontSize: '15px', color: 'var(--text)', outline: 'none'
                }}
              />
              {inputError && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--error)' }}>⚠ {inputError}</span>}
            </div>
            <button onClick={() => doSearch(ipInput)} disabled={searching} style={{
              padding: '13px 22px', background: 'var(--accent)', color: '#0a0e1a',
              border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-display)',
              fontWeight: 700, fontSize: '14px', cursor: 'pointer', opacity: searching ? 0.7 : 1, whiteSpace: 'nowrap'
            }}>
              {searching ? 'Looking up...' : 'Trace IP'}
            </button>
            {displayGeo !== myGeo && (
              <button onClick={handleClear} style={{
                padding: '13px 16px', background: 'transparent', color: 'var(--text2)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                fontFamily: 'var(--font-mono)', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap'
              }}>↩ My IP</button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', gap: '12px' }}>
            <div style={{ width: 32, height: 32, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text3)', fontSize: '13px' }}>Detecting your location...</span>
          </div>
        ) : (
          <>
            <div>
              <p style={labelStyle}>{displayGeo === myGeo ? 'Your current location' : `Results for ${displayGeo?.ip}`}</p>
              <GeoCard data={displayGeo} />
            </div>
            {coords && (
              <div>
                <MapView lat={coords.lat} lon={coords.lon} label={displayGeo?.ip} />
              </div>
            )}
          </>
        )}

        {/* History */}
        <div>
          <HistoryList history={history} onSelect={handleHistorySelect} onDelete={handleDeleteHistory} />
        </div>
      </main>
    </div>
  );
}