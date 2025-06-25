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

  const onFinish = useCallback(async () => {
    const formattedPhone = phone.replace(/[^\d]/g, "");
    await submitPhone(formattedPhone);
    setCodeRequested(true);
    setTimer(60);
    setHasAttempted(true);
  }, [phone, submitPhone, setCodeRequested]);

  const handleChange = useCallback(
    (value) => {
      setPhone(value);
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
