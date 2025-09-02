import React from "react";
import { Button, Form, Input, Typography } from "antd";
import useRegistration from "../../../../../stores/useRegistration";

const { Paragraph } = Typography;

export default function PasswordRegForm() {
  const [form] = Form.useForm();
  const { registerUser, isRegistering } = useRegistration();

  const onFinish = (values) => {
    if (values.password !== values.repeat_password) {
      console.error("Пароли не совпадают.");
      return;
    }
    registerUser(values.password);
  };

  // Функция для проверки, что значения в обоих парольных полях совпадают
  const validatePasswordsMatch = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Пароли не совпадают'));
    },
  });

  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Paragraph>
          Пароль должен содержать минимум 10 символов, заглавную букву, цифры,
          латинские буквы.
        </Paragraph>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
            {
              min: 10, // Так как требуется минимум 8 символов, меняем здесь
              message: "Минимальная длина пароля 10 символов",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Повторите пароль"
          name="repeat_password"
          dependencies={['password']} // Указываем зависимость от поля password
          rules={[
            {
              required: true,
              message: "Это поле обязательно",
            },
            validatePasswordsMatch, // Используем созданную функцию для валидации
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button disabled={isRegistering} type="primary" htmlType="submit">
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
