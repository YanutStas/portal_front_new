import React, { useEffect, useState } from "react";
import AppHelmet from "../components/Global/AppHelmet";
import { Flex, Typography, Button } from "antd";
import useAuth from "../stores/useAuth";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../components/ErrorModal";
const { Title } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { toggleModal, auth, redirection, setRedirection } = useAuth();
  const [error, setError] = useState(null);
  const [errorVisible, setErrorVisible] = useState(false);
  useEffect(() => {
    if (auth) {
      if (redirection) {
        const nav = redirection;
        toggleModal("isAuthModalOpen", false);
        setRedirection("");
        navigate(nav);
      } else {
        toggleModal("isAuthModalOpen", false);
        navigate("/cabinet/claimers");
      }
    } else {
      toggleModal("isAuthModalOpen", true);
    }
  }, [auth]);
  const handlerChangeAuth = () => {
    try {
      toggleModal("isAuthModalOpen", true);
    } catch (err) {
      setError(err.message);
      setErrorVisible(true);
    }
  };
  const closeModal = () => {
    setErrorVisible(false);
  };
  return (
    <>
      <AppHelmet
        title={"Авторизация на портале"}
        desc={"Портал цифровых услуг АО Мособлэнерго"}
      />
      <div>
        <Flex
          vertical
          justify="center"
          align="center"
          style={{ width: "100%", height: "calc(100vh - 200px)" }}
        >
          <Title level={1}>Пожалуйста авторизируйтесь</Title>
          <Button type="primary" onClick={handlerChangeAuth}>
            Войти
          </Button>
        </Flex>
      </div>
      <ErrorModal visible={errorVisible} error={error} onClose={closeModal} />
    </>
  );
}
