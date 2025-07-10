import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  QuestionCircleOutlined,
  MoonOutlined,
  SunOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Switch, Badge, Tooltip, Button, Space, Drawer, Flex, Divider } from "antd";
import styles from "./AppHeader.module.css";
import CabinetMenu from "../../Cabinet/CabinetMenu";
import CabinetMenuNew from "../../Cabinet/CabinetMenuNew";
import ProfileNew from "../../../pages/Cabinet/Profile/ProfileNew";

export const items = [
  {
    key: "/services",
    label: <Link to={"/services"}>Каталог услуг</Link>,
  },
  {
    key: "/calc",
    label: <Link to={"/calc"}>Калькулятор</Link>,
  },
  {
    key: "/docs",
    label: <Link to={"/docs"}>Информация</Link>,
  },
  {
    key: "/about",
    label: <Link to={"/about"}>О нас</Link>,
  },
  {
    key: "/contacts",
    label: <Link to={"/contacts"}>Контакты</Link>,
  },
];

export const itemsMobile = [
  {
    label: <Link to="/services">Каталог услуг</Link>,
    key: "/services",
  },
  {
    label: <Link to="/calc">Калькулятор</Link>,
    key: "/calc",
  },
  {
    label: <Link to="/docs">Информация</Link>,
    key: "/docs",
  },
  {
    label: <Link to="/about">О нас</Link>,
    key: "/about",
  },
  {
    label: <Link to="/contacts">Контакты</Link>,
    key: "/contacts",
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
  const [isOpenProfileMenu, setIsOpenProfileMenu] = useState(false)

  return (
    <Flex gap={10} align="center" className={styles.mainMenu}>
      <Switch
        onChange={handlerDarkMode}
        checkedChildren={<SunOutlined />}
        unCheckedChildren={<MoonOutlined />}
        checked={darkMode}
        style={{ background: !darkMode && colorText }}
      />
      {auth ? (
        <div className={styles.userInfo}>
          <Button
            type="primary"
            onClick={() => { setIsOpenProfileMenu(true) }}
          >
            {profile.email?.split('@')[0]}
          </Button>
        </div>
      ) : (
        <Flex justify="center" style={{ width: "100%" }}>
          <Button type="primary" onClick={handlerChangeAuth}>
            Войти
          </Button>
        </Flex>
      )}
      <Drawer
        open={isOpenProfileMenu}
        onClose={() => { setIsOpenProfileMenu(false) }}
        // title={<Flex justify="flex-end">
        //   <Switch
        //     onChange={handlerDarkMode}
        //     checkedChildren={<SunOutlined />}
        //     unCheckedChildren={<MoonOutlined />}
        //     checked={darkMode}
        //     style={{ background: !darkMode && colorText }}
        //   />
        // </Flex>}
      >

        <CabinetMenuNew setIsOpenProfileMenu={setIsOpenProfileMenu} />
      </Drawer>
    </Flex>
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
    <>
      <Flex gap={10} align="center" className={styles.mobileMenu}>
        {/* <Switch
        onChange={handlerDarkMode}
        checkedChildren={<SunOutlined />}
        unCheckedChildren={<MoonOutlined />}
        checked={darkMode}
        style={{ background: !darkMode && colorText }}
        /> */}
        {auth ? (
          <>
            {/* <Tooltip title={profile.email ? profile.email : "Пользователь"}>
              <UserOutlined
              style={{
                fontSize: "20px",
                color: colorText,
                cursor: "pointer",
                }}
                />
                </Tooltip> */}
            <div style={{width:"100%"}}>

              <CabinetMenuNew setIsOpenProfileMenu={closeMenuDrawer} />
              {/* <Divider /> */}
            </div>
            {/* <Button type="primary" onClick={handleLogout}>
              Выйти
              </Button> */}
          </>
        ) : (
          <Flex justify="center" style={{ width: "100%" }}>
            <Button type="primary" onClick={handlerChangeAuth}>
              Войти
            </Button>
          </Flex>
        )}
      </Flex>
      <Divider />
    </>
  );
}
