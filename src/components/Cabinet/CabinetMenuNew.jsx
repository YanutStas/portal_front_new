import React, { useState } from "react";
import { Flex, Typography, Card, Modal, Button, message } from "antd";

import { useNavigate } from "react-router-dom";
import useAuth from "../../stores/useAuth";
import ProfileNew from "../../pages/Cabinet/Profile/ProfileNew";
import ProfileSetting from "./ProfileSetting";

const { Text, Paragraph } = Typography;

export default function CabinetMenuNew({ setIsOpenProfileMenu }) {
  const logout = useAuth((state) => state.logout);
  const toggleModal = useAuth((state) => state.toggleModal);
  const setAuthTab = useAuth((state) => state.setAuthTab);
  const [modal, modalContextHolder] = Modal.useModal();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalSetting, setIsOpenModalSetting] = useState(false);

  const handleReg = () => {
    modal.confirm({
      title: "Подтверждение",
      content: "Вы уверены, что хотите пройти регистрацию заново?",
      okText: "Да",
      cancelText: "Отмена",
      onOk: () => {
        logout();
        message.success("Вы вышли из системы. Открываем окно регистрации...");
        setIsOpenProfileMenu(false);
        setIsOpenModal(false);
        toggleModal("isAuthModalOpen", true);
        setAuthTab("2");
      },
    });
  };

  return (
    <>
      <ProfileNew />
      {modalContextHolder}
      <Flex
        gap={20}
        wrap={"wrap"}
        vertical
        style={{ margin: "20px 0", width: "100%" }}
      >
        <Flex gap={10} wrap={"wrap"}>
          <Button
            onClick={() => {
              setIsOpenModal(true);
            }}
          >
            Сменить пароль
          </Button>
          <Button
            type="primary"
            onClick={() => {
              logout();
              setIsOpenProfileMenu(false);
            }}
          >
            Выйти
          </Button>
        </Flex>
        <Flex gap={10} vertical>
          <LinkCard
            title={"Заявки"}
            color={"blue"}
            url={"/cabinet/claimers"}
            setIsOpenProfileMenu={setIsOpenProfileMenu}
          />

          <LinkCard
            title={"Подать обращение"}
            color={"green"}
            url={"https://mosoblenergo.ru/contact?feedback=1"}
            external
            setIsOpenProfileMenu={setIsOpenProfileMenu}
          />

          <Flex vertical gap={0} justify="center" style={{ width: "100%" }}>
            <Typography.Text
              level={5}
              style={{ textAlign: "center", marginBottom: "0" }}
            >
              Горячая линия АО «Мособлэнерго»
            </Typography.Text>
            <Typography.Text style={{ textAlign: "center" }}>
              <a href="tel:+74959950099">+7 (495) 99-500-99</a>
            </Typography.Text>


          </Flex>
        </Flex>
      </Flex>

      <Modal
        open={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false);
        }}
        footer={false}
      >
        <Paragraph>
          Если вы хотите <strong>изменить телефон или пароль</strong>, повторно
          пройдите регистрацию с тем же адресом электронной почты, нажав на
          кнопку ниже.
        </Paragraph>
        <Button type="primary" onClick={handleReg}>
          Регистрация
        </Button>
      </Modal>

      {/* Модалка с настройками */}
      <Modal
        title={"Настройки профиля"}
        open={isOpenModalSetting}
        onCancel={() => {
          setIsOpenModalSetting(false);
        }}
        footer={false}
      >
        <ProfileSetting />
      </Modal>
    </>
  );
}
function LinkCard({ title, color, url, setIsOpenProfileMenu, external = false }) {
  const navigate = useNavigate();
  const handlerNavigate = (url, isExternal) => {
    if (isExternal) {
      setIsOpenProfileMenu(false);
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate(url);
      setIsOpenProfileMenu(false);
    }
  };
  return (
    <Button
      onClick={() => {
        handlerNavigate(url, external);
      }}
      style={{ width: "100%" }}
      size="large"
      color={color}
      variant="filled"
    >
      {title}
    </Button>
  );
}
