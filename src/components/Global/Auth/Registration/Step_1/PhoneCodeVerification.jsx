import React, { useEffect, useRef } from "react";
import { Form, Input, Typography, Flex } from "antd";
import useRegistration from "../../../../../stores/useRegistration";
import styles from "./PhoneCodeVerification.module.css";

const PhoneCodeVerification = () => {
  const submitPhoneCode = useRegistration((s) => s.submitPhoneCode);
  const isSendingCodePhone = useRegistration((s) => s.isSendingCodePhone);
  const phoneCodeError = useRegistration((s) => s.phoneCodeError);
  const formRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const onFinish = (values) => {
    const phoneCode = values.otp;
    submitPhoneCode(phoneCode);
  };

  const handleChange = (value) => {
    if (value.length === 4 && !isSendingCodePhone) {
      if (formRef.current) formRef.current.submit();
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
            disabled={isSendingCodePhone}
            status={phoneCodeError ? "error" : ""}
          />
        </Form.Item>
      </Form>

      {isSendingCodePhone && (
        <Typography.Text type="secondary">Проверяем код…</Typography.Text>
      )}
      {phoneCodeError && (
        <Typography.Text style={{ color: "red" }}>{phoneCodeError}</Typography.Text>
      )}
    </>
  );
};

export default PhoneCodeVerification;
