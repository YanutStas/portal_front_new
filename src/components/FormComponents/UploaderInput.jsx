import React, { useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Form, Upload, message, theme, Image } from "antd";
import iconPdf from "../../img/pdf.svg";

const { Dragger } = Upload;

export default function UploaderInput({
  resetTrigger,
  read,
  edit,
  value,
  depends,
  required = false,
  maxFileSize = 10,
  loading,
}) {
  
  maxFileSize = 10
  const [fileList, setFileList] = useState([]);
  const { colorPrimaryText } = theme.useToken().token;
  const form = Form.useFormInstance();
  const allowedExtensions = [".jpeg", ".jpg", ".pdf", ".png"];

  const uploadProps = {
    multiple: true,
    disabled: loading,
    beforeUpload: (file) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      console.log("fileExtension",fileExtension);
      const isSupported = allowedExtensions.includes(`.${fileExtension}`);

      if (!isSupported) {
        console.log("isSupported");
        
        message.error(`${file.name} не поддерживается`);
        return Upload.LIST_IGNORE;
      }
      const isSizeOk = file.size / 1024 / 1024 < maxFileSize;
      if (!isSizeOk) {
        console.log("isSizeOk");
        message.error(
          `${file.name} превышает максимальный размер ${maxFileSize} МБ`
        );
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: ({ fileList }) => {
      setFileList(fileList);
      form.setFieldsValue({ fileDoc: fileList });
    },
    listType: "text",
    fileList,
    onRemove: (file) => {
      const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
      setFileList(updatedFileList);
      form.setFieldsValue({ fileDoc: updatedFileList });
    },
  };

  useEffect(() => {
    setFileList([]);
    form.setFieldsValue({ fileDoc: [] });
  }, [resetTrigger]);

  useEffect(() => {
    setFileList([]);
    form.setFieldsValue({ fileDoc: [] });
  }, [maxFileSize]);

  return (
    <Form.Item
      label={read ? "Файлы" : "Загрузить файлы"}
      name={"fileDoc"}
      rules={[
        {
          required: required,
          message: "Пожалуйста, загрузите файл",
        },
      ]}
    >
      {!read && (
        <Dragger {...uploadProps} accept={allowedExtensions.join(',')}>
          <div>
            <InboxOutlined
              style={{ color: colorPrimaryText, fontSize: "48px" }}
            />
          </div>
          <p className="ant-upload-text">
            Файлы размером не более {maxFileSize} МБ
          </p>
          <p className="ant-upload-hint">
            Форматы: {allowedExtensions.join(", ")}
          </p>
        </Dragger>
      )}
      {read && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {fileList.map((item, index) =>
            item.name.includes(".pdf") ? (
              <a
                key={index}
                target="_blank"
                href={item.url}
                rel="noopener noreferrer"
              >
                <div
                  style={{
                    boxSizing: "border-box",
                    width: 150,
                    height: 150,
                    border: "1px solid gray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image preview={false} src={iconPdf} />
                </div>
              </a>
            ) : (
              <Image key={index} width={150} src={item.url} />
            )
          )}
        </div>
      )}
    </Form.Item>
  );
}

// import React, { useEffect, useState } from "react";
// import { InboxOutlined } from "@ant-design/icons";
// import { Form, Upload, message, theme, Image } from "antd";
// import iconPdf from "../../img/pdf.svg";

// const { Dragger } = Upload;

// export default function UploaderInput({
//   resetTrigger,
//   read,
//   edit,
//   value,
//   depends,
//   required = false,
//   maxFileSize = 10,
//   loading,
// }) {
//   const [fileList, setFileList] = useState([]);
//   const { colorPrimaryText } = theme.useToken().token;
//   const form = Form.useFormInstance();
//   const allowedExtensions = ["JPEG", "JPG", "PDF", "HREF", "PNG"];

//   const uploadProps = {
//     multiple: true,
//     disabled: loading, // Блокируем загрузчик во время загрузки
//     beforeUpload: (file) => {
//       const fileExtension = file.name.split(".").pop().toUpperCase();
//       const isSupported = allowedExtensions.includes(fileExtension);

//       if (!isSupported) {
//         message.error(`${file.name} не поддерживается`);
//         return Upload.LIST_IGNORE;
//       }
//       const isSizeOk = file.size / 1024 / 1024 < maxFileSize;
//       if (!isSizeOk) {
//         message.error(
//           `${file.name} превышает максимальный размер ${maxFileSize} МБ`
//         );
//         return Upload.LIST_IGNORE;
//       }
//       return false; // Предотвращаем автоматическую загрузку
//     },
//     onChange: ({ fileList }) => {
//       setFileList(fileList);
//       form.setFieldsValue({ fileDoc: fileList });
//     },
//     listType: "text",
//     fileList,
//     onRemove: (file) => {
//       const updatedFileList = fileList.filter((item) => item.uid !== file.uid);
//       setFileList(updatedFileList);
//       form.setFieldsValue({ fileDoc: updatedFileList });
//     },
//   };

//   useEffect(() => {
//     setFileList([]);
//     form.setFieldsValue({ fileDoc: [] });
//   }, [resetTrigger]);

//   useEffect(() => {
//     setFileList([]);
//     form.setFieldsValue({ fileDoc: [] });
//   }, [maxFileSize]);

//   return (
//     <Form.Item
//       label={read ? "Файлы" : "Загрузить файлы"}
//       name={"fileDoc"}
//       rules={[
//         {
//           required: required,
//           message: "Пожалуйста, загрузите файл",
//         },
//       ]}
//     >
//       {!read && (
//         <Dragger {...uploadProps}>
//           <div>
//             <InboxOutlined
//               style={{ color: colorPrimaryText, fontSize: "48px" }}
//             />
//           </div>
//           <p className="ant-upload-text">
//             Файлы размером не более {maxFileSize} МБ
//           </p>
//           <p className="ant-upload-hint">
//             Форматы: {allowedExtensions.join(", ")}
//           </p>
//         </Dragger>
//       )}
//       {read && (
//         <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
//           {fileList.map((item, index) =>
//             item.name.includes(".pdf") ? (
//               <a
//                 key={index}
//                 target="_blank"
//                 href={item.url}
//                 rel="noopener noreferrer"
//               >
//                 <div
//                   style={{
//                     boxSizing: "border-box",
//                     width: 150,
//                     height: 150,
//                     border: "1px solid gray",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Image preview={false} src={iconPdf} />
//                 </div>
//               </a>
//             ) : (
//               <Image key={index} width={150} src={item.url} />
//             )
//           )}
//         </div>
//       )}
//     </Form.Item>
//   );
// }
