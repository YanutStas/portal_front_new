// File: /src/components/Global/Auth/Registration/Step_1/PhoneVerification/PhoneVerification.jsx
import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Space, theme } from "antd";
import { IMaskInput } from "react-imask";
import useRegistration from "../../../../../../stores/useRegistration";
import PhoneCodeVerification from "../PhoneCodeVerification";
import { formItemLayout, tailFormItemLayout } from "../../../../../../components/configSizeForm";
import styles from "./PhoneVerification.module.css";

const PhoneVerification = React.memo(() => {
  const { colorBorderBg, colorText } = theme.useToken().token;
  const [form] = Form.useForm();

  // Используем Zustand для хранения номера
  const phone = useRegistration((state) => state.phone);
  const setPhone = useRegistration((state) => state.setPhone);
  const submitPhone = useRegistration((state) => state.submitPhone);
  const codeRequested = useRegistration((state) => state.codeRequested);
  const setCodeRequested = useRegistration((state) => state.setCodeRequested);

  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [timer, setTimer] = useState(0);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [buttonText, setButtonText] = useState("Подтвердить");

  useEffect(() => {
    if (timer === 0 && hasAttempted) {
      setButtonText("Отправить код повторно");
    }
  }, [timer, hasAttempted]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Забираем номер из состояния (не из формы) при сабмите
  const onFinish = useCallback(async () => {
    const formattedPhone = phone.replace(/[^\d]/g, "");
    await submitPhone(formattedPhone);
    setCodeRequested(true);
    setTimer(10);
    setHasAttempted(true);
  }, [phone, submitPhone, setCodeRequested]);

  // Обработчик onAccept для IMaskInput
  const handleChange = useCallback(
    (value) => {
      setPhone(value);
      // Для маски "+7 (000) 000-00-00" должно быть 11 цифр (7 + 10 цифр)
      const digits = value.replace(/\D/g, "");
      setIsPhoneValid(digits.length === 11);
    },
    [setPhone]
  );

  return (
    <div>
      <Form {...formItemLayout} form={form} onFinish={onFinish}>
        <Form.Item label="Номер">
          <IMaskInput
            mask="+7 (000) 000-00-00"
            value={phone}
            onAccept={(val) => handleChange(val)}
            placeholder="+7 (xxx) xxx-xx-xx"
            className={styles.inputMask}
            style={{ backgroundColor: colorBorderBg, color: colorText }}
          />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Space>
            <Button type="primary" htmlType="submit" disabled={!isPhoneValid || timer > 0}>
              {buttonText}
            </Button>
            {timer > 0 && <span className={styles.timer}>{timer} сек.</span>}
          </Space>
        </Form.Item>
      </Form>
      {codeRequested && <PhoneCodeVerification />}
    </div>
  );
});

export default PhoneVerification;
