import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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

export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000';

// Préfixe IMAGE_BASE_URL pour les chemins relatifs (uploads locaux),
// laisse intactes les URLs absolues (http/https) et retourne null si vide.
export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${IMAGE_BASE_URL}${url}`;
};