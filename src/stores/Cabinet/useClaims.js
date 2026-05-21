import { create } from "zustand";
import axios from "axios";
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;


const useClaim = create((set, get) => ({
  claims: null,
  metaClaims: null,
  claim: null,
  loadingClaim: false,
  loadingDataByClaim: false,
  loadingClaims: false,
  newClaim: null,
  blockButtonNewClaim: false,
  filtersClaims: false,
  countClaims: false,

  addBlockButtonNewClaim: () => {
    set({ blockButtonNewClaim: true });
  },
  removeBlockButtonNewClaim: () => {
    set({ blockButtonNewClaim: false });
  },
  clearNewClaim: () => {
    set({ newClaim: null });
  },
  fetchClaims: async (page, pageSize, filters = {}, sort = false) => {
    set((state) => ({ claims: null, loadingClaims: true }));
    let url = `${backServer}/api/cabinet/claims?page=${page}&pageSize=${pageSize}`
    let filtersArray = []
    for (let key in filters) {
      if (filters[key]) {
        filtersArray.push({ name: key, value: filters[key] })
        // console.log("Ключ: " + key + " значение: " + filters[key]);
      }
    }

    if (filtersArray.length > 0) {
      url = url + `&filters=${JSON.stringify(filtersArray)}`
    }
    if (sort) {
      url = url + `&sort=${sort}`
    }
    // console.log("filters", filters)
    console.log("url", url)
    try {
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }, withCredentials: true, });
      console.log(res.data);
      set((state) => {
        return {
          claims: res.data.data,
          metaClaims: res.data.meta,
          loadingClaims: false
        };
      });
    } catch (error) {
      console.log(error);
    }
  },

  fetchClaimsDataset: async (dataset = "filters") => {
    if (dataset === "filters") {
      let url = `${backServer}/api/cabinet/claims?dataset=filters`
      const res = await axios.get(url, { headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` }, withCredentials: true, });
      // console.log("fetchClaimsDataset", res.data);

      set({ filtersClaims: res.data.meta })
    }

  },
  fetchClaimItem: async (key) => {
    try {
      set((state) => ({ claim: null, loadingClaim: true }));
      const res = await axios.get(`${backServer}/api/cabinet/claims/${key}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
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
  fetchDataByClaim: async (key, dataSet = "steps", processTree = false) => {
    try {
      // set((state) => ({ loadingDataByClaim: true }));
      const url = `${backServer}/api/cabinet/claims/${key}?dataSet=${dataSet}&processTree=${processTree}`
      // console.log("url", url);

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
        withCredentials: true,
      });
      // console.log('res.data', res.data.data.appeals)
      // const newClaim = Object.assign({}, get().claim)
      // console.log('newClaim', newClaim)
      // newClaim[dataSet] = res.data.data[dataSet]
      // console.log('DATA', res.data.data);

      return res.data.data
      // set({ claim: newClaim, loadingDataByClaim: false });
    } catch (error) {
      console.log(error)
      return false
      // set({ loadingDataByClaim: false });
    }
  },
  createClaim: async (data) => {
    const res = await axios.post(
      `${backServer}/api/cabinet/claims`,
      {
        ...data,
      },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
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
