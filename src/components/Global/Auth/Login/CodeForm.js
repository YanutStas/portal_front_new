import React, { useEffect, useRef } from "react";
import { Form, Input, Typography } from "antd";
import useAuth from "../../../../stores/useAuth";
import styles from "./CodeForm.module.css";

export default function CodeForm() {
  const { verifyPincode } = useAuth();
  const formRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const onFinish = (values) => {
    const pincode = values.otp;
    verifyPincode(pincode);
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
        name="codeForm"
        onFinish={onFinish}
        className={styles.codeFormContainer}
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Пожалуйста, введите код из СМС" },
          ]}
        >
          {/* Добавляем type="tel", inputMode="numeric", pattern="[0-9]*" */}
          <Input.OTP
            ref={inputRef}
            onChange={handleChange}
            length={4}
            formatter={(str) => str.toUpperCase()}
            className={styles.codeInput}
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
          />
        </Form.Item>
      </Form>
    </>
  );
}