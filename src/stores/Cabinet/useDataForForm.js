import { create } from "zustand";
const useDataForForm = create((set) => ({
    links: false,
    styles: false,
    clearDataForForm: () => {
        set({ links: false, styles: false })
    },
    setLinks: (value) => {
        set({ links: value })
    },
    setStyles: (value) => {
        set({ styles: value })
    },
}));
export default useDataForForm;
