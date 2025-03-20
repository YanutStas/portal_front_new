import React from "react";
import { Modal } from "antd";
import CodeForm from "./CodeForm";
import useAuth from "../../../../stores/useAuth";

const CodeModal = () => {
  const { toggleModal, isCodeModalOpen } = useAuth();

  return (
    <Modal
      title="Введите код подтверждения"
      open={isCodeModalOpen}
      onCancel={() => toggleModal("isCodeModalOpen", false)}
      footer={null}
      maskClosable={false}
    >
      <CodeForm />
    </Modal>
  );
};

export default CodeModal;
