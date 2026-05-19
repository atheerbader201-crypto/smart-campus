import axios from "axios";

function resolveBaseUrl() {
  const raw = String(import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
  if (raw) {
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  }
  // Production: API + UI on same host (Render Docker) — no separate VITE_API_URL needed
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "";
}

const API = axios.create({
  baseURL: resolveBaseUrl(),
});

export default API;
