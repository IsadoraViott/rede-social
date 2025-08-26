// app/src/services/api.js
import axios from 'axios';

// Para web no mesmo PC, use localhost.
// (Depois, para testar no celular, a gente volta a usar o IP.)
export const API_BASE_URL = 'http://localhost:3001/api';

console.log('API_BASE_URL =>', API_BASE_URL);

export const API_ORIGIN = API_BASE_URL.replace(/\/api$/, '');

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err?.response?.data?.message || 'Erro de rede';
    console.warn('[API]', msg);
    return Promise.reject(err);
  }
);

export default api;
