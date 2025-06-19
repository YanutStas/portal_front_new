import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Typography, Card, Modal, Divider, Flex, Button } from "antd";
import AppHelmet from "../../../components/Global/AppHelmet";
import { PlusOutlined } from "@ant-design/icons";
import SceletonCard from "../../../components/SceletonCard";
import useDocuments from "../../../stores/Cabinet/useDocuments";
import axios from "axios";
import ModalAddDocument from "../../../components/Cabinet/Documents/ModalAddDocument";
import DocumentCard from "./DocumentCard";

const { Title } = Typography;
const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  // console.log("byteCharacters",byteCharacters);

  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

const Documents = ({ categoryKey, onSelectDocument, isModal, label = false }) => {
  const [modalCategoryKey, setModalCategoryKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const documents = useDocuments((state) => state.documents);
  // const categories = useDocuments((state) => state.categories);
  const loadingDocuments = useDocuments((state) => state.loadingDocuments);
  const openModalAdd = useDocuments((state) => state.openModalAdd);
  const setOpenModalAdd = useDocuments((state) => state.setOpenModalAdd);
  const fetchDocuments = useDocuments((state) => state.fetchDocuments);
  const deleteDocument = useDocuments((state) => state.deleteDocument);

  useEffect(() => {
    fetchDocuments(categoryKey);
  }, [categoryKey, fetchDocuments]);

  const openDocument = useCallback((document) => {
    const backServer = import.meta.env.VITE_BACK_BACK_SERVER;
    let fileUrl;
    
    if (document.ПутьКФайлу) {
      const fileName = document.ПутьКФайлу.split("/")[1];
      fileUrl = `${backServer}/api/cabinet/get-file/by-filename/${fileName}`;
    } else {
      const fileId = document.id;
      fileUrl = `${backServer}/api/cabinet/get-file/by-id/${fileId}`;
    }

    axios
      .get(fileUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        // responseType: "blob",
        withCredentials: true,
      })
      .then((response) => {
        const file = b64toBlob(response.data.data.base64, "application/pdf")
        const fileURL = URL.createObjectURL(file);
        const newWindow = window.open("", "_blank");
        newWindow.location.href = fileURL;
      })
      .catch((error) => {
        console.error("Ошибка при открытии документа:", error);
        // newWindow.document.write("<p>Не удалось загрузить документ.</p>");
      });
  }, []);

  const handleDocumentClick = (document) => {
    if (onSelectDocument) {
      onSelectDocument(document);
      console.log("onSelectDocument", onSelectDocument);
    } else {
      openDocument(document);
    }
  };

  const confirmDelete = useCallback(
    (id) => {
      Modal.confirm({
        title: "Вы уверены, что хотите удалить этот документ?",
        okText: "Да",
        okType: "danger",
        cancelText: "Отмена",
        onOk() {
          deleteDocument(id);
        },
      });
    },
    [deleteDocument]
  );

  const handleAddDocument = useCallback(() => {
    setOpenModalAdd(true);
    setIsModalOpen(true);
    if (isModal) {
      setModalCategoryKey(categoryKey);
    } else {
      setModalCategoryKey(null);
    }
  }, [setOpenModalAdd, isModal, categoryKey]);

  const handleCloseModal = () => {
    setOpenModalAdd(false);
    setIsModalOpen(false);
    // setModalCategoryKey(null);
  };

  const documentCards = useMemo(() => {
    return documents.map((category, indexcategory) => (
      <div key={indexcategory}>
        <Typography.Title level={3}>{category.label}</Typography.Title>
        <Flex gap={20} wrap="wrap">
          {category.docs.map((doc, indexdoc) => (
            <DocumentCard
              key={indexdoc}
              document={doc}
              isModal={isModal}
              handleDocumentClick={handleDocumentClick}
              confirmDelete={confirmDelete}
              openDocument={openDocument}
            />
          ))}
        </Flex>
        <Divider />
      </div>
    ));
  }, [documents, isModal, handleDocumentClick, confirmDelete, openDocument]);
  // console.log(documents);

  return (
    <div>
      <AppHelmet title={"Документы"} desc={"Документы"} />
      <Flex align="center" justify="space-between">
        <Flex wrap={"wrap"} align="center" justify="center" gap={20}>
          {!label && <Title level={1} style={{ margin: 0 }}>Мои документы</Title>}
          <Title level={2} style={{ color: "gray", margin: 0 }}>{label}</Title>
        </Flex>
        <Button
          type="primary"
          onClick={!isModalOpen ? handleAddDocument : undefined}
        >
          Добавить документ
        </Button>
      </Flex>
      {loadingDocuments && <SceletonCard />}
      {/* <Card
        hoverable={!isModalOpen}
        style={{
          width: 250,
          height: 250,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: isModalOpen ? 0.5 : 1,
          cursor: isModalOpen ? "not-allowed" : "pointer",
        }}
        onClick={!isModalOpen ? handleAddDocument : undefined}
        >
        <PlusOutlined style={{ fontSize: "24px" }} />
      </Card> */}
      {documentCards}
      <ModalAddDocument
        visible={openModalAdd}
        onClose={handleCloseModal}
        categoryKey={modalCategoryKey}
      />
    </div>
  );
};

export default React.memo(Documents);
