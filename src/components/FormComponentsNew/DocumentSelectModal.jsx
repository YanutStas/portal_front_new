import React from "react";
import { Modal } from "antd";
import Documents from "../../pages/Cabinet/Documents/Documents";

const DocumentSelectModal = ({
  visible,
  onClose,
  categoryKey,
  onSelectDocument,
  label
}) => {
  return (

    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width="80%"
      keyboard={false}
      title={"Выбор документа"}
    >

      <Documents
        categoryKey={categoryKey}
        label={label}
        onSelectDocument={onSelectDocument}
        isModal={true}
      />
    </Modal>
  );
};

export default DocumentSelectModal;
