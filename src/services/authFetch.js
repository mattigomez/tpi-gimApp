// Default: Azure App Service (backend deployed)
// Override locally by creating a `.env.local` with:
//   VITE_API_URL=http://localhost:5000/api
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
export const API_BASE_URL =
  import.meta?.env?.VITE_API_URL ??
  (isLocal
    ? "http://localhost:5112/api"
    : "https://gimapp-api-tup-fgfgd6f3e6c9hehj.brazilsouth-01.azurewebsites.net/api");


export const authFetch = (endpoint, options = {}) => {
  const token = localStorage.getItem("GymHub-2025");

  // Allow calling with absolute URLs too
  const url = /^https?:\/\//i.test(endpoint)
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};
