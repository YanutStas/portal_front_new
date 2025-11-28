import React, { useEffect, useState } from "react";
import { Flex, Layout, Menu, Tag, theme, Tooltip } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppstoreOutlined, CalculatorOutlined, InfoCircleOutlined, InfoOutlined, MenuOutlined } from "@ant-design/icons";
import logoWhite from "../../../img/header/logoWhite.svg";
import logoBlue from "../../../img/header/logoBlue.svg";
import logoMobile from "../../../img/header/logo-sun.png";
import useGlobal from "../../../stores/useGlobal";
import useAuth from "../../../stores/useAuth";
import useNotifications from "../../../stores/useNotifications";
import useProfile from "../../../stores/Cabinet/useProfile";
import styles from "./AppHeader.module.css";
import ErrorModal from "../../ErrorModal";
import { items, itemsMobile, RightMenuArea } from "./AppHeaderMenus";
import { MobileMenuDrawer, NotificationDrawer } from "./AppHeaderDrawers";

import release from '../../../version.json'

const version = import.meta.env.VITE_BACK_VERSION;

const { Header } = Layout;

export default function AppHeader() {
  const { darkMode, toggleDarkMode, currentPage, setCurrentPage } = useGlobal();
  const { auth, logout, toggleModal } = useAuth();
  const { getUnreadCount } = useNotifications();
  const { profile, fetchProfile } = useProfile();

  const navigate = useNavigate();
  const location = useLocation();
  const [current, setCurrent] = useState()
  useEffect(() => {
    if (location.pathname.includes("/services")) {
      return setCurrent("/services")
    }
    if (location.pathname.includes("/about")) {
      return setCurrent("/about")
    }
    if (location.pathname.includes("/calc")) {
      return setCurrent("/calc")
    }
    if (location.pathname.includes("/contacts")) {
      return setCurrent("/contacts")
    }
    if (location.pathname.includes("/docs")) {
      return setCurrent("/docs")
    }
    return setCurrent()
  }, [location])

  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);

  const [error, setError] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    if (auth) {
      fetchProfile();
    } else {

    }
  }, [auth, fetchProfile]);

  // useEffect(() => {
  //   const matchingItem = items.find((item) => item.key === location.pathname);
  //   if (matchingItem) {
  //     setCurrentPage(location.pathname);
  //   } else {
  //     setCurrentPage("");
  //   }
  // }, [location.pathname, setCurrentPage]);

  const handleLogout = () => {
    try {
      logout();
      setCurrentPage("/");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlerChangeAuth = () => {
    try {
      toggleModal("isAuthModalOpen", true);
    } catch (err) {
      setError(err.message);
      setErrorVisible(true);
    }
  };

  const handlerDarkMode = () => {
    try {
      toggleDarkMode();
    } catch (err) {
      setError(err.message);
      setErrorVisible(true);
    }
  };

  const showMenuDrawer = () => {
    setMenuDrawerVisible(true);
  };

  const closeMenuDrawer = () => {
    setMenuDrawerVisible(false);
  };

  const showNotificationDrawer = () => {
    setNotificationDrawerVisible(true);
  };

  const closeNotificationDrawer = () => {
    setNotificationDrawerVisible(false);
  };

  const closeModal = () => {
    setErrorVisible(false);
  };

  const {
    token: { colorBgContainer, colorText },
  } = theme.useToken();

  return (
    <>
      <Header
        className={styles.header}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: colorBgContainer,
          position: "fixed",
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Flex align="center" gap={10}>
          <div className="demo-logo" style={{ padding: 10 }}>

            <Link
              to="/"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",

              }}
            >
              <img
                src={darkMode ? logoWhite : logoBlue}
                height={40}
                alt="Логотип компании"
                // style={{ zIndex: 10 }}
                className={styles.logoDesktop}
              />
              <img
                src={logoMobile}
                height={40}
                // style={{ zIndex: 10 }}
                alt="Логотип компании"
                className={styles.logoMobile}
              />
            </Link>
          </div>
          <Flex gap={15} className={styles.mobileMenuCatalog} align="center">

            <Link to={"/services"} style={{ color: "gray", fontSize: 28 }} >
              <AppstoreOutlined />
              {/* <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M9 14c0-.93 0-1.394.077-1.78a4 4 0 0 1 3.143-3.143C12.606 9 13.07 9 14 9s1.394 0 1.78.077a4 4 0 0 1 3.143 3.143c.077.386.077.85.077 1.78s0 1.394-.077 1.78a4 4 0 0 1-3.143 3.143C15.394 19 14.93 19 14 19s-1.394 0-1.78-.077a4 4 0 0 1-3.143-3.143C9 15.394 9 14.93 9 14zm5 3.5c-1.001 0-1.283-.007-1.488-.048a2.5 2.5 0 0 1-1.964-1.964C10.508 15.283 10.5 15 10.5 14s.007-1.283.048-1.488a2.5 2.5 0 0 1 1.964-1.964c.205-.04.487-.048 1.488-.048s1.283.007 1.488.048a2.5 2.5 0 0 1 1.964 1.964c.04.205.048.487.048 1.488s-.007 1.283-.048 1.488a2.5 2.5 0 0 1-1.964 1.964c-.205.04-.487.048-1.488.048zM9 26c0-.93 0-1.394.077-1.78a4 4 0 0 1 3.143-3.143C12.606 21 13.07 21 14 21s1.394 0 1.78.077a4 4 0 0 1 3.143 3.143c.077.386.077.85.077 1.78s0 1.394-.077 1.78a4 4 0 0 1-3.143 3.143C15.394 31 14.93 31 14 31s-1.394 0-1.78-.077a4 4 0 0 1-3.143-3.143C9 27.394 9 26.93 9 26zm5 3.5c-1.001 0-1.283-.007-1.488-.048a2.5 2.5 0 0 1-1.964-1.964C10.508 27.283 10.5 27 10.5 26s.007-1.283.048-1.488a2.5 2.5 0 0 1 1.964-1.964c.205-.04.487-.048 1.488-.048s1.283.007 1.488.048a2.5 2.5 0 0 1 1.964 1.964c.04.205.048.487.048 1.488s-.007 1.283-.048 1.488a2.5 2.5 0 0 1-1.964 1.964c-.205.04-.487.048-1.488.048zM21.077 24.22C21 24.606 21 25.07 21 26s0 1.394.077 1.78a4 4 0 0 0 3.143 3.143c.386.077.85.077 1.78.077s1.394 0 1.78-.077a4 4 0 0 0 3.143-3.143C31 27.394 31 26.93 31 26s0-1.394-.077-1.78a4 4 0 0 0-3.143-3.143C27.394 21 26.93 21 26 21s-1.394 0-1.78.077a4 4 0 0 0-3.143 3.143zm3.435 5.232c.205.04.487.048 1.488.048s1.283-.007 1.488-.048a2.5 2.5 0 0 0 1.964-1.964c.04-.205.048-.487.048-1.488s-.007-1.283-.048-1.488a2.5 2.5 0 0 0-1.964-1.964C27.283 22.508 27 22.5 26 22.5s-1.283.007-1.488.048a2.5 2.5 0 0 0-1.964 1.964c-.04.205-.048.487-.048 1.488s.007 1.283.048 1.488a2.5 2.5 0 0 0 1.964 1.964zM21 14c0-.93 0-1.394.077-1.78a4 4 0 0 1 3.143-3.143C24.606 9 25.07 9 26 9s1.394 0 1.78.077a4 4 0 0 1 3.143 3.143c.077.386.077.85.077 1.78s0 1.394-.077 1.78a4 4 0 0 1-3.143 3.143C27.394 19 26.93 19 26 19s-1.394 0-1.78-.077a4 4 0 0 1-3.143-3.143C21 15.394 21 14.93 21 14zm5 3.5c-1.001 0-1.283-.007-1.488-.048a2.5 2.5 0 0 1-1.964-1.964C22.508 15.283 22.5 15 22.5 14s.007-1.283.048-1.488a2.5 2.5 0 0 1 1.964-1.964c.205-.04.487-.048 1.488-.048s1.283.007 1.488.048a2.5 2.5 0 0 1 1.964 1.964c.04.205.048.487.048 1.488s-.007 1.283-.048 1.488a2.5 2.5 0 0 1-1.964 1.964c-.205.04-.487.048-1.488.048z" fill="currentColor"></path></svg> */}
            </Link>
            <Link to={"/calc"} style={{ color: "gray", fontSize: 28 }}>
              <CalculatorOutlined />

            </Link>
            <Link to={"/docs"} style={{ color: "gray", fontSize: 28 }}>
              <InfoCircleOutlined />

            </Link>
          </Flex>
        </ Flex>

        <Menu
          className={styles.mainMenu}
          theme="light"
          mode="horizontal"
          selectedKeys={[current]}
          onClick={({ key }) => {
            setCurrentPage(key);
          }}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
        <div style={{ opacity: .7, }}>
          <Tooltip title={`${release[0]?.version} от ${release[0]?.date}`}>

            {version === "local" && <Tag color="blue">Локальная версия</Tag>}
            {version === "beta" && <Tag color="gold">Бета версия</Tag>}
            {version === "test" && <Tag color="red">Тестовая версия</Tag>}
          </Tooltip>
        </div>
        <RightMenuArea
          colorText={colorText}
          darkMode={darkMode}
          handlerDarkMode={handlerDarkMode}
          auth={auth}
          profile={profile}
          getUnreadCount={getUnreadCount}
          showNotificationDrawer={showNotificationDrawer}
          handleLogout={handleLogout}
          handlerChangeAuth={handlerChangeAuth}
          setCurrentPage={setCurrentPage}
        />

        <div className={styles.mobileMenu}>
          <MenuOutlined
            style={{ fontSize: "24px", cursor: "pointer", color: colorText }}
            onClick={showMenuDrawer}
          />
        </div>
      </Header>

      <MobileMenuDrawer
        menuDrawerVisible={menuDrawerVisible}
        closeMenuDrawer={closeMenuDrawer}
        currentPage={current}
        setCurrentPage={setCurrentPage}
        itemsMobile={items}
        colorText={colorText}
        darkMode={darkMode}
        handlerDarkMode={handlerDarkMode}
        auth={auth}
        profile={profile}
        handleLogout={handleLogout}
        handlerChangeAuth={handlerChangeAuth}
      />

      {/* <NotificationDrawer
        notificationDrawerVisible={notificationDrawerVisible}
        closeNotificationDrawer={closeNotificationDrawer}
      /> */}

      <ErrorModal visible={errorVisible} error={error} onClose={closeModal} />
    </>
  );
}

