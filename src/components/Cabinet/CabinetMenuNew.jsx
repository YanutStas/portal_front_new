import React, { useState } from "react";
import { Flex, Typography, Card, Modal, Button } from "antd";

import { Link, useNavigate, } from "react-router-dom";
import useAuth from "../../stores/useAuth";
import ProfileNew from "../../pages/Cabinet/Profile/ProfileNew";
import useGlobal from "../../stores/useGlobal";


const { Text, Paragraph } = Typography;

export default function CabinetMenuNew({ setIsOpenProfileMenu }) {
  const { darkMode, toggleDarkMode, currentPage, setCurrentPage } = useGlobal();
  const logout = useAuth((state) => state.logout);
  const toggleModal = useAuth((state) => state.toggleModal);
  const setAuthTab = useAuth((state) => state.setAuthTab);
  const [modal, modalContextHolder] = Modal.useModal();
  const [isOpenModal, setIsOpenModal] = useState(false)

  const navigate = useNavigate();


  const handleReg = () => {
    modal.confirm({
      title: "Подтверждение",
      content: "Вы уверены, что хотите пройти регистрацию заново?",
      okText: "Да",
      cancelText: "Отмена",
      onOk: () => {
        logout();
        message.success("Вы вышли из системы. Открываем окно регистрации...");
        toggleModal("isAuthModalOpen", true);
        setAuthTab("2");
      },
    });
  };
  // const handleLogout = () => {
  //   try {
  //     logout();
  //     setCurrentPage("/");
  //     navigate("/");
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  return (
    <>
      <ProfileNew />
      {modalContextHolder}
      <Flex gap={20} wrap={"wrap"} vertical style={{ margin: "20px 0", width: "100%" }}>
        <Flex gap={10} wrap={"wrap"}>
          <Button onClick={() => { setIsOpenModal(true) }}>Сменить пароль</Button>
          <Button type="primary" onClick={() => { setIsOpenModal(true) }}>Выйти</Button>
        </Flex>
        <Link to={"/cabinet/claimers"} style={{ width: "100%" }}>
          <Card hoverable onClick={() => {
            setIsOpenProfileMenu(false)
          }}
            style={{ width: "100%",  }}
            styles={{
              body: {
                textAlign: "center"
              }
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 500 }}>Заявки</Text>
          </Card>
        </Link>

        {/* <Card hoverable onClick={() => { setIsOpenModal(true) }}>
        </Card> */}
      </Flex>

      <Modal
        open={isOpenModal}
        onCancel={() => { setIsOpenModal(false) }}
        footer={false}
      >
        <Paragraph>
          Если вы хотите{" "}
          <strong>изменить телефон или пароль</strong>, повторно
          пройдите регистрацию с тем же адресом электронной
          почты, нажав на кнопку ниже.
        </Paragraph>
        <Button type="primary" onClick={handleReg}>
          Регистрация
        </Button>
      </Modal>
    </>
  );
}
