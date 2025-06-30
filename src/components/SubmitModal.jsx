import React from "react";
import { Modal, Result, Button, Typography, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";

const SubmitModal = ({ open, claim, onClose }) => {
  const navigate = useNavigate();

  const handleOk = () => {
    if (onClose) onClose();
    navigate("/cabinet/claimers");
  };
  console.log(claim);

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
        title={claim.number ? <Flex vertical>
          <Typography.Text style={{fontSize:20,fontWeight:600}}>Заявка принята.</Typography.Text>
          <Typography.Text>Предварительный номер:</Typography.Text>
          <Typography.Text style={{fontSize:24,fontWeight:600}}> {claim.number} </Typography.Text>
        </Flex> : `Ваша заявка принята.`}
        extra={claim.service?.description ?
          <Flex gap={10} vertical>
            <Flex gap={10} wrap="wrap">
              <Typography.Text style={{fontWeight:600}}>Услуга:</Typography.Text>
              <Typography.Text>{claim.service?.description}</Typography.Text>
            </Flex>
            <Button key="submit" type="primary" onClick={handleOk}>
              К списку заявок
            </Button>
          </Flex> : false
        }
      />
    </Modal>
  );
};

export default SubmitModal;
