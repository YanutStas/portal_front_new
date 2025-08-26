import React from "react";
import { Button, Flex, Modal, Typography } from "antd";
import cat from "../img/Cat.png";

const { Text, Title, Paragraph } = Typography;

const ErrorModal = ({ visible, error, onClose }) => {
  return (
    <Modal
      closable={false}
      open={visible}
      footer={null}
      centered
      styles={{ body: { textAlign: "center" } }}
    >
      <Title level={4} style={{ textAlign: "center" }}>
        Регламентные работы
      </Title>
     
      <Text type="danger">
        Извините, наш портал временно недоступен.
      </Text>
      <Paragraph type="danger">
        Пожалуйста, подождите несколько
        минут и попробуйте обновить страницу.
      </Paragraph>
      <br />
      <img
        src={cat}
        alt="Сайт устал"
        style={{ width: "100%", marginTop: "20px" }}
      />
      {/* Для отображения ошибки можно использовать это место */}
      {/* <Text type="secondary">{error?.message || "Неизвестная ошибка"}</Text> */}
      <Flex justify="center" gap={10}>
        <Button
          type="primary"
          onClick={() => {
            window.location.reload();
          }}
        >
          {" "}
          Обновить страницу
        </Button>
        <Button
          type="dashed"
          onClick={() => {
            window.location.replace("/");
          }}
        >
          {" "}
          На главную страницу
        </Button>
      </Flex>
    </Modal>
  );
};

export default ErrorModal;
