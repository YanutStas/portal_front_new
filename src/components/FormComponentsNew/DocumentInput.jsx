import React, { useState, useCallback } from "react";
import { Form, Card, Button, Tag, theme, Flex, Typography } from "antd";
import axios from "axios";
import { FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import DocumentSelectModal from "./DocumentSelectModal";
import WrapperComponent from "./WrapperComponent";
import openDocs from "../Cabinet/openDocument";

// const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
//   const byteCharacters = atob(b64Data);
//   // console.log("byteCharacters",byteCharacters);

//   const byteArrays = [];
//   for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//     const slice = byteCharacters.slice(offset, offset + sliceSize);
//     const byteNumbers = new Array(slice.length);
//     for (let i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     byteArrays.push(byteArray);
//   }
//   const blob = new Blob(byteArrays, { type: contentType });
//   return blob;
// }

export default function DocumentInput({
  name = "name",
  label = "",
  dependOf = false,
  howDepend = false,
  category_key = null,
  span = false,
  stylesField_key = false,
  read = false,
  required = false,
  saveToProfile = false
}) {
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { token } = theme.useToken();

  const form = Form.useFormInstance();

  const handlerSelectDocument = (category_key) => {
    setSelectedCategory(category_key);
    setDocumentModalVisible(true);
  };

  const handlerDocumentSelected = (document) => {
    console.log(
      `Пользователь выбрал документ для категории ${selectedCategory}:`,
      document
    );
    form.setFieldValue(name, {
      fileId: document.id,
      category_key: document.typeFile.id,
      label: document.name,
      fromProfile: true
    });
    setDocumentModalVisible(false);
  };

  // Функция для открытия документа в новой вкладке 

  const attachedDocument = form.getFieldValue(name);
  const isAttached = !!attachedDocument;
// console.log(token);
console.log(form.getFieldError(name));
// form.getFieldError(name)
  const formElement = (
    <>
      {/* {saveToProfile && <Typography.Text>Сохранять в профиль</Typography.Text>} */}
      <Card
        title={label}
        style={{
          borderColor: isAttached ? "green" : token.colorPrimary,
          minHeight: 300,
          height: "100%"
        }}
        styles={{
          title: {
            whiteSpace: "break-spaces"
          },
          body: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          },
        }}
        extra={isAttached ? <Tag color='green'>Выбран</Tag> : <Tag color='blue'>НЕ выбран</Tag>}
      // className={"formElement"}
      >
        <Form.Item
          name={name}
          style={{ height: "100%" }}
          rules={[
            {
              required: required,
              message: "Этот документ обязателен",
            },
          ]}
        >
        </Form.Item>
        <Flex gap={10} vertical justify='center' style={{ height: "100%" }}>

          {/* Иконка глаза в верхнем правом углу */}
          {isAttached && (
            <Button
             
              onClick={() => openDocs(attachedDocument)}
            >Посмотреть документ</Button>
          )}

          <Button
            type="primary"
            onClick={() => handlerSelectDocument(category_key)}
          >
            {isAttached ? "Изменить" : "Выбрать документ"}
          </Button>
        </Flex>

      </Card>
      <DocumentSelectModal
        visible={documentModalVisible}
        onClose={() => setDocumentModalVisible(false)}
        categoryKey={selectedCategory}
        label={label}
        onSelectDocument={handlerDocumentSelected}
      />
    </>
  );
  return (
    <WrapperComponent
      span={span}
      stylesField_key={stylesField_key}
      dependOf={dependOf}
      howDepend={howDepend}
      name={name}
      read={read}
    >
      {formElement}
    </WrapperComponent>
  );
}
