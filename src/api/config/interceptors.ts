import axios, { type AxiosResponse, isAxiosError } from 'axios';

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const extractErrorCode = (data: unknown): string | null => {
  if (typeof data === 'object' && data !== null && 'error' in data) {
    const code = (data as { error: unknown }).error;
    return typeof code === 'string' ? code : 'unknown_error';
  }
  return null;
};

export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  const errorCode = extractErrorCode(response.data);
  if (errorCode !== null) {
    throw new ApiError(errorCode, response.status);
  }
  return response;
};

export const responseInterceptorError = (error: unknown): never => {
  if (axios.isCancel(error) || error instanceof ApiError) {
    throw error;
  }
  if (isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const code =
      extractErrorCode(error.response?.data) ??
      (error.code === 'ECONNABORTED' ? 'timeout' : status > 0 ? `http_${status}` : 'network');
    throw new ApiError(code, status);
  }
  throw error;
};
