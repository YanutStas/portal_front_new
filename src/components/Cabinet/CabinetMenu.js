import React, { useState } from "react";
import { Flex, Menu, Typography, ConfigProvider } from "antd";
import {
  ProfileOutlined,
  MenuOutlined,
  FileSyncOutlined,
  FileAddOutlined,
  FileOutlined,
} from "@ant-design/icons";
import styles from "./CabinetMenu.module.css";
import { Link } from "react-router-dom";

import useGlobal from "../../stores/useGlobal";

const { Text } = Typography;

export default function CabinetMenu() {
  const { currentPage, setCurrentPage } = useGlobal();
  const iconStyle = {
    color: "gray",
  };
  const menuItems = [
    {
      key: "/services",
      icon: <FileAddOutlined className={styles.icon} style={iconStyle} />,
      label: (
        <Link to={"/services"} className={styles.labelSizeMobile}>
          Новая услуга
        </Link>
      ),
    },
    {
      key: "/cabinet/claimers",
      icon: <FileSyncOutlined className={styles.icon} style={iconStyle} />,
      label: (
        <Link to={"/cabinet/claimers"} className={styles.labelSizeMobile}>
          Заявки
        </Link>
      ),
    },

    {
      key: "/cabinet/documents",
      icon: <FileOutlined className={styles.icon} style={iconStyle} />,
      label: (
        <Link to={"/cabinet/documents"} className={styles.labelSizeMobile}>
          Мои документы
        </Link>
      ),
    },

    {
      key: "/cabinet/profile",
      icon: <ProfileOutlined className={styles.icon} style={iconStyle} />,
      label: (
        <Link to={"/cabinet/profile"} className={styles.labelSizeMobile}>
          Мой профиль
        </Link>
      ),
    },
  ];
  const menuItemsMobile = menuItems.map((item) => {
    if (!item.type) {
      return {
        key: item.key,
        label: (
          <Flex
            vertical
            align="center"
            justify="center"
            className={styles.menuItem}
          >
            <div>
              <Text>{item.icon}</Text>
            </div>
            <Text>{item.label}</Text>
          </Flex>
        ),
        children: item.children,
      };
    }
  });

  const [collapsed, setCollapsed] = useState(false);

  const handlerMenu = ({ key }) => {
    setCurrentPage(key);
    // navigator(key)
  };

  return (
    <div className={styles.menuContainer}>
      <div></div>
      {/* ----------------------------------------------------------------------- */}
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemHeight: 60,
              iconSize: 24,
              itemPaddingInline: 10,
              dropdownWidth: 100,
            },
          },
        }}
      >
        <div className={styles.mobile}>
          <Flex vertical>
            <Menu
              style={{ justifyContent: "space-between" }}
              mode={"horizontal"}
              items={menuItemsMobile}
              overflowedIndicator={
                <Flex
                  vertical
                  align="center"
                  justify="center"
                  className={styles.menuItemMobile}
                >
                  <div>
                    <Text>
                      <MenuOutlined style={iconStyle} />
                    </Text>
                  </div>
                  <Text>Еще</Text>
                </Flex>
              }
              onClick={handlerMenu}
            />
          </Flex>
        </div>
      </ConfigProvider>
      {/* ----------------------------------------------------------------------- */}
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              itemHeight: 50,
              iconSize: 24,
              collapsedWidth: 60,
              collapsedIconSize: 24,
              itemPaddingInline: 10,
            },
          },
        }}
      >
        <div className={styles.desktop}>
          <Flex vertical className={styles.menuItem}>
            <Menu
              inlineCollapsed={collapsed}
              mode={"inline"}
              items={menuItems}
              onClick={handlerMenu}
              className={styles.menu}
              selectedKeys={[currentPage]}
            />
          </Flex>
        </div>
      </ConfigProvider>
    </div>
  );
}
