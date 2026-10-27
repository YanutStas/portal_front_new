import axios from "axios";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

export const sendMessageToGigachat = async (message) => {
  try {
    const res = await axios.post(`${backServer}/api/gigachat`, {
      message,
    });
    // console.log("res.data: ", res.data);
    if (res.data.status && res.data.status === "ОК") {
      return res.data.answer;
    } else {
      return "Что-то пошло не так...";
    }
  } catch (error) {
    console.log(error);
  }
};
const urlN8n = import.meta.env.VITE_N8N_WEBHOOK_URL;

export const sendMessageToN8n = async (message) => {
  if (!urlN8n) {
    console.error(
      "Не задан VITE_N8N_WEBHOOK_URL — запрос к n8n не отправлен. Добавьте переменную в .env"
    );
    return;
  }

  let sessionId = false
  if (!(sessionId = localStorage.getItem('sessionId'))) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('sessionId', sessionId)
  }
  try {
    const res = await axios.post(urlN8n, {
      message,
      sessionId
    });
    // вебхук может ответить как { output }, так и text/plain или потоком —
    // без ответа лучше показать сообщение, чем пустой пузырь в чате
    const answer =
      typeof res.data === "string" ? res.data : res.data?.output;
    return answer || "Не удалось получить ответ. Попробуйте позже.";
  } catch (error) {
    console.log(error);
    return "Не удалось получить ответ. Попробуйте позже.";
  }
};
