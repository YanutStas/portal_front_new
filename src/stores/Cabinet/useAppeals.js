import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const useAppeals = create((set, get) => ({
    appeals: false,
    isLoadingAppeals: false,
    appeal: false,
    isLoadingAppeal: false,
    isReadingAnswer: false,
    clearAppeal: () => {
        set({ appeal: false });
    },

    fetchAppealsAll: async (claimId) => {
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

    createNewAppeal: async (data) => {
        try {
            set({ isReadingAnswer: true });
            const token = localStorage.getItem("jwt");
            const response = await axios.post(`${backServer}/api/cabinet/appeals`,
                {
                    ...data
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            // console.log(response);

            if (response.data) {
                set({ isReadingAnswer: false });
                return true
            } else {
                set({ isReadingAnswer: false });
                console.log("Задача не создана");
                return false
            }
        } catch (error) {
            set({ isReadingAnswer: false });
            console.error("Ошибка при создании задачи:", error);
        }
    },
    readingAnswer: async (id) => {
        try {
            const token = localStorage.getItem("jwt");
            const response = await axios.post(`${backServer}/api/cabinet/appeals/read`,
                {
                    id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            // console.log(response);

            if (response.data) {
                return true
            } else {
                console.log("Ответ не прочитан");
                return false
            }
        } catch (error) {
            console.error("Ошибка при прочтении ответа:", error);
        }
    }

}));

export default useAppeals;
