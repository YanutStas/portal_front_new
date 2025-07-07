import { create } from "zustand";
import axios from "axios";
import { path } from "framer-motion/client";

const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

const useServices = create((set, get) => ({
  services: [],
  chain: [],
  path: [],
  serviceItem: null,
  isLoading: false,
  error: null, // Новое состояние для хранения ошибки

  fetchServices: async (key = "00000000-0000-0000-0000-000000000000") => {
    set({ services: [], isLoading: true, chain: [], error: null }); // Сбрасываем состояния

    try {
      // const res = await Promise.all([
      //   axios.get(`${backServer}/api/services/${key}`),
      //   axios.get(`${backServer}/api/services/item/${key}?withFields=false`),
      //   get().fetchServiceChain(key),
      // ]);
      const res = await axios.get(`${backServer}/api/services/${key}`)
      // console.log("res.data", res.data);
      res.data.data.path.unshift({
        "Ref_Key": "",
        "label": "Каталог услуг"
      })
      set({
        services: res.data.data,
        // path: res.data.data.path,
        // serviceItem: res[1].data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      set({
        isLoading: false,
        error: error.message || "Произошла ошибка при загрузке услуг",
      });
    }
  },

  fetchServiceItem: async (
    key,
    property = { withFields: true }
  ) => {
    // console.log(property)
    set({ serviceItem: null, isLoading: true, chain: [], error: null }); // Сбрасываем состояния
    try {
      const res = await axios.get(`${backServer}/api/services/item/${key}?withFields=${property.withFields}`)
      // property.withChain ? get().fetchServiceChain(key) : false,)
      // console.log(res);

      set({
        serviceItem: res.data?.data,
        isLoading: false,
      });
    } catch (error) {
      console.log(error);
      set({
        isLoading: false,
        error: error.message || "Произошла ошибка при загрузке услуги",
      });
    }
  },

  // fetchServiceChain: (key) => {
  //   return new Promise(async (resolve, reject) => {
  //     let chain = [];
  //     async function getService(key) {
  //       const res = await axios.get(
  //         `${backServer}/api/services/item/${key}?withFields=false`
  //       );
  //       chain.push({
  //         Description: res.data.Description,
  //         Ref_Key: res.data.Ref_Key,
  //       });
  //       if (
  //         res.data.Parent_Key &&
  //         res.data.Parent_Key !== "00000000-0000-0000-0000-000000000000"
  //       ) {
  //         await getService(res.data.Parent_Key);
  //       }
  //     }
  //     try {
  //       await getService(key);
  //       chain.push({ Description: "Каталог услуг", Ref_Key: "" });
  //       chain.reverse().pop();
  //       resolve({ chain });
  //       set({ chain });
  //     } catch (error) {
  //       console.log(error);
  //       set({
  //         error:
  //           error.message || "Произошла ошибка при построении цепочки услуг",
  //       }); // Устанавливаем ошибку
  //       reject(error);
  //     }
  //   });
  // },

  clearError: () => {
    set({ error: null }); // Метод для сброса состояния ошибки
  },
}));

export default useServices;
