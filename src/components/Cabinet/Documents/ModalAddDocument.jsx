import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  message,
  Form,
  Select,
  Input,
  ConfigProvider,
} from "antd";
import axios from "axios";
import useDocuments from "../../../stores/Cabinet/useDocuments";
import UploaderInput from "../../FormComponents/UploaderInput";
import ErrorModal from "../../ErrorModal";
import Preloader from "../../Main/Preloader";
import styles from "./ModalAddDocument.module.css";

const { Option } = Select;
const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

export default function ModalAddDocument({ visible, onClose, categoryKey }) {
  const openModalAdd = useDocuments((state) => state.openModalAdd);
  const setOpenModalAdd = useDocuments((state) => state.setOpenModalAdd);
  const fetchDocuments = useDocuments((state) => state.fetchDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  const [form] = Form.useForm();

  const token = localStorage.getItem("jwt");

  const [categoriesData, setCategoriesData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allowedExtensions, setAllowedExtensions] = useState([]);
  const [maxFileSize, setMaxFileSize] = useState(10);
  const [isCategoryDisabled, setIsCategoryDisabled] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${backServer}/api/cabinet/documents/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setCategoriesData(response.data.categories);
        const uniqueCategories = [
          ...new Set(response.data.categories.map((item) => item.Description)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Ошибка при загрузке категорий документов:", error);
      }
    };

    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (categoryKey && categoriesData.length > 0 && visible) {
      const selectedCategoryItem = categoriesData.find(
        (item) => item.Ref_Key === categoryKey
      );
      if (selectedCategoryItem) {
        const selectedCategory = selectedCategoryItem.Description;
        form.setFieldsValue({
          category: selectedCategory,
          documentName: selectedCategory,
          categoryKey: selectedCategoryItem.Ref_Key,
        });
        setIsCategoryDisabled(true);
        setMaxFileSize(
          selectedCategoryItem.maximumSize
            ? parseInt(selectedCategoryItem.maximumSize)
            : 10
        );
      }
    } else if (!visible) {
      form.resetFields();
      setAllowedExtensions([]);
      setMaxFileSize(10);
      setUploaderKey((prevKey) => prevKey + 1);
      setIsCategoryDisabled(false);
    }
  }, [categoryKey, categoriesData, form, visible]);

  const handleModalClose = () => {
    if (onClose) {
      onClose();
    } else {
      setOpenModalAdd(false);
    }
  };

  const handleSaveDocument = async (values) => {
    try {
      setLoading(true);
      const files = form.getFieldValue("fileDoc");

      if (!files || files.length === 0) {
        message.error("Пожалуйста, загрузите файлы");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("category", values.category);
      formData.append("documentName", values.documentName);
      formData.append("categoryKey", values.categoryKey);
      formData.append("saveToProfile", true);

      files.forEach((file) => {
        formData.append("files", file.originFileObj);
      });

      const token = localStorage.getItem("jwt");

      await axios.post(`${backServer}/api/cabinet/upload-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      message.success("Документ успешно сохранен");
      fetchDocuments(categoryKey);
      handleModalClose();
      setUploaderKey((prevKey) => prevKey + 1);
    } catch (error) {
      if (error.response && error.response.status === 413) {
        message.error(
          "Присоединяемые файлы слишком большие. Пожалуйста, сожмите файлы до 10 МБ."
        );
      } else {
        console.error("Ошибка при сохранении документа:", error);
        setError(error.message || "Неизвестная ошибка");
        setErrorVisible(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setErrorVisible(false);
  };

  return (
    <>
      <Modal
        title="Загрузить новый документ"
        open={openModalAdd || visible}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose={true}
        keyboard={false}
      >
        <ConfigProvider
          theme={{
            components: {
              Form: {
                itemMarginBottom: 20,
              },
            },
          }}
        >
          <Form form={form} onFinish={handleSaveDocument} layout="vertical">
            <Form.Item
              label="Категория"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите категорию документа",
                },
              ]}
            >
              <Select
                showSearch
                placeholder="Выберите категорию"
                disabled={isCategoryDisabled}
                onChange={(value) => {
                  const selectedCategoryItem = categoriesData.find(
                    (item) => item.Description === value
                  );
                  if (selectedCategoryItem) {
                    const selectedCategory = selectedCategoryItem.Description;
                    form.setFieldsValue({
                      documentName: selectedCategory,
                      categoryKey: selectedCategoryItem.Ref_Key,
                    });
                    setMaxFileSize(
                      Number(selectedCategoryItem.maximumSize) === 0
                        ? 10
                        : Number(selectedCategoryItem.maximumSize)
                    );
                  }
                }}
              >
                {categories
                  .sort((a, b) => {
                    if (a.toLowerCase() < b.toLowerCase()) {
                      return -1;
                    }
                    if (a.toLowerCase() > b.toLowerCase()) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((category, index) => (
                    <Option key={index} value={category}>
                      {category}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.category !== currentValues.category ||
                prevValues.documentName !== currentValues.documentName
              }
            >
              {() => {
                const selectedCategory = form.getFieldValue("category");
                const documentName = form.getFieldValue("documentName");

                return (
                  <>
                    {(selectedCategory || isCategoryDisabled) && (
                      <>
                        <Form.Item
                          label="Название"
                          name="documentName"
                          rules={[
                            {
                              required: true,
                              message: "Пожалуйста, введите название документа",
                            },
                          ]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item name="categoryKey" hidden>
                          <input type="hidden" />
                        </Form.Item>
                      </>
                    )}
                  </>
                );
              }}
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.documentName !== currentValues.documentName
              }
            >
              {() => {
                const documentName = form.getFieldValue("documentName");

                return (
                  <>
                    {(documentName || isCategoryDisabled) && (
                      <>
                        <UploaderInput
                          resetTrigger={uploaderKey}
                          allowedExtensions={allowedExtensions}
                          maxFileSize={maxFileSize}
                          loading={loading}
                        />

                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            disabled={loading}
                          >
                            Сохранить файлы
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </>
                );
              }}
            </Form.Item>
          </Form>
        </ConfigProvider>
        {loading && (
          <div className={styles.overlay}>
            <Preloader />
          </div>
        )}
        <ErrorModal visible={errorVisible} error={error} onClose={closeModal} />
      </Modal>
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import { Modal, Button, message, Form, Select, Input, ConfigProvider } from "antd";
// import axios from "axios";
// import useDocuments from "../../../stores/Cabinet/useDocuments";
// import UploaderInput from "../../FormComponents/UploaderInput";
// import ErrorModal from "../../ErrorModal";
// import Preloader from "../../Main/Preloader";
// import styles from "./ModalAddDocument.module.css";

// const { Option } = Select;
// const backServer = import.meta.env.VITE_BACK_BACK_SERVER;

// export default function ModalAddDocument({ visible, onClose, categoryKey }) {
//   const openModalAdd = useDocuments((state) => state.openModalAdd);
//   const setOpenModalAdd = useDocuments((state) => state.setOpenModalAdd);
//   const fetchDocuments = useDocuments((state) => state.fetchDocuments);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [errorVisible, setErrorVisible] = useState(false);
//   const [uploaderKey, setUploaderKey] = useState(0);

//   const [form] = Form.useForm();

//   const token = localStorage.getItem("jwt");

//   const [categoriesData, setCategoriesData] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [allowedExtensions, setAllowedExtensions] = useState([]);
//   const [maxFileSize, setMaxFileSize] = useState(10);
//   const [isCategoryDisabled, setIsCategoryDisabled] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `${backServer}/api/cabinet/documents/categories`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             withCredentials: true,
//           }
//         );
//         // console.log(response.data);

//         setCategoriesData(response.data.categories);
//         const uniqueCategories = [
//           ...new Set(response.data.categories.map((item) => item.Description)),
//         ];
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error("Ошибка при загрузке категорий документов:", error);
//       }
//     };

//     fetchCategories();
//   }, [token]);

//   useEffect(() => {
//     if (categoryKey && categoriesData.length > 0 && visible) {
//       const selectedCategoryItem = categoriesData.find(
//         (item) => item.Ref_Key === categoryKey
//       );
//       console.log(selectedCategoryItem.maximumSize);
//       if (selectedCategoryItem) {
//         const selectedCategory = selectedCategoryItem.Description;
//         form.setFieldsValue({
//           category: selectedCategory,
//           documentName: selectedCategory,
//           categoryKey: selectedCategoryItem.Ref_Key,
//         });
//         setIsCategoryDisabled(true);
//         // const extensions = JSON.parse(
//         //   selectedCategoryItem.category.availableExtensionsJSON
//         // );
//         // setAllowedExtensions(extensions);

//         setMaxFileSize(selectedCategoryItem.maximumSize ? parseInt(selectedCategoryItem.maximumSize) : 10);
//       }
//     } else if (!visible) {
//       form.resetFields();
//       setAllowedExtensions([]);
//       setMaxFileSize(10);
//       setUploaderKey((prevKey) => prevKey + 1);
//       setIsCategoryDisabled(false);
//     }
//   }, [categoryKey, categoriesData, form, visible]);

//   const handleModalClose = () => {
//     if (onClose) {
//       onClose();
//     } else {
//       setOpenModalAdd(false);
//     }
//   };

//   const handleSaveDocument = async (values) => {
//     try {
//       setLoading(true);
//       const files = form.getFieldValue("fileDoc");

//       if (!files || files.length === 0) {
//         message.error("Пожалуйста, загрузите файлы");
//         setLoading(false);
//         return;
//       }

//       const formData = new FormData();
//       formData.append("category", values.category);
//       formData.append("documentName", values.documentName);
//       formData.append("categoryKey", values.categoryKey);

//       files.forEach((file) => {
//         formData.append("files", file.originFileObj);
//       });

//       const token = localStorage.getItem("jwt");

//       await axios.post(`${backServer}/api/cabinet/upload-file`, formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true,
//       });

//       message.success("Документ успешно сохранен");
//       fetchDocuments(categoryKey);
//       handleModalClose();
//       setUploaderKey((prevKey) => prevKey + 1);
//     } catch (error) {
//       console.error("Ошибка при сохранении документа:", error);
//       setError(error.message || "Неизвестная ошибка");
//       setErrorVisible(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setErrorVisible(false);
//   };
//   // console.log(selectedCategoryItem.maximumSize);

//   return (
//     <>
//       <Modal
//         title="Загрузить новый документ"
//         open={openModalAdd || visible}
//         onCancel={handleModalClose}
//         footer={null}
//         destroyOnClose={true}
//         keyboard={false}
//       >
//         <ConfigProvider
//           theme={{
//             components: {
//               Form: {
//                 itemMarginBottom: 20
//               },
//             },
//           }}
//         >

//           <Form form={form} onFinish={handleSaveDocument} layout="vertical">
//             <Form.Item
//               label="Категория"
//               name="category"
//               rules={[
//                 {
//                   required: true,
//                   message: "Пожалуйста, выберите категорию документа",
//                 },
//               ]}
//             >
//               <Select
//                 showSearch
//                 placeholder="Выберите категорию"
//                 disabled={isCategoryDisabled}
//                 onChange={(value) => {
//                   const selectedCategoryItem = categoriesData.find(
//                     (item) => item.Description === value
//                   );
//                   if (selectedCategoryItem) {
//                     const selectedCategory =
//                       selectedCategoryItem.Description;
//                     form.setFieldsValue({
//                       documentName: selectedCategory,
//                       categoryKey: selectedCategoryItem.Ref_Key,
//                     });
//                     // const extensions = JSON.parse(
//                     //   selectedCategoryItem.availableExtensionsJSON
//                     // );
//                     // setAllowedExtensions(extensions);
//                     console.log(selectedCategoryItem.maximumSize)
//                     setMaxFileSize(Number(selectedCategoryItem.maximumSize) === 0 ? 10 : Number(selectedCategoryItem.maximumSize));
//                   }
//                 }}
//               >
//                 {categories.sort((a, b) => {
//                   if (a.toLowerCase() < b.toLowerCase()) {
//                     return -1;
//                   }
//                   if (a.toLowerCase() > b.toLowerCase()) {
//                     return 1;
//                   }
//                   return 0;
//                 }).map((category, index) => (
//                   <Option key={index} value={category}>
//                     {category}
//                   </Option>
//                 ))}
//               </Select>
//             </Form.Item>

//             <Form.Item
//               noStyle
//               shouldUpdate={(prevValues, currentValues) =>
//                 prevValues.category !== currentValues.category ||
//                 prevValues.documentName !== currentValues.documentName
//               }
//             >
//               {() => {
//                 const selectedCategory = form.getFieldValue("category");
//                 const documentName = form.getFieldValue("documentName");

//                 return (
//                   <>
//                     {(selectedCategory || isCategoryDisabled) && (
//                       <>
//                         <Form.Item
//                           label="Название"
//                           name="documentName"
//                           rules={[
//                             {
//                               required: true,
//                               message: "Пожалуйста, введите название документа",
//                             },
//                           ]}
//                         >
//                           <Input />
//                         </Form.Item>

//                         <Form.Item name="categoryKey" hidden>
//                           <input type="hidden" />
//                         </Form.Item>
//                       </>
//                     )}
//                   </>
//                 );
//               }}
//             </Form.Item>

//             <Form.Item
//               noStyle
//               shouldUpdate={(prevValues, currentValues) =>
//                 prevValues.documentName !== currentValues.documentName
//               }
//             >
//               {() => {
//                 const documentName = form.getFieldValue("documentName");

//                 return (
//                   <>
//                     {(documentName || isCategoryDisabled) && (
//                       <>
//                         <UploaderInput
//                           resetTrigger={uploaderKey}
//                           allowedExtensions={allowedExtensions}
//                           maxFileSize={maxFileSize}
//                           loading={loading}
//                         />

//                         <Form.Item>
//                           <Button
//                             type="primary"
//                             htmlType="submit"
//                             disabled={loading}
//                           >
//                             Сохранить файлы
//                           </Button>
//                         </Form.Item>
//                       </>
//                     )}
//                   </>
//                 );
//               }}
//             </Form.Item>
//           </Form>
//         </ConfigProvider>
//         {loading && (
//           <div className={styles.overlay}>
//             <Preloader />
//           </div>
//         )}
//         <ErrorModal visible={errorVisible} error={error} onClose={closeModal} />
//       </Modal>
//     </>
//   );
// }
