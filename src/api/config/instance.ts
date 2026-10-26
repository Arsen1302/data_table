import axios from 'axios';

import { responseInterceptor, responseInterceptorError } from './interceptors';

const rawBaseUrl = import.meta.env.VITE_API_URL ?? 'https://test-api.ltouch.ai';

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});

instance.interceptors.response.use(responseInterceptor, responseInterceptorError);

export default instance;
