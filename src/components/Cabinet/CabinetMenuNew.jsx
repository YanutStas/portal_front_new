import React, { useState } from "react";
import { Flex, Typography, Card, Modal, Button } from "antd";

import { Link, useNavigate, } from "react-router-dom";
import useAuth from "../../stores/useAuth";
import ProfileNew from "../../pages/Cabinet/Profile/ProfileNew";
import useGlobal from "../../stores/useGlobal";
import { SettingOutlined } from '@ant-design/icons';
import ProfileSetting from "./ProfileSetting";


const { Text, Paragraph } = Typography;

export default function CabinetMenuNew({ setIsOpenProfileMenu }) {
  const { darkMode, toggleDarkMode, currentPage, setCurrentPage } = useGlobal();
  const logout = useAuth((state) => state.logout);
  const toggleModal = useAuth((state) => state.toggleModal);
  const setAuthTab = useAuth((state) => state.setAuthTab);
  const [modal, modalContextHolder] = Modal.useModal();
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenModalSetting, setIsOpenModalSetting] = useState(false)

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
          <Button onClick={() => { setIsOpenModalSetting(true) }}><SettingOutlined /></Button>
          <Button onClick={() => { setIsOpenModal(true) }}>Сменить пароль</Button>
          <Button type="primary" onClick={() => { setIsOpenModal(true) }}>Выйти</Button>
        </Flex>
        <Flex gap={10} vertical>
          <LinkCard title={"Заявки"} color={"blue"} url={"/cabinet/claimers"} />
          <LinkCard title={"Задачи"} color={"red"} url={"/cabinet/claimers"} />
          <LinkCard title={"Обращения"} color={"green"} url={"/cabinet/claimers"} />
        </Flex>

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

      {/* Модалка с настройками */}
      <Modal
        title={"Настройки профиля"}
        open={isOpenModalSetting}
        onCancel={() => { setIsOpenModalSetting(false) }}
        footer={false}
      >
       <ProfileSetting/>
      </Modal>
    </>
  );
}
function LinkCard({ title, color, url }) {
  return (
    <Link to={url} style={{ width: "100%" }}>
      <Button style={{ width: "100%" }} size="large" color={color} variant="filled">{title}</Button>

    </Link>
  )
}

//  <Card hoverable onClick={() => {
//         setIsOpenProfileMenu(false)
//       }}
//         style={{ width: "100%", height: "100%", backgroundColor: color }}
//         styles={{
//           body: {
//             padding:10,
//             // display: "flex",
//             // justifyItems: "center",
//             // alignItems: "center",
//             textAlign:"center"
//           }
//         }}
//       >
//         {/* <div style={{textAlign:"center"}}> */}

//           <Text style={{ fontSize: 14, fontWeight: 500 }}>{title}</Text>
//         {/* </div> */}
//       </Card>