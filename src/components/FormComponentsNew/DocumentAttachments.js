import React, { useState, useCallback } from "react";
import { Row, Col, Card, Button, Tag, Divider, theme, Flex } from "antd";
import { FileTextOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import DocumentSelectModal from "./DocumentSelectModal";

const DocumentAttachments = ({ form, categoriesFiles }) => {
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { token } = theme.useToken();

  const handleSelectDocument = (categoryKey) => {
    setSelectedCategory(categoryKey);
    setDocumentModalVisible(true);
  };

  const handleDocumentSelected = (document) => {
    console.log(
      `Пользователь выбрал документ для категории ${selectedCategory}:`,
      document
    );
    form.setFieldsValue({ [`document_${selectedCategory}`]: document });
    setDocumentModalVisible(false);
  };

  // Функция для открытия документа в новой вкладке
  const openDocument = useCallback((document) => {
    const backServer = import.meta.env.VITE_APP_BACK_BACK_SERVER;
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

  return (
    <>
      <Divider>Файлы</Divider>
      <Row align={"stretch"} gutter={[20, 20]}>
        {categoriesFiles &&
          categoriesFiles.map((item, index) => {
            const attachedDocument = form.getFieldValue(
              `document_${item.category_Key}`
            );
            const isAttached = !!attachedDocument;

            return (
              <Col xxl={6} xl={8} lg={12} span={24} key={index}>
                <Card
                  bordered
                  style={{
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "8px",
                    backgroundColor: isAttached
                      ? token.colorSuccessBg
                      : token.colorBgContainer,
                  }}
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
                      title={
                        <div style={{ whiteSpace: "normal" }}>
                          {item.categoryName}
                        </div>
                      }
                      description={item.shortDescription || ""}
                      style={{ marginBottom: 16 }}
                    />
                    {/* Отображение названия выбранного документа */}
                    {isAttached && (
                      <div style={{ marginBottom: 16 }}>
                        <strong>Документ:</strong>{" "}
                        {attachedDocument.Description}
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
                      onClick={() => handleSelectDocument(item.category_Key)}
                    >
                      {isAttached ? "Изменить" : "Выбрать"}
                    </Button>
                  </Flex>
                </Card>
              </Col>
            );
          })}
      </Row>

      <DocumentSelectModal
        visible={documentModalVisible}
        onClose={() => setDocumentModalVisible(false)}
        categoryKey={selectedCategory}
        onSelectDocument={handleDocumentSelected}
      />
    </>
  );
};

export default DocumentAttachments;
