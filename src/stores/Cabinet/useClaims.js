import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
const useNewClaim = create((set) => ({
  claims: null,
  claim: null,
  newClaim: null,
  blockButtonNewClaim: false,
  addBlockButtonNewClaim: () => {
    set({ blockButtonNewClaim: true });
  },
  removeBlockButtonNewClaim: () => {
    set({ blockButtonNewClaim: false });
  },
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
    // console.log(res.data.data);
    set((state) => {
      return {
        claims: res.data.data,
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
    // console.log("fetchClaimItem",res.data.data);
    set((state) => {
      return {
        claim: res.data.data,
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
        newClaim: res.data.data,
      };
    });
  },
}));
export default useNewClaim;
