import axios from "axios";
const backServer = import.meta.env.VITE_APP_BACK_BACK_SERVER;

export const sendMessageToGigachat = async (message) => {
  try {
    const res = await axios.post(`${backServer}/api/gigachat`, {
      message,
    });
    console.log("res.data: ", res.data);
    if (res.data.status && res.data.status === "ОК") {
      return res.data.answer;
    } else {
      return "Что-то пошло не так...";
    }
  } catch (error) {
    console.log(error);
  }
};
