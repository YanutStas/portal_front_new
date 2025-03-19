import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
const useSubjects = create((set, get) => ({
  subjects: [],
  subject: null,
  isLoadingSubjects: false,
  isLoadingSubjectItem: false,
  error: null,
  showModalView: false,
  showModalYurView: false,
  showModalIPView: false,
  showModalAdd: false,

  // Показать модальное окно для субъекта или скрыть его
  showSubject: async (id = false) => {
    if (id !== false) {
      console.log(id);
      await get().fetchSubjectItem(id);
      console.log(get().subject.attributes.type);
      switch (get().subject.attributes.type) {
        case "Физическое лицо":
          set({ showModalView: true });
          break;
        case "Юридическое лицо":
          set({ showModalYurView: true });
          break;
        case "ИП":
          console.log("123");
          set({ showModalIPView: true });
          break;
      }
    } else {
      set({
        showModalView: false,
        showModalYurView: false,
        showModalIPView: false,
        subject: null,
      });
    }
  },

  // Установить отображение модального окна для просмотра
  setShowModalView: (show) => {
    set({ showModalView: show });
  },

  // Установить отображение модального окна для добавления
  setShowModalAdd: (show) => {
    set({ showModalAdd: show });
  },

  // Получить список всех субъектов
  fetchSubjects: async () => {
    try {
      set({ isLoadingSubjects: true });
      const token = localStorage.getItem("jwt");
      const response = await axios.get(`${backServer}/api/cabinet/subjects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ subjects: response.data, isLoadingSubjects: false });
    } catch (error) {
      console.log(error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  // Получить детали конкретного субъекта
  fetchSubjectItem: async (id) => {
    return new Promise(async function (resolve, reject) {
      try {
        set({ isLoadingSubjectItem: true });
        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          `${backServer}/api/cabinet/subjects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set({ subject: response.data, isLoadingSubjectItem: false });
        resolve();
      } catch (error) {
        console.log(error);
        set({
          error: error.response?.data?.message || error.message,
          isLoading: false,
        });
        reject();
      }
    });
  },

  // Добавить новый субъект
  submitNewSubject: async (formData) => {
    try {
      const response = await axios.post(
        `${backServer}/api/cabinet/subjects`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        //console.log(response.data);
        set((state) => ({
          subjects: [...state.subjects, response.data],
        }));
        return response.data.subject;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // Удалить субъект
  deleteSubjectItem: async (id) => {
    try {
      set({ isLoadingSubjectItem: true });
      const token = localStorage.getItem("jwt");
      const response = await axios.delete(
        `${backServer}/api/cabinet/subjects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        subjects: state.subjects.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.log(error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },
}));

export default useSubjects;
