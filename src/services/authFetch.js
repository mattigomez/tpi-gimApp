// src/services/authFetch.js
// Helper para hacer fetch autenticado automáticamente con el token

export const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("GymHub-2025");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
};
