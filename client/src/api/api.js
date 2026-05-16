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
  timeout: 90_000,
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    if (!config || (config.__retryCount ?? 0) >= 2) return Promise.reject(error);
    const method = String(config.method || "get").toLowerCase();
    if (method !== "get") return Promise.reject(error);
    const retriable =
      !error.response ||
      error.response.status >= 500 ||
      error.code === "ECONNABORTED" ||
      error.message === "Network Error";
    if (!retriable) return Promise.reject(error);
    config.__retryCount = (config.__retryCount ?? 0) + 1;
    await new Promise((r) => setTimeout(r, 3000));
    return API(config);
  }
);

export default API;
