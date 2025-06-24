import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
const useNewClaim = create((set) => ({
  claims: null,
  claim: null,
  loadingClaim: false,
  loadingClaims: false,
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
    set((state) => ({ claims: null, loadingClaims: true }));
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
    try {


      set((state) => ({ claim: null, loadingClaim: true }));
      const res = await axios.get(`${backServer}/api/cabinet/claims/${key}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        withCredentials: true,
      });
      if (res.data?.data && Object.keys(res.data.data).length === 0) {
        // console.log("fetchClaimItem", res.data.data);
        return   set((state) => ({  loadingClaim: false }));
      }
      set({ claim: res.data.data, loadingClaim: false });
    } catch (error) {
      console.log(error)
      set({ loadingClaim: false });
    }
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
