import axios from "axios";

const PRODUCTION_API = "https://smart-campus-cuco.onrender.com";

function resolveBaseUrl() {
  const raw = String(
    import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRODUCTION_API : "")
  )
    .trim()
    .replace(/\/$/, "");
  if (!raw) return raw;
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

const API = axios.create({
  baseURL: resolveBaseUrl(),
});

export default API;
