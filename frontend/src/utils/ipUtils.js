export function isValidIp(ip) {
  if (!ip || typeof ip !== 'string') return false;
  const trimmed = ip.trim();

  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4.test(trimmed)) {
    return trimmed.split('.').every(part => parseInt(part, 10) <= 255);
  }

  const ipv6 = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::$|^::1$|^([0-9a-fA-F]{1,4}::?){1,7}[0-9a-fA-F]{0,4}$/;
  return ipv6.test(trimmed);
}

export function parseLatLon(locString) {
  if (!locString) return null;
  const [lat, lon] = locString.split(',').map(Number);
  if (isNaN(lat) || isNaN(lon)) return null;
  return { lat, lon };
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}