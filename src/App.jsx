import React, { useEffect } from "react";
import axios from "axios";
import { ConfigProvider, Layout, theme } from "antd";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";

import Main from "./pages/Main";
import AppHeader from "./components/Global/AppHeader/AppHeader";
import AppFooter from "./components/Global/AppFooter/AppFooter";
import Calc from "./pages/Calc/Calc";
import About from "./pages/About/About";
import Services from "./pages/Services/Services";
import CabinetMenu from "./components/Cabinet/CabinetMenu";
import AuthModal from "./components/Global/Auth/AuthModal/AuthModal";
import CodeModal from "./components/Global/Auth/Login/CodeModal";
import ServiceItem from "./pages/ServiceItem/ServiceItem";
import Page404 from "./pages/Page404";
import Container from "./components/Container";
import NewClaim from "./pages/Cabinet/NewClaim";
import Profile from "./pages/Cabinet/Profile/Profile";
import Documents from "./pages/Cabinet/Documents/Documents";
import Checking from "./pages/Cabinet/Checking/Checking";
import ClaimItem from "./pages/Cabinet/Claims/ClaimItem/ClaimItem";
import Contacts from "./pages/Contacts/Contacts";
import Claimers from "./pages/Cabinet/Claims/Claimers/Claimers";
import Archives from "./pages/Cabinet/Claims/Archives";
import Documentation from "./pages/Documentation/Documentation";
import PrivateRoute from "./pages/PrivateRouter";
import Login from "./pages/Login";
import AddressInputTest from "./components/FormComponentsNew/addressComponents/AddressInputTest";
import Answers from "./pages/Answers/Answers";
import Test from "./pages/Test";

import useGlobal from "./stores/useGlobal";
import useAuth from "./stores/useAuth";
import Lk from "./pages/Cabinet/Lk/Lk";
import Error from "./pages/Error";

const { Content } = Layout;

export default function App() {
  const { darkMode, checkDarkMode } = useGlobal();
  const auth = useAuth((state) => state.auth);
  const checkJWT = useAuth((state) => state.checkJWT);
  const toggleModal = useAuth((state) => state.toggleModal);
  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
          toggleModal("isAuthModalOpen", true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, [logout, toggleModal]);

  useEffect(() => {
    checkJWT();
    checkDarkMode();
  }, []);

  useEffect(() => {
    useAuth.getState().checkJWT();
  }, []);

  const { colorPrimary } = theme.useToken().token;

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          fontSize: 16,
          lineHeight: 1.5,
          fontSizeHeading1: "2.5rem",
          fontSizeHeading2: "2.1rem",
          fontSizeHeading3: "1.8rem",
          fontSizeHeading4: "1.5rem",
          colorPrimary: "#0061aa",
          colorInfo: "#F37021",
          myCustomColor: "#00ffff",
          customfontSizeIcon: "16px",
        },
      }}
    >
      <Layout>
        <BrowserRouter>
          <AuthModal />
          <CodeModal />
          <AppHeader />
          <Layout>
            {/* {auth && <CabinetMenu />} */}
            <Content 
            className={"mainContent"}
            // className={`${auth ? "mainContentAuth" : "mainContent"}`}
            >
              <Routes>
                <Route path="/" element={<Main />} />

                <Route path="/services" element={<Services />} />
                <Route path="/services/:level2" element={<Services />} />
                <Route
                  path="/services/:level2/:key"
                  element={
                    <Container>
                      <ServiceItem />
                    </Container>
                  }
                />

                <Route path="/about" element={<About />} />
                <Route path="/calc" element={<Calc />} />
                <Route path="/contacts" element={<Contacts />} />

                <Route path="/docs" element={<Documentation />} />
                <Route path="/error" element={<Error />} />
                <Route path="/test" element={<AddressInputTest />} />
                <Route path="/login" element={<Login />} />

                <Route path="cabinet" element={<PrivateRoute />}>
                  <Route
                    path="new-claim/:id"
                    element={
                      <Container>
                        <NewClaim />
                      </Container>
                    }
                  />

                  <Route path="profile" element={<Profile />} />
                  <Route path="documents" element={<Documents />} />
                  <Route path="checking" element={<Checking />} />
                  <Route path="claimers" element={<Claimers />} />
                  <Route path="lk/:id" element={<Lk />} />
                  <Route path="claimers/:id" element={<ClaimItem />} />
                  <Route path="archives" element={<Archives />} />
                </Route>

                <Route path="/answers" element={<Answers />} />
                <Route path="/tests" element={<Test />} />

                <Route path="*" element={<Page404 />} />
              </Routes>
            </Content>
          </Layout>
          <AppFooter />
        </BrowserRouter>
      </Layout>
    </ConfigProvider>
  );
}
