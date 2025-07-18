import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const useTasks = create((set, get) => ({
    action: {},
    isLoadingAction: false,

    fetchActionById: async (id) => {
        try {
            set({ isLoadingProfile: true });
            const token = localStorage.getItem("jwt");
            const response = await axios.get(`${backServer}/api/cabinet/action/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);

            if (response.data) {
                set({ action: response.data, isLoadingAction: false });
            } else {
                console.log("Данные задачи не получены.");
                set({ isLoadingAction: false });
            }
        } catch (error) {
            console.error("Ошибка при получении задачи:", error);
            set({ isLoadingAction: false });
        }
    },

    createNewTask: async (data) => {
        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.post(`${backServer}/api/cabinet/tasks`,
                {
                    ...data
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
             console.log(response.data);

            if (response.data) {
                return true
            } else {
                console.log("Задача не создана");
                return false
            }
        } catch (error) {
            console.error("Ошибка при создании задачи:", error);
        }
    }

}));

export default useTasks;
