import React from "react";
import { Modal, Result, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";

const SubmitModal = ({ visible, claim, onClose }) => {
  const navigate = useNavigate();

  const handleOk = () => {
    if (onClose) onClose();
    navigate("/cabinet/claimers");
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      maskClosable={false}
      width={500}
    >
      <Result
        status="success"
        icon={<CheckCircleFilled style={{ fontSize: 72, color: "#52c41a" }} />}
        title={`Ваша заявка № ${claim?.Code || "XXXXXX"} принята.`}
        extra={[
          <Button key="submit" type="primary" onClick={handleOk}>
            К списку заявок
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default SubmitModal;
