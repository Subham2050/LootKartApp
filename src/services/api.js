import axios from "axios";

const API_BASE_URL = "http://localhost:8085/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
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

    if (isRetryable && config.retryCount < 2) {
      config.retryCount += 1;
      const delay = Math.pow(2, config.retryCount) * 500;
      await new Promise((resolve) => setTimeout(resolve, delay));
      console.warn(`Retrying API request (${config.retryCount}/2): ${config.url}`);
      return api(config);
    }

    return Promise.reject(error);
  }
);

export default api;
