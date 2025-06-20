import React from "react";
import { Modal, Result, Button, Typography,Flex} from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";

const SubmitModal = ({ open, claim, onClose }) => {
  const navigate = useNavigate();

  const handleOk = () => {
    if (onClose) onClose();
    navigate("/cabinet/claimers");
  };

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      maskClosable={false}
      width={500}
    >
      <Result
        status="success"
        icon={<CheckCircleFilled style={{ fontSize: 72, color: "#52c41a" }} />}
        // Не знаю тот ли это номер заявки6 но путь будет он :)
        title={`Ваша заявка с предварительным номером ${claim.number || "XXXXXX"} принята.`}
        extra={[
          <Flex gap={10} wrap="wrap">
            <Typography.Text>Услуга:</Typography.Text>
            <Typography.Text>{claim.service?.description}</Typography.Text>
          </Flex>,
          <Button key="submit" type="primary" onClick={handleOk}>
            К списку заявок
          </Button>,
        ]}
      />
    </Modal>
  );
};

export default SubmitModal;
