import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
const usePersonalAccounts = create((set) => ({
  loadingPersonalAccounts: false,
  loadingPersonalAccount: false,
  loadingClaimsByPersonalAccount: false,
  personalAccounts: [],
  personalAccount: null,
  claimsByPersonalAccount: [],
  metaClaimsByPersonalAccount: {},

  fetchPersonalAccounts: async () => {
    set((state) => ({ personalAccounts: [], loadingPersonalAccounts: true }));
    const res = await axios.get(`${backServer}/api/cabinet/personalAccounts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      withCredentials: true,
    });
    // console.log(res.data);
    set((state) => {
      return {
        personalAccounts: res.data.data,
        loadingPersonalAccounts: false
      };
    });
  },
  fetchClaimsByPersonalAccount: async (key, page, pageSize) => {
    set((state) => ({ claimsByPersonalAccount: [], loadingClaimsByPersonalAccount: true }));
    const res = await axios.get(`${backServer}/api/cabinet/personalAccounts/${key}/claims?page=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      withCredentials: true,
    });
    // console.log(res.data);

    set((state) => {
      return {
        claimsByPersonalAccount: res.data.data,
        metaClaimsByPersonalAccount: res.data.meta,
        loadingClaimsByPersonalAccount: false
      };
    });
  },
  fetchPersonalAccountItem: async (key) => {
    set((state) => ({ personalAccount: null, loadingPersonalAccount: true }));
    try {


      const res = await axios.get(`${backServer}/api/cabinet/personalAccounts/${key}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        withCredentials: true,
      });
      // console.log(res.data);
      set((state) => {
        // console.log(res.data);
        return {
          personalAccount: res.data.data,
          loadingPersonalAccount: false
        };
      });
    } catch (error) {
      set((state) => ({ personalAccount: null, loadingPersonalAccount: false }));
    }
  },
}));
export default usePersonalAccounts;
