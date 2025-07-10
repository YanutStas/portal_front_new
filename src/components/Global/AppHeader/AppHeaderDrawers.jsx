import React from "react";
import { Drawer, Flex, Menu, Switch } from "antd";
import NotificationList from "../../Notifications/NotificationPanel";
import { MobileExtraMenu } from "./AppHeaderMenus";
import {
  QuestionCircleOutlined,
  MoonOutlined,
  SunOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";

export function MobileMenuDrawer({
  menuDrawerVisible,
  closeMenuDrawer,
  currentPage,
  setCurrentPage,
  itemsMobile,
  colorText,
  darkMode,
  handlerDarkMode,
  auth,
  profile,
  handleLogout,
  handlerChangeAuth,
}) {
  return (
    <Drawer
      // title="Меню"
      placement="right"
      onClose={closeMenuDrawer}
      open={menuDrawerVisible}
      // width={300}
       title={<Flex justify="flex-end">
          <Switch
            onChange={handlerDarkMode}
            checkedChildren={<SunOutlined />}
            unCheckedChildren={<MoonOutlined />}
            checked={darkMode}
            style={{ background: !darkMode && colorText }}
          />
        </Flex>}
    >
      <MobileExtraMenu
        colorText={colorText}
        darkMode={darkMode}
        handlerDarkMode={handlerDarkMode}
        auth={auth}
        profile={profile}
        handleLogout={handleLogout}
        handlerChangeAuth={handlerChangeAuth}
        closeMenuDrawer={closeMenuDrawer} 
        setCurrentPage={setCurrentPage} 
      />
      <Menu
        mode="inline"
        selectedKeys={[currentPage]}
        onClick={({ key }) => {
          setCurrentPage(key);
          closeMenuDrawer();
        }}
        items={itemsMobile}
      />
    </Drawer>
  );
}

export function NotificationDrawer({
  notificationDrawerVisible,
  closeNotificationDrawer,
}) {
  return (
    <Drawer
      title="Уведомления"
      placement="right"
      onClose={closeNotificationDrawer}
      open={notificationDrawerVisible}
    >
      <NotificationList />
    </Drawer>
  );
}
