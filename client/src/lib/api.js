const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = configuredBaseUrl
  ? trimTrailingSlash(configuredBaseUrl)
  : '/api';

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
