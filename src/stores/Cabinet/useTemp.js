import { create } from "zustand";
const useTemp = create((set) => ({
    unit: {},
    setUnit: (name, value) => {
        set((state) => {
            return {
                unit: {...state.unit, [name]: value }
            };
        })
    },
    currency: {},
    setCurrency: (props) => {
        set((state) => {
            return {
                currency: { ...props }
            };
        })
    },

}));
export default useTemp;
