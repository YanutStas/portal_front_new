import { create } from "zustand";
import axios from "axios";
import { message } from "antd";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const useGlobal = create((set) => ({
  darkMode: false,
  currentPage: "/",

  setCurrentPage: (url) => {
    set((state) => {
      return {
        currentPage: url,
      };
    });
  },

  toggleDarkMode: () => {
    set((state) => {
      localStorage.setItem("darkMode", !state.darkMode ? 1 : 0);
      return {
        darkMode: !state.darkMode,
      };
    });
  },

  checkDarkMode: () => {
    if (localStorage.getItem("darkMode") === "1") {
      set((state) => ({
        darkMode: true,
      }));
    }
  },

  //Загрузчик
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${backServer}/api/cabinet/upload-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          withCredentials: true,
        }
      );

      if (response.data) {
        set({ filePath: response.data.files[0] });
        message.success(`${file.name} файл успешно загружен.`);
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла", error);
      message.error(`${file.name} не удалось загрузить файл.`);
    }
  },
}));

export default useGlobal;
