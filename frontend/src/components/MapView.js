import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function Recenter({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) map.flyTo([lat, lon], 10, { duration: 1.2 });
  }, [lat, lon, map]);
  return null;
}

export default function MapView({ lat, lon, label }) {
  if (!lat || !lon) return null;

  return (
    <div style={{
      height: '320px', borderRadius: 'var(--radius-lg)',
      overflow: 'hidden', border: '1px solid var(--border)',
      boxShadow: 'var(--shadow)', animation: 'fadeIn 0.5s ease both'
    }}>
      <MapContainer center={[lat, lon]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter lat={lat} lon={lon} />
        <Marker position={[lat, lon]}>
          <Popup>
            <div style={{ fontFamily: 'monospace', fontSize: '13px' }}>
              <strong>{label}</strong><br />
              {lat.toFixed(4)}, {lon.toFixed(4)}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}