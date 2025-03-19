import React, { useState, useEffect, useCallback } from "react";
import { Button, Form, Space, theme } from "antd";
import useRegistration from "../../../../../../stores/useRegistration";
import InputMask from "react-input-mask";
import PhoneCodeVerification from "../PhoneCodeVerification";
import { formItemLayout, tailFormItemLayout } from '../../../../../../components/configSizeForm'
import styles from './PhoneVerification.module.css'

const PhoneVerification = React.memo(({ submitPhoneCode }) => {
  const { colorBorderBg, colorText } = theme.useToken().token;
  const [form] = Form.useForm();
  const { phone, setPhone, submitPhone, codeRequested, setCodeRequested } = useRegistration((state) => ({
    phone: state.phone,
    setPhone: state.setPhone,
    submitPhone: state.submitPhone,
    codeRequested: state.codeRequested,
    setCodeRequested: state.setCodeRequested,
  }));
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
      interval = setInterval(() => setTimer((prevTimer) => prevTimer - 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onFinish = useCallback(async (values) => {
    const formattedPhone = values.phone.replace(/[^\d]/g, "");
    setCodeRequested(false);
    await submitPhone(formattedPhone);
    setCodeRequested(true);
    setTimer(10);
    setHasAttempted(true);
  }, [submitPhone]);


  const onPhoneChange = useCallback((event) => {
    const value = event.target.value;
    const isComplete = !value.includes("_");
    setIsPhoneValid(isComplete);
    setPhone(value);
  }, [setPhone]);

  return (
    <div>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish} >
        <Form.Item
        label="Номер"
          name="phone"
          rules={[{ required: true, message: "Пожалуйста, введите ваш номер телефона!" }]}
        >
          <InputMask
            mask="+7(999)999-99-99"
            value={phone}
            onChange={onPhoneChange}
            placeholder="+7(xxx)xxx-xx-xx"
            className={styles.inputMask}
            style={{ backgroundColor: colorBorderBg, color: colorText }}
          />
        </Form.Item>
        <Form.Item
          {...tailFormItemLayout}
        >
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
