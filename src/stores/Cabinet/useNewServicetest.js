import { create } from 'zustand'
import axios from "axios";

const backServerTest = import.meta.env.VITE_APP_BACK_SERVER_TEST

const useNewServicetest = create((set) => ({
    claims: [],
    claim: {},
    fetchClaims: async (key) => {

        const res = await axios.get(`${backServerTest}/api/cabinet/claimstest`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                withCredentials: true,
            })
        set((state) => ({ claims: res.data.value }))
        console.log(res.data)

    },
    fetchClaim: async (key) => {
        set((state) => ({ claim: null }))
        const res = await axios.get(`${backServerTest}/api/servicestest/item/${key}`)
        if (res.data) {
            res.data.fields = res.data.fields.map((item, index) => {
                if (item.in1C && item.name == '') item.name = item.in1C.Description + '_' + index
                return item
            })
            // console.log(data)
            set((state) => {
                console.log(res.data)
                return {
                    claim: res.data
                }
            })
        }
    },
    createClaim: async (data) => {
        const res = await axios.post(`${backServerTest}/api/cabinet/claimstest`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
                },
                withCredentials: true,
            })
        console.log(res.data)
    },

}));
export default useNewServicetest;