//Старенький вариант
// import React, { useEffect, useState } from "react";
// import {
//   Layout,
//   Menu,
//   Space,
//   Switch,
//   Badge,
//   Drawer,
//   Button,
//   Tooltip,
//   theme,
// } from "antd";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   MenuOutlined,
//   MoonOutlined,
//   SunOutlined,
//   BellOutlined,
//   QuestionCircleOutlined,
//   UserOutlined,
// } from "@ant-design/icons";
// import logoWhite from "../../../img/header/logoWhite.svg";
// import logoBlue from "../../../img/header/logoBlue.svg";
// import useGlobal from "../../../stores/useGlobal";
// import useAuth from "../../../stores/useAuth";
// import useNotifications from "../../../stores/useNotifications";
// import useProfile from "../../../stores/Cabinet/useProfile";
// import NotificationList from "../../FormComponentsNew/Notifications/NotificationPanel";
// import styles from "./AppHeader.module.css";
// import ErrorModal from "../../ErrorModal";

// const { Header } = Layout;

// const items = [
//   {
//     key: "/about",
//     label: <Link to={"/about"}>О нас</Link>,
//   },
//   {
//     key: "/services",
//     label: <Link to={"/services"}>Каталог услуг</Link>,
//   },
//   {
//     key: "/calc",
//     label: <Link to={"/calc"}>Калькулятор</Link>,
//   },
//   {
//     key: "/contacts",
//     label: <Link to={"/contacts"}>Контакты</Link>,
//   },
//   {
//     key: "/docs",
//     label: <Link to={"/docs"}>Документация</Link>,
//   },
// ];

