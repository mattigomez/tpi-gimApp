// src/services/jwtDecode.js
// Decodifica un JWT para extraer el payload (sin validación de firma)
export function jwtDecode(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}
