import axios from 'axios';

const API_BASE = import.meta.env.APP_API_URL || 'http://localhost:5000';

const API = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur pour ajouter le token
API.interceptors.request.use(config => {
  const token = localStorage.getItem('ld_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur pour gérer les erreurs 401
API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ld_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default API;

export const IMAGE_BASE_URL = API_BASE;

// Préfixe IMAGE_BASE_URL pour les chemins relatifs.
// Force https sur les URLs absolues quand la page est servie en https,
// pour éviter le mixed-content quand le backend renvoie http://.
export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && url.startsWith('http://')) {
      return 'https://' + url.slice('http://'.length);
    }
    return url;
  }
  return `${IMAGE_BASE_URL}${url}`;
};