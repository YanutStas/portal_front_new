import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_APP_BACK_BACK_SERVER
const useObjects = create((set, get) => ({
  objects: [],
  object: null,
  isLoadingObjects: false,
  isLoadingObjectItem: false,
  error: null,
  showModalView: false,
  showModalAdd: false,

  showObject: async (id = false) => {
    if (id !== false) {
      console.log("Объект с ID:", id);
      await get().fetchObjectItem(id);
      const object = get().object;
      console.log("Выбранный объект:", object);
      if (object && object.attributes) {
        set({ showModalView: true });
        console.log("Установка showModalView в значение true");
      }
    } else {
      set({
        showModalView: false,
        object: null,
      });
      console.log("Установка showModalView в значение false");
    }
  },

  setShowModalView: (show) => {
    console.log("setShowModalView called with:", show);
    set({ showModalView: show });
  },

  setShowModalAdd: (show) => {
    set({ showModalAdd: show });
  },

  fetchObjects: async () => {
    try {
      set({ isLoadingObjects: true });
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `${backServer}/api/cabinet/objects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set({ objects: response.data, isLoadingObjects: false });
    } catch (error) {
      console.log(error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  fetchObjectItem: async (id) => {
    return new Promise(async function (resolve, reject) {
      try {
        set({ isLoadingObjectItem: true });
        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          `${backServer}/api/cabinet/objects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        set({ object: response.data, isLoadingObjectItem: false });
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

  submitNewObject: async (formData) => {
    try {
      const response = await axios.post(
        `${backServer}/api/cabinet/objects`,
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
        set((state) => ({
          objects: [...state.objects, response.data],
        }));
        return response.data.object;
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  deleteObjectItem: async (id) => {
    try {
      set({ isLoadingObjectItem: true });
      const token = localStorage.getItem("jwt");
      const response = await axios.delete(
        `${backServer}/api/cabinet/objects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        objects: state.objects.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.log(error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  updateObjectItem: async (id, data) => {
    try {
      set({ isLoadingObjectItem: true });
      const token = localStorage.getItem("jwt");
      const response = await axios.put(
        `${backServer}/api/cabinet/objects/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        objects: state.objects.map((item) =>
          item.id === id ? { ...item, ...response.data } : item
        ),
        isLoadingObjectItem: false,
      }));
      console.log("Объект успешно обновлен", response.data);
    } catch (error) {
      console.log("Ошибка при обновлении объекта", error);
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },
}));

export default useObjects;
