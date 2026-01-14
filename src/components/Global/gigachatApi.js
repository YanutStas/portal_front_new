import axios from "axios";
import { uniqueId } from "lodash";
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
const urlN8n = "https://n8n.mosoblenergo.ru/webhook/f2274c46-ee15-4d83-95fe-b37796dc871a"
export const sendMessageToN8n = async (message) => {

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
    // console.log("res.data: ", res.data);
    // if (res.data.status && res.data.status === "ОК") {
    //   return res.data.answer;
    // } else {
    //   return "Что-то пошло не так...";
    // }
    return res.data.output
  } catch (error) {
    console.log(error);
  }
};
