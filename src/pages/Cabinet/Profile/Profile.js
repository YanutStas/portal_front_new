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
import styles from "./Profile.module.css";
import TweenOne from "rc-tween-one";
import Children from "rc-tween-one/lib/plugin/ChildrenPlugin";
import moment from "moment";

TweenOne.plugins.push(Children);

const { Title, Text, Paragraph } = Typography;

export default function Profile() {
  const token = theme.useToken().token;
  const profile = useProfile((store) => store.profile);
  const fetchProfile = useProfile((store) => store.fetchProfile);
  const logout = useAuth((state) => state.logout);
  const toggleModal = useAuth((state) => state.toggleModal);
  const setAuthTab = useAuth((state) => state.setAuthTab);
  const darkMode = useGlobal((state) => state.darkMode);

  const [leftPanelVisible, setLeftPanelVisible] = useState(false);
  const [rightPanelVisible, setRightPanelVisible] = useState(false);

  useEffect(() => {
    fetchProfile();
    setTimeout(() => setLeftPanelVisible(true), 300);
    setTimeout(() => setRightPanelVisible(true), 800);
  }, [fetchProfile]);

  const handleLogout = () => {
    Modal.confirm({
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
    <div
      className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}
    >
      <AppHelmet title="Профиль" desc="Профиль пользователя" />
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} md={8}>
          <TweenOne
            animation={{
              opacity: leftPanelVisible ? 1 : 0,
              translateX: leftPanelVisible ? 0 : -50,
              duration: 800,
              ease: "easeOutCubic",
            }}
            style={{
              opacity: 0,
              transform: "translateX(-50px)",
              height: "100%",
            }}
          >
            <Card className={styles.profileCard} bordered={false}>
              <TweenOne
                animation={{
                  opacity: leftPanelVisible ? 1 : 0,
                  translateY: leftPanelVisible ? 0 : -20,
                  duration: 500,
                  delay: 200,
                  ease: "easeOutCubic",
                }}
                style={{ opacity: 0, transform: "translateY(-20px)" }}
              >
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  className={styles.avatar}
                />
                {profile.email && (
                  <Title level={3} className={styles.emailTitle}>
                    {profile.email}
                  </Title>
                )}
                {profile.dateСreate && (
                  <Paragraph
                    style={{ fontSize: 18, color: token.colorTextPlaceholder }}
                  >
                    Профиль создан:{" "}
                    {moment(profile.dateСreate).format("DD.MM.YYYY")}
                  </Paragraph>
                )}
              </TweenOne>
            </Card>
          </TweenOne>
        </Col>

        <Col xs={24} md={14}>
          <TweenOne
            animation={{
              opacity: rightPanelVisible ? 1 : 0,
              translateX: rightPanelVisible ? 0 : 50,
              duration: 800,
              ease: "easeOutCubic",
            }}
            style={{
              opacity: 0,
              transform: "translateX(50px)",
              height: "100%",
            }}
          >
            <Card
              className={styles.profileCard}
              bordered={false}
              styles={{ body: { height: "100%" } }}
            >
              <ConfigProvider
                theme={{
                  token: {
                    fontSize: 18,
                  },
                }}
              >
                <Flex style={{ height: "100%" }} vertical justify="center">
                  <Row gutter={16} align="middle">

                    <Col span={24}>
                      <Text strong>Телефон: </Text>
                      <Text>{profile.phone || ""}</Text>
                    </Col>

                    <Col span={24} style={{ marginTop: "20px" }}>
                      <Paragraph>
                        Если вы хотите{" "}
                        <strong>изменить телефон или пароль</strong>, повторно
                        пройдите регистрацию с тем же адресом электронной почты,
                        нажав на кнопку ниже.
                      </Paragraph>

                      <Button type="primary" onClick={handleLogout}>
                        Регистрация
                      </Button>
                    </Col>
                  </Row>
                </Flex>
              </ConfigProvider>
            </Card>
          </TweenOne>
        </Col>
      </Row>
    </div>
  );
}