// export default function AppHeader() {
//   const { darkMode, toggleDarkMode, currentPage, setCurrentPage } = useGlobal();
//   const { auth, logout, toggleModal } = useAuth();
//   const { getUnreadCount } = useNotifications();
//   const { profile, fetchProfile } = useProfile();

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Раздельные состояния для Drawer
//   const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);
//   const [notificationDrawerVisible, setNotificationDrawerVisible] =
//     useState(false);

//   const [chatModalVisible, setChatModalVisible] = useState(false);
//   const [error, setError] = useState(null);
//   const [errorVisible, setErrorVisible] = useState(false);

//   useEffect(() => {
//     if (auth) {
//       fetchProfile();
//     }
//   }, [auth, fetchProfile]);

//   useEffect(() => {
//     // Проверяем, соответствует ли текущий путь какому-либо ключу в меню
//     const matchingItem = items.find((item) => item.key === location.pathname);
//     if (matchingItem) {
//       setCurrentPage(location.pathname);
//     } else {
//       setCurrentPage(""); // Или null, если текущий путь не соответствует ни одному пункту меню
//     }
//   }, [location.pathname, setCurrentPage]);

//   const handleLogout = () => {
//     try {
//       logout();
//       setCurrentPage("/");
//       navigate("/");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handlerChangeAuth = () => {
//     try {
//       toggleModal("isAuthModalOpen", true);
//     } catch (err) {
//       setError(err.message);
//       setErrorVisible(true);
//     }
//   };

