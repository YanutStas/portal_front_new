import React, { useState, useCallback } from "react";
import { Form, Card, Button, Tag, theme, Flex } from "antd";
import axios from "axios";
import { FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import DocumentSelectModal from "./DocumentSelectModal";
import WrapperComponent from "./WrapperComponent";

export default function DocumentInput({
  name = "name",
  label = "",
  dependOf = false,
  howDepend = false,
  category_key = null,
  span = false,
  stylesField_key = false,
  read = false
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
    form.setFieldValue(name, document);
    setDocumentModalVisible(false);
  };

  // Функция для открытия документа в новой вкладке
  const openDocument = useCallback((document) => {
    const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
    const newWindow = window.open("", "_blank");
    let fileUrl;

    if (document.ПутьКФайлу) {
      const fileName = document.ПутьКФайлу.split("/")[1];
      fileUrl = `${backServer}/api/cabinet/get-file/by-filename/${fileName}`;
    } else {
      const fileId = document.Ref_Key;
      fileUrl = `${backServer}/api/cabinet/get-file/by-id/${fileId}`;
    }

    axios
      .get(fileUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        responseType: "blob",
        withCredentials: true,
      })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        newWindow.location.href = fileURL;
      })
      .catch((error) => {
        console.error("Ошибка при открытии документа:", error);
        newWindow.document.write("<p>Не удалось загрузить документ.</p>");
      });
  }, []);

  const attachedDocument = form.getFieldValue(name);
  const isAttached = !!attachedDocument;

  const formElement = (
    <div style={{ height: "100%" }}>
      <Form.Item name={name} style={{ height: "100%" }}>
        <Card
          bordered
          style={{
            height: "300px",
            color: token.colorBorder,
            backgroundColor: isAttached
              ? token.colorSuccessBg
              : token.colorBgContainer,
          }}
          styles={{
            body: {
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          }}
          className={"formElement"}
        >
          {/* Иконка глаза в верхнем правом углу */}
          {isAttached && (
            <Button
              type="primary"
              shape="circle"
              icon={<EyeOutlined />}
              size="small"
              style={{ position: "absolute", top: 10, right: 10 }}
              onClick={() => openDocument(attachedDocument)}
            />
          )}

          {/* Верхняя часть карточки */}
          <div style={{ flex: 1 }}>
            {/* Заголовок с иконкой */}
            <Card.Meta
              avatar={
                <FileTextOutlined
                  style={{
                    fontSize: "24px",
                    color: token.colorPrimary,
                  }}
                />
              }
              title={<div style={{ whiteSpace: "normal" }}>{label}</div>}
              style={{ marginBottom: 16 }}
            />
            {/* Отображение названия выбранного документа */}
            {isAttached && (
              <div style={{ color: token.colorText }}>
                <strong>Документ:</strong> {attachedDocument.Description}
              </div>
            )}
          </div>
          {/* Нижняя часть карточки с плашкой и кнопкой */}
          <Flex vertical gap={10} align="center" justify="center">
            {isAttached ? (
              <Tag color="success">Прикреплено</Tag>
            ) : (
              <Tag color="error">Не прикреплено</Tag>
            )}
            <Button
              type="primary"
              onClick={() => handlerSelectDocument(category_key)}
            >
              {isAttached ? "Изменить" : "Выбрать"}
            </Button>
          </Flex>
        </Card>
      </Form.Item>
      <DocumentSelectModal
        visible={documentModalVisible}
        onClose={() => setDocumentModalVisible(false)}
        categoryKey={selectedCategory}
        onSelectDocument={handlerDocumentSelected}
      />
    </div>
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
