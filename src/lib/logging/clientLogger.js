import axios from "axios";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const logHttp = axios.create({
  timeout: 2000, // логирование не должно блокировать UI
  withCredentials: true,
});

const MAX_EVENT_LEN = 120;
const MAX_MSG_LEN = 4000;
const MAX_DETAILS_LEN = 2000;

function toSafeString(v, maxLen) {
  if (v === null || v === undefined) return "";
  const s = typeof v === "string" ? v : String(v);
  return s.length > maxLen ? s.slice(0, maxLen) + "…" : s;
}

function safeJson(obj, maxLen) {
  try {
    const s = JSON.stringify(obj);
    return s.length > maxLen ? s.slice(0, maxLen) + "…" : s;
  } catch {
    return "[unserializable]";
  }
}

export async function logFrontend({
  level = "info",
  event = "frontend",
  message = "",
  details = {},
}) {
  // если вдруг где-то будет SSR/тесты без window
  const url =
    typeof window !== "undefined" && window.location
      ? window.location.href
      : "";

  const safeLevel = ["error", "warn", "info"].includes(
    String(level).toLowerCase()
  )
    ? String(level).toLowerCase()
    : "info";

  const safeEvent = toSafeString(event || "frontend", MAX_EVENT_LEN);
  const safeMessage = toSafeString(message || "", MAX_MSG_LEN);

  const safeDetailsObj =
    details && typeof details === "object" ? details : { details };

  // на бэке всё равно будет JSON.stringify — лучше заранее ограничить размер
  const safeDetailsStr = safeJson(
    { url, ...safeDetailsObj },
    MAX_DETAILS_LEN
  );

  const payload = {
    level: safeLevel,
    event: safeEvent,
    message: safeMessage,
    // отправляем details как объект (но обрезанный строкой в поле _meta),
    // чтобы не ловить циклы/огромные структуры
    details: { url, _meta: safeDetailsStr },
  };

  try {
    await logHttp.post(`${backServer}/api/client-logs`, payload);
  } catch (e) {
    // логгер не должен ломать приложение
    console.debug("FE logger failed", e?.message);
  }
}

const clientLogger = {
  info(event, details = {}, message = "") {
    return logFrontend({ level: "info", event, message, details });
  },
  warn(event, details = {}, message = "") {
    return logFrontend({ level: "warn", event, message, details });
  },
  error(event, details = {}, message = "") {
    return logFrontend({ level: "error", event, message, details });
  },
};

export default clientLogger;