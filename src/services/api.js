import axios from "axios";

const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      // If accessed via local IP (e.g. 192.168.x.x), target the backend on the same host IP
      if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
        return `http://${host}:8085/api`;
      }
    }
  }
  return "http://localhost:8085/api";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// Request Interceptor: Attach JWT Token & Idempotency Key
api.interceptors.request.use(
  (config) => {
    try {
      const userStr = localStorage.getItem("lootkart_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      console.error("Error reading token from localStorage", e);
    }

    if (config.method === "post" && config.url.includes("/orders")) {
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      config.headers["Idempotency-Key"] = idempotencyKey;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Exponential Backoff Retry on transient failures
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (!config || !config.retryCount) {
      config.retryCount = 0;
    }

    const isRetryable = !response || (response.status >= 500 && response.status < 600);

    if (isRetryable && config.retryCount < 1) {
      config.retryCount += 1;
      const delay = 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
      console.warn(`Retrying API request (${config.retryCount}/1): ${config.url}`);
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
