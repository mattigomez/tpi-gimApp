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
  if (r === "admin") return "admin";
  if (r === "professor" || r === "profesor" || r === "trainer") return "trainer";
  if (r === "client" || r === "user") return "user";
  return r;
}
