import React from "react";
import { Drawer, Menu } from "antd";
import NotificationList from "../../Notifications/NotificationPanel";
import { MobileExtraMenu } from "./AppHeaderMenus";

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
      placement="right  "
      onClose={closeMenuDrawer}
      open={menuDrawerVisible}
      // width={300}
    >
      <Menu
        mode="inline"
        selectedKeys={[currentPage]}
        onClick={({ key }) => {
          setCurrentPage(key);
          closeMenuDrawer();
        }}
        items={itemsMobile}
      />
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
