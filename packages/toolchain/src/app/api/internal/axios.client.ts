import axios from 'axios';
import { getAuthToken } from '../token';
import { AUTH_API_URL, WIT_API_URL } from './api.config';

function isAuthUrl(url: string) {
  return url.startsWith(WIT_API_URL) || url.startsWith(AUTH_API_URL);
}

const axiosClient = axios.create();

// Adds Authorization header to requests
axiosClient.interceptors.request.use((config) => {
  if (isAuthUrl(`${config.baseURL || ''}${config.url}`)) {
    config.headers.Authorization = `Bearer ${getAuthToken()}`;
  }
  return config;
});

export default axiosClient;
