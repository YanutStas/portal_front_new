import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_APP_BACK_BACK_SERVER;

const useNewClaim = create((set) => ({
  claims: [],
  claim: null,
  newClaim: null,
  clearNewClaim: () => {
    set({ newClaim: null });
  },
  fetchClaims: async (key) => {
    set((state) => ({ claims: null }));
    const res = await axios.get(`${backServer}/api/cabinet/claims`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      withCredentials: true,
    });
    set((state) => {
      return {
        claims: res.data,
      };
    });
  },
  fetchClaimItem: async (key) => {
    set((state) => ({ claim: null }));
    const res = await axios.get(`${backServer}/api/cabinet/claims/${key}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      withCredentials: true,
    });
    set((state) => {
      console.log(res.data);
      return {
        claim: res.data,
      };
    });
  },
  createClaim: async (data) => {
    const res = await axios.post(
      `${backServer}/api/cabinet/claims`,
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        withCredentials: true,
      }
    );
    set((state) => {
      // console.log(res.data);
      return {
        newClaim: res.data,
      };
    });
  },
}));
export default useNewClaim;
