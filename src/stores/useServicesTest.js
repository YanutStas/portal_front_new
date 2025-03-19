import { create } from "zustand";
import axios from "axios";

const backServerTest = import.meta.env.VITE_BACK_SERVER_TEST;

const useServicesTest = create((set, get) => ({
  services: [],
  chain: [],
  serviceItem: null,
  isLoading: false,

  fetchServices: async (key = "00000000-0000-0000-0000-000000000000") => {
    set((state) => ({ services: [], isLoading: true, chain: [] }));

    try {
      const res = await Promise.all([
        axios.get(`${backServerTest}/api/servicestest/${key}`),
        axios.get(`${backServerTest}/api/servicestest/item/${key}`),
        get().fetchServiceChain(key),
      ]);
      // const res = await axios.get(`${config.backServer}/api/services/${key}`)
      //console.log(res)
      set((state) => {
        return {
          services: res[0].data.value,
          serviceItem: res[1].data,
          isLoading: false,
        };
      });
    } catch (error) {
      console.log(error);
    }
  },

  fetchServiceItem: async (key) => {
    set((state) => ({ serviceItem: null, isLoading: true, chain: [] }));
    try {
      const res = await Promise.all([
        axios.get(`${backServerTest}/api/servicestest/item/${key}`),
        get().fetchServiceChain(key),
      ]);
      console.log(res);
      set((state) => {
        return {
          serviceItem: res[0].data,
          isLoading: false,
        };
      });
    } catch (error) {
      console.log(error);
    }
  },

  fetchServiceChain: (key) => {
    return new Promise(async (resolve, reject) => {
      let chain = [];
      async function getService(key) {
        const res = await axios.get(
          `${backServerTest}/api/servicestest/item/${key}`
        );
        // console.log(res.data)
        chain.push({
          Description: res.data.Description,
          Ref_Key: res.data.Ref_Key,
        });
        if (
          res.data.Parent_Key &&
          res.data.Parent_Key !== "00000000-0000-0000-0000-000000000000"
        ) {
          await getService(res.data.Parent_Key);
        }
      }
      await getService(key);
      chain.push({ Description: "Каталог услуг", Ref_Key: "" });
      chain.reverse().pop();
      resolve({ chain });
      set((state) => ({ chain }));
    });
  },
}));
export default useServicesTest;
