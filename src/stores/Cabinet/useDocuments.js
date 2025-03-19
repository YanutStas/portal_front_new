import { create } from "zustand";
import axios from "axios";
import { message } from "antd";

const backServer = import.meta.env.VITE_APP_BACK_BACK_SERVER;

const useDocuments = create((set, get) => ({
  documents: [],
  loadingDocuments: false,
  errorLoadingDocuments: false,
  openModalAdd: false,
  categories: [],

  setOpenModalAdd: (status = false) => {
    set({ openModalAdd: status });
  },

  fetchDocuments: async (categoryKey = null) => {
    set({ documents: [], loadingDocuments: true });
    try {
      let url = `${backServer}/api/cabinet/documents`;

      const response = await Promise.all([axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`
        },
        withCredentials: true,
      }), axios.get(
        `${backServer}/api/cabinet/documents/categories`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          withCredentials: true,
        }
      )])

      if (response[0].data.documents && categoryKey) {
        response[0].data.documents = response[0].data.documents.filter(
          (document) => document.ВидФайла_Key === categoryKey
        );
      }
      const docsForCategory = []
      response[0].data.documents.forEach(document => {
        const category = response[1].data.categories.find(category => category.Ref_Key === document.ВидФайла_Key)
        const docsForCategoryIndex = docsForCategory.findIndex(category => category.Ref_Key === document.ВидФайла_Key)
        console.log(docsForCategoryIndex)
        if (category && docsForCategoryIndex !== -1) {
          docsForCategory[docsForCategoryIndex].docs.push(document)
        }else{
          docsForCategory.push(category)
          docsForCategory[docsForCategory.length-1].docs = []
          docsForCategory[docsForCategory.length-1].docs.push(document)
        }
        
      })
console.log(docsForCategory);



set({ documents: docsForCategory, categories: response[1].data.categories, loadingDocuments: false });
    } catch (error) {
      set({
        loadingDocuments: false,
        errorLoadingDocuments: "Не удалось загрузить документы",
      });
      console.error("Ошибка при загрузке документов", error);
    }
  },

  deleteDocument: async (id) => {
    try {
      await axios.delete(`${backServer}/api/cabinet/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        withCredentials: true,
      });
      message.success("Документ успешно удален");
      get().fetchDocuments();
    } catch (error) {
      console.error("Ошибка при удалении документа", error);
      message.error("Не удалось удалить документ");
    }
  },
}));

export default useDocuments;
