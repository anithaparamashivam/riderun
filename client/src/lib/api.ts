import axios from 'axios';

export const SERVER_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

export default api;
