import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = (email, password) =>
  api.post('/login', { email, password }).then(r => r.data);

export const getGeoByIp = async (ip = '') => {
  const url = ip
    ? `https://ipinfo.io/${ip}/geo`
    : `https://ipinfo.io/geo`;
  const res = await axios.get(url);
  return res.data;
};

export const getHistory = () =>
  api.get('/history').then(r => r.data.history);

export const saveHistory = (entry) =>
  api.post('/history', entry).then(r => r.data);

export const deleteHistory = (ids) =>
  api.delete('/history', { data: { ids } }).then(r => r.data);