//   const handlerDarkMode = () => {
//     try {
//       toggleDarkMode();
//     } catch (err) {
//       setError(err.message);
//       setErrorVisible(true);
//     }
//   };

//   // Функции для управления Drawer

//   const showMenuDrawer = () => {
//     setMenuDrawerVisible(true);
//   };

//   const closeMenuDrawer = () => {
//     setMenuDrawerVisible(false);
//   };

//   const showNotificationDrawer = () => {
//     setNotificationDrawerVisible(true);
//   };

//   const closeNotificationDrawer = () => {
//     setNotificationDrawerVisible(false);
//   };

//   const closeModal = () => {
//     setErrorVisible(false);
//   };

//   const {
//     token: { colorBgContainer, colorText },
//   } = theme.useToken();

//   const rightMenuArea = (
//     <div className={styles.rightMenu}>
//       <Link to="/answers">
//         <QuestionCircleOutlined
//           onClick={() => {
//             // console.log("/answers");
//             setCurrentPage("/answers");
//           }}
//           style={{ fontSize: "20px", cursor: "pointer", color: colorText }}
//         />
//       </Link>
//       {/* <QuestionCircleOutlined
//         style={{ fontSize: "20px", cursor: "pointer", color: colorText }}
//         onClick={() => setChatModalVisible(true)}
//       /> */}
//       <Switch
//         onChange={handlerDarkMode}
//         checkedChildren={<SunOutlined />}
//         unCheckedChildren={<MoonOutlined />}
//         checked={darkMode}
//         style={{ background: !darkMode && colorText }}
//       />
//       <Badge count={getUnreadCount()} overflowCount={9}>
//         <BellOutlined
//           style={{ fontSize: "20px", cursor: "pointer", color: colorText }}
//           onClick={showNotificationDrawer}
//         />
//       </Badge>
//       {auth ? (
//         <div className={styles.userInfo}>
//           <Tooltip title={profile.email ? profile.email : "Пользователь"}>
//             <UserOutlined
//               style={{ fontSize: "20px", color: colorText, cursor: "pointer" }}
//             />
//           </Tooltip>
//           <Button type="primary" onClick={handleLogout}>
//             Выйти
//           </Button>
//         </div>
//       ) : (
//         <Button type="primary" onClick={handlerChangeAuth}>
//           Войти
//         </Button>
//       )}
//     </div>
//   );

