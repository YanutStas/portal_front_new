import axios from "axios";
import clientLogger from "./logging/clientLogger";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

// Единый axios-инстанс + перехватчик ошибок
const http = axios.create({
  baseURL: backServer,
  withCredentials: true,
  timeout: 10000,
});

function ruHttpErrorMessage({ method, url, status, code, message }) {
  const m = (method || "").toUpperCase();
  if (code === "ECONNABORTED" || !status) {
    return `Бэкенд недоступен: ${m} ${url}. Таймаут/сеть. Подробно: ${message}`;
  }
  if (status >= 500) {
    return `Ошибка сервера (${status}) при запросе ${m} ${url}. Подробно: ${message}`;
  }
  return `Сетевая ошибка (${status || code}) при запросе ${m} ${url}. Подробно: ${message}`;
}

http.interceptors.response.use(
  (r) => r,
  async (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || "";
    const method = error?.config?.method?.toUpperCase();
    const code = error?.code;

    const baseURL = error?.config?.baseURL || backServer || "";
    const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

    // логируем только серьёзные технические ошибки
    if (!status || status >= 500 || code === "ECONNABORTED") {
      const message = ruHttpErrorMessage({
        method,
        url,
        status,
        code,
        message: error?.message,
      });

      try {
        await clientLogger.error(
          "FE/http",
          { method, url, fullUrl, status, code },
          message
        );
      } catch {
        // не мешаем дальнейшему потоку ошибок
      }
    }

    return Promise.reject(error);
  }
);

export default http;
