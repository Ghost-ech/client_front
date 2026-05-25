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

// Préfixe IMAGE_BASE_URL pour les chemins relatifs (uploads locaux),
// laisse intactes les URLs absolues (http/https) et retourne null si vide.
export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${IMAGE_BASE_URL}${url}`;
};