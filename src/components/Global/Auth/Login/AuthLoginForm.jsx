import React, { useState } from "react";
import { Button, Form, Input, Alert, Typography } from "antd";
import useAuth from "../../../../stores/useAuth";
import CodeForm from "./CodeForm";
import styles from "./AuthLoginForm.module.css";
import {
  formItemLayout,
  tailFormItemLayout,
} from "../../../../components/configSizeForm";
import ErrorModal from "../../../../components/ErrorModal";
import { MailTwoTone, LockTwoTone } from "@ant-design/icons";

export default function AuthLoginForm() {
  const {
    login,
    toggleModal,
    loginError,
    isCodeRequested,
    authTimer,
    startAuthTimer,
    showErrorModal,
  } = useAuth();

  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const onFinish = async (values) => {
    login(values.email, values.password);
    startAuthTimer();
  };

  const onFinishFailed = ({ values, errorFields }) => {
    console.log("Failed:", errorFields);
  };

  return (
    <>
      {loginError && (
        <Alert
          message={loginError}
          type="error"
          showIcon
          closable
          style={{ marginBottom: "16px" }}
          onClose={() => toggleModal("isAuthModalOpen", false)}
        />
      )}
      <Form
        {...formItemLayout}
        className={styles.formContainer}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label={
            <span>
              Email
              <MailTwoTone style={{ marginLeft: 5 }} />
            </span>
          }
          name="email"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
            {
              type: "email",
              message: "Пожалуйста, введите корректный Email",
            },
          ]}
        >

          <Input
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />

        </Form.Item>

        <Form.Item
          label={
            <span>
              Пароль
              <LockTwoTone style={{ marginLeft: 5 }} />
            </span>
          }
          name="password"
          validateTrigger="onBlur"
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
            {
              min: 10,
              message: "Минимальная длина пароля 10 символов",
            },
          ]}
        >

          <Input.Password
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
        </Form.Item>
        <Typography.Paragraph>
          Забыли пароль или поменялся номер телефона - пройдите регистрацию
          повторно с тем же адресом электронной почты, указанным при регистрации.

        </Typography.Paragraph>

        <Form.Item {...tailFormItemLayout}>
          {!isCodeRequested && (
            <Button
              type="primary"
              htmlType="submit"
              // className={styles.submitButton}
              disabled={authTimer > 0}
            >
              Вход
            </Button>
          )}
          {isCodeRequested && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  padding: "25px 35px",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  whiteSpace: "normal",
                  wordWrap: "break-word",
                  textAlign: "center",
                  width: "auto",
                  minWidth: "200px",
                }}
                disabled={authTimer > 0}
              >
                {authTimer > 0 ? (
                  <>
                    Повторить через
                    <br />
                    {`${authTimer} секунд(ы)`}
                  </>
                ) : (
                  "Отправить СМС еще раз"
                )}
              </Button>
            </div>
          )}
        </Form.Item>
      </Form>
      {isCodeRequested && <CodeForm />}
      {showErrorModal && (
        <ErrorModal
          visible={showErrorModal}
          error={"Ошибка соединения с сервером 1С"}
          onClose={() => toggleModal("isAuthModalOpen", false)}
        />
      )}
    </>
  );
}
