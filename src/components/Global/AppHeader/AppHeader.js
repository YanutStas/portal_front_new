import React, { useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import logoWhite from "../../../img/header/logoWhite.svg";
import logoBlue from "../../../img/header/logoBlue.svg";
import useGlobal from "../../../stores/useGlobal";
import useAuth from "../../../stores/useAuth";
import useNotifications from "../../../stores/useNotifications";
import useProfile from "../../../stores/Cabinet/useProfile";
import styles from "./AppHeader.module.css";
import ErrorModal from "../../ErrorModal";
import { items, itemsMobile, RightMenuArea } from "./AppHeaderMenus";
import { MobileMenuDrawer, NotificationDrawer } from "./AppHeaderDrawers"; 

const { Header } = Layout;

export default function AppHeader() {
  const { darkMode, toggleDarkMode, currentPage, setCurrentPage } = useGlobal();
  const { auth, logout, toggleModal } = useAuth();
  const { getUnreadCount } = useNotifications();
  const { profile, fetchProfile } = useProfile();

  const navigate = useNavigate();
  const location = useLocation();

  const [menuDrawerVisible, setMenuDrawerVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);

  const [error, setError] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    if (auth) {
      fetchProfile();
    }
  }, [auth, fetchProfile]);

  useEffect(() => {
    const matchingItem = items.find((item) => item.key === location.pathname);
    if (matchingItem) {
      setCurrentPage(location.pathname);
    } else {
      setCurrentPage("");
    }
  }, [location.pathname, setCurrentPage]);

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
        <div className="demo-logo" style={{ padding: 10, marginRight: 20 }}>
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
            />
          </Link>
        </div>

        <Menu
          className={styles.mainMenu}
          theme="light"
          mode="horizontal"
          selectedKeys={[currentPage]}
          onClick={({ key }) => {
            setCurrentPage(key);
          }}
          items={items}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />

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
        currentPage={currentPage}
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

      <NotificationDrawer
        notificationDrawerVisible={notificationDrawerVisible}
        closeNotificationDrawer={closeNotificationDrawer}
      />

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
