import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
const useClaim = create((set, get) => ({
  claims: null,
  claim: null,
  loadingClaim: false,
  loadingDataByClaim: false,
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
  fetchClaimItem: async (key,) => {
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
        return set((state) => ({ loadingClaim: false }));
      }
      // if (res.data.data.links) {
      //   useDataForForm.getState().setLinks(res.data.data.links)
      // }
      set({ claim: res.data.data, loadingClaim: false });
    } catch (error) {
      console.log(error)
      set({ loadingClaim: false });
    }
  },
  fetchDataByClaim: async (key, dataSet = "steps") => {
    try {
      set((state) => ({ loadingDataByClaim: true }));
      const res = await axios.get(`${backServer}/api/cabinet/claims/${key}?dataSet=${dataSet}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        withCredentials: true,
      });
      // console.log('res.data', res.data.data.appeals)
      const newClaim = Object.assign({}, get().claim)
      // console.log('newClaim', newClaim)
      newClaim[dataSet] = res.data.data[dataSet]
      set({ claim: newClaim, loadingDataByClaim: false });
    } catch (error) {
      console.log(error)
      set({ loadingDataByClaim: false });
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
export default useClaim;
