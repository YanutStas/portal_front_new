import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const useAppeals = create((set, get) => ({
    appeals: false,
    isLoadingAppeals: false,
    appeal: false,
    isLoadingAppeal: false,
    clearAppeal: () => {
        set({ appeal: false });
    },

    fetchAppealsAll: async () => {
        try {
            set({ isLoadingProfile: true });
            const token = localStorage.getItem("jwt");
            const response = await axios.get(`${backServer}/api/cabinet/appeals`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log(response.data);

            if (response.data) {
                set({ appeals: response.data, isLoadingAppeals: false });
            } else {
                console.log("Данные задачи не получены.");
                set({ isLoadingAppeals: false });
            }
        } catch (error) {
            console.error("Ошибка при получении задачи:", error);
            set({ isLoadingAppeals: false });
        }
    },
    fetchAppealById: async (id) => {
        try {
            set({ isLoadingAppeal: true });
            const token = localStorage.getItem("jwt");
            const response = await axios.get(`${backServer}/api/cabinet/appeals/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // console.log(response);

            if (response.data) {
                set({ appeal: response.data, isLoadingAppeal: false });
            } else {
                console.log("Данные задачи не получены.");
                set({ isLoadingAppeal: false });
            }
        } catch (error) {
            console.error("Ошибка при получении задачи:", error);
            set({ isLoadingAppeal: false });
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

export default useAppeals;
