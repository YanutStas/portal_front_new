import React from "react";
import { Link } from "react-router-dom";
import {
  QuestionCircleOutlined,
  MoonOutlined,
  SunOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Switch, Badge, Tooltip, Button, Space } from "antd";
import styles from "./AppHeader.module.css";

export const items = [
  {
    key: "/about",
    label: <Link to={"/about"}>О нас</Link>,
  },
  {
    key: "/services",
    label: <Link to={"/services"}>Каталог услуг</Link>,
  },
  {
    key: "/calc",
    label: <Link to={"/calc"}>Калькулятор</Link>,
  },
  {
    key: "/contacts",
    label: <Link to={"/contacts"}>Контакты</Link>,
  },
  {
    key: "/docs",
    label: <Link to={"/docs"}>Информация</Link>,
  },
];

export const itemsMobile = [
  {
    label: <Link to="/about">О нас</Link>,
    key: "/about",
  },
  {
    label: <Link to="/services">Каталог услуг</Link>,
    key: "/services",
  },
  {
    label: <Link to="/calc">Калькулятор</Link>,
    key: "/calc",
  },
  {
    label: <Link to="/contacts">Контакты</Link>,
    key: "/contacts",
  },
  {
    label: <Link to="/docs">Информация</Link>,
    key: "/docs",
  },
  {
    type: "divider",
  },
];

export function RightMenuArea({
  colorText,
  darkMode,
  handlerDarkMode,
  auth,
  profile,
  getUnreadCount,
  showNotificationDrawer,
  handleLogout,
  handlerChangeAuth,
  setCurrentPage,
}) {
  return (
    <div className={styles.rightMenu}>
      <Link to="/answers">
        <QuestionCircleOutlined
          onClick={() => {
            setCurrentPage("/answers");
          }}
          style={{ fontSize: "20px", cursor: "pointer", color: colorText }}
        />
      </Link>
      <Switch
        onChange={handlerDarkMode}
        checkedChildren={<SunOutlined />}
        unCheckedChildren={<MoonOutlined />}
        checked={darkMode}
        style={{ background: !darkMode && colorText }}
      />
      <Badge count={getUnreadCount()} overflowCount={9}>
        <BellOutlined
          style={{ fontSize: "20px", cursor: "pointer", color: colorText }}
          onClick={showNotificationDrawer}
        />
      </Badge>
      {auth ? (
        <div className={styles.userInfo}>
          <Tooltip title={profile.email ? profile.email : "Пользователь"}>
            <UserOutlined
              style={{ fontSize: "20px", color: colorText, cursor: "pointer" }}
            />
          </Tooltip>
          <Button type="primary" onClick={handleLogout}>
            Выйти
          </Button>
        </div>
      ) : (
        <Button type="primary" onClick={handlerChangeAuth}>
          Войти
        </Button>
      )}
    </div>
  );
}

export function MobileExtraMenu({
  colorText,
  darkMode,
  handlerDarkMode,
  auth,
  profile,
  handleLogout,
  handlerChangeAuth,
  closeMenuDrawer,
  setCurrentPage,
}) {
  return (
    <div style={{ marginTop: 16 }}>
      <Space size="middle">
        <Link
          to="/answers"
          onClick={() => {
            setCurrentPage("/answers");
            closeMenuDrawer(); // закрываем Drawer
          }}
        >
          <QuestionCircleOutlined
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: colorText,
            }}
          />
        </Link>

        <Switch
          onChange={handlerDarkMode}
          checkedChildren={<SunOutlined />}
          unCheckedChildren={<MoonOutlined />}
          checked={darkMode}
          style={{ background: !darkMode && colorText }}
        />
        {auth ? (
          <>
            <Tooltip title={profile.email ? profile.email : "Пользователь"}>
              <UserOutlined
                style={{
                  fontSize: "20px",
                  color: colorText,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Button type="primary" onClick={handleLogout}>
              Выйти
            </Button>
          </>
        ) : (
          <Button type="primary" onClick={handlerChangeAuth}>
            Войти
          </Button>
        )}
      </Space>
    </div>
  );
}
