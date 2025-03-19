import React, { useState } from "react";
import { Modal, Form, Input, message, Typography, Button } from "antd";
import PhoneCodeVerification from "../../../components/Global/Auth/Registration/Step_1/PhoneCodeVerification";
import useRegistration from "../../../stores/useRegistration"; // Используем стор регистрации для отправки СМС
import useProfile from "../../../stores/Cabinet/useProfile";
const { Paragraph } = Typography;

// Функция для валидации совпадения паролей
const validatePasswordsMatch = ({ getFieldValue }) => ({
  validator(_, value) {
    if (!value || getFieldValue("password") === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Пароли не совпадают"));
  },
});

// Модалка для изменения телефона с кодом подтверждения
export const PhoneModal = ({ isVisible, onCancel, onSubmit, form }) => {
  const [codeRequested, setCodeRequested] = useState(false);
  const {
    submitPhone,
    submitPhoneCode,
    setCodeRequested: setRegistrationCodeRequested,
  } = useRegistration();
  const { updatePhone } = useProfile(); // Обновление телефона в профиле

  const handleRequestCode = async () => {
    try {
      const values = await form.validateFields(["phone"]);
      await submitPhone(values.phone);
      setCodeRequested(true);
      setRegistrationCodeRequested(true); // Активируем состояние для запроса кода
      message.info("Код подтверждения отправлен на указанный номер");
    } catch (error) {
      message.error("Ошибка при отправке кода подтверждения");
    }
  };

  const handleSubmitCode = async (code) => {
    try {
      console.log("Введённый код:", code); // Лог введённого кода
      const result = await submitPhoneCode(code); // Проверка кода на сервере
      console.log("Результат проверки кода:", result); // Лог результата

      const phone = form.getFieldValue("phone");
      await updatePhone(phone); // Обновляем телефон пользователя
      message.success("Телефон успешно обновлён");
      onCancel(); // Закрываем модалку
    } catch (error) {
      console.error("Ошибка проверки кода:", error); // Лог ошибки
      message.error("Неверный код подтверждения");
    }
  };

  const handleChange = (value) => {
    if (value.length === 4) {
      handleSubmitCode(value);
    }
  };

  return (
    <Modal
      title="Изменить номер телефона"
      open={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={onSubmit}>
        <Form.Item
          label="Новый номер телефона"
          name="phone"
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
          ]}
        >
          <Input placeholder="79999999999" />
        </Form.Item>
        {!codeRequested && (
          <Button onClick={handleRequestCode}>
            Отправить код подтверждения
          </Button>
        )}
        {codeRequested && (
          <Input.OTP
            onChange={handleChange}
            length={4}
            formatter={(str) => str.toUpperCase()}
            // className={styles.codeInput}
          />
        )}
      </Form>
    </Modal>
  );
};

// Модалка для изменения пароля с кодом подтверждения
export const PasswordModal = ({ isVisible, onCancel, onSubmit, form }) => {
  const [codeRequested, setCodeRequested] = useState(false);
  const {
    submitPhone,
    submitPhoneCode,
    setCodeRequested: setRegistrationCodeRequested,
  } = useRegistration(); // Можно использовать ту же логику для отправки СМС
  const { updatePassword } = useProfile(); // Обновление пароля в профиле

  const handleRequestCode = async () => {
    try {
      const phone = form.getFieldValue("phone");
      await submitPhone(phone); // Отправляем код на номер телефона
      setCodeRequested(true);
      setRegistrationCodeRequested(true); // Активируем состояние для запроса кода
      message.info("Код подтверждения отправлен на указанный номер телефона");
    } catch (error) {
      message.error("Ошибка при отправке кода подтверждения");
    }
  };

  const handleSubmitCode = async (code) => {
    try {
      console.log("Введённый код:", code); // Лог введённого кода
      const result = await submitPhoneCode(code); // Проверка кода на сервере
      console.log("Результат проверки кода:", result); // Лог результата

      const password = form.getFieldValue("password");
      await updatePassword(password); // Обновляем пароль пользователя
      message.success("Пароль успешно обновлён");
      onCancel(); // Закрываем модалку
    } catch (error) {
      console.error("Ошибка проверки кода:", error); // Лог ошибки
      message.error("Неверный код подтверждения");
    }
  };

  const handleChange = (value) => {
    if (value.length === 4) {
      handleSubmitCode(value);
    }
  };

  return (
    <Modal
      title="Изменить пароль"
      visible={isVisible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={onSubmit}>
        <Paragraph>
          Пароль должен содержать минимум 8 символов, заглавную букву, цифры,
          латинские буквы.
        </Paragraph>
        <Form.Item
          label="Новый пароль"
          name="password"
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
            {
              min: 8,
              message: "Минимальная длина пароля 8 символов",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Повторите пароль"
          name="repeat_password"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
            validatePasswordsMatch,
          ]}
        >
          <Input.Password />
        </Form.Item>
        {!codeRequested && (
          <Button onClick={handleRequestCode}>
            Отправить код подтверждения
          </Button>
        )}
        {codeRequested && (
          <Input.OTP
            onChange={handleChange}
            length={4}
            formatter={(str) => str.toUpperCase()}
            // className={styles.codeInput}
          />
        )}
      </Form>
    </Modal>
  );
};
