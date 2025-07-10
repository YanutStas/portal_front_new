import React, { useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Col,
  Row,
  Typography,
  Button,
  message,
  theme,
  ConfigProvider,
  Flex,
  Modal,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import AppHelmet from "../../../components/Global/AppHelmet";
import useProfile from "../../../stores/Cabinet/useProfile";
import useGlobal from "../../../stores/useGlobal";
import useAuth from "../../../stores/useAuth";
import styles from "./ProfileNew.module.css";
import TweenOne from "rc-tween-one";
import Children from "rc-tween-one/lib/plugin/ChildrenPlugin";
import moment from "moment";

TweenOne.plugins.push(Children);

const { Title, Text, Paragraph } = Typography;

export default function ProfileNew() {
  const token = theme.useToken().token;
  const profile = useProfile((store) => store.profile);
  const fetchProfile = useProfile((store) => store.fetchProfile);
  const logout = useAuth((state) => state.logout);
  const toggleModal = useAuth((state) => state.toggleModal);
  const setAuthTab = useAuth((state) => state.setAuthTab);
  const darkMode = useGlobal((state) => state.darkMode);

  const [leftPanelVisible, setLeftPanelVisible] = useState(false);
  const [rightPanelVisible, setRightPanelVisible] = useState(false);

  // инстанс модалки, которая будет учитывать динамическую тему
  const [modal, modalContextHolder] = Modal.useModal();

  useEffect(() => {
    fetchProfile();
    setTimeout(() => setLeftPanelVisible(true), 300);
    setTimeout(() => setRightPanelVisible(true), 800);
  }, [fetchProfile]);

  const handleLogout = () => {
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

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 18,
        },
      }}
    >
      {modalContextHolder}
      <div
        className={`${styles.container} ${darkMode ? styles.dark : styles.light
          }`}
      >
        <AppHelmet title="Профиль" desc="Профиль пользователя" />
          <Flex gap={10} wrap="wrap" align="center">
            <Avatar
              icon={<UserOutlined />}
            />
        <Flex vertical >
            {profile.email && (
              <Text style={{fontWeight:600}}>
                {profile.email}
              </Text>
            )}
          {profile.dateСreate && (
            <Text style={{color:"gray",fontSize:12}}>
              Профиль создан:{" "}
              {moment(profile.dateСreate).format("DD.MM.YYYY")}
            </Text>
          )}
          </Flex>
        </Flex>

      </div>
    </ConfigProvider>
  );
}