//   const itemsMobile = [
//     {
//       label: <Link to="/about">О нас</Link>,
//       key: "/about",
//     },
//     {
//       label: <Link to="/services">Каталог услуг</Link>,
//       key: "/services",
//     },
//     {
//       label: <Link to="/calc">Калькулятор</Link>,
//       key: "/calc",
//     },
//     {
//       label: <Link to="/contacts">Контакты</Link>,
//       key: "/contacts",
//     },
//     {
//       label: <Link to="/docs">Документация</Link>,
//       key: "/docs",
//     },
//     {
//       type: "divider",
//     },
//   ];

//   return (
//     <>
//       <Header
//         className={styles.header}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           background: colorBgContainer,
//           position: "fixed",
//           left: 0,
//           right: 0,
//           zIndex: 1000,
//         }}
//       >
//         <div className="demo-logo" style={{ padding: 10, marginRight: 20 }}>
//           <Link
//             to="/"
//             style={{
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <img
//               src={darkMode ? logoWhite : logoBlue}
//               height={40}
//               alt="Логотип компании"
//             />
//           </Link>
//         </div>

//         <Menu
//           className={styles.mainMenu}
//           theme="light"
//           mode="horizontal"
//           selectedKeys={[currentPage]}
//           onClick={({ key }) => {
//             setCurrentPage(key);
//           }}
//           items={items}
//           style={{
//             flex: 1,
//             minWidth: 0,
//           }}
//         />

//         <div className={styles.rightMenu}>{rightMenuArea}</div>

//         {/* Мобильное меню */}
//         <div className={styles.mobileMenu}>
//           <MenuOutlined
//             style={{ fontSize: "24px", cursor: "pointer", color: colorText }}
//             onClick={showMenuDrawer}
//           />
//         </div>
//       </Header>

//       {/* Боковая панель для мобильного меню */}
//       <Drawer
//         title="Меню"
//         placement="left"
//         onClose={closeMenuDrawer}
//         open={menuDrawerVisible}
//       >
//         <Menu
//           mode="inline"
//           selectedKeys={[currentPage]}
//           onClick={({ key }) => {
//             setCurrentPage(key);
//             setMenuDrawerVisible(false);
//           }}
//           items={itemsMobile}
//         />
//         {/* Ваш блок с иконками и кнопками вне Menu */}
//         <div style={{ marginTop: 16 }}>
//           <Space size="middle">
//             <Link to="/answers">
//               <QuestionCircleOutlined
//                 style={{
//                   fontSize: "20px",
//                   cursor: "pointer",
//                   color: colorText,
//                 }}
//               />
//             </Link>

//             <Switch
//               onChange={handlerDarkMode}
//               checkedChildren={<SunOutlined />}
//               unCheckedChildren={<MoonOutlined />}
//               checked={darkMode}
//               style={{ background: !darkMode && colorText }}
//             />
//             {auth ? (
//               <>
//                 <Tooltip title={profile.email ? profile.email : "Пользователь"}>
//                   <UserOutlined
//                     style={{
//                       fontSize: "20px",
//                       color: colorText,
//                       cursor: "pointer",
//                     }}
//                   />
//                 </Tooltip>
//                 <Button type="primary" onClick={handleLogout}>
//                   Выйти
//                 </Button>
//               </>
//             ) : (
//               <Button type="primary" onClick={handlerChangeAuth}>
//                 Войти
//               </Button>
//             )}
//           </Space>
//         </div>
//       </Drawer>

//       {/* Drawer для уведомлений */}
//       <Drawer
//         title="Уведомления"
//         placement="right"
//         onClose={closeNotificationDrawer}
//         open={notificationDrawerVisible}
//       >
//         <NotificationList />
//       </Drawer>

//       <ErrorModal visible={errorVisible} error={error} onClose={closeModal} />
//     </>
//   );
// }
