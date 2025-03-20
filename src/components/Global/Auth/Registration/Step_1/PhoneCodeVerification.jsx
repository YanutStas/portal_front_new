import React, { useEffect, useRef } from "react";
import { Form, Input, Typography } from "antd";
import useRegistration from "../../../../../stores/useRegistration";
import styles from "./PhoneCodeVerification.module.css";

const PhoneCodeVerification = () => {
  const { submitPhoneCode } = useRegistration();
  const formRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const onFinish = (values) => {
    const phoneCode = values.otp;
    submitPhoneCode(phoneCode);
  };

  const handleChange = (value) => {
    if (value.length === 4) {
      formRef.current.submit();
    }
  };

  return (
    <>
      <Typography.Text level={5}>Введите код из СМС:</Typography.Text>
      <Form
        ref={formRef}
        name="phoneCodeForm"
        onFinish={onFinish}
        className={styles.codeFormContainer}
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Пожалуйста, введите код из СМС" },
          ]}
        >
          <Input.OTP
            ref={inputRef}
            onChange={handleChange}
            length={4}
            formatter={(str) => str.toUpperCase()}
            className={styles.codeInput}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default PhoneCodeVerification;
