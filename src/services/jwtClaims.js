import { jwtDecode } from "./jwtDecode";

export function getUserClaims(token) {
  const p = jwtDecode(token);
  if (!p) return null;

  const role =
    p.role ||
    p["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    p.roles;

  const email =
    p.email ||
    p.unique_name ||
    p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

  const id = p.id || p.sub || p.userId;

  return { role, email, id, raw: p };
}

export function normalizeRole(role) {
  if (!role) return null;

  const r = String(role).toLowerCase();

  // ADMIN
  if (r === "admin" || r === "administrador")
    return "admin";

  // PROFESOR
  if (
    r === "professor" ||
    r === "profesor" ||
    r === "trainer"
  )
    return "trainer";

  // CLIENTE / SOCIO
  if (
    r === "client" ||
    r === "cliente" ||
    r === "user" ||
    r === "socio"
  )
    return "user";

  return r;